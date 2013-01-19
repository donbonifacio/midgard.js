(function midgardController() {

  var midgardController = exports;
  exports.layout = "midgard#master";

  exports.master = function master(context) {
    context.render();
  };

  exports.index = function(context) {
    context.redirectTo('/midgard.info');
  };

  exports.info = function(context) {
    context.include('midgard#trace');
    context.render();
  };

  exports.trace = function(context) {
    context.include('midgard#traceEnv');
    context.include('midgard#traceRequest');
    context.include('midgard#traceResponse');
    context.include('midgard#tracePipeline');
    context.render();
  };

  exports.fetchData = function fetchData(context, next) {
    next(context);
  };

  exports.traceEnv = function(context) {
    context.render();
  };

  exports.traceRequest = function(context) {
    context.render();
  };


  exports.traceResponse = function(context) {
    context.render();
  };

  exports.tracePipeline = function(context) {
    context.render();
  };

})();
