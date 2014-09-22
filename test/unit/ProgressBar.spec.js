/* globals describe, beforeEach, inject, it, expect */
'use strict';

describe('ProgressBar component', function () {
    it ('Should throw error when non passed name of progress bar', function () {
        expect(function() {
            new ProgressBar();
        }).toThrowError(/name/);
    });

    it ('Should throw error when not passed container or bar angular dom elements', function () {
        expect(function() {
            new ProgressBar('test', {});
        }).toThrowError(/dom\snodes/);

        expect(function() {
            new ProgressBar('test', {
                container: angular.element('<div class="container"></div>')
            });
        }).toThrowError(/dom\snodes/);

        expect(function() {
            new ProgressBar('test', {
                bar: angular.element('<div class="bar"></div>')
            });
        }).toThrowError(/dom\snodes/);
    });

    it('Should initialize on right params', function () {
        expect(function () {
            new ProgressBar('test', {
                container: angular.element('<div class="container"></div>'),
                bar: angular.element('<div class="bar"></div>')
            }).not.toThrowError();
        })
    });
    //
    //describe('', function () {
    //    var baseTemplate = '<div class="container"><div class="bar"></div></div>';
    //    var progressBarTemplateContainer;
    //    var progressBarTemplateBar;
    //    var progressBar;
    //
    //    beforeEach(function () {
    //        progressBarTemplateContainer = angular.element(baseTemplate);
    //        progressBarTemplateBar = progressBarTemplateContainer.find('.bar');
    //        progressBar = ProgressBar('test', {
    //            container: progressBarTemplateContainer,
    //            bar: progressBarTemplateBar
    //        });
    //    });
    //
    //    it('', function () {
    //
    //    });
    //});
});