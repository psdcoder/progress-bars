module.exports = function (gulp, $, utils, config) {
    gulp.task('release:checkout-master', ['release:commit'], function (cb) {
        $.git.checkout('master', cb);
    });
};