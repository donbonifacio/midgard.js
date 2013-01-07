(function template() {

  var fs = require('fs');
  var template = exports;
  var _ = require('underscore');
  var path = require('path');

  exports.init = function init(midgard) {
    template.midgard = midgard;
    return template;
  };

  exports.render = function render(context, next) {
    template.getViewPath(context, template.doRenderForTemplate, next);
  };

  exports.getViewPath = function getViewPath(context, renderFunc, next) {
    var fileName = context.controllerName + "/" + context.actionName + ".ejs";
    var completeFileName = path.join("./app/views/", fileName);
    fs.exists(completeFileName, function(exists) {
      if(exists) {
        renderFunc(context, completeFileName, next);
      } else {
        renderFunc( context, path.join(context.midgard.path, 'app/views/', fileName), next );
      }
    });
  };

  exports.doRenderForTemplate = function doRenderForTemplate(context, templateName, next) {
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
  };

})();
