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
                num = $rappers.length,
                height = $rappers.eq(0).outerHeight();

            $(d.body).css('height', height * num + 'px');

            $rappers.each(function(i, val) {
                // console.log(i, val);
            });

            $rapperImg.each(function(i, val) {
                var $this = $(this);
                $this.css('top', (height - $this[0].height) / 6);
            });

            animLoop.setFPS(20);

            animLoop.add('scrollchecker', function() {
                var top = d.body.scrollTop;
                // console.log(top/height * 100);
                $rappers[0].style.height = Math.abs((top/height * 100)-100) + '%';
            });

            animLoop.start();

        });

    }]);


})(window,document,window.angular,'BriocheApp','controllers');