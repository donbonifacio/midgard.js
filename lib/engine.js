(function engine() {

  var _ = require('underscore');
  var path = require('path');
  var fs = require('fs');
  var logger = require('./logger.js');
  var contextFactory = require('./context.js');
  var engine = exports;

  exports.init = function init(midgard) {
    engine.midgard = midgard;
    return engine;
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
        template: engine.midgard.template,
        language: engine.midgard.language,
        midgard: engine.midgard,
        request: request,
        response: response
      });
      engine.addDefaults(context);
      logger.midgard.request(context);
      engine.runProcess(context);
    };
  };

  exports.setLayout = function setLayout(context, next) {
    engine.getController(context.controllerName, function(controller) {
      if( controller.layout ) {
        context.include(controller.layout);
      }
      next(context);
    });
  };

  exports.addDefaults = function addDefaults(context) {
    context.processQueue.push({
      handler: engine.setLayout
    });
    context.processQueue.push({
      handler: function setMainController(context, next) {
        engine.process(context, context.handlerId);
        next(context);
      }
    });
    context.renderQueue.push({
      handler: engine.endRender
    });
    context.requestLanguage = context.language.getLanguageFromRequest(context.request);
  };

  exports.runProcess = function runProcess(context, next) {
    var info = context.processQueue.shift();
    if(info) {
      logger.midgard.pipelineInfo('process', context, info);
      if(info.handler) {
        info.handler(context, engine.runProcess);
      } else {
        engine.getController(info.controllerName, function processController(controller) {
          engine.doAction(_.extend(context, info), controller, info.actionName);
          engine.runProcess(context, engine.runProcess);
        });
      }
    } else {
      engine.processRender(context);
    }
  }

  exports.doAction = function doAction(context, controller, actionName) {
    var action = controller[actionName];
    if( action ) {
      action(context);
    } 
  }

  exports.getController = function(controllerName, next) {
    var controllerPath = "app/controllers/" + controllerName + "Controller.js";
    var fullPath = path.join(engine.midgard.appPath, controllerPath);
    fs.exists(fullPath, function(exists) {
      if(exists) {
        next(require(fullPath));
      } else {
        var fullPath2 = path.join(engine.midgard.path, controllerPath);
        fs.exists(fullPath2, function(exists) {
          if(exists) {
            next(require(fullPath2));
          } else {
            // fail with the first attempt
            next(fullPath);
          }
        });
      }
    });
  }

  exports.process = function process(context, id) {
    var info = engine.idToControllerAction(id);
    context.processQueue.push({
      controllerName : info.controllerName,
      actionName : info.actionName
    });
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
      info.handler(_.extend(context, info), engine.processRender);
    }
  }

  exports.endRender = function endRender(context, next) {
      context.response.write(context.responseData);
      context.response.end();
  };

  exports.doRender = function doRender(context, next) {
    context.template.render(context, next);
  }

  logger.midgard.success('Engine loaded');

})();
