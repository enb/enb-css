# Building a separate bundle for IE

If your project has styles that only apply to IE, place them in a separate file with the special extension `.ie*.css`:

* `. ie.css` — Styles for any version of IE earlier than version 9.
* `. ie6.css` — Styles for IE 6.
* `. ie7.css` — Styles for IE 7.
* `. ie8.css` — Styles for IE 8.
* `. ie9.css` — Styles for IE  9.

To build a separate bundle for IE, you need to:

1. Create one or more files with the `.ie*.css` extension in the block folder:

  ```
  blocks/
  └── block/
      ├── block.css
      ├── block.ie.css
      └── block.ie6.css
  ```

2. Add the `CSSTech` technology again:

  ```js
  node.addTechs([
     [CSSTech], // for the main CSS
     [CSSTech]  // for IE
  ]);
  ```

3. Add a new build target for the IE file – `?.ie6.css`:

  ```js
  node.addTechs([
      [CSSTech],
      [CSSTech, { target: '?.ie6.css' }]  // IE 6
  ]);
  node.addTargets(['?.css', '?.ie6.css']);
  ```

4. Add styles:

  ```html
  <!DOCTYPE html>
  <html>
      <head>
          <meta charset="utf-8"/>
          <!--[if gt IE 9]><!-->            <link rel="stylesheet" href="index.css"/>        <!--<![endif]-->
          <!--[if lte IE 9]>
              <link rel="stylesheet" href="index.ie.css"/>
          <![endif]-->
      </head>
      <body>
  ```

> **Note.** In BEM projects, styles are usually connected using [conditional comments](https://en.wikipedia.org/wiki/Conditional_comment).

It is important that the file for IE includes all the styles for the entire page, in addition to the styles specific to IE.

To get a file like this, use the [sourceSuffixed](api.en.md#sourcesuffixes) option to expand the list of suffixes.

```js
node.addTechs([
    [stylusTech],
    [stylusTech, {
        target: '?.ie6.css',
        sourceSuffixes: [
            'css',     // General styles
            'ie.css',  // Styles for IE < 9
            'ie6.css'  // Styles for IE 6
        ]
    }]
]);
node.addTargets(['?.css', '?.ie6.css']);
```

The result is the `.enb/make.js` configuration file:

```js
var CSSTech = require('enb-css/techs/css'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // getting the list of files (FileList)
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Building CSS files
        node.addTechs([
            [CSSTech],
            [CSSTech, {
                target: '?.ie6.css',
                sourceSuffixes: [
                    'styl', 'css',          // General styles
                    'ie.styl', 'ie.css',    // Styles for IE < 9
                    'ie6.styl', 'ie6.css'   // Styles for IE 6
                ]
            }]
        ]);
        node.addTargets(['?.css', '?.ie6.css']);
    });
};
```
