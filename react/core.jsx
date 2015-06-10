var React = require('react/addons');
var Search = require('./searchpage.jsx');
var Landing = require('./landing.jsx');
var MaterialAppBar = require('material-ui/lib/app-bar');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');
var SearchIcon = require('./searchicon.jsx');

var AppBar = React.createClass({
  render: function() {
    return (
      <MaterialAppBar
        title="Field Guide Guru"
        iconElementRight={<SearchIcon />}
      />
    );
  }
});

var Core = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function() {
    ThemeManager.setPalette({
      primary1Color: Colors.green500
    });
  },

  render: function() {
    var path = window.location.pathname;
    
    if (path.indexOf('/guides') == 0) {
      return (
        <div>
          <AppBar />
          <Search />
        </div>
      );
    } else {
      return <Landing />;
    }
  }
});

module.exports = Core;
