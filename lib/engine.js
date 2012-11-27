(function() {
	
	var _ = require('underscore');
	var fs = require('fs');

	exports.resolve = function(controllerName, actionName) {
		var engine = this;
		var controller = require(this.getControllerPath(controllerName));
		return function(request, response) {
			var context = {
				actionName: actionName,
				controllerName: controllerName,
				request: request,
				response: response
			}
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
	
})();
