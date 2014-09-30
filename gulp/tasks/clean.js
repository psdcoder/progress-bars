module.exports = function (gulp, $, utils, config) {
    gulp.task('clean', function () {
        return gulp.src(config.paths.outputFolder, {read: false})
            .pipe($.clean());
    });
};