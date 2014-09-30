var path = require('path');
var bowerPackage = require('../bower.json');
var rootPath = path.resolve(path.join(__dirname, '..'));

module.exports = {
    server: {
        host: 'localhost',
        port: 8000
    },
    paths: {
        root: rootPath,
        src: [
            path.join(rootPath, 'src', bowerPackage.name + '.module.js'),
            path.join(rootPath, 'src', '**', '*.js')
        ],
        outputFolder: path.join(rootPath, 'dist'),
        outputFilename: bowerPackage.name + '.js',
        demoFolder: path.join(rootPath, 'demo'),
        test: [
            path.join(rootPath, 'test', 'unit', '**', '*.js')
        ]
    }
};