"use strict";
var Dispatcher = require('flux').Dispatcher;
var assign = require('object-assign');

class EnvironmentStore extends Dispatcher {
  setLocation(obj) {
    this.dispatch({
      action: 'new_location',
      data: obj
    });
  }
};

module.exports = new EnvironmentStore();
