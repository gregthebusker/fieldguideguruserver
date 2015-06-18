var React = require('react/addons');
var Search = require('./searchpage.jsx');
var Landing = require('./landing.jsx');
var Start = require('./start.jsx');
var MaterialAppBar = require('material-ui/lib/app-bar');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');
var SearchIcon = require('./searchicon.jsx');
var EnvironmentStore = require('./environmentstore.jsx');

var GUIDES_BASE = '/guides'

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

    window.onpopstate = function(event) {
      this.forceUpdate();
    }.bind(this);

    EnvironmentStore.register(function(payload) {
      if (payload.action == 'new_location') {
        var obj = payload.data;
        history.pushState({}, '', this.createGuideUrl(obj));
        this.setState({
          location: payload.data
        });
      }
    }.bind(this));
  },

  createGuideUrl: function(obj) {
    return GUIDES_BASE + '/' + obj.id;
  },

  render: function() {
    var path = window.location.pathname;
    
    if (path.indexOf(GUIDES_BASE) == 0) {
      return (
        <div>
          <AppBar />
          <Search />
        </div>
      );
    } else if (path.indexOf('/start') == 0) {
      return <Start />;
    } else {
      return <Landing />;
    }
  }
});

module.exports = Core;
