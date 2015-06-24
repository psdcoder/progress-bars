/*! pg.progress-bars v0.2.1 | Pavel Grinchenko <psdcoder@gmail.com> | (c) 2015 */
angular.module('pg.progress-bars', []);

(function () {
    'use strict';

    angular
        .module('pg.progress-bars')
        .directive('pgProgressBar', progressBarDirective);

    function progressBarDirective(ProgressBarsSettings, ProgressBarsStorage, ProgressBarFactory) {
        var providerClassNames = ProgressBarsSettings.getClasses();
        var classNames = {
            container: providerClassNames.container || 'progress__container',
            bar: providerClassNames.bar || 'progress__bar',
            barShowing: providerClassNames.barShowing || 'progress__container_showing'
        };

        return {
            restrict: 'EA',
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
                        animation: $scope.animation,
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
    progressBarDirective.$inject = ["ProgressBarsSettings", "ProgressBarsStorage", "ProgressBarFactory"];
})();

(function () {
    'use strict';

    angular
        .module('pg.progress-bars')
        .factory('ProgressBarFactory', ProgressBarFactory);

    function ProgressBarFactory() {
        return function(name, elements, options) {
            return new ProgressBar(name, elements, options);
        }
    }

    function ProgressBar(name, elements, options) {
        if (!name) {
            throw new Error('You must specify name for ProgressBar');
        }

        if (!elements || !elements.container || !elements.bar) {
            throw new Error('You must specify elements object with "container" and "bar" dom nodes');
        }

        options = options || {};

        this.name = name;
        this.elements = elements;
        this.options = {
            minimum: options.minimum || 8,
            speed: options.speed || 250,
            animation: options.animation || 'ease-out',
            trickleRate: options.trickleRate || 2,
            trickleSpeed: options.trickleSpeed || 300,
            showingClass: options.showingClass
        };
        this.current = null;
        this.toStop = true;
    }

    ProgressBar.prototype._show = function () {
        this.elements.container.addClass(this.options.showingClass);
        this.elements.bar.css('opacity', 1);
    };

    ProgressBar.prototype._hide = function () {
        this.elements.container.removeClass(this.options.showingClass);
        this.elements.bar.css('opacity', 0);
        this.elements.bar.css('width', 0);
    };

    ProgressBar.prototype._clamp = function (value, min, max) {
        if (value < min) {
            value = min;
        }
        if (value > max) {
            value = max;
        }

        return value;
    };

    ProgressBar.prototype._trickle = function () {
        var trickle = Math.sqrt(100 - this.current) / 5 * this.options.trickleRate;
        return this.inc(Math.random() * trickle);
    };

    ProgressBar.prototype._positioning = function (value, speed, ease) {
        return {
            width: value + '%',
            transition: 'all ' + speed + 'ms '+ ease
        };
    };

    ProgressBar.prototype.set = function (value) {
        var self = this;

        this._show();

        value = this._clamp(value, this.options.minimum, 100);
        this.current = value === 100 ? null : value;

        setTimeout(function () {
            var calculatedCssProperties = self._positioning(value, self.options.speed, self.options.animation);

            for (var property in calculatedCssProperties) {
                if (calculatedCssProperties.hasOwnProperty(property)) {
                    self.elements.bar.css(property, calculatedCssProperties[property]);
                }
            }
        }, 0);

        if (value === 100) {
            setTimeout(function () {
                self.elements.bar.css('transition', 'all ' + self.options.speed + 'ms linear');
                self.elements.bar.css('opacity', 0);

                setTimeout(function () {
                    self._hide();
                }, self.options.speed);
            }, self.options.speed);
        }

        return this;
    };

    ProgressBar.prototype.get = function() {
        return this.current;
    };

    ProgressBar.prototype.start = function () {
        var self = this;

        this.toStop = false;

        if (!self.current) {
            self.set(0);
        }

        var increasingLoop = function () {
            setTimeout(function () {
                if (!self.current || self.toStop) {
                    return;
                }

                self._trickle();
                increasingLoop();
            }, self.options.trickleSpeed);
        };

        increasingLoop();
        return this;
    };

    ProgressBar.prototype.isInProgress = function () {
        return !this.toStop;
    };

    ProgressBar.prototype.stop = function () {
        this.toStop = true;

        return this;
    };

    ProgressBar.prototype.inc = function (value) {
        if (!this.current) {
            return this.start();
        }

        if (typeof value !== 'number') {
            value = this._clamp(Math.random() * (100 - this.current) / 3, 10, 95);
        }

        this.current = this._clamp(this.current + value, 0, 99.4);
        this.set(this.current);

        return this;
    };

    ProgressBar.prototype.done = function () {
        if (this.current) {
            this.inc(30 + 50 * Math.random()).set(100);
        }

        return this;
    };
})();

(function () {
    'use strict';

    angular
        .module('pg.progress-bars')
        .provider('ProgressBarsSettings', ProgressBarsSettingsProvider);

    function ProgressBarsSettingsProvider() {
        var classNames = {};

        return {
            setContainerClass: function (className) {
                classNames.container = className;
                return this;
            },
            setBarClass: function (className) {
                classNames.bar = className;
                return this;
            },
            setShowingClass: function (className) {
                classNames.barShowing = className;
                return this;
            },
            $get: function () {
                return {
                    getClasses: function () {
                        return classNames;
                    }
                };
            }
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('pg.progress-bars')
        .service('ProgressBarsStorage', ProgressBarsStorageService);

    function ProgressBarsStorageService() {
        var progressBars = {};

        this._register = function (progressBar) {
            progressBars[progressBar.name] = progressBar;
        };

        this._unregister = function (progressBar) {
            if (progressBars[progressBar.name]) {
                delete progressBars[progressBar.name];
            }
        };

        this.get = function(name) {
            if (!progressBars[name]) {
                return null;
            }

            return progressBars[name];
        };
    }
})();
