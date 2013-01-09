(function routes() {

  var routes = exports;
  var _ = require('underscore');

  exports.init = function init(midgard) {
    routes.midgard = midgard;
    return routes;
  };

  exports.register = function register(endpoint, handlerId) {
    routes.midgard.appServer.addRoute(endpoint, routes.midgard.engine.resolve(handlerId));
  };

  exports.staticAccess = function staticAccess(paths) {
    _.each(paths, function registerStaticPath(path) {
      routes.midgard.appServer.addRoute(path, routes.midgard.appServer.plugins.filehandler, { section: "main" });
    });
  };

  exports.addDefault = function addDefault() {
    require('./../config/routes.js').init(routes.midgard);
  };

})();	
