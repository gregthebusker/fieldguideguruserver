"use strict";
var React = require('react');
var Search = require('./searchpage.js');
var Book = require('./book.js');
var Landing = require('./landing.js');
var Start = require('./start.js');
var MaterialAppBar = require('material-ui').AppBar;
var LeftNav = require('material-ui').LeftNav;
var Colors = require('material-ui/lib/styles/colors');
var SearchIcon = require('./searchicon.js');
var EnvironmentStore = require('./environmentstore.js');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Navigation = Router.Navigation;
var LocationEntities = require('./LocationEntities.js');
var Collections = require('collectionspage');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

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
  mixins: [Navigation],

  openNav() {
    this.refs.leftNav.toggle();
  },

  onLeftNavChange(e, index, payload) {
    this.refs.leftNav.close();
    this.transitionTo(payload.route);
  },

  render: function() {
    var menuItems = [
      {
        route: 'start',
        text: 'Search',
      },
    ];
    return (
      <div>
        <MaterialAppBar
          title="Field Guide Guru"
          iconElementRight={<SearchIcon />}
          onLeftIconButtonTouchTap={this.openNav}
        />
        <LeftNav
          ref="leftNav"
          docked={false}
          menuItems={menuItems}
          onChange={this.onLeftNavChange}
        />
      </div>
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
  
        this.transitionTo('search', {
          locationId: obj.get('location').id
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
    <Route handler={App}>
      <DefaultRoute handler={Landing}/>
      <Route name="search" path="search/:locationId" handler={Search} />
      <Route name="book-id" path="book/:bookId" handler={Book} />
      <Route name="collections" path="collections" handler={Collections} />
      <Route name="start" path="start" handler={Start} />
    </Route>
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
