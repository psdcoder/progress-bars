module.exports = function (gulp, $, utils, config) {
    gulp.task('release', ['release:checkout-develop']);
};