module.exports = function (gulp, $, utils, config) {
    gulp.task('server', ['run-server', 'css'], function () {
        return gulp.src(config.paths.demoFolder + '/index.html')
            .pipe($.plumber())
            .pipe($.open('', {
                url: 'http://' + config.server.host + ':' + config.server.port + '/demo/index.html',
                app: utils.getBrowserApp()
            }));
    });
};