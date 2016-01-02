/* jshint node: true */
'use strict';

var path = require('path');
var fs = require('fs');

module.exports = {
  name: 'ember-cli-redux',

  isDevelopingAddon: function() {
    return true; // TODO: Remove this
  },

  included: function() {
    console.log("Including ember-cli-redux"); // TODO: Remove this
  }
};
