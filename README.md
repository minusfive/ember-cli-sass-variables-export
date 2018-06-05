
# ember-cli-sass-variables-export

<!-- <img src='http://emberobserver.com/badges/ember-export-sass-variables.svg' > -->

Export your Sass variables and access them through auto-generated Ember utilities.

This addon [should] support most [Sass Data Types](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#data_types), including lists, maps, nested maps, colors, etc., and uses the node-sass native functions to parse values.

## Methods

```scss
export(utilName: String, contents: any)
```

The export method is used in your Sass file to tell the compiler what name the utility file is, and what variables to export inside.

## Usage
First, define a sass export and import the utility that matches the name of the export.

```scss
$export: export('colors' /* <- this will be the util file name */, (
  'colors': $colors,
  'themes': $themes
));
```

```js
import styles from 'ember-cli-sass-variables-export/utils/colors';
```

## Installation
`ember install ember-cli-sass-variables-export`

## Credits

Forked from https://github.com/mikemunsie/ember-export-sass-variables (no longer maintained).

#### Original Project Credits:

- https://github.com/Punk-UnDeaD/node-sass-export
- https://github.com/davidpett/ember-cli-sass-variables
