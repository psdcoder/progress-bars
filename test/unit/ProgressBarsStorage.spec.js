/* globals describe, ddescribe, beforeEach, inject, it, expect, iit, module */
'use strict';

describe('ProgressBarsStorage Service', function () {
    var ProgressBarsStorage;
    var progressBarTestName = 'test';
    var testProgressBarObject;

    beforeEach(module('pg.progress-bars'));
    beforeEach(inject(function ($injector) {
        ProgressBarsStorage = $injector.get('ProgressBarsStorage');
        testProgressBarObject = {
            name: progressBarTestName
        };
    }));

    describe('Private methods', function () {
        describe('"_register"', function () {
            it ('Should add to registry progressbar by name', function () {
                expect(ProgressBarsStorage.get(progressBarTestName)).toBeNull();
                ProgressBarsStorage._register(testProgressBarObject);
                expect(ProgressBarsStorage.get(progressBarTestName)).toEqual(testProgressBarObject);
            });
        });

        describe('"_unregister"', function () {
            it ('Should remove from registry progressbar by name', function () {
                ProgressBarsStorage._register(testProgressBarObject);
                expect(ProgressBarsStorage.get(progressBarTestName)).toEqual(testProgressBarObject);
                ProgressBarsStorage._unregister(testProgressBarObject);
                expect(ProgressBarsStorage.get(progressBarTestName)).toBeNull();
            });
        });
    });

    describe('Public methods', function () {
        describe('"get"', function () {
            it ('Should return null if progress bar doesn\'t exist', function () {
                expect(ProgressBarsStorage.get(progressBarTestName)).toBeNull();
            });

            it ('Should return progress bar when it was registered before', function () {
                ProgressBarsStorage._register(testProgressBarObject);
                expect(ProgressBarsStorage.get(progressBarTestName)).toEqual(testProgressBarObject);
            });
        });
    });
});