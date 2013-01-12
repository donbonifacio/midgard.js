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
      dataQueue : [],
      renderQueue : [],

      // shortcuts
      
      render : function(viewPath) {
        this.engine.render(this, viewPath);
      },

      translate: function(token) {
        return this.language.translate(this.requestLanguage, token);
      },

      partial : function(id) {
        return this.partialData[id];
      },

      dataHandler : function(handler) {
        this.engine.dataHandler(this, handler);
      },

      include : function(handlerId) {
        this.engine.process(this, handlerId);
      }

    });
  }

})();
