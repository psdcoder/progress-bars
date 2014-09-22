/* global require, process */
'use strict';

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var bowerPackage = require('./bower.json');

var gulpArguments = process.argv.splice(2);
var server = {
    host: 'localhost',
    port: 8000
};
var paths = {
    src: [
        path.join('src', bowerPackage.name + '.module.js'),
        path.join('src', '**', '*.js')
    ],
    outputFolder: 'dist',
    outputFilename: bowerPackage.name + '.js',
    demoFolder: 'demo',
    test: [
        'test/unit/**/*.js'
    ]
};
var banner = [
    '/*! ',
    bowerPackage.name + ' ',
    'v' + bowerPackage.version + ' | ',
    bowerPackage.authors.join(', ') + ' | (c) ' + new Date().getFullYear(),
    ' */',
    '\n'
].join('');


gulp.task('default', [
    'lint',
    'js',
    'test'
]);

gulp.task('clean', function (cb) {
    return gulp.src(paths.outputFolder, {read: false})
        .pipe($.clean());
});

gulp.task('js', ['clean'], function() {
    return gulp.src(paths.src)
        .pipe($.plumber())
        .pipe($.concat(paths.outputFilename))
        .pipe($.header(banner))
        .pipe(gulp.dest(paths.outputFolder))
        .pipe($.concat(paths.outputFilename))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglify())
        .pipe($.header(banner))
        .pipe(gulp.dest(paths.outputFolder));
});

gulp.task('lint', function () {
    return gulp.src(path.join(__dirname, paths.outputFolder, paths.outputFilename))
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('test', function() {
    return gulp.src(
            [
                'bower_components/angular/angular.js',
                'src/components/ProgressBar.js',
                'src/pg.progress-bars.module.js',
                'src/services/ProgressBars.service.js',
                'src/services/ProgressBarsStorage.service.js',
                'src/directives/progressBar.directive.js'
            ].concat(paths.test)
        )
        .pipe($.plumber())
        .pipe($.karma({
            configFile: 'test/karma.conf.js'
        }))
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('server', ['js'], function () {
    return gulp.src(__dirname)
        .pipe($.plumber())
        .pipe($.webserver({
            host: server.host,
            port: server.port,
            livereload: true,
            fallback: 'demo/index.html'
        }))
        .pipe($.notify('Dev server was started on: http://' + server.host + ':' + server.port));
});

gulp.task('release', ['bump'], function () {
    gulp.start('release-tag');
});

function getBumpedVersion(file, key) {
    file = file || './bower.json';
    key = key || 'version';

    var cached = null;

    if (cached === null) {
        cached = JSON.parse(fs.readFileSync(file))[key];
    }

    return cached;
}
//gulp.task('release-push', ['release-tag'], function () {
//    $.git.push('origin', 'master', {args: '--tags'}).end();
//});


gulp.task('release-tag', ['release-commit'], function (cb) {
    var version = 'v' + getBumpedVersion();
    var message = 'Release ' + version;

    $.git.tag(version, message);
    cb();
});

gulp.task('release-commit', function () {
    var version = 'v' + getBumpedVersion();
    var message = 'Release ' + version;

    return gulp.src('./')
        .pipe($.git.add())
        .pipe($.git.commit(message))
        .pipe($.git.checkout('HEAD'));
});

gulp.task('bump', function (cb) {
    var type;
    var allowedTypes = ['major', 'minor', 'patch', 'prerelease'];

    if (!gulpArguments[1]) {
        cb('You must specify release type. You can use this types: \'' + allowedTypes.join('\', \'') + '\'.');
        return;
    }

    type = allowedTypes.indexOf(gulpArguments[1].replace(/^--/g, ''));

    if (type === -1) {
        cb('Not allowed release type, You can use this types: \'' + allowedTypes.join('\', \'') + '\'.');
        return;
    }

    return gulp.src('bower.json')
        .pipe($.bump({ type: allowedTypes[type] }))
        .pipe(gulp.dest('.'));
});
