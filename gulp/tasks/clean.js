module.exports = function (gulp, $, utils, config) {
    gulp.task('clean', function (cb) {
        require('del')([config.paths.outputFolder + '/*.js'], cb);
    });
};