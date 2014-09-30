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
