var React = require('react');
var Paper = require('material-ui/lib/paper');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var CircularProgress = require('material-ui/lib/circular-progress');
var InfiniteScroll = require('react-infinite-scroll')(React);

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Search Results');

function fetchFieldGuides(cb, skip) {
  var skip = skip || 0;
  var FieldGuide = Parse.Object.extend('fieldguide');
  var query = new Parse.Query(FieldGuide);
  query.skip(skip);
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
    if (items && items.length) {
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
    }

    if (!this.props.hasMore) {
      papers.push(<h3>No More Results</h3>);
    }

    var loader = (
      <div className="search-result-loader">
        <CircularProgress mode="indeterminate" />
      </div>
    );

    var scroll = (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.props.onLoadMore}
        hasMore={this.props.hasMore}
        loader={loader}
      >
        {papers}
      </InfiniteScroll>
    );

    return (
      <div>
        <h1 className="search-result-heading">{this.props.title}</h1>
        {scroll}
      </div>
    );
  }
});

var Search = React.createClass({
  componentWillMount: function() {
    this.fetchData();
  },

  fetchData: function(page) {
    var skip = 0;
    if (this.state.results) {
      skip = this.state.results.length;
    }

    fetchFieldGuides(function(results) {
      this.setState({
        results: this.state.results.concat(results),
        hasMore: results.length != 0
      });
    }.bind(this), skip);
  },

  getInitialState: function() {
    return {
      results: [],
      hasMore: true
    };
  },

  render: function() {
    return (
      <ResultList
        title="Books"
        items={this.state.results}
        hasMore={this.state.hasMore}
        onLoadMore={this.fetchData}
      />
    );
  }
});

module.exports = Search;
