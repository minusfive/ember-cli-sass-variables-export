'use strict';
const exportSass = require('./lib/exportSass');
const path = require('path');

module.exports = {
  name: 'ember-cli-sass-variables-export',

  config(env, baseConfig) {
    return {
      sassOptions: {
        functions: exportSass(path.join(__dirname, 'addon', 'utils'))
      }
    };
  }
};
