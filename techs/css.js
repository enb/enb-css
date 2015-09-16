// Support node 0.10: `postcss` uses promises
require('es6-promise').polyfill();

var EOL = require('os').EOL,
    path = require('path'),
    vfs = require('enb/lib/fs/async-fs'),
    postcss = require('postcss'),
    atImport = require('postcss-import'),
    atUrl = require('postcss-url'),
    csswring = require('csswring'),
    autoprefixer = require('autoprefixer');

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
 *             [bemTechs.levels, levels: ['blocks']],
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
module.exports = require('enb/techs/css').buildFlow()
    .name('css')
    .target('target', '?.css')
    .defineOption('sourcemap', false)
    .defineOption('autoprefixer', false)
    .defineOption('compress', false)
    .useFileList(['css'])
    .builder(function (fileList) {
        var dirname = this.node.getDir(),
            filename = path.join(dirname, this._target),
            // make list of files
            css = fileList.map(function (file) {
                return '@import "' + path.relative(dirname, file.fullname) + '";';
            }).join(EOL),
            processor = postcss();

        processor
            .use(atImport())
            .use(atUrl({
                url: 'rebase'
            }));

        // use autoprefixer
        if (this._autoprefixer) {
            processor.use(
               (this._autoprefixer.browsers ?
                   autoprefixer({ browsers: this._autoprefixer.browsers }) :
                   autoprefixer)
            );
        }

        // compress css
        if (this._compress) {
            processor.use(csswring());
        }

        // compile css
        var result = processor
            .process(css, {
                from: filename,
                to: filename,
                map: this._sourcemap && {
                    inline: this._sourcemap === 'inline',
                    annotation: true
                }
            });

        // write map file
        if (this._sourcemap && this._sourcemap !== 'inline') {
            return vfs.write(filename + '.map', JSON.stringify(result.map))
                .then(function () {
                    return result.css;
                });
        }

        return result.css;
    })
    .createTech();
