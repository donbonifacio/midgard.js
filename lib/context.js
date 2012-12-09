(function() {

  var _ = require('underscore');
  var logger = require('../lib/logger');
  var package = require('../package.json');

  exports.createFrom = function(defaults) {
    var urlData = require('url').parse(defaults.request.url, true);
    return _.extend(defaults, {
      // utils
      _ : _,
      logger : logger,
      package : package,
      rawUrl : defaults.request.url,
      params : urlData.query,
      data : {},
      partialData : {},

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

      partial : function(id) {
        return this.partialData[id];
      },

      process : function(controllerName, actionName) {
        this.engine.process(this, controllerName, actionName);
      }

    });
  }

})();
