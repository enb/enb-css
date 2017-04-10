enb-css
=======

[![Greenkeeper badge](https://badges.greenkeeper.io/enb/enb-css.svg)](https://greenkeeper.io/)

[![NPM version](http://img.shields.io/npm/v/enb-css.svg?style=flat)](http://www.npmjs.org/package/enb-css)
[![Build Status](http://img.shields.io/travis/enb/enb-css/master.svg?style=flat&label=tests)](https://travis-ci.org/enb/enb-css)
[![Build status](http://img.shields.io/appveyor/ci/blond/enb-css.svg?style=flat&label=windows)](https://ci.appveyor.com/project/andrewblond/enb-css)
[![Coverage Status](https://img.shields.io/coveralls/enb/enb-css.svg?style=flat)](https://coveralls.io/r/enb/enb-css?branch=master)
[![Dependency Status](http://img.shields.io/david/enb/enb-css.svg?style=flat)](https://david-dm.org/enb/enb-css)

Пакет предоставляет набор [ENB](https://ru.bem.info/tools/bem/enb-bem/)-технологий для сборки CSS-файлов в проектах, построенных по [методологии БЭМ](https://ru.bem.info/method/).

**Технологии пакета `enb-css`:**

* [css](docs/api.ru.md#css) — технология собирает исходные CSS-файлы.
* [css-imports](docs/api.ru.md#css-imports) — технология состовляет список `@import`'ов из исходных CSS-файлов.

Принципы работы технологий и их API описаны в документе [API технологий](docs/api.ru.md).

Обзор документа
---------------

<!-- TOC -->
- [Быстрый старт](#Быстрый-старт)
- [Особенности работы пакета](#Особенности-работы-пакета)
  - [Добавление вендорных префиксов](#Добавление-вендорных-префиксов)
  - [Минимизация CSS-кода](#Минимизация-css-кода)
  - [Source Maps](#source-maps)
- [Дополнительная документация](#Дополнительная-документация)
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
            [bemTechs.levels, { levels: ['blocks'] }],
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

Для автоматического добавления вендорных префиксов в процессе сборки используйте опцию [autoprefixer](docs/api.ru.md#autoprefixer).

### Минимизация CSS-кода

Для минимизации CSS-кода используется [csswring](https://github.com/hail2u/node-csswring).

Включить минимизацию можно с помощью опции [compress](docs/api.ru.md#compress).

### Source Maps

Технология `css` позволяет строить карты кода (sourcemap) с информацией об исходных файлах.

Включить построение карт кода можно с помощью опции [sourcemap](docs/api.ru.md#sourcemap).

Дополнительная документация
---------------------------

* [Сборка отдельного бандла для IE](docs/ie.ru.md)

Лицензия
--------

© 2015 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
