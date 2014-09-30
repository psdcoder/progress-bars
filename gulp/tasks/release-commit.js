module.exports = function (gulp, $, utils, config) {
    gulp.task('release:commit', ['release:add'], function () {
        return gulp.src(config.paths.root)
            .pipe($.git.commit(utils.getReleaseMessage()));
    });
};