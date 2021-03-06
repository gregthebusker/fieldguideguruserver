var React = require('react');
var CircularProgress = require('material-ui').CircularProgress;
var InfiniteScroll = require('react-infinite-scroll')(React);


var ParseList = React.createClass({
  fetchData() {
    console.log('Searching for', this.props.query);
    var skip = this.state.results.length;
    var limit = skip == 0 ? 20 : 100;
    this.props.query.skip(skip);
    this.props.query.limit(limit);
    this.props.query.find({
      success: this.receiveData,
      error: function(e) {
        console.log(e);
      }
    });
  },

  receiveData(results) {
    console.log('Search Results', results);
    this.setState({
      results: this.state.results.concat(results),
      hasMore: results.length != 0
    });
  },

  getInitialState() {
    return {
      results: [],
      hasMore: true
    };
  },

  render() {
    var items = this.state.results;
    var papers = [];
    if (items && items.length) {
      papers = items.map(this.props.renderFunction);
    }

    if (!this.state.hasMore) {
      papers.push(this.props.addMoreFunction());
    }

    var loader = (
      <div className="search-result-loader">
        <CircularProgress mode="indeterminate" />
      </div>
    );

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.fetchData}
        hasMore={this.state.hasMore}
        loader={loader}
      >
        <div className="parse-list">
          {papers}
        </div>
      </InfiniteScroll>
    );
  }
});

module.exports = ParseList;
