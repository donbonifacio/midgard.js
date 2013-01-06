(function routes() {

  exports.init = function init(midgard) {
    exports.midgard = midgard;
    return exports;
  };

  exports.register = function register(endpoint, handlerId) {
    this.midgard.appServer.addRoute(endpoint, this.midgard.engine.resolve(handlerId));
  };

  exports.addDefault = function addDefault() {
    require('./../config/routes.js').init(this.midgard);
  };

})();	
