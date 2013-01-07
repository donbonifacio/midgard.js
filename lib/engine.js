(function engine() {

  var _ = require('underscore');
  var fs = require('fs');
  var logger = require('./logger.js');
  var contextFactory = require('./context.js');
  var engine = exports;

  exports.init = function init(midgard) {
    exports.midgard = midgard;
    return exports;
  };

  exports.idToControllerAction = function idToControllerAction(id) {
    var parts = id.split('#');
    return { controllerName : parts[0], actionName: parts[1] };
  };

  exports.resolve = function(handlerId) {
    var info = engine.idToControllerAction(handlerId);
    return function(request, response) {
      var context = contextFactory.createFrom({
        actionName: info.actionName,
        controllerName: info.controllerName,
        handlerId: handlerId,
        engine : engine,
        request: request,
        response: response
      });
      engine.addDefaultHandlers(context);
      engine.setLayout(context);
      logger.midgard.request(context);
      engine.process(context, handlerId);
      engine.runProcess(context);
      engine.processRender(context);
    };
  };

  exports.setLayout = function setLayout(context) {
    var controller = engine.getController(context.controllerName);
    if( controller.layout ) {
      context.include(controller.layout);
    }
  };

  exports.addDefaultHandlers = function addDefaultHandlers(context) {
    context.renderQueue.push({
      handler: engine.endRender
    });
  };

  exports.runProcess = function(context) {
    while( info = context.processQueue.shift() ) {
      logger.midgard.pipelineInfo('process', context, info);
      var controller = engine.getController(info.controllerName);
      engine.doAction(_.extend(context, info), controller, info.actionName);
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

  exports.process = function process(context, id) {
    var info = engine.idToControllerAction(id);
    context.processQueue.push({
      controllerName : info.controllerName,
      actionName : info.actionName
    });
  }

  exports.getControllerPath = function(controllerName) {
    return "../app/controllers/" + controllerName + "Controller.js";
  }

  exports.getViewPath = function(controllerName, actionName) {
    return "app/views/" + controllerName + "/" + actionName + ".ejs";
  }

  exports.render = function(context) {
    context.renderQueue.unshift({
      controllerName : context.controllerName,
      actionName : context.actionName,
      handler: engine.doRender
    });
  }

  exports.processRender = function(context) {
    var info = context.renderQueue.shift();
    if( info ) {
      logger.midgard.pipelineInfo('render', context, info);
      info.handler(_.extend(context, {
          controllerName: info.controllerName,
          actionName: info.actionName
        }), 
        engine.processRender
      );
    }
  }

  exports.endRender = function endRender(context, next) {
      context.response.write(context.responseData);
      context.response.end();
  };

  exports.doRender = function doRender(context, next) {
    var templateName = context.engine.getViewPath(context.controllerName, context.actionName);
    fs.readFile(templateName, 'utf8', function (err, data) {
      if (err) throw err;
      var compiled = _.template(data);
      var data = compiled({ context : context });
      var handlerId = context.controllerName + '#' + context.actionName;
      context.partialData[handlerId] = data;
      if( handlerId === context.handlerId ) {
        context.body = data;
      }
      context.responseData = data;
      next(context);
    });
  }

  logger.midgard.success('Engine loaded');

})();
