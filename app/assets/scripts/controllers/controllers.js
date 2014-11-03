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
                $rapperImg = $('.rapper img'),
                $navLinks = $('nav li'),
                num = $rappers.length,
                height = $rappers.eq(0).outerHeight(),
                bodyheight = height * num,
                percent = 0,
                current,
                top,
                ratio = 100 / num;

            $(d.body).css('height', height * num + 'px');

            $rappers.each(function(i, val) {
                // console.log(i, val);
            });

            $rapperImg.each(function(i, val) {
                var $this = $(this);
                $this.css('top', (height - $this[0].height) / 6);
            });

            animLoop.setFPS(60);

            $navLinks.on('click', function(e) {
                
            });

            animLoop.add('scrollchecker', function() {
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