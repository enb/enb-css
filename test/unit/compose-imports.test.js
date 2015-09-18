var EOL = require('os').EOL,
    path = require('path'),
    composeImports = require('../../lib/compose-imports');

describe('compose imports', function () {
    it('should return empty string if there are no files', function () {
        composeImports([]).should.equal('');
    });

    it('should handle relative path', function () {
        var dirname = path.resolve('path/to/dir'),
            filename = path.resolve('path/to/file.css');

        composeImports([filename], { root: dirname })
            .should.equal('@import "' + path.normalize('../file.css') + '";');
    });

    it('should handle absolute path', function () {
        composeImports(['/path/to/file.css'])
            .should.equal('@import "/path/to/file.css";');
    });

    it('should concat several files', function () {
        composeImports([
            '/path/to/file-1.css',
            '/path/to/file-2.css'
        ]).should.equal([
            '@import "/path/to/file-1.css";',
            '@import "/path/to/file-2.css";'
        ].join(EOL));
    });
});
