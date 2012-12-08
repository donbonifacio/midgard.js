(function() {

  exports.info = function(context) {
    context.process('midgard', 'trace');
    context.render();
  }

  exports.trace = function(context) {
    context.process('midgard', 'traceRequest');
    context.renderPartial();
  }

  exports.traceRequest = function(context) {
    context.renderPartial();
  }

})();
