"use strict";
var React = require('react');
var Paper = require('material-ui/lib/paper');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var DropDownMenu = require('material-ui/lib/drop-down-menu');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var ParseList = require('./parselist.jsx');
var Router = require('react-router');
var Navigation = Router.Navigation;

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Search Results');

var Tile = React.createClass({
  mixins: [Navigation],

  getInitialState() {
    return {
      hover: false
    };
  },
  onClick() {
    this.transitionTo('book-id', {
      bookId: this.props.item.id
    });
  },

  onMouseOver() {
    this.setState({
      hover: true
    });
  },

  onMouseOut() {
    this.setState({
      hover: false
    });
  },

  render() {
    var item = this.props.item;
    var thumb = item.get('thumbnail');
    var image;
    if (thumb) {
      var style = {
        backgroundImage: 'url(' + thumb.url() + ')'
      };
      image = <div className="search-result-image" style={style} />;
    }

    return (
      <Paper
        zDepth={this.state.hover ? 3 : 1}
        className="search-result-card"
        key={item.get('ISBN')}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}>
          <div className="search-result-image-container">
            {image}
            <div className="search-result-overlay" />
          </div>
          <div
            className="search-result-content"
            title={item.get('title')}>
            {item.get('title')}
          </div>
      </Paper>
    );
  }
});

var ResultList = React.createClass({
  mixins: [Navigation],
    
  render: function() {
    return (
      <div>
        <h1 className="search-result-heading">{this.props.title}</h1>
        <ParseList
          query={this.props.query}
          renderFunction={(item) => {
            return <Tile item={item} />;
          }}
        />
      </div>
    );
  }
});

var FilterBar = React.createClass({
  render: function() {
    var filterOptions = this.props.categories.map(function(v) {
      return {
        text: v.get('text'),
        id: v
      };
    });

    filterOptions.splice(0, 0, {
      text: 'All'
    });

    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <DropDownMenu
            menuItems={filterOptions}
            onChange={this.props.onFilterChange}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }
});

var Search = React.createClass({
  componentWillMount: function() {
    var Subject = Parse.Object.extend('subject');
    var query = new Parse.Query(Subject);
    query.ascending('text');
    query.find({
      success: function(results) {
        this.setState({
          subjects: results
        });
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      filter: undefined,
      subjects: []
    };
  },
 
  onFilterChange: function(e, selectedIndex, menuItem) {
    this.setState({
      filter: menuItem.id
    });
  },

  render: function() {
    var FieldGuide = Parse.Object.extend('fieldguide');
    var query = new Parse.Query(FieldGuide);

    if (this.state.filter) {
      query.equalTo('category_subject', this.state.filter);
    }

    var filterBar;
    if (this.state.subjects.length) {
      filterBar = (
        <FilterBar
          categories={this.state.subjects}
          onFilterChange={this.onFilterChange}
        />
      );
    }

    return (
      <div>
        {filterBar}
        <ResultList
          title="Books"
          query={query}
        />
      </div>
    );
  }
});

module.exports = Search;
