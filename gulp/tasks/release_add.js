module.exports = function (gulp, $, utils, config) {
    gulp.task('release:add', ['release:build'], function () {
        return gulp.src(config.paths.root)
            .pipe($.git.add({ args: '--all' }));
    });
};