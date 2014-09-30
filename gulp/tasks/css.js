var path = require('path');

module.exports = function (gulp, $, utils, config) {
    gulp.task('css', function () {
        return gulp.src(path.join(config.paths.demoFolder, '*.less'))
            .pipe($.plumber())
            .pipe($.less())
            .pipe($.autoprefixer({
                browsers: ['last 2 versions']
            }))
            .pipe($.rename({
                extname: '.css'
            }))
            .pipe(gulp.dest(config.paths.demoFolder));
    });
};