var React = require('react');
var ReactDOM = require('react-dom');
var Search = require('./searchpage.js');
var Book = require('./book.js');
var Landing = require('./landing.js');
var Start = require('./start.js');
var MaterialAppBar = require('material-ui').AppBar;
var LeftNav = require('material-ui').LeftNav;
var SearchIcon = require('./searchicon.js');
var EnvironmentStore = require('./environmentstore.js');
var { Router, Route, IndexRoute, History } = require('react-router');
var Collections = require('collectionspage');
var AddEntityPage = require('AddEntityPage');
var Footer = require('./Footer.js');
var { createHistory } = require('history');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <AppBar />
        {this.props.children}
        <Footer />
      </div>
    );
  }
});

var AppBar = React.createClass({
  mixins: [History],

  openNav() {
    this.refs.leftNav.toggle();
  },

  onLeftNavChange(e, index, payload) {
    this.refs.leftNav.close();
    this.history.push({ pathname: payload.route});
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
          title='Field Guide Guru'
          iconElementRight={<SearchIcon />}
          onLeftIconButtonTouchTap={this.openNav}
        />
        <LeftNav
          ref='leftNav'
          docked={false}
          menuItems={menuItems}
          onChange={this.onLeftNavChange}
        />
      </div>
    );
  }
});

var Core = React.createClass({
  mixins: [History],

  componentWillMount: function() {
    EnvironmentStore.register(function(payload) {
      if (payload.action == 'new_location') {
        var obj = payload.data;

        this.history.push({
            pathname: `search/${obj.get('location').id}`,
        });
      }
    }.bind(this));
  },

  render: function() {
    return this.props.children;
  }
});

var routes = (
  <Route component={Core}>
    <Route component={App}>
      <Route name='start' path='start' component={Start} />
    </Route>
    <Route path="*" component={Landing} />
  </Route>
);

function run() {
    var history = createHistory();

    ReactDOM.render(
        <Router history={history}>
            {routes}
        </Router>
    , document.getElementById('react-body'));
}

module.exports = {
  run: run
};
