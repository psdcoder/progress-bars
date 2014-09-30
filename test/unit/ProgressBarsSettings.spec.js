/* globals describe, ddescribe, beforeEach, inject, it, expect, iit,  */
'use strict';

describe('ProgressBarsSettings Provider', function () {
    var ProgressBarsSettingsProvider;
    var ProgressBarsSettingsService;

    beforeEach(module('pg.progress-bars', function(_ProgressBarsSettingsProvider_) {
        ProgressBarsSettingsProvider = _ProgressBarsSettingsProvider_;
    }));
    beforeEach(inject(function ($injector) {
        ProgressBarsSettingsService = $injector.get('ProgressBarsSettings');
    }));

    describe('Provider methods', function () {
        var testClass = 'some-test-class';

        describe('"setContainerClass"', function () {
            it('Should return self instance', function () {
                expect(ProgressBarsSettingsProvider.setContainerClass()).toEqual(ProgressBarsSettingsProvider);
            });

            it('Should set container class', function () {
                ProgressBarsSettingsProvider.setContainerClass(testClass);
                expect(ProgressBarsSettingsService.getClasses().container).toEqual(testClass);
            });
        });

        describe('"setBarClass"', function () {
            it('Should return self instance', function () {
                expect(ProgressBarsSettingsProvider.setBarClass()).toEqual(ProgressBarsSettingsProvider);
            });

            it('Should set container class', function () {
                ProgressBarsSettingsProvider.setBarClass(testClass);
                expect(ProgressBarsSettingsService.getClasses().bar).toEqual(testClass);
            });
        });

        describe('"setShowingClass"', function () {
            it('Should return self instance', function () {
                expect(ProgressBarsSettingsProvider.setShowingClass()).toEqual(ProgressBarsSettingsProvider);
            });

            it('Should set container class', function () {
                ProgressBarsSettingsProvider.setShowingClass(testClass);
                expect(ProgressBarsSettingsService.getClasses().barShowing).toEqual(testClass);
            });
        });
    });

    describe('Service methods', function () {
        it('Should return right classes', function () {
            ProgressBarsSettingsProvider.setContainerClass('container');
            ProgressBarsSettingsProvider.setBarClass('bar');
            ProgressBarsSettingsProvider.setShowingClass('bar-showing');

            expect(ProgressBarsSettingsService.getClasses()).toEqual({
                container: 'container',
                bar: 'bar',
                barShowing: 'bar-showing'
            });
        });
    });
});