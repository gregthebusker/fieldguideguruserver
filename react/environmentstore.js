var Dispatcher = require('flux').Dispatcher;

class EnvironmentStore extends Dispatcher {
  setLocation(obj) {
    this.dispatch({
      action: 'new_location',
      data: obj
    });
  }
}

module.exports = new EnvironmentStore();
