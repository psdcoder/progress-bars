module.exports = function (gulp, $, utils, config) {
    gulp.task('run-server', ['js', 'watch'], function () {
        return gulp.src(config.paths.root)
            .pipe($.plumber())
            .pipe($.webserver({
                host: config.server.host,
                port: config.server.port,
                livereload: true,
                fallback: 'demo/index.html'
            }))
            .pipe($.notify('Dev server was started on: http://' + config.server.host + ':' + config.server.port));
    });
};

