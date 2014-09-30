/* globals describe, ddescribe, beforeEach, inject, it, expect, iit, module */
'use strict';

describe('progressBar directive', function () {
    var $compile;
    var $rootScope;
    var directiveElement;
    var scope;
    var ProgressBarsStorage;

    beforeEach(module('pg.progress-bars'));
    beforeEach(inject(function (_$compile_, _$rootScope_, $injector) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        scope = $rootScope;
        ProgressBarsStorage = $injector.get('ProgressBarsStorage');
        directiveElement = $compile('<progress-bar name="test" minimum="15" speed="350" trickle-rate="4" trickle-speed="400" animation="linear"></progress-bar>')(scope);
    }));

    describe('ProgressBar instantiating', function () {
        it('Should throw error when not passed name attribute', function () {
            expect(function errorFunctionWrapper() {
                $compile('<progress-bar></progress-bar>')($rootScope);
            }).toThrowError(/specify/);
        });

        it('Should add id attribute to element', function () {
            expect(directiveElement.attr('id')).toEqual('progress-bar-' + 'test');
        });

        it('Should register in storage instance of ProgressBar', function () {
            expect(ProgressBarsStorage.get('test')).not.toBeNull();
        });

        it('Options of saved in storage progress bar should be equal to set through directive attributes', function () {
            expect(ProgressBarsStorage.get('test').options.minimum).toEqual(15);
            expect(ProgressBarsStorage.get('test').options.speed).toEqual(350);
            expect(ProgressBarsStorage.get('test').options.trickleRate).toEqual(4);
            expect(ProgressBarsStorage.get('test').options.trickleSpeed).toEqual(400);
            expect(ProgressBarsStorage.get('test').options.animation).toEqual('linear');
        });

        it('Should unregistered from storage when directive destroyed', function () {
            expect(ProgressBarsStorage.get('test')).not.toBeNull();
            scope.$destroy();
            expect(ProgressBarsStorage.get('test')).toBeNull();
        })
    });
});