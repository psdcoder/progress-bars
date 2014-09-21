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

        this.get = function(name) {
            if (!progressBars[name]) {
                return null;
            }

            return progressBars[name];
        };
    }
})();
