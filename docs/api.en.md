# Technologies API

The package includes the following technologies:

* [css](#css) – This technology builds the source CSS files.
* [css-imports](#css-imports) – This technology forms a list of `@import`s from the CSS source files.

## css

Collects the CSS source files for the blocks with styles.

The result of the build is a CSS file. The [postcss](https://github.com/postcss/postcss) post processor is used for processing the resulting CSS.

### Options

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [sourcemap](#sourcemap)
* [autoprefixer](#autoprefixer)
* [compress](#compress)

#### target

Type: `String`. Default: `?.css`.

The name of the file for saving the build result with the necessary `.css` project files.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The list of files is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['css']`.

The suffixes to use for filtering style files for the build.

#### sourcemap

Type: `String | Boolean`. Default: `false`.

The source map with information about the source files.

*Acceptable values:*

* **true** — The source map is stored in a separate file with the `.map` extension.
* **inline** — The map is embedded in a compiled file as a `base64` line.
* **object** [postcss options](https://github.com/postcss/postcss/blob/master/docs/source-maps.md#options).

#### autoprefixer

Type: `Object | Boolean`. Default: `false`.

Adds vendor prefixes using [autoprefixer](https://github.com/postcss/autoprefixer).

*Acceptable values:*

* **false** (`Boolean`) — Disables `autoprefixer`.
* **true** (`Boolean`) — Prefixes are added for the latest browser versions based on data from the [caniuse.com](http://caniuse.com) service (this is the default behavior of the [autoprefixer](https://github.com/postcss/autoprefixer) module).
* **browsers** (`String[]`) — Sets the configuration if an exact list of supported browsers must be passed.

  **Example**

  ```js
  {    autoprefixer: { browsers: ['Explorer 10', 'Opera 12'] }}
  ```

  > **Note.** For more information, see the [Autoprefixer](https://github.com/postcss/autoprefixer#browsers) documentation.

#### compress

Type: `Boolean`. Default: `false`.

CSS minification Uses [csswring](https://github.com/hail2u/node-csswring).

Support source maps.

**Example**

```js
var CSSTech = require('enb-css/techs/css'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting file names (FileList)
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Creating CSS files
        node.addTech([CSSTech, { /* options */ }]);
        node.addTarget('?.css');
    });
};
```

## css-imports

Forms a list of `@import`s from the CSS source files for blocks.

### Options

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)

#### target

Type: `String`. Default: `?.css`.

The name of the file for saving the build result with the necessary `.css` project files.

#### filesTarget

Type: `String`. Default: `?.files`.

The name of the target for accessing the list of source files for the build. The list of files is provided by the [files](https://github.com/enb/enb-bem-techs/blob/master/docs/api/api.en.md#files) technology in the [enb-bem-techs](https://github.com/enb/enb-bem-techs/blob/master/README.md) package.

#### sourceSuffixes

Type: `String | String[]`. Default: `['css']`.

The suffixes to use for filtering style files for the build.

**Example**

```js
var CSSImportsTech = require('enb-css/techs/css-imports'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Getting the file names (FileList)
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Creating CSS files
        node.addTech([CSSImportsTech, { /* options */ }]);
        node.addTarget('?.css');
    });
};
```
