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

  exports.findRoute = function findRoute(path) {
    for( var i = 0; i < routes.registered.length; ++i ) {
      var route = routes.registered[i];
      if( (typeof(route.endpoint) === 'string') ) {
        var regexResult = path.match(route.endpoint);
        if( regexResult != null  ) {
          return { handler: route.handler, regexParams: regexResult };
        }
      }
    }
    return null;
  };

  exports.getHandler = function getHandler(request, response) {
    var path = url.parse(request.url, true).pathname;
    var found = routes.findRoute(path);
    if(found) {
      request.regexParams = found.regexParams;
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
    fs.stat(fileName, function(err, stats) {
      fs.readFile(fileName, 'binary', function loadFile(err, data) {
        if(err) {
          routes.midgard.logger.midgard.error('FAILED GET', request.url);
          routes.error(request, response, err);
        } else {
          routes.midgard.logger.midgard.success(request.url );
          response.setHeader('Content-Type', mime.lookup(fileName));
          response.setHeader('Date', stats.mtime.toUTCString());
          response.setHeader('Last-Modified', stats.mtime.toUTCString());
          response.end(data, 'binary');
        }
      });
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
