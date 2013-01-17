var events = require('events');
var util = require('util');

var Eventer = function() {
  events.EventEmitter.call(this);
};

util.inherits(Eventer, events.EventEmitter);
exports.Eventer = Eventer;
