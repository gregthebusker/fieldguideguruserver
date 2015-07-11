"use strict";
var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Core = require('./core.js');


(function () {
  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  Core.run();
})();
