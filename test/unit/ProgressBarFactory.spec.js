/* globals describe, ddescribe, beforeEach, inject, it, expect, iit,  */
'use strict';

describe('ProgressBar Factory && ProgressBar class', function () {
    var ProgressBarFactory;

    beforeEach(module('pg.progress-bars'));
    beforeEach(inject(function ($injector) {
        ProgressBarFactory = $injector.get('ProgressBarFactory');
    }));

    it('Should be a function', function () {
        expect(ProgressBarFactory).toEqual(jasmine.any(Function));
    });

    it('Should throw error when non passed name of progress bar', function () {
        expect(function() {
            ProgressBarFactory();
        }).toThrowError(/name/);
    });

    it('Should throw error when not passed any dom elements', function () {
        expect(function () {
            ProgressBarFactory('test', {});
        }).toThrowError(/dom\snodes/);
    });

    it('Should throw error when not passed container dom element', function () {
        expect(function () {
            ProgressBarFactory('test', {
                container: angular.element('<div class="container"></div>')
            });
        }).toThrowError(/dom\snodes/);
    });

    it('Should throw error when not passed bar dom element', function () {
        expect(function() {
            ProgressBarFactory('test', {
                bar: angular.element('<div class="bar"></div>')
            });
        }).toThrowError(/dom\snodes/);
    });

    it('Should initialize progress bar with right params', function () {
        expect(function () {
            ProgressBarFactory('test', {
                container: angular.element('<div class="container"></div>'),
                bar: angular.element('<div class="bar"></div>')
            }).not.toThrowError();
        });
    });

    describe('ProgressBar instance:', function () {
        var progressBarName = 'test';
        var progressBarTemplate = '<div class="container"><div class="bar"></div></div>';
        var options = {
            minimum: 15,
            speed: 350,
            animation: 'linear',
            trickleRate: 5,
            trickleSpeed: 450,
            showingClass: 'container-show'
        };
        var containerDomElement;
        var barDomElement;
        var progressBar;

        beforeEach(function () {
            containerDomElement = angular.element(progressBarTemplate);
            barDomElement = containerDomElement.find('div');
            progressBar = ProgressBarFactory(progressBarName, {
                container: containerDomElement,
                bar: barDomElement
            }, options);
        });

        describe('Default behavior', function () {
            it('By default progress bar is hidden', function () {
                expect(containerDomElement.hasClass(options.showingClass)).toBe(false);
            });

            it('Should set "name" property to null', function () {
                expect(progressBar.name).toBe(progressBarName);
            });

            it('Should set "current" property to null', function () {
                expect(progressBar.current).toBeNull();
            });

            it('Should set "toStop" property to null', function () {
                expect(progressBar.toStop).toBe(true);
            });

            it('Should set "options" to passed values', function () {
                expect(progressBar.options).toEqual(options);
            });
        });

        describe('Public methods:', function () {
            beforeEach(function () {
                jasmine.clock().install();
                spyOn(progressBar, '_positioning').and.callThrough();
                spyOn(progressBar, '_show').and.callThrough();
                spyOn(progressBar, '_hide').and.callThrough();
                spyOn(progressBar, '_clamp').and.callThrough();
                spyOn(progressBar, '_trickle').and.callThrough();
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            describe('"set"', function () {
                it('Should return "this"', function () {
                    expect(progressBar.set(50)).toEqual(progressBar);
                });

                it('Should set this.current to correct value', function () {
                    progressBar.set(50);
                    expect(progressBar.current).toEqual(50);
                });

                it('Should set current to null if passed 100', function () {
                    progressBar.set(100);
                    expect(progressBar.current).toBeNull();
                });

                describe('Correct work on setting different values', function () {
                    it('50', function () {
                        progressBar.set(50);

                        jasmine.clock().tick(10000);
                        expect(progressBar._positioning).toHaveBeenCalled();
                        expect(barDomElement.css('width')).toEqual('50%');
                        expect(barDomElement.css('transition')).toEqual('all ' + options.speed + 'ms ' + options.animation);
                    });

                    it('100', function () {
                        progressBar.set(100);

                        jasmine.clock().tick(options.speed + 1);

                        expect(barDomElement.css('opacity')).toEqual('0');
                        expect(barDomElement.css('transition')).toEqual('all ' + options.speed + 'ms linear');

                        jasmine.clock().tick(options.speed);
                        expect(progressBar._hide).toHaveBeenCalled();
                    });
                });
            });

            describe('"get"', function () {
                it('Should get correct value', function () {
                    progressBar.set(50);
                    jasmine.clock().tick(10000);
                    expect(progressBar.get()).toEqual(50);
                });
            });

            describe('"start"', function () {
                it('Should return "this"', function () {
                    expect(progressBar.start()).toEqual(progressBar);
                });

                describe('Correct starting work', function () {
                    it('Should set "toStop" property to false', function () {
                        progressBar.start();
                        expect(progressBar.toStop).toBe(false);
                    });

                    it('Should call _trickle method after each trickleSpeed ms', function () {
                        progressBar.start();
                        expect(progressBar._trickle).not.toHaveBeenCalled();

                        jasmine.clock().tick(options.trickleSpeed + 1);
                        expect(progressBar._trickle).toHaveBeenCalled();

                        jasmine.clock().tick(options.trickleSpeed * 2);
                        expect(progressBar._trickle.calls.count()).toEqual(3);
                    });
                });
            });

            describe('"isInProgress"', function () {
                it('Should return boolean value', function () {
                    expect(progressBar.isInProgress()).toEqual(jasmine.any(Boolean));
                });

                it('Should return false when progress bar stopped (on default)', function () {
                    expect(progressBar.isInProgress()).toEqual(false);
                });

                it('Should return true when progress bar started', function () {
                    progressBar.start();
                    jasmine.clock().tick(10000);
                    expect(progressBar.isInProgress()).toEqual(true);
                });
            });

            describe('"stop"', function () {
                it('Should return "this"', function () {
                    expect(progressBar.stop()).toEqual(progressBar);
                });

                it('Should stop progress bar', function () {
                    var currentValue;
                    
                    progressBar.start();
                    jasmine.clock().tick(options.trickleSpeed * 3 + 1);
                    currentValue = progressBar.get();
                    progressBar.stop();
                    jasmine.clock().tick(1000);
                    expect(progressBar.get()).toEqual(currentValue);
                });
            });

            describe('"inc"', function () {
                it('Should return "this"', function () {
                    expect(progressBar.inc()).toEqual(progressBar);
                });

                describe('Correct work', function () {
                    beforeEach(function () {
                        spyOn(progressBar, 'start').and.callThrough();
                    });

                    it('Should start progress bar if called', function () {

                        progressBar.inc();
                        expect(progressBar.start).toHaveBeenCalled();
                    });

                    it('Should start progress bar if called', function () {
                        progressBar.inc();
                        expect(progressBar.start).toHaveBeenCalled();
                    });

                    it('If passed value should set it after clamping', function () {
                        progressBar.inc(30);
                        expect(progressBar._clamp.calls.count()).toBe(1);
                    });

                    it('Should call "set" method', function () {
                        progressBar.inc();
                        expect(progressBar.start).toHaveBeenCalled();
                    });
                });
            });

            describe('"done"', function () {
                beforeEach(function () {
                    spyOn(progressBar, 'set').and.callThrough();
                });

                it('Should return "this"', function () {
                    expect(progressBar.done()).toEqual(progressBar);
                });

                it('Work only if progress bar already run', function () {
                    progressBar.done();
                    expect(progressBar.set).not.toHaveBeenCalled();

                    progressBar.start();
                    progressBar.done();
                    expect(progressBar.set).toHaveBeenCalled();
                });
            });
        });

        describe('Private methods:', function () {
            describe('"_show"', function () {
                beforeEach(function () {
                    progressBar._show();
                });

                it('should add class to container element', function () {
                    expect(containerDomElement.hasClass(options.showingClass)).toBe(true);
                });

                it('opacity property of bar must be equal to 1', function () {
                    expect(barDomElement.css('opacity')).toEqual('1');
                });
            });

            describe('"_hide"', function () {
                beforeEach(function () {
                    progressBar._show();
                    progressBar._hide();
                });

                it('container element should not to have showing class', function () {
                    expect(containerDomElement.hasClass(options.showingClass)).toBe(false);
                });

                it('opacity property of bar must be equal to 0', function () {
                    expect(barDomElement.css('opacity')).toEqual('0');
                });

                it('width property of bar must be equal to 0px', function () {
                    expect(barDomElement.css('width')).toEqual('0px');
                });
            });

            describe('"_clamp"', function () {
                it('Should return min', function () {
                    expect(progressBar._clamp(1, 5, 10)).toEqual(5);
                });

                it('Should return max', function () {
                    expect(progressBar._clamp(20, 5, 10)).toEqual(10);
                });

                it('Should return value', function () {
                    expect(progressBar._clamp(7, 5, 10)).toEqual(7);
                });
            });

            describe('"_positioning"', function () {
                it('Should return object with correct result', function () {
                    expect(progressBar._positioning(50, 50, 'linear')).toEqual({
                        width: '50%',
                        transition: 'all 50ms linear'
                    });
                });
            });
        });
    });
});