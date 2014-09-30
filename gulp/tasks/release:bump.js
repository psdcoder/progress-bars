module.exports = function (gulp, $, utils, config) {
    gulp.task('release:bump', function (cb) {
        var type;
        var allowedTypes = ['major', 'minor', 'patch', 'prerelease'];

        if (!utils.getArguments()[1]) {
            cb('You must specify release type. You can use this types: \'--' + allowedTypes.join('\', --\'') + '\'.');
            return;
        }

        type = allowedTypes.indexOf(utils.getArguments()[1].replace(/^--/g, ''));

        if (type === -1) {
            cb('Not allowed release type, You can use this types: \'--' + allowedTypes.join('\', --\'') + '\'.');
            return;
        }

        return gulp.src('bower.json')
            .pipe($.bump({ type: allowedTypes[type] }))
            .pipe(gulp.dest(config.paths.root));
    });
};