(function() {

  var _ = require('underscore');
  var logger = require('./logger.js');
  var package = require('./../package.json');

  exports.createFrom = function(defaults) {
    var urlData = require('url').parse(defaults.request.url, true);
    if(midgard.routes.context) {
      _.extend(defaults, midgard.routes.context);
    }
    return _.extend(defaults, {
      // utils
      _ : _,
      logger : logger,
      package : package,
      rawUrl : defaults.request.url,
      pathname: urlData.pathname,
      params : urlData.query,
      pipelineLog: [],
      data : {},
      partialData : {},
      httpStatusCode: 200,
      httpHeaders: {
        'Content-Type': 'text/html; charset=utf-8'
      },

      // queues
      processQueue : [],
      dataQueue : [],
      renderQueue : [],

      // shortcuts
      
      render : function(viewPath) {
        this.engine.render(this, viewPath);
      },

      redirectTo: function(url) {
        this.engine.redirectTo(this, url);
      },

      translate: function(token, defaultText) {
        return this.language.translate(this.requestLanguage, token, defaultText);
      },

      partial : function(id) {
        return this.partialData[id];
      },

      dataHandler : function(handler) {
        this.engine.dataHandler(this, handler);
      },

      include : function(handlerId) {
        this.engine.process(this, handlerId);
      },

      parseJSONBody: function parseJSONBody() {
        try {
          return JSON.parse(this.request.body);
        } catch(e) {
          return null;
        }
      }

    });
  }

})();
