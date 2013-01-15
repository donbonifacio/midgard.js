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

  exports.resolve = function(handlerId, options) {
    var info = engine.idToControllerAction(handlerId);
    return function(request, response) {
      var context = contextFactory.createFrom({
        actionName: info.actionName,
        controllerName: info.controllerName,
        handlerId: handlerId,
        engine : engine,
        template: engine.midgard.template,
        language: engine.midgard.language,
        validator: engine.midgard.validator,
        midgard: engine.midgard,
        encoding: engine.midgard.encoding,
        request: request,
        response: response
      });
      if(options) {
        _.extend(context, options);
      }
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
    if(!context.requestLanguage) {
      context.requestLanguage = context.language.getLanguageFromRequest(context.request);
    }
  };

  exports.redirectTo = function redirectTo(context, url) {
    context.httpStatusCode = 303;
    context.httpHeaders['Location'] = url;
    if(context.request.method !== "HEAD" ) {
      context.responseData = "<a href='"+url+"'>Redirecting...</a>";
    }
    engine.endRender(context);

  };

  exports.runProcess = function runProcess(context, next) {
    var info = context.processQueue.shift();
    if(info) {
      logger.midgard.pipelineInfo('process', context, info);
      if(info.handler) {
        info.handler(context, engine.runProcess);
      } else {
        engine.getController(info.controllerName, function processController(controller) {
          var setupFunc = engine.getSetupForController(controller, context, info);
          setupFunc(context, function() {
            engine.doAction(_.extend(context, info), controller, info.actionName);
            engine.runProcess(context, engine.runProcess);
          });
        });
      }
    } else {
      engine.runData(context);
    }
  };

  exports.getSetupForController = function getSetupForController(controller, context, info) {
    if(controller.setup) {
      logger.midgard.pipelineInfo('setup', context, info);
      return controller.setup;
    } else {
      return engine.advance;
    }
  };

  exports.advance = function advance(context, next) {
    next(context)
  };

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
            next(require(fullPath));
          }
        });
      }
    });
  };

  exports.dataHandler = function dataHandler(context, handler) {
    context.dataQueue.push({
      handler: handler,
      controlerName: context.controllerName,
      actionName: context.ActionName
    });
  };

  exports.runData = function runData(context, next) {
    var info = context.dataQueue.shift();
    if(info) {
      logger.midgard.pipelineInfo('data', context, info);
      if(info.handler) {
        info.handler(context, engine.runData);
      }
    } else {
      engine.processRender(context);
    }
  };

  exports.process = function process(context, id) {
    var info = engine.idToControllerAction(id);
    context.processQueue.push({
      controllerName : info.controllerName,
      actionName : info.actionName
    });
  };

  exports.render = function(context, viewName) {
    context.renderQueue.unshift({
      controllerName : context.controllerName,
      actionName : context.actionName,
      viewName: viewName,
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
      context.response.writeHead(context.httpStatusCode, context.httpHeaders);
      context.response.write(context.responseData, context.encoding);
      context.response.end();
  };

  exports.doRender = function doRender(context, next) {
    context.template.render(context, next);
  }

  logger.midgard.success('Engine loaded');

})();
