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
            };

        return build(sources)
            .should.become('@import "' + path.normalize('../sources/foo.css') + '";');
    });

    it('should import several files', function () {
        var sources = {
                'bar.css': '.bar {}',
                'baz.css': '.baz {}'
            };

            return build(sources)
                .should.become([
                    '@import "' + path.normalize('../sources/bar.css') + '";',
                    '@import "' + path.normalize('../sources/baz.css') + '";'
                ].join(EOL));
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
