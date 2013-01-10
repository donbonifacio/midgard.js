(function midgard() {

  var bricks = require('bricks');
  var path = require('path');
  var midgard = exports;
  midgard.appServer = new bricks.appserver();

  midgard.engine = require('./engine.js').init(midgard);
  midgard.routes = require('./routes.js').init(midgard);
  midgard.template = require('./template.js').init(midgard);
  midgard.language = require('./language.js').init(midgard);
  midgard.logger = require("./logger.js")
  midgard.logger.listenToBricks(midgard.appServer);
  midgard.path = path.join(__dirname, "..");
  midgard.appPath = process.cwd();
  midgard.env = process.env.NODE_ENV || 'development';
  midgard.isProduction = midgard.env === 'production'
  midgard.isDevelopment = !midgard.isProduction;

  exports.start = function startMidgard(port) {
    midgard.server = midgard.appServer.createServer();
    midgard.logger.midgard.success('Server listening on port ' + port );
    midgard.server.listen(port);
  };

  exports.route = function route(endpoint, handlerId, options) {
    midgard.routes.register(endpoint, handlerId, options);
  };

  midgard.routes.addDefault();

})();
