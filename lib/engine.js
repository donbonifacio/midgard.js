(function() {

  var _ = require('underscore');
  var fs = require('fs');
  var logger = require('../lib/logger.js');
  var contextFactory = require('../lib/context.js');
  var engine = exports;

  exports.resolve = function(controllerName, actionName) {
    return function(request, response) {
      var context = contextFactory.createFrom({
        actionName: actionName,
        controllerName: controllerName,
        engine : engine,
        request: request,
        response: response
      });
      logger.midgard.request(context);
      engine.process(context, controllerName, actionName);
      engine.runProcess(context);
      engine.processRender(context);
    };
  }

  exports.runProcess = function(context) {
    while( info = context.processQueue.shift() ) {
      logger.midgard.pipelineInfo('process', info.controllerName, info.actionName);
      var controller = engine.getController(info.controllerName);
      context.controllerName = info.controllerName;
      context.actionName = info.actionName;
      engine.doAction(context, controller, info.actionName);
    }
  }

  exports.doAction = function doAction(context, controller, actionName) {
    var action = controller[actionName];
    if( action ) {
      action(context);
    } 
  }

  exports.getController = function(controllerName) {
    var controllerPath = engine.getControllerPath(controllerName);
    return require(controllerPath);
  }

  exports.process = function(context, controllerName, actionName) {
    context.processQueue.push({
      controllerName : controllerName,
      actionName : actionName
    });
  }

  exports.getControllerPath = function(controllerName) {
    return "../app/controllers/" + controllerName + "Controller.js";
  }

  exports.getViewPath = function(controllerName, actionName) {
    return "app/views/" + controllerName + "/" + actionName + ".ejs";
  }

  exports.render = function(context, isPartial) {
    context.renderQueue.unshift({
      controllerName : context.controllerName,
      actionName : context.actionName,
      partial : isPartial === true
    });
  }

  exports.renderPartial = function(context) {
    engine.render(context, true); 
  }

  exports.processRender = function(context) {
    var info = context.renderQueue.shift();
    if( info ) {
      logger.midgard.pipelineInfo('render', info.controllerName, info.actionName);
      engine.doRender(context, info.controllerName, info.actionName, info.isPartial);
    } else {
      logger.midgard.pipelineInfo('render', 'reponse end', '');
      context.response.end();
    }
  }

  exports.doRender = function(context, controllerName, actionName, isPartial) {
    var templateName = this.getViewPath(controllerName, actionName);
    fs.readFile(templateName, 'utf8', function (err, data) {
      if (err) throw err;
      var compiled = _.template(data);
      var data = compiled({ context : context });
      if( isPartial ) {
        context.partialData[controllerName + '.' + actionName] = data;
        engine.processRender(context);
      } else {
        context.response.write(data);
      }
    });
  }

  logger.midgard.success('Engine loaded');

})();
