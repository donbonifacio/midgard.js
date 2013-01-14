(function midgard() {

  var http = require('http');
  var path = require('path');
  var midgard = exports;
  midgard.encoding = 'utf8';

  midgard.engine = require('./engine.js').init(midgard);
  midgard.routes = require('./routes.js').init(midgard);
  midgard.template = require('./template.js').init(midgard);
  midgard.language = require('./language.js').init(midgard);
  midgard.logger = require("./logger.js")
  midgard.path = path.join(__dirname, "..");
  midgard.appPath = process.cwd();
  midgard.env = process.env.NODE_ENV || 'development';
  midgard.isProduction = midgard.env === 'production'
  midgard.isDevelopment = !midgard.isProduction;

  exports.start = function startMidgard(port) {
    midgard.server = http.createServer(midgard.handleRequest);
    midgard.logger.midgard.success('Server listening on port ' + port );
    midgard.server.listen(port);
  };

  exports.handleRequest = function handleRequest(request, response) {
    var handler = midgard.routes.getHandler(request, response);
    if(handler) {
      handler(request, response);
    }
  };

  exports.route = function route(endpoint, handlerId, options) {
    midgard.routes.register(endpoint, handlerId, options);
  };

  midgard.routes.addDefault();

})();
