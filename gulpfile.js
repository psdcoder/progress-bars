/* global require, process */
'use strict';

var gulp = require('gulp');
var path = require('path');
var os = require('os');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var bowerPackage = require('./bower.json');

var gulpArguments = process.argv.splice(2);
var server = {
    host: 'localhost',
    port: 8000
};
var browserApp = (function () {
    //also can be 'firefox'
    var platformBrowserApp;

    switch (os.platform()) {
        case 'linux':
            platformBrowserApp = 'google-chrome';
            break;
        case 'darwin':
            platformBrowserApp = 'open /Applications/Google\\ Chrome.app';
            break;
        case 'win32':
            platformBrowserApp = 'chrome';
            break;
        default:
            $.util.log($.util.colors.red('Unsupported dev platform'));
            process.exit();
            break;
    }

    return platformBrowserApp;
})();
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
        .pipe($.ngAnnotate())
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

gulp.task('server', ['run-server', 'css'], function () {
    return gulp.src(paths.demoFolder + '/index.html')
        .pipe($.plumber())
        .pipe($.open('', {
            url: 'http://' + server.host + ':' + server.port + '/demo/index.html',
            app: browserApp
        }));
});

gulp.task('run-server', ['js', 'watch'], function () {
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

gulp.task('css', function () {
    return gulp.src(path.join(paths.demoFolder, '*.less'))
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe($.rename({
            extname: '.css'
        }))
        .pipe(gulp.dest(paths.demoFolder));
});

gulp.task('watch', function () {
    gulp.watch(paths.src, ['js']);
    gulp.watch(path.join(paths.demoFolder, '*.less'), ['css']);
});

gulp.task('release', ['bump'], function () {
    gulp.start('release-push');
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

gulp.task('release-push', ['release-tag'], function () {
    $.git.push('origin', 'master', {args: '--tags'}).end();
});

gulp.task('release-tag', ['release-commit'], function (cb) {
    var version = 'v' + getBumpedVersion();
    var message = 'Release ' + version;

    $.git.tag(version, message, cb);
});

gulp.task('release-commit', function (cb) {
    var version = 'v' + getBumpedVersion();
    var message = 'Release ' + version;

    gulp.src('./')
        .pipe($.git.add())
        .pipe($.git.commit(message))
        .pipe($.git.checkout('HEAD', cb));
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
