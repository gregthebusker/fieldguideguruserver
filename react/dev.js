"use strict";
require("babel/polyfill");
var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var DevPage = React.createClass({
  render() {
    return (
      <div>
        Dev Page
      </div>
    );
  },
});


var run = () => {
  React.render(<DevPage />, document.body);
};

module.exports = {
  run: run,
};
