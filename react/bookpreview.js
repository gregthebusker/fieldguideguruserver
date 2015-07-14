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
    var div = React.findDOMNode(this.refs.preview);
    var buy = div.querySelector('table td:nth-child(5)');
    if (buy.nextSiblingNode) {
      buy.parentNode.removeChild(buy.nextSiblingNode);
    }
    buy.parentNode.removeChild(buy);
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
      return (
        <div>
          No Preview
        </div>
      );
    }

    var style = {
      width: '100%',
      height: this.props.height,
    };

    return (
      <div className="preview-container">
        <div ref="preview" style={style}/>
      </div>
    );
  },
});

module.exports = BookPreview;
