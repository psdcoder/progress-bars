module.exports = function (gulp, $, utils, config) {
    gulp.task('release:merge', ['release:checkout-master'], function (cb) {
        $.git.merge('develop', cb);
    });
};