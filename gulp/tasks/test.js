var path = require('path');

module.exports = function (gulp, $, utils, config) {
    gulp.task('test', function() {
        return gulp.src(
                [
                    path.join(config.paths.root, 'bower_components/angular/angular.js'),
                    path.join(config.paths.root, 'src/components/ProgressBar.js'),
                    path.join(config.paths.root, 'src/pg.progress-bars.module.js'),
                    path.join(config.paths.root, 'src/services/ProgressBars.service.js'),
                    path.join(config.paths.root, 'src/services/ProgressBarsStorage.service.js'),
                    path.join(config.paths.root, 'src/directives/progressBar.directive.js')
                ].concat(config.paths.test)
            )
            .pipe($.plumber())
            .pipe($.karma({
                configFile: path.join(config.paths.root, 'test/karma.conf.js')
            }))
            .on('error', function(err) {
                throw err;
            });
    });
};