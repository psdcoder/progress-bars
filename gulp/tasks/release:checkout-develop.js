module.exports = function (gulp, $, utils, config) {
    gulp.task('release:checkout-develop', ['release:push'], function (cb) {
        $.git.checkout('develop', cb);
    });
};