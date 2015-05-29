(function () {
  var React = require('react/addons');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  var Landing = require('./landing.jsx'); // Our custom react component

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  React.render(<Landing />, document.body);

})();
