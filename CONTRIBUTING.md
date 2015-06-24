# How to contribute

* Plugin sources are available in `src` folder. In `dist` you can find already built versions, don't change it. IT will be rewrited on next build.
* Work in `develop` branch, not in `master`.
* Check unit tests and add new if it's necessary.
* Update docs and demo files if it's necessary.
* Build dist files: `gulp`
* Create pull request =)

## Development flow

* Install dev dependencies: `npm i`
* Install bower dependencies: `bower i`

For build dist version used `gulp` build system. So available few useful commands for developer:
* `gulp` - Run linting, build js and run unit tests.
* `gulp server` - run dev server with watching for changes in plugin sources.
