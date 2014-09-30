var path = require('path');
var stylish = require('jshint-stylish');

module.exports = function (gulp, $, utils, config) {
    gulp.task('lint', function () {
        return gulp.src(path.join(config.paths.root, config.paths.outputFolder, config.paths.outputFilename))
            .pipe($.plumber())
            .pipe($.jshint())
            .pipe($.jshint.reporter(stylish));
    });
};