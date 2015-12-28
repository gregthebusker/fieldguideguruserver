var React = require('react');
var ReactDOM = require('react-dom');
var Search = require('./searchpage.js');
var Book = require('./book.js');
var Landing = require('./landing.js');
var Start = require('./start.js');
var { LeftNav, MenuItem, AppBar} = require('material-ui');
var SearchIcon = require('./searchicon.js');
var EnvironmentStore = require('./environmentstore.js');
var { Router, Route, History } = require('react-router');
var Collections = require('collectionspage');
var AddEntityPage = require('AddEntityPage');
var Footer = require('./Footer.js');
var { createHistory } = require('history');

var BaseAppBar = React.createClass({
  mixins: [History],

  openNav() {
    this.refs.leftNav.toggle();
  },

  routeTo(route) {
    this.refs.leftNav.close();
    this.history.push({ pathname: route});
  },

  render: function() {
    return (
      <div>
        <AppBar
          title='Field Guide Guru'
          iconElementRight={<SearchIcon />}
          onLeftIconButtonTouchTap={this.openNav}
        />
        <LeftNav
          ref='leftNav'
          docked={false}
          onChange={this.onLeftNavChange}>
            <MenuItem onClick={this.routeTo.bind(this, 'start')}>
                Search
            </MenuItem>
        </LeftNav>
      </div>
    );
  }
});


var App = React.createClass({
  render: function() {
    return (
      <div>
        <BaseAppBar />
        {this.props.children}
        <Footer />
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
      <Route name='search' path='search/:locationId' component={Search} />
      <Route name='book-id' path='book/:bookId' component={Book} />
      <Route name='collections' path='collections' component={Collections} />
      <Route name='start' path='start' component={Start} />
      <Route name='add' path='add' component={AddEntityPage} />
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
