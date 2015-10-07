var path = require('path'),
    vow = require('vow'),
    enb = require('enb'),
    vfs = enb.asyncFS || require('enb/lib/fs/async-fs'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    composeImports = require('../lib/compose-imports'),
    processCSS = require('../lib/process-css');

/**
 * @class CSSTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Builds CSS files using [Postcss]{@link https://github.com/postcss/postcss}.
 *
 * Files are processing in 2 steps:<br/>
 * 1. Prepare list of @import sources (contain source code).
 * 2. Expand @import and rebase urls.
 *
 * @param {Object}          [options]                        Options
 * @param {String}          [options.filesTarget='?.files']  Path to target with [FileList]{@link http://bit.ly/1GTUOj0}
 * @param {String[]}        [options.sourceSuffixes=['css']  Files with specified suffixes involved in the assembly.
 * @param {Boolean|String}  [options.sourcemap=false]        Builds sourcemap:
 *                                                           - `true` – builds ?.css.map.
 *                                                           - `inline` – builds and inlining sourcemap
 *                                                                        into bundled CSS file.
 * @param {Boolean|Object}  [options.autoprefixer=false]     Adds vendor prefixes using autoprefixer:
 *                                                           - `true` – enables autoprefixer and defines what
 *                                                                      prefixes should be used based on
 *                                                                      [CanIUse]{@link http://caniuse.com} data.
 *                                                           - `{browsers: ['last']}` – allows to set custom browsers.
 * @param {Boolean}         [options.compress=false]         Minifies styles. Supports sourcemap.
 *
 * @example
 * var CSSTech = require('enb-css/techs/css'),
 *     FileProvideTech = require('enb/techs/file-provider'),
 *     bemTechs = require('enb-bem-techs');
 *
 * module.exports = function(config) {
 *     config.node('bundle', function(node) {
 *         // get FileList
 *         node.addTechs([
 *             [FileProvideTech, { target: '?.bemdecl.js' }],
 *             [bemTechs.levels, { levels: ['blocks'] }],
 *             [bemTechs.deps],
 *             [bemTechs.files]
 *         ]);
 *
 *         // build css file
 *         node.addTech(CSSTech);
 *         node.addTarget('?.css');
 *     });
 * };
 */
module.exports = buildFlow.create()
    .name('css')
    .target('target', '?.css')
    .defineOption('sourcemap', false)
    .defineOption('autoprefixer', false)
    .defineOption('compress', false)
    .useFileList(['css'])
    .builder(function (fileList) {
        var dirname = this.node.getDir(),
            filename = path.join(dirname, this._target),
            cssImports = composeImports(fileList.map(function (file) {
                return file.fullname;
            }), { root: dirname }),
            result = processCSS(cssImports, {
                from: filename,
                to: filename,
                sourcemap: this._sourcemap,
                autoprefixer: this._autoprefixer,
                compress: this._compress
            }),
            map = result.map;

        return (map
            ? vfs.write(filename + '.map', JSON.stringify(map))
            : vow.resolve()
        ).then(function () {
            return result.css;
        });
    })
    .createTech();
