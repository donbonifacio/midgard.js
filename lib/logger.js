
(function() {

  var clc = require('cli-color');

  var error = clc.red.bold;
  var success = clc.green;
  var getRequest = clc.yellowBright('GET');
  var pipelineInfo = clc.magentaBright('PIPELINE');
  var midgardPrefix = clc.cyan('Midgard');
  var bricksPrefix = 'Bricks';

  exports.midgard = {};
  exports.midgard.info = function(text) {
    console.log(midgardPrefix + text);
  }

  exports.midgard.success = function(text) {
    console.log(midgardPrefix + ' ' + success('OK') + ' ' + text);
  }

  exports.midgard.request = function(context) {
    console.log(midgardPrefix + ' ' + getRequest + ' ' + context.controllerName + '.' + context.actionName );
  }

  exports.midgard.pipelineInfo = function(step, context, info) {
    var message =  midgardPrefix + ' ' + pipelineInfo + ' ' + clc.magentaBright(step);
    var handler = '';
    var controllerAction = '';

    if( info && info.handler ) {
      handler += info.handler.name;
    }
    if( info.controllerName ) {
      controllerAction += ' ' + info.controllerName + '#' + info.actionName;
    }
    //console.log(message + ' ' + handler + ' ' + controllerAction);
    context.pipelineLog.push({
      step: step,
      handler:handler,
      controllerAction: controllerAction
    });
  }

  exports.midgard.bricksError = function(message) {
    console.log(bricksPrefix + ' ' + error("ERROR") + ' ' + message);
  }

  exports.listenToBricks = function(appServer) {
    appServer.addEventHandler('run.fatal', exports.midgard.bricksError);
    appServer.addEventHandler('route.fatal', exports.midgard.bricksError);
  }

  exports.object = function(obj) {
    if(obj === null ) {
      console.log("null");
    } else if( obj === undefined ) {
      console.log("undefined");
    } else {
      console.log(JSON.stringify(obj));
    }
  }

})();	
