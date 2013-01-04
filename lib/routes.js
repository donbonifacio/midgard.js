(function routes() {

  exports.init = function init(midgard) {
    this.midgard = midgard;
    return this;
  };

  exports.register = function register(endpoint, handlerId) {
    this.midgard.appServer.addRoute(endpoint, this.midgard.engine.resolveHandlerId(handlerId));
  };

  exports.addDefault = function addDefault() {
    require('./../config/routes.js').init(this.midgard);
  };

})();	