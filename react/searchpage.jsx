var React = require('react');
var Paper = require('material-ui/lib/paper');
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

var Search = React.createClass({
  render: function() {
    var FieldGuide = Parse.Object.extend('fieldguide');
    var query = new Parse.Query(FieldGuide);

    return (
      <ResultList
        title="Books"
        query={query}
      />
    );
  }
});

module.exports = Search;
