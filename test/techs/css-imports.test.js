var EOL = require('os').EOL,
    path = require('path'),
    mockFs = require('mock-fs'),
    loadDirSync = require('mock-enb/utils/dir-utils').loadDirSync,
    MockNode = require('mock-enb/lib/mock-node'),
    FileList = require('enb/lib/file-list'),
    CSSImportsTech = require('../../techs/css-imports');

describe('css-imports', function () {
    afterEach(function () {
        mockFs.restore();
    });

    it('should import file', function () {
        var sources = {
                'foo.css': '.bar {}'
            },
            output = '@import "' + path.normalize('../sources/foo.css') + '";';

        return assert(sources, output);
    });

    it('should import several files', function () {
        var sources = {
                'bar.css': '.bar {}',
                'baz.css': '.baz {}'
            },
            output = [
                '@import "' + path.normalize('../sources/bar.css') + '";',
                '@import "' + path.normalize('../sources/baz.css') + '";'
            ].join(EOL);

        return assert(sources, output);
    });
});

function build(sources, opts) {
    mockFs({
        sources: sources,
        bundle: {}
    });

    var bundle = new MockNode('bundle'),
        fileList = new FileList();

    fileList.addFiles(loadDirSync('sources'));
    bundle.provideTechData('?.files', fileList);

    return bundle.runTechAndGetContent(CSSImportsTech, opts)
        .spread(function (res) {
            return res;
        });
}

function assert(sources, expected, opts) {
    return build(sources, opts)
        .then(function (actual) {
            actual.should.eql(expected);
        });
}
