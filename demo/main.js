(function () {
    'use strict';

    angular
        .module('demo-app', ['pg.progress-bars'])
        .controller('ProgressBarsCtrl', ProgressBarsCtrl);

    function ProgressBarsCtrl(ProgressBarsStorage) {
        this.setValues = {};

        this.start = function (name) {
            ProgressBarsStorage.get(name).start();
        };

        this.stop = function (name) {
            ProgressBarsStorage.get(name).stop();
        };

        this.done = function (name) {
            ProgressBarsStorage.get(name).done();
        };

        this.inc = function (name) {
            ProgressBarsStorage.get(name).inc();
        };

        this.set = function (name, value) {
            ProgressBarsStorage.get(name).set(+value);
        };

        this.get = function (name) {
            return ProgressBarsStorage.get(name).get();
        };
    }
})();