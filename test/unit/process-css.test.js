var sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    postcss = require('postcss'),
    postcssImport = require('postcss-import'),
    postcssUrl = require('postcss-url'),
    csswring = require('csswring'),
    autoprefixer = require('autoprefixer');

describe('process css', function () {
    var css = '.foo {}',
        sandbox,
        processor,
        processCSS,
        importSpy,
        urlSpy,
        csswringSpy,
        autoprefixerSpy;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();

        processor = postcss();
        sandbox.spy(processor, 'use');
        sandbox.spy(processor, 'process');

        importSpy = sandbox.spy(postcssImport);
        urlSpy = sandbox.spy(postcssUrl);
        csswringSpy = sandbox.spy(csswring);
        autoprefixerSpy = sandbox.spy(autoprefixer);

        processCSS = proxyquire('../../lib/process-css', {
            postcss: function () { return processor; },
            'postcss-import': importSpy,
            'postcss-url': urlSpy,
            csswring: csswringSpy,
            autoprefixer: autoprefixerSpy
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should process imports', function () {
        processCSS(css);

        importSpy.should.calledOnce;
    });

    it('should rebase urls', function () {
        processCSS(css);

        urlSpy.should.calledWith({ url: 'rebase' });
    });

    it('should consider input', function () {
        processCSS(css, { from: 'path/to/source' });

        processor.process.should.calledWithMatch(css, { from: 'path/to/source' });
    });

    it('should consider output', function () {
        processCSS(css, { from: 'path/to/result' });

        processor.process.should.calledWithMatch(css, { from: 'path/to/result' });
    });

    describe('source maps', function () {
        it('should not build source maps by default', function () {
            processCSS(css, { sourcemap: false });

            processor.process.should.calledWithMatch(css, { map: false });
        });

        it('should build source maps', function () {
            processCSS(css, { sourcemap: true });

            processor.process.should.calledWithMatch(css, { map: {} });
        });

        it('should build inline source maps', function () {
            processCSS(css, {
                sourcemap: 'inline'
            });

            processor.process.should.calledWithMatch(css, { map: { inline: true } });
        });
    });

    describe('compress', function () {
        it('should not compress by default', function () {
            processCSS(css, { compress: true });

            csswringSpy.should.notCalled;
        });

        it('should  compress', function () {
            processCSS(css, { compress: true });

            csswringSpy.should.calledOnce;
        });
    });

    describe('autoprefixer', function () {
        it('should add vendor prefixes by CanIUse', function () {
            processCSS(css, { autoprefixer: true });

            processor.use.should.calledWith(autoprefixerSpy);
        });

        it('should add vendor prefixes by browser list', function () {
            var opts = { browsers: ['Explorer 10'] };

            processCSS(css, { autoprefixer: opts });

            autoprefixerSpy.should.calledWith(opts);
        });
    });
});
