/*jshint node:true*/
module.exports = {
  description: 'ember-cli-sass-variables-export',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonToProject('ember-cli-sass');
  }
};
