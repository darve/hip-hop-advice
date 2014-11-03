
/*  Romeo Services
/* ================================== */

(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
                       [] /* module dependencies */);

    app.factory('$sanitize', [function() {
        return function(input) {
            return input.replace('\n', '').replace('\t', '').replace('\r', '').replace(/^\s+/g, '');
        };
    }]);

    app.factory('$scroller', ['$rootScope', function($rootScope){

        /*
        * Get a handle on the body element ( one that is happy in older browsers )
        */
        var b = (d.querySelector('.lte9') == null ) ? d.body : d.documentElement,
            checkCounter = 0;

        /*
        * Expects a DOM element
        * Returns an object representing that objects position on the page
        * ( e.g. { left: xxx, top: xxx } )
        */
        var getOffset = function(target){

            var docElem, 
                elem = target,
                doc = elem && elem.ownerDocument,
                box = {
                    top: 0,
                    left: 0
                };

            docElem = doc.documentElement;

            if (typeof elem.getBoundingClientRect !== undefined ) {
                box = elem.getBoundingClientRect();
            }
            
            return {
                top: box.top + (w.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (w.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        };

        /*
        * Tweens the scrolltop of the body element to a target amount
        */
        var scrollTo = function(target, offset){
            var adjust = offset || (-40),
                tween = new TWEEN.Tween( { y: b.scrollTop } )
                .to( { y: getOffset(target).top+adjust }, 600 )
                .easing( TWEEN.Easing.Cubic.Out )
                .onUpdate( function () {
                    b.scrollTop = this.y;
                })
                .start();
        };

        /*
        * Broadcasts the current scrolltop of the body
        */
        var scrollCheck = function() {
            checkCounter++;
            if ( checkCounter % 24 === 0 ) {
                $rootScope.$broadcast( 'scroll', currentScroll() );
            }
        };

        /*
        * Polyfill for getting the window width
        */
        var windowWidth = (function() {
            if (typeof w.innerWidth !== 'undefined') {
                return function() {
                    return w.innerWidth;
                };
            } else {
                var b = ('clientWidth' in d.documentElement) ? d.documentElement : d.body;
                return function() {
                    return b.clientWidth;
                };
            }
        })();

        /*
        * Polyfill for getting the window height
        */
        var windowHeight = (function() {
            if (typeof w.innerHeight !== 'undefined') {
                return function() {
                    return w.innerHeight;
                };
            } else {
                var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
                return function() {
                    return b.clientHeight;
                };
            }
        })();

        /*
        * Returns true if the top of the element has scrolled higher than half way up the viewable page
        */
        var isVisible = function(elem){
            var offset = getOffset(elem);
            // console.log('offset retrieved', offset.top < (currentScroll() + windowHeight()/2));
            return offset.top < (currentScroll() + (windowHeight()/2));
        };

        /*
        * Returns the current scrolltop of the body element
        */
        var currentScroll = function() {
            return b.scrollTop;
        };

        /*
        * Expose the methods to the public service
        */
        return {
            getOffset: getOffset,
            scrollTo: scrollTo,
            scrollCheck: scrollCheck,
            currentScroll: currentScroll,
            isVisible: isVisible,
            windowWidth: windowWidth,
            windowHeight: windowHeight
        };
    }]);

    app.factory('windowSize', ['$timeout', function($timeout){
    
        var ww = (function() {
            if (typeof w.innerWidth !== 'undefined') {
                return function() {
                    return w.innerWidth;
                };
            } else {
                var b = ('clientWidth' in d.documentElement) ? d.documentElement : d.body;
                return function() {
                    return b.clientWidth;
                };
            }
        })();

        var wh = (function() {
            if (typeof w.innerHeight !== 'undefined') {
                return function() {
                    return w.innerHeight;
                };
            } else {
                var b = ('clientHeight' in d.documentElement) ? d.documentElement : d.body;
                return function() {
                    return b.clientHeight;
                };
            }
        })();

        return {
            ww: ww,
            wh: wh
        };
    }]);

    app.factory('windowResizer', ['$timeout', '$rootScope', 'windowSize', 'animLoop', function($timeout, $rootScope, windowSize, animLoop) {

        var wW = windowSize.ww(),
            wH = windowSize.wh();

        var resize = function(){
            $timeout( function() {
                $rootScope.$apply(function() {
                    $rootScope.wW = wW;
                    $rootScope.wH = wH;
                })
            });

            animLoop.remove('windowResize');
        }

        w.onresize = function() {
            wW = windowSize.ww();
            wH = windowSize.wh();
            animLoop.add('windowResize', resize);
        };
    }]);

    app.factory('animLoop', function(){

        var rafLast = 0;

        var requestAnimFrame = (function(){
            return  window.requestAnimationFrame     ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - rafLast));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                rafLast = currTime + timeToCall;
                return id;
            };
        })();

        var cancelAnimFrame = (function() {
            return  window.cancelAnimationFrame        ||
            window.cancelRequestAnimationFrame   ||
            window.webkitCancelAnimationFrame    ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelAnimationFrame     ||
            window.mozCancelRequestAnimationFrame  ||
            function(id) {
                clearTimeout(id);
            };
        })();

        var FramePipeline = function() {
            var _t = this;
            _t.pipeline = {};
            _t.then = new Date().getTime();
            _t.now = undefined;
            _t.raf = undefined;
            _t.delta = undefined;
            _t.interval = 1000 / 60;
            _t.running = false;
        };

        FramePipeline.prototype = {
            add : function(name, fn) {
                this.pipeline[name] = fn;
            },
            remove : function(name) {
                delete this.pipeline[name];
            },
            start : function() {
                if (!this.running) {
                    this._tick();
                    this.running = true;
                }
            },
            pause : function() {
                if (this.running) {
                    cancelAnimFrame.call(window, this.raf);
                    this.running = false;
                }         
            },
            setFPS : function(fps) {
                this.interval = 1000 / fps;
            },
            _tick : function tick() {
                var _t = this;
                _t.raf = requestAnimFrame.call(window, tick.bind(_t));
                _t.now = new Date().getTime();
                _t.delta = _t.now - _t.then;
                if (_t.delta > _t.interval) {
                    for (var n in _t.pipeline) {
                        _t.pipeline[n]();
                    }
                    _t.then = _t.now - (_t.delta % _t.interval);
                }
            }
        };

        var pipeline = new FramePipeline();

        Function.prototype.bind = Function.prototype.bind || function() {
            return function(context) {
                var fn = this,
                args = Array.prototype.slice.call(arguments, 1);

                if (args.length) {
                    return function() {
                        return arguments.length ? fn.apply(context, args.concat(Array.prototype.slice.call(arguments))) : fn.apply(context, args);
                    };
                }
                return function() {
                    return arguments.length ? fn.apply(context, arguments) : fn.apply(context);
                };
            };
        };

        return pipeline;
    });

})(window,document,window.angular,'BriocheApp','services');