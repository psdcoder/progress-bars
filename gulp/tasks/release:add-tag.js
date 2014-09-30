module.exports = function (gulp, $, utils, config) {
    gulp.task('release:add-tag', ['release:merge'], function (cb) {
        $.git.tag(utils.getVersion(), utils.getReleaseMessage(), cb);
    });
};