# postcss-meter [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> Cross-browser meter pseudo-selectors

## Installation

```sh
$ npm install --save postcss-meter
```

## Usage

See postcss/postss for usage information on postcss itself.

```js
const postcss = require("postcss");
const meter = require("postcss-meter");

postcss(meter(options)).process(css);
```

## Options

### `keepOriginal` (default: `false`)

Whether to keep the original selector.

#### Example: `{ keepOriginal: false }` (default)

```css
::meter-bar {
  color: green;
}
```

```css
::-moz-meter-bar {
  color: green;
}

::-webkit-meter-optimum-value,
::-webkit-meter-suboptimum-value,
::-webkit-meter-even-less-good-value {
  color: green;
}
```

#### Example: `{ keepOriginal: true }`

```css
::meter-bar {
  color: green;
}
```

```css
/* this block would be removed if keepOriginal were false */
::meter-bar {
  color: green;
}

::-moz-meter-bar {
  color: green;
}

::-webkit-meter-optimum-value,
::-webkit-meter-suboptimum-value,
::-webkit-meter-even-less-good-value {
  color: green;
}
```

### `vendors` (default: `['moz', 'webkit']`)

For which vendors to "prefix" the pseudo-selectors. Note that only the default
vendors are supported. Edge uses the same selectors as WebKit, so the value `'webkit'` also supports Edge.

#### Example: `{ vendors: ['moz', 'webkit'] }` (default)

```css
::meter-bar {
  color: green;
}
```

```css
/* this block would not be here if moz weren't in vendors */
::-moz-meter-bar {
  color: green;
}

/* this block would not be here if webkit weren't in vendors */
::-webkit-meter-optimum-value,
::-webkit-meter-suboptimum-value,
::-webkit-meter-even-less-good-value {
  color: green;
}
```

#### Example: `{ vendors: ['moz'] }`

```css
::meter-bar {
  color: green;
}
```

```css
::-moz-meter-bar {
  color: green;
}

/* webkit-block isn't here */
```

#### Example: `{ vendors: ['webkit'] }`

```css
::meter-bar {
  color: green;
}
```

```css
/* moz-block isn't here */

::-webkit-meter-optimum-value,
::-webkit-meter-suboptimum-value,
::-webkit-meter-even-less-good-value {
  color: green;
}
```

## License

MIT © [Malte-Maurice Dreyer](https://github.com/Myhlamaeus)

[npm-image]: https://badge.fury.io/js/postcss-meter.svg
[npm-url]: https://npmjs.org/package/postcss-meter
[travis-image]: https://travis-ci.org/Myhlamaeus/postcss-meter.svg?branch=master
[travis-url]: https://travis-ci.org/Myhlamaeus/postcss-meter
[daviddm-image]: https://david-dm.org/Myhlamaeus/postcss-meter.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Myhlamaeus/postcss-meter
[coveralls-image]: https://coveralls.io/repos/Myhlamaeus/postcss-meter/badge.svg
[coveralls-url]: https://coveralls.io/r/Myhlamaeus/postcss-meter
