var React = require('react');
var CircularProgress = require('material-ui').CircularProgress;

var Loader = React.createClass({
  render() {
    return (
      <div className="fgg-center" style={{marginTop: '-5px'}}>
        <CircularProgress mode="indeterminate" />
      </div>
    );
  },
});

module.exports = Loader;
