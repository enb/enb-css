// Support node 0.10: `postcss` uses promises
require('es6-promise').polyfill();

var postcss = require('postcss'),
    atImport = require('postcss-import'),
    atUrl = require('postcss-url'),
    csswring = require('csswring'),
    autoprefixer = require('autoprefixer');

/**
 * @param {String} css                          Code to process.
 * @param {Object} [options]
 * @param {String} [options.from]               Path to input file.
 * @param {String} [options.to]                 Path to output file.
 * @param {Object} [options.autoprefixer]       Adds vendor prefixes using autoprefixer:
 *                                                - `true` enables autoprefixer and defines what prefixes should
 *                                                         be used based on [CanIUse]{@link http://caniuse.com} data.
 *                                                - `{browsers: ['last']}` allows to set custom browsers.
 * @param {Boolean} [options.compress]          Minifies styles. Supports sourcemap.
 * @param {Boolean|String} [options.sourcemap]  Builds sourcemap:
 *                                                - `true` builds ?.css.map.
 *                                                - `inline` builds and inlining sourcemap into bundled CSS file.
 */
module.exports = function (css, options) {
    options || (options = {});

    var processor = postcss();

    processor
        .use(atImport())
        .use(atUrl({
            url: 'rebase'
        }));

    // use autoprefixer
    if (options.autoprefixer) {
        processor.use(
           (options.autoprefixer.browsers ?
               autoprefixer({ browsers: options.autoprefixer.browsers }) :
               autoprefixer)
        );
    }

    // compress css
    if (options.compress) {
        processor.use(csswring());
    }

    var map;

    if (options.sourcemap) {
        if (options.sourcemap === 'inline') {
            map = { inline: true };
        } else if (typeof options.sourcemap === 'object') {
            map = options.sourcemap;
        } else {
            map = { inline: false };
        }
    } else {
        map = false;
    }

    // compile css
    return processor
        .process(css, {
            from: options.from,
            to: options.to,
            map: map
        });
};
