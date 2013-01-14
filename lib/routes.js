(function routes() {

  var routes = exports;
  routes.registered = [];
  var _ = require('underscore');

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
    return null;
  };

  exports.register = function register(endpoint, handlerId, options) {
    routes.registered.push({
      endpoint: endpoint,
      handler: routes.midgard.engine.resolve(handlerId, options)
    });
  };

  exports.static = function static(paths) {
    _.each(paths, function registerStaticPath(path) {
      //routes.midgard.appServer.addRoute(path, routes.midgard.appServer.plugins.filehandler, { section: "main" });
    });
  };

  exports.addDefault = function addDefault() {
    require('./../config/routes.js').init(routes.midgard);
  };

})();	
