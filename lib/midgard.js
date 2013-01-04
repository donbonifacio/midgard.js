(function midgard() {

  var bricks = require('bricks');
  var midgard = exports;
  midgard.appServer = new bricks.appserver();

  midgard.engine = require('./engine.js').init(midgard);
  midgard.routes = require('./routes.js').init(midgard);
  midgard.logger = require("./logger.js")
  midgard.logger.listenToBricks(midgard.appServer);

  exports.start = function startMidgard(port) {
    midgard.server = midgard.appServer.createServer();
    midgard.server.listen(port);
  };

  exports.route = function route(endpoint, handlerId) {
    midgard.routes.register(endpoint, handlerId);
  };

  midgard.routes.addDefault();

})();
