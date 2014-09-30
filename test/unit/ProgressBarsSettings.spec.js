/* globals describe, ddescribe, beforeEach, inject, it, expect, iit,  */
'use strict';

describe('ProgressBarsSettings Provider', function () {
    var ProgressBarsSettings;

    beforeEach(module('pg.progress-bars'));
    beforeEach(inject(function ($injector) {
        ProgressBarsSettings = $injector.get('ProgressBarsSettings');
    }));
});