
(function() {

	var clc = require('cli-color');

  var error = clc.red.bold;
  var success = clc.green;
  var midgardPrefix = clc.cyan('Midgard');

  exports.midgard = {};
	exports.midgard.info = function(text) {
    console.log(midgardPrefix + text);
  }

	exports.midgard.success = function(text) {
    console.log(midgardPrefix + ' ' + success('OK') + ' ' + text);
  }

})();	
