(function(w,d,ng,ns,m) {

    'use strict';

    var app = ng.module(ns + '.' + m /* module name */,
                       [ns + '.services',
                        ns + '.directives'] /* module dependencies */);

    app.controller('MainCtrl', 
        ['$scope', '$rootScope', 'animLoop', '$http', '$timeout', '$location', '$templateCache', '$compile', 'windowSize',
        function($scope, $rootScope, animLoop, $http, $timeout, $location, $templateCache, $compile, windowSize) {

        $timeout(function() {

            // Cache our rapper elements
            var $rappers = $('.rapper'),
                $rapperImg = $('.rapper img.lad'),
                $rapperText = $('.rapper img.text'),
                $navLinks = $('nav li'),
                num = $rappers.length,
                height = $rappers.eq(0).outerHeight(),
                bodyheight = height * num,
                percent = 0,
                current,
                top,
                ratio = 100 / num,
                framecounter = 0;
            
            $(d.body).css('height', height * num + 'px');

            function positionImages() {
                $rapperImg.each(function(i, val) {
                    var $this = $(this);
                    $this.css('top', (height - $this[0].height) / 6);
                });    

                $rapperText.each(function(i, val) {
                    var $this = $(this);
                    $this.css('top', (height - $this[0].height) / 6);
                });

                $('.advice').each(function(i, val) {
                    var $this = $(this);
                    $this.css('top', (height*0.75) + 'px');
                });
            }

            animLoop.setFPS(60);

            $navLinks.on('click', function(e) {
                e.preventDefault();

                var $this = $(this);
                // d.body.scrollTop = height * $this.attr('data-index');

                var tween = new TWEEN.Tween( { y: d.body.scrollTop } )
                .to( { y: (height * $this.attr('data-index')) + 1 }, 750 )
                .easing( TWEEN.Easing.Cubic.Out )
                .onUpdate( function () {
                    d.body.scrollTop = this.y;
                })
                .start();

            });

            positionImages();

            animLoop.add('scrollchecker', function() {
                framecounter++;
                if ( framecounter % 60 === 0 ) {
                    positionImages();
                }
                TWEEN.update();
                top = d.body.scrollTop;
                percent = top/bodyheight * 100;
                current = Math.floor(percent / ratio);
                $navLinks.removeClass('active').eq(current).addClass('active');
                for ( var i = 0; i < num; i++ ) {

                    if ( i < current ) {
                        $rappers[i].style.height = '0%';
                    } else if ( i > current ) {
                        $rappers[i].style.height = '100%';
                    }
                }

                var newtop = top - current*height;
                $rappers[current].style.height = Math.abs((newtop/height * 100)-100) + '%';
            });

            animLoop.start();

        });

    }]);


})(window,document,window.angular,'BriocheApp','controllers');