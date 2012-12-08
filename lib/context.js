(function() {

  var _ = require('underscore');
  var logger = require('../lib/logger');

  exports.createFrom = function(defaults) {
    return _.extend(defaults, {
      _ : _,
      logger : logger
    });
  }

})();
