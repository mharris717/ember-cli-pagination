/* jshint node: true */
'use strict';
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-cli-pagination',
  init: function() {
    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    dep.assertAbove('1.13.0');
  }
};
