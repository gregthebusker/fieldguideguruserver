var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

var EnvironmentStore = function() {
};

EnvironmentStore.prototype = new Dispatcher();
EnvironmentStore.prototype.setLocation = function(obj) {
  this.dispatch({
    action: 'new_location',
    data: obj
  });
};

module.exports = new EnvironmentStore();
