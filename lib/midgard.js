(function midgard() {

  var bricks = require('bricks');
  var midgard = exports;
  midgard.appServer = new bricks.appserver();

  midgard.engine = require('./engine.js');
  midgard.routes = require('./routes.js').init(midgard);
  midgard.routes.addDefault();
  midgard.logger = require("./logger.js")
  midgard.logger.listenToBricks(midgard.appServer);

  exports.start = function startMidgard(port) {
    midgard.server = midgard.appServer.createServer();
    midgard.server.listen(port);
  };

})();
