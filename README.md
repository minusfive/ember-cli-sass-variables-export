
# ember-cli-sass-variables-export

[![Ember Observer Score](https://emberobserver.com/badges/ember-cli-sass-variables-export.svg)](https://emberobserver.com/addons/ember-cli-sass-variables-export) [![npm version](https://badge.fury.io/js/ember-cli-sass-variables-export.svg)](https://badge.fury.io/js/ember-cli-sass-variables-export)

Export Sass variables as JSON data to auto-generated Ember utils, so they can be consumed from the rest of your app. The idea is to help you step closer to an SSOT for style-related data/documentation (e.g. I'm using it to generate styling components for documentation with [Ember Freestyle](http://ember-freestyle.com/)).

## Installation
`ember i ember-cli-sass-variables-export`

## Usage

### 1. Use The `export` Sass Function

This addon makes an `export` Sass function available to your app (or addon), with the following signature:

```scss
$export: export('util-name' /* string */, $variables /* $your-variables */);
```

The **first argument** for the `export` function is a `string`, used as the name for the utility file your variables will be exported to (as JSON).

For the **second argument** you can pass the [one or more] `$variables` you wish to export. Most [Sass Data Types](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#data_types) are supported for the `$variables` argument, including **lists**, [nested] **maps**, **colors**, etc.. Nnode-sass' native functions are used to parse the values.

*IMPORTANT:* Make sure all your map keys are quoted. This is just good practice (becoming standardized convention), and will save you a ton of headaches.

### 2. Import Generated Util

You should now be able to import your variables from your components, controllers, etc.

```js
import mySassVars from 'ember-cli-sass-variables-export/utils/my-sass-vars';
```

### 3. Profit!

## Examples
```scss
// app/styles/settings/colors.scss
$color-palette: (
  'primary': (
    'base': $color-brand--primary,
    'light': mix($color-white, $color-brand--primary, 33%),
    'dark': mix($color-black, $color-brand--primary, 33%),
    'accent': $color-brand--primary--accent,
    'trans': transparentize($ivb-color-brand--primary, 0.50)
  ),
  'secondary': (
    'base': $color-brand--secondary,
    'light': mix($color-white, $color-brand--secondary, 33%),
    'dark': mix($color-black, $color-brand--secondary, 33%),
    'accent': $color-brand--secondary--accent
  )
);

$export: export('color-palette', $color-palette);
```

```js
// output: /app/utils/color-palette.js
exports default = {
  "primary": {
    "base": "rgb(161, 148, 213)",
    "light": "rgb(191, 182, 226)",
    "dark": "rgb(113, 104, 148)",
    "accent": "rgb(161, 148, 213)",
    "trans": "rgba(161, 148, 213, 0.50)"
  },
  "secondary": {
    "base": "rgb(242, 135, 97)",
    "light": "rgb(245, 174, 148)",
    "dark": "rgb(168, 96, 70)",
    "accent": "rgb(242, 135, 97)"
  }
};
```

```js
// app/components/my-component.js
import Component from '@ember/component';
import colorPalette from 'ember-cli-sass-variables-export/utils/color-palette';

export default Component.extend({
  colorPalette
});
```

```hbs
{{! app/templates/components/my-component.js }}
{{#each-in colorPalette as |color shade|}}
  {{#each-in shade as |shadeKey shadeColor|}}
    <div style="background-color: {{shadeColor}}">
      {{color}}--{{shade}}
    </div>
  {{/each-in}}
{{/each-in}}
```

## Bugs

Please report any bugs [through issues](https://github.com/minusfive/ember-cli-sass-variables-export/issues).

## Credits

Forked from https://github.com/mikemunsie/ember-export-sass-variables (no longer maintained).

#### Original Project Credits:

- https://github.com/Punk-UnDeaD/node-sass-export
- https://github.com/davidpett/ember-cli-sass-variables
