var enb = require('enb'),
    buildFlow = enb.buildFlow || require('enb/lib/build-flow'),
    composeImports = require('../lib/compose-imports');

/**
 * @class CSSImportsTech
 * @augments {BaseTech}
 * @classdesc
 *
 * Composes list of `@import`s to source files.
 *
 * @param {Object}    [options]                        Options
 * @param {String}    [options.filesTarget='?.files']  Path to target with [FileList]{@link http://bit.ly/1GTUOj0}
 * @param {String[]}  [options.sourceSuffixes=['css']  Files with specified suffixes involved in the assembly.
 *
 * @example
 * var CSSImportsTech = require('enb-css/techs/css-imports'),
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
 *         node.addTech(CSSImportsTech);
 *         node.addTarget('?.css');
 *     });
 * };
 */
module.exports = buildFlow.create()
    .name('css-imports')
    .target('target', '?.css')
    .useFileList(['css'])
    .builder(function (fileList) {
        var dirname = this.node.getDir();

        return composeImports(fileList.map(function (file) {
            return file.fullname;
        }), { root: dirname });
    })
    .createTech();
