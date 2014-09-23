(function () {
    'use strict';

    angular
        .module('pg.progress-bars')
        .service('ProgressBarsStorage', ProgressBarsStorageService);

    function ProgressBarsStorageService() {
        var progressBars = {};

        this.register = function (progressBar) {
            progressBars[progressBar.name] = progressBar;
        };

        this.unregister = function (progressBar) {
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
