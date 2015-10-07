# API технологии `css`

Собирает исходные CSS-файлы блоков со стилями.

Результатом сборки является CSS-файл. Для обработки итогового CSS используется CSS-построцессор [postcss](https://github.com/postcss/postcss).

### Опции

* [target](#target)
* [filesTarget](#filestarget)
* [sourceSuffixes](#sourcesuffixes)
* [sourcemap](#sourcemap)
* [autoprefixer](#autoprefixer)
* [compress](#compress)

#### target

Тип: `String`. По умолчанию: `?.css`.

Имя файла, куда будет записан результат сборки необходимых `.css`-файлов проекта.

#### filesTarget

Тип: `String`. По умолчанию: `?.files`.

Имя таргета, откуда будет доступен список исходных файлов для сборки. Список файлов предоставляет технология [files](https://github.com/enb-bem/enb-bem-techs/blob/master/docs/api.ru.md#files) пакета [enb-bem-techs](https://github.com/enb-bem/enb-bem-techs/blob/master/README.md).

#### sourceSuffixes

Тип: `String | String[]`. По умолчанию: `['css']`.

Суффиксы, по которым отбираются файлы стилей для дальнейшей сборки.

#### sourcemap

Тип: `String | Boolean`. По умолчанию: `false`.

Построение карт кода (sourcemap) с информацией об исходных файлах.

*Допустимые значения:*

- **true:** карта хранится в отдельном файле с расширение `.map`.  
- **inline:** карта встраивается в скомпилированный файл в виде закодированной строки в формате `base64`.  

#### autoprefixer

Тип: `Object | Boolean`. По умолчанию: `false`.

Добавление вендорных префиксов с помощью [autoprefixer](https://github.com/postcss/autoprefixer).

*Допустимые значения:*

- **false:** отключает `autoprefixer`.
- **true:** префиксы добавляются для самых актуальных версий браузеров на основании данных сервиса [caniuse.com](http://caniuse.com) (поведение по умолчанию модуля [autoprefixer](https://github.com/postcss/autoprefixer)).
- **browsers: String[]:** задание конфигурации в случае, если требуется передать точный список поддерживаемых браузеров.

  **Пример**

  ```js
  {
      autoprefixer: { browsers: ['Explorer 10', 'Opera 12'] }
  }
  ```

  Подробнее в документации [autoprefixer](https://github.com/postcss/autoprefixer#browsers).

#### compress

Тип: `Boolean`. По умолчанию: `false`.

Минификация CSS-кода. Используется [csswring](https://github.com/hail2u/node-csswring).

Поддерживает карты кода (sourcemap).

--------------------------------------

## Пример использования технологии

```js
var CSSTech = require('enb-css/techs/css'),
    FileProvideTech = require('enb/techs/file-provider'),
    bemTechs = require('enb-bem-techs');

module.exports = function(config) {
    config.node('bundle', function(node) {
        // Получаем имена файлов (FileList)
        node.addTechs([
            [FileProvideTech, { target: '?.bemdecl.js' }],
            [bemTechs.levels, { levels: ['blocks'] }],
            [bemTechs.deps],
            [bemTechs.files]
        ]);

        // Создаем CSS-файлы
        node.addTech([CSSTech, { /* опции */ }]);
        node.addTarget('?.css');
    });
};
```

Лицензия
--------

© 2015 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
