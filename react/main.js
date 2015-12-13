require('babel-polyfill');
var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
var Core = require('./core.js');

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();



var run = () => {
  Core.run();
};

module.exports = {
  run: run,
};
