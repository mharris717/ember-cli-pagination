/* eslint-env node */
'use strict';
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-cli-pagination',
  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    dep.assertAbove('1.13.0');
  }
};
