enb-css
=======

[![NPM version](http://img.shields.io/npm/v/enb-css.svg?style=flat)](http://www.npmjs.org/package/enb-css)
[![Build Status](http://img.shields.io/travis/enb-make/enb-css/master.svg?style=flat&label=tests)](https://travis-ci.org/enb-make/enb-css)
[![Build status](http://img.shields.io/appveyor/ci/blond/enb-css.svg?style=flat&label=windows)](https://ci.appveyor.com/project/andrewblond/enb-css)
[![Coverage Status](https://img.shields.io/coveralls/enb-make/enb-css.svg?style=flat)](https://coveralls.io/r/enb-make/enb-css?branch=master)
[![Dependency Status](http://img.shields.io/david/enb-make/enb-css.svg?style=flat)](https://david-dm.org/enb-make/enb-css)

Пакет предоставляет [ENB](https://ru.bem.info/tools/bem/enb-bem/)-технологию для сборки CSS-файлов в проектах, построенных по [методологии БЭМ](https://ru.bem.info/method/).

Принципы работы технологии и ее API описаны в документе [API технологии](api.ru.md).

Обзор документа
---------------

<!-- TOC -->
- [Быстрый старт](#Быстрый-старт)
- [Особенности работы пакета](#Особенности-работы-пакета)
  - [Добавление вендорных префиксов](#Добавление-вендорных-префиксов)
  - [Минимизация CSS-кода](#Минимизация-css-кода)
  - [Сборка отдельного бандла для IE](#Сборка-отдельного-бандла-для-ie)
- [Лицензия](#Лицензия)
<!-- TOC END -->

Быстрый старт
-------------

**1.** Установите пакет `enb-css`:

```sh
$ npm install --save-dev enb-css
```

**Требования:** зависимость от пакета `enb` версии `0.16.0` или выше.

**2.** Опишите код стилей в файле с расширением `.css`:
```
 blocks/
 └── block/
     └── block.css
```

**3.** Добавьте в конфигурационный файл `.enb/make.js` следующий код:

```js
var CSSTech = require('enb-css/techs/css'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получаем список файлов (FileList)
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, levels: ['blocks']],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Строим CSS-файл
        node.addTech([CSSTech, {
            // target: '?.css',
            // filesTarget: '?.files',
            // sourceSuffixes: ['.css']
        }]);
        node.addTarget('?.css');
    });
};
```

Особенности работы пакета
-------------------------

### Добавление вендорных префиксов

Технология `css` поддерживает [Autoprefixer](https://github.com/postcss/autoprefixer).

Для автоматического добавления вендорных префиксов в процессе сборки используйте опцию [autoprefixer](api.ru.md#autoprefixer).

### Минимизация CSS-кода

Для минимизации CSS-кода используется [csswring](https://github.com/hail2u/node-csswring).

Включить минимизацию можно с помощью опции [compress](api.ru.md#compress).

### Сборка отдельного бандла для IE

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

**2.** Добавить еще технологию `CSSTech`:

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
node.addTargets(['?.css', '?.ie.css']);
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
            [bemTechs.levels, levels: ['blocks']],
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

Лицензия
--------

© 2015 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
