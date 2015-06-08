var React = require('react');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');
var Paper = require('material-ui/lib/paper');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Search Results');

function fetchFieldGuides(cb) {
  var FieldGuide = Parse.Object.extend('fieldguide');
  var query = new Parse.Query(FieldGuide);
  query.find({
    success: cb,
    error: function(error) {
      console.log(error);
    }
  });
}

var ResultList = React.createClass({
  render: function() {
    var items = this.props.items;
    var papers;
    if (items) {
      papers = items.map(function(item) {
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
      });
    } else {
      papers = <h3>No Results</h3>;
    }

    return (
      <div>
        <h2>{this.props.title}</h2>
        {papers}
      </div>
    );
  }
});

var Search = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function() {
    fetchFieldGuides(function(results) {
      this.setState({
        results: results
      });
    }.bind(this));
  },

  getInitialState: function() {
    return {
      results: undefined
    };
  },

  render: function() {
    return (
      <ResultList
        title="Books"
        items={this.state.results}
      />
    );
  }
});

module.exports = Search;
