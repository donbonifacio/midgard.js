(function() {

	var engine = require('../lib/engine.js');

	exports.init = function(server) {
		server.addRoute("/static/.+", server.plugins.filehandler, { basedir: "./static" });
		
		server.addRoute("/home", engine.resolve("home", "index"));

		server.addRoute(".+", server.plugins.fourohfour);
	
	}

})();	
