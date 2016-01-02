var RSVP = require('rsvp');

module.exports = {
  description: 'Install ember-cli-redux dependencies into your app.',

  // Allow `ember generate ember-cli-redux` to run without error
  normalizeEntityName: function() {},

  // Install redux and tools to the host app
  afterInstall: function() {
    return RSVP.all([
      this.addPackageToProject("redux", "^3.0.4"),
      this.addPackageToProject("redux-thunk", "^1.0.0"),
      this.addPackageToProject("redux-logger", "^2.3.1"),
      this.addPackageToProject("browserify", "12.0.1"),
      this.addPackageToProject("ember-browserify", "^1.1.4")
    ]);
  }
};
