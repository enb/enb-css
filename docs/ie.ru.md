Сборка отдельного бандла для IE
===============================

Если в проекте есть стили, которые должны примениться только для IE, то их помещают в отдельный файл со специальным расширением `.ie*.css`:

* `.ie.css` — стили для любого IE, ниже 9й версии.
* `.ie6.css` — стили для IE 6.
* `.ie7.css` — стили для IE 7.
* `.ie8.css` — стили для IE 8.
* `.ie9.css` — стили для IE 9.

Чтобы собрать отдельный бандл для IE нужно:

**1.** В папке блока создать один или несколько файлов c расширением `.ie*.css`:

```
blocks/
└── block/
    ├── block.css
    ├── block.ie.css
    └── block.ie6.css
```

**2.** Добавить технологию `CSSTech` ещё раз:

```js
node.addTechs([
   [CSSTech], // для основного CSS
   [CSSTech]  // для IE
]);
```

**3.** Добавить новую цель сборки для IE файла — `?.ie6.css`:

```js
node.addTechs([
    [CSSTech],
    [CSSTech, { target: '?.ie6.css' }]  // IE 6
]);

node.addTargets(['?.css', '?.ie6.css']);
```

**4.** В БЭМ проектах принято подключать стили с помощью [условных комментариев](https://ru.wikipedia.org/wiki/Условный_комментарий).

**Пример**

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <!--[if gt IE 9]><!-->
            <link rel="stylesheet" href="index.css"/>
        <!--<![endif]-->
        <!--[if lte IE 9]>
            <link rel="stylesheet" href="index.ie.css"/>
        <![endif]-->
    </head>
    <body>
```

Важно, чтобы файл, подключаемый для IE, содержал стили не только специфичные для него, но и общие для всей страницы.

Чтобы собрать такой файл, нужно расширить список суффиксов с помощью опции [sourceSuffixed](api.ru.md#sourcesuffixes).

```js
node.addTechs([
    [stylusTech],
    [stylusTech, {
        target: '?.ie6.css',
        sourceSuffixes: [
            'css',     // Общие стили
            'ie.css',  // Стили для IE < 9
            'ie6.css'  // Стили для IE 6
        ]
    }]
]);
node.addTargets(['?.css', '?.ie6.css']);
```

В итоге получаем следующий конфигурационный файл `.enb/make.js`:

```js
var CSSTech = require('enb-css/techs/css'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // получаем список файлов (FileList)
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Собираем CSS-файлы
        node.addTechs([
            [CSSTech],
            [CSSTech, {
                target: '?.ie6.css',
                sourceSuffixes: [
                    'styl', 'css',          // Общие стили
                    'ie.styl', 'ie.css',    // Стили для IE < 9
                    'ie6.styl', 'ie6.css'   // Стили для IE 6
                ]
            }]
        ]);
        node.addTargets(['?.css', '?.ie6.css']);
    });
};
```
