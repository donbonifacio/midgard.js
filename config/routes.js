(function() {

  var engine = require('../lib/engine.js');

  exports.init = function(server) {
    server.addRoute("/static/.+", server.plugins.filehandler, { basedir: "./static" });

    server.addRoute("/midgard.info", engine.resolve("midgard", "info"));

    server.addRoute(".+", server.plugins.fourohfour);

  }

})();	
