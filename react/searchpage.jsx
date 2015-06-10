var React = require('react');
var Paper = require('material-ui/lib/paper');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var DropDownMenu = require('material-ui/lib/drop-down-menu');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var ParseList = require('./parselist.jsx');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Search Results');

var ResultList = React.createClass({
  render: function() {
    var renderFunction = function(item) {
      var thumb = item.get('thumbnail');
      var image;
      if (thumb) {
        var style = {
          backgroundImage: 'url(' + thumb.url() + ')'
        };
        image = <div className="search-result-image" style={style} />;
      }
      return (
        <Paper className="search-result-card" key={item.get('ISBN')}>
          <div className="search-result-content">
            {image}
            {item.get('title')}
          </div>
        </Paper>
      );
    };

    return (
      <div>
        <h1 className="search-result-heading">{this.props.title}</h1>
        <ParseList
          query={this.props.query}
          renderFunction={renderFunction}
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
