module.exports = function (gulp, $, utils, config) {
    gulp.task('js', ['clean'], function() {
        return gulp.src(config.paths.src)
            .pipe($.plumber())
            .pipe($.concat(config.paths.outputFilename))
            .pipe($.header(utils.getBanner()))
            .pipe(gulp.dest(config.paths.outputFolder))
            .pipe($.ngAnnotate())
            .pipe($.concat(config.paths.outputFilename))
            .pipe($.rename({ suffix: '.min' }))
            .pipe($.uglify())
            .pipe($.header(utils.getBanner()))
            .pipe(gulp.dest(config.paths.outputFolder));
    });
};


