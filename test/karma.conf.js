/* global module */
module.exports = function (config) {
    'use strict';

    config.set({
        basePath : '',
        autoWatch : true,
        frameworks: ['jasmine'],
        browsers : ['PhantomJS'],
        plugins : [
            'karma-spec-reporter',
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],
        reporters : ['spec']
    });
};