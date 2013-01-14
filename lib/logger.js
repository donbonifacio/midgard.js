
(function() {

  var clc = require('cli-color');

  var error = clc.red.bold;
  var success = clc.green;
  var getRequest = clc.yellowBright('GET');
  var pipelineInfo = clc.magentaBright('PIPELINE');
  var midgardPrefix = clc.cyan('Midgard');

  exports.midgard = {};
  exports.midgard.info = function(text) {
    console.log(midgardPrefix + text);
  }

  exports.midgard.success = function(text) {
    console.log(midgardPrefix + ' ' + success('OK') + ' ' + text);
  }

  exports.midgard.error = function(section, text) {
    console.log(midgardPrefix + ' ' + error(section) + ' ' + text);
  }

  exports.midgard.request = function(context) {
    console.log(midgardPrefix + ' ' + getRequest + ' ' + context.controllerName + '#' + context.actionName );
  }

  exports.midgard.notFound = function(url) {
    console.log(midgardPrefix + ' ' + error('NOT FOUND') + ' ' + url);
  }

  exports.midgard.loadedLanguage = function loadedLanguage(data, fileName) {
    console.log(midgardPrefix + ' ' + success('OK') + ' Load Language: ' + Object.keys(data).length + ' tokens from ' + fileName );
  };

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

  exports.log = function(text) {
    console.log(text);
  };

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
