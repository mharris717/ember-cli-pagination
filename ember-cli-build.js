/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // app.import({development:'node_modules/route-recognizer/dist/route-recognizer.js'});
  // app.import({development:'node_modules/fake-xml-http-request/fake_xml_http_request.js'});
  // app.import({development:'node_modules/pretender/pretender.js'});

  return app.toTree();
};
