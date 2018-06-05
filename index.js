'use strict';
const exportSass = require('./lib/exportSass');
const path = require('path');

module.exports = {
  name: 'ember-export-sass-variables',

  config(env, baseConfig) {
    return {
      sassOptions: {
        functions: exportSass(path.join(__dirname, 'addon', 'utils'))
      }
    }
  }
};
