var path = require('path');

module.exports = function (gulp, $, utils, config) {
    gulp.task('watch', function () {
        gulp.watch(config.paths.src, ['js']);
        gulp.watch(path.join(config.paths.demoFolder, '*.less'), ['css']);
    });
};

