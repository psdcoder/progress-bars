module.exports = function (gulp, $, utils, config) {
    gulp.task('release:push', ['release:add-tag'], function (cb) {
        $.git.push('origin', 'master', { args: '--tags' }, cb);
    });
};