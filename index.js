'use strict';
const exportSass = require('./lib/exportSass');
const path = require('path');

module.exports = {
  name: 'ember-cli-sass-variables-export',

  included(/* app */) {
    this._super.included.apply(this, arguments);
    let app;

    // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just
    // use that.
    if (typeof this._findHost === 'function') {
      app = this._findHost();
    } else {
      // Otherwise, we'll use this implementation borrowed from the _findHost()
      // method in ember-cli.
      let current = this;
      do {
        app = current.app || app;
      } while (current.parent && current.parent.parent && (current = current.parent));
    }

    if (!app.options.sassOptions) {
      app.options.sassOptions = {};
    }

    if (!app.options.sassOptions.functions) {
      app.options.sassOptions.functions = {};
    }

    Object.assign(app.options.sassOptions.functions, exportSass(path.join(__dirname, 'addon', 'utils')));
  }
};
