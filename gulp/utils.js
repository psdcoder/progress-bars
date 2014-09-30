var os = require('os');
var path = require('path');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var bowerPackagePath = path.join(__dirname, '..', 'bower.json');
var processArguments = process.argv.splice(2);

module.exports = {
    getArguments: function () {
        return processArguments;
    },
    loadBowerJson: function () {
        delete require.cache[path.resolve(bowerPackagePath)];
        return require(bowerPackagePath);
    },
    getBanner: function() {
        var bowerPackage = this.loadBowerJson();

        return [
            '/*! ',
            bowerPackage.name + ' ',
            'v' + bowerPackage.version + ' | ',
            bowerPackage.authors.join(', ') + ' | (c) ' + new Date().getFullYear(),
            ' */',
            '\n'
        ].join('');
    },
    getBrowserApp: function () {
        //also can be 'firefox'
        var platformBrowserApp;

        switch (os.platform()) {
            case 'linux':
                platformBrowserApp = 'google-chrome';
                break;
            case 'darwin':
                platformBrowserApp = 'open /Applications/Google\\ Chrome.app';
                break;
            case 'win32':
                platformBrowserApp = 'chrome';
                break;
            default:
                $.util.log($.util.colors.red('Unsupported dev platform'));
                process.exit();
                break;
        }

        return platformBrowserApp;
    },
    getBumpedVersion: function (file, key) {
        file = file || bowerPackagePath;
        key = key || 'version';

        var cached = null;

        if (cached === null) {
            cached = JSON.parse(fs.readFileSync(file))[key];
        }

        return cached;
    },
    getVersion: function () {
        return 'v' + this.getBumpedVersion();
    },
    getReleaseMessage: function () {
        return 'Release ' + this.getVersion();
    }
};






