(function() {

  var _ = require('underscore');
  var logger = require('../lib/logger');
  var package = require('../package.json');

  exports.createFrom = function(defaults) {
    return _.extend(defaults, {
      // utils
      _ : _,
      logger : logger,
      package : package,
      data : {},

      // queues
      processQueue : [],
      prepareQueue : [],
      renderQueue : [],

      // shortcuts
      
      render : function() {
        this.engine.render(this);
      },

      renderPartial : function() {
        this.engine.renderPartial(this);
      },

      process : function(controllerName, actionName) {
        this.engine.process(this, controllerName, actionName);
      }

    });
  }

})();
