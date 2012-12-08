(function() {

  var _ = require('underscore');
  var fs = require('fs');
  var logger = require('../lib/logger.js');
  var contextFactory = require('../lib/context.js');

  exports.resolve = function(controllerName, actionName) {
    var engine = this;
    var controllerPath = this.getControllerPath(controllerName);
    var controller = require(controllerPath);
    return function(request, response) {
      var context = contextFactory.createFrom({
        actionName: actionName,
        controllerName: controllerName,
        controller : controller,
        controllerPath : controllerPath,
        engine : engine,
        request: request,
        response: response
      });
      logger.midgard.request(context);
      var action = controller[actionName];
      if( action ) {
        action(context);
      }
      engine.render(context);
    };
  }

  exports.getControllerPath = function(controllerName) {
    return "../app/controllers/" + controllerName + "Controller.js";
  }

  exports.getViewPath = function(context) {
    return "app/views/" + context.controllerName + "/" + context.actionName + ".ejs";
  }

  exports.render = function(context) {
    var templateName = this.getViewPath(context);
    fs.readFile(templateName, 'utf8', function (err, data) {
      if (err) throw err;
      var compiled = _.template(data);
      context.response.write(compiled(context));
      context.response.end();
    });
  }

  logger.midgard.success('Engine loaded');

})();
