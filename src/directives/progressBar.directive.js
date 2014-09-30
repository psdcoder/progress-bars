(function () {
    'use strict';

    angular
        .module('pg.progress-bars')
        .directive('progressBar', progressBarDirective);

    function progressBarDirective(ProgressBarsSettings, ProgressBarsStorage, ProgressBarFactory) {
        var providerClassNames = ProgressBarsSettings.getClasses();
        var classNames = {
            container: providerClassNames.container || 'progress__container',
            bar: providerClassNames.bar || 'progress__bar',
            barShowing: providerClassNames.barShowing || 'progress__container_showing'
        };

        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="' + classNames.container + '"><div class="' + classNames.bar + '"></div></div>',
            scope: {
                name: '@',
                minimum: '@',
                speed: '@',
                trickleRate: '@',
                trickleSpeed: '@',
                animation: '@'
            },
            link: function ($scope, $element) {
                if (!$scope.name) {
                    throw new Error('You must specify "name" property for progress bar');
                }

                $element.attr('id', 'progress-bar-' + $scope.name);

                var progressBar = ProgressBarFactory(
                    $scope.name,
                    {
                        container: $element,
                        bar: $element.find('div')
                    },
                    {
                        minimum: +$scope.minimum,
                        speed: +$scope.speed,
                        ease: $scope.animation,
                        trickleRate: +$scope.trickleRate,
                        trickleSpeed: +$scope.trickleSpeed,
                        showingClass: classNames.barShowing
                    }
                );

                ProgressBarsStorage._register(progressBar);

                $scope.$on('$destroy', function () {
                    ProgressBarsStorage._unregister(progressBar);
                });
            }
        };
    }
})();
