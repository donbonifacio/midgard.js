(function() {

  var _ = require('underscore');
  var logger = require('./logger.js');
  var package = require('./../package.json');

  exports.createFrom = function(defaults) {
    var urlData = require('url').parse(defaults.request.url, true);
    return _.extend(defaults, {
      // utils
      _ : _,
      logger : logger,
      package : package,
      rawUrl : defaults.request.url,
      params : urlData.query,
      pipelineLog: [],
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

      partial : function(id) {
        return this.partialData[id];
      },

      include : function(handlerId) {
        this.engine.process(this, handlerId);
      }

    });
  }

})();
