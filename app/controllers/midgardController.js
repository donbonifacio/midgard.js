(function midgardController() {

  exports.layout = "midgard#master";

  exports.master = function master(context) {
    context.render();
  };

  exports.info = function(context) {
    context.include('midgard#trace');
    context.render();
  }

  exports.trace = function(context) {
    context.include('midgard#traceRequest');
    context.render();
  }

  exports.traceRequest = function(context) {
    context.render();
  }

})();
