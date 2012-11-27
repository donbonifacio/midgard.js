var bricks = require('bricks');
var appServer = new bricks.appserver();

require("../config/routes.js").init(appServer);

var server = appServer.createServer();

server.listen(3000);
