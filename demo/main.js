(function () {
    'use strict';

    angular
        .module('demo-app', ['pg.progress-bars'])
        .controller('ProgressBarsCtrl', ProgressBarsCtrl);

    function ProgressBarsCtrl(ProgressBarsStorage) {
        this.start = function (name) {
            console.log('start');
            console.log(ProgressBarsStorage.get(name));
            ProgressBarsStorage.get(name).start();
        };

        this.stop = function (name) {
            console.log(ProgressBarsStorage.get(name));
            ProgressBarsStorage.get(name).stop();
        };

        this.done = function (name) {
            console.log(ProgressBarsStorage.get(name));
            ProgressBarsStorage.get(name).done();
        };

        this.inc = function (name) {
            console.log(ProgressBarsStorage.get(name));
            ProgressBarsStorage.get(name).inc();
        };

        this.set = function (name, value) {
            console.log(ProgressBarsStorage.get(name));
            ProgressBarsStorage.get(name).set(value);
        };

        this.get = function (name) {
            console.log(ProgressBarsStorage.get(name));
            return ProgressBarsStorage.get(name).get();
        };
    }
})();