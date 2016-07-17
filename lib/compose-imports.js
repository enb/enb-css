var path = require('path'),
    EOL = require('os').EOL;

/**
 * Returns CSS code with imports to specified files.
 *
 * @param {String[]} filenames — paths to CSS files.
 * @param {Object} options — options.
 * @param {String} options.root — filenames will be processed on this dirname.

 * @returns {String}
 */
module.exports = function (filenames, options) {
    options || (options = {});

    var root = options.root,
        process = root
            ? function (filename) { return '@import "' + path.relative(root, filename) + '";'; }
            : function (filename) { return '@import "' + filename + '";'; };

    return filenames.map(process).join(EOL);
};
