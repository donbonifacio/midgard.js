(function routes() {

  var routes = exports;
  routes.registered = [];
  var _ = require('underscore');
  var fs = require('fs');
  var path = require('path');
  var url = require('url');
  var mime = require('mime');

  exports.init = function init(midgard) {
    routes.midgard = midgard;
    return routes;
  };

  exports.getHandler = function getHandler(request, response) {
    var path = request.url;
    var found = _.find(routes.registered, function seachRegisteredRoutes(route) {
      return (typeof(route.endpoint) === 'string') && path.match(route.endpoint) != null;
    });
    if(found && found.length && found.length > 1) {
      return found[0].handler
    }
    if(found) {
      return found.handler;
    }
    return routes.notFound;
  };

  exports.register = function register(endpoint, handlerId, options) {
    routes.registered.push({
      endpoint: endpoint,
      handler: routes.midgard.engine.resolve(handlerId, options)
    });
  };

  exports.static = function static(paths) {
    _.each(paths, function registerStaticPath(path) {
      routes.registered.push({
        endpoint: path,
        handler: routes.staticHandler
      });
    });
  };

  exports.staticHandler = function staticHandler(request, response) {
    var parsed = url.parse(request.url, true);
    var pathname = path.normalize(parsed.pathname);

    var fileName = path.join(routes.midgard.appPath, pathname);
    fs.readFile(fileName, 'binary', function loadFile(err, data) {
      if(err) {
        routes.midgard.logger.midgard.error('FAILED GET', request.url);
        routes.error(request, response, err);
      } else {
        routes.midgard.logger.midgard.success(request.url );
        response.setHeader('Content-Type', mime.lookup(fileName));
        response.write(data);
        response.end();
      }
    });
  };

  exports.error = function error(request, response, error) {
    response.writeHead(200);
    response.write(JSON.stringify(error));
    response.end();
  };

  exports.notFound = function notFound(request, response) {
    routes.midgard.logger.midgard.notFound(request.url);
    response.writeHead(404);
    response.end();
  };

  exports.addDefault = function addDefault() {
    require('./../config/routes.js').init(routes.midgard);
  };

})();
