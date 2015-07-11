"use strict";
var React = require('react');
var Search = require('./searchpage.js');
var Book = require('./book.js');
var Landing = require('./landing.js');
var Start = require('./start.js');
var MaterialAppBar = require('material-ui/lib/app-bar');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');
var SearchIcon = require('./searchicon.js');
var EnvironmentStore = require('./environmentstore.js');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Navigation = Router.Navigation;

var App = React.createClass({
  render: function() {
    return (
      <div>
        <AppBar />
        <RouteHandler />
      </div>
    );
  }
});

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
  mixins: [Navigation],

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

    EnvironmentStore.register(function(payload) {
      if (payload.action == 'new_location') {
        var obj = payload.data;
        this.transitionTo('guides-loc', {
          locationId: obj.id
        });
      }
    }.bind(this));
  },

  render: function() {
    return <RouteHandler />
  }
});

var routes = (
  <Route handler={Core}>
    <DefaultRoute handler={Landing}/>
    <Route name="guides" path="guides" handler={App}>
      <Route name="guides-loc" path=":locationId" handler={Search}/>
    </Route>
    <Route name="book" path="book" handler={App}>
      <Route name="book-id" path=":bookId" handler={Book}/>
    </Route>
    <Route name="start" path="start" handler={Start} />
  </Route>
);

function run() {
  Router.run(routes, Router.HistoryLocation, function(Root) {
      React.render(<Root/>, document.body);
  });
}

module.exports = {
  run: run
};
