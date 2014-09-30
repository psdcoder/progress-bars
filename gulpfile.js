/* global require, process */
'use strict';

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var gulpPlugins = require('gulp-load-plugins')();
var utils = require('./gulp/utils');
var config = require('./gulp/config');

fs.readdirSync(path.join(__dirname, 'gulp', 'tasks'))
    .forEach(function(file) {
        require(path.join(__dirname, 'gulp', 'tasks', file))(gulp, gulpPlugins, utils, config);
    });