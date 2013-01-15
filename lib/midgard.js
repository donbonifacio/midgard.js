(function midgard() {

  var http = require('http');
  var path = require('path');
  var midgard = exports;
  midgard.encoding = 'utf8';

  midgard.engine = require('./engine.js').init(midgard);
  midgard.routes = require('./routes.js').init(midgard);
  midgard.template = require('./template.js').init(midgard);
  midgard.language = require('./language.js').init(midgard);
  midgard.validator = require('./validator.js');
  midgard.logger = require("./logger.js")
  midgard.path = path.join(__dirname, "..");
  midgard.appPath = process.cwd();
  midgard.env = process.env.NODE_ENV || 'development';
  midgard.isProduction = midgard.env === 'production'
  midgard.isDevelopment = !midgard.isProduction;

  GLOBAL.midgard = midgard;

  exports.start = function startMidgard(port) {
    midgard.server = http.createServer(midgard.handleRequest);
    midgard.logger.midgard.success('Server listening on port ' + port );
    midgard.server.listen(port);
  };

  exports.handleRequest = function handleRequest(request, response) {
    request.setEncoding(midgard.encoding);
    midgard.ensureRequestEnded(request, function() {
      var handler = midgard.routes.getHandler(request, response);
      if(handler) {
        handler(request, response);
      }
    });
  };

  exports.ensureRequestEnded = function ensureRequestEnded(request, callback) {
    var queryData = "";
    if(request.method == 'POST') {
      request.on('data', function(data) {
        queryData += data;
        if(queryData.length > 1e6) {
          queryData = "";
          response.writeHead(413, {'Content-Type': 'text/plain'});
          request.connection.destroy();
        }
      });

      request.on('end', function() {
        request.body = queryData;
        callback();
      });

    } else {
      callback();
    }
  };

  exports.route = function route(endpoint, handlerId, options) {
    midgard.routes.register(endpoint, handlerId, options);
  };

  midgard.routes.addDefault();

})();
