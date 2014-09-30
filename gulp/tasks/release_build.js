module.exports = function (gulp, $, utils, config) {
    gulp.task('release:build', ['release:bump'], function (cb) {
        gulp.start(['js'])
            .on('task_stop', function (info) {
                if (info.task && info.task === 'js') {
                    cb();
                }
            });
    });
};