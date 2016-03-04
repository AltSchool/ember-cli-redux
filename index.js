/* jshint node: true */
'use strict';

var path = require('path');
var fs = require('fs');

module.exports = {
  name: 'ember-cli-redux',

  // Turn on file watching for livereload support when this addon is npm linked.
  isDevelopingAddon: function() {
    try {
      fs.readlinkSync('node_modules/ember-cli-redux');
      console.log("Ember-cli-redux npm link detected.");
    } catch (e) {
      return false;
    }
    return true;
  }
};
