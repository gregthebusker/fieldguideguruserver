var React = require('react');

var BookPreview = React.createClass({
  componentDidMount() {
    var div = React.findDOMNode(this.refs.preview);
    if (div) {
      var options = {
        showLinkChrome: false,
      };
      var viewer = new google.books.DefaultViewer(div, options);
      viewer.load(
        `ISBN:${this.props.isbn}`,
        this.onNoPreview,
        this.onPreview
      );
    }
  },

  onPreview() {
    //Do something
  },

  onNoPreview() {
    this.setState({
      notFound: true,
    });
  },

  getInitialState() {
    return {
      notFound: false,
    };
  },

  render() {
    if (this.state.notFound) {
      return <div>No Preview</div>;
    }

    var style = {
      width: '100%',
      height: this.props.height,
    };

    return (
      <div id="something" ref="preview" style={style}/>
    );
  },
});

module.exports = BookPreview;
