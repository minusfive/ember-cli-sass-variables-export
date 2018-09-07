'use strict';
const exportSass = require('./lib/exportSass');
const path = require('path');
const VersionChecker = require('ember-cli-version-checker');

function getDefaultSass() {
  try {
    // eslint-disable-next-line node/no-extraneous-require, node/no-missing-require node/no-unpublished-require
    return require('sass');
  } catch (e) {
    let error = new Error(
      'Could not find the default SASS implementation. Run the default blueprint:\n' +
      '   ember g ember-cli-sass\n' +
      'Or install an implementation such as "node-sass" and add an implementation option. For example:\n' +
      '   sassOptions: {implementation: require("node-sass")}');
    error.type = 'Sass Plugin Error';

    throw error;
  }
}

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

    let checker = new VersionChecker(this);
    let sass = checker.for('ember-cli-sass');

    let implementation = app.options.sassOptions.implementation;

    if (sass.lt('8.0.0')) {
      // these ember-cli-sass versions used node-sass by default
      // so we force its usage
      // eslint-disable-next-line node/no-extraneous-require, node/no-missing-require
      implementation = require('node-sass');
    } else {
      // on ember-cli-sass version8 and above
      // we mimic the way ember-cli-sass tries to find the default sass implementation
      // only runs when no implementation was passed in
      implementation = implementation || getDefaultSass();
    }

    Object.assign(app.options.sassOptions.functions, exportSass(path.join(__dirname, 'addon', 'utils'), implementation));
  }
};
