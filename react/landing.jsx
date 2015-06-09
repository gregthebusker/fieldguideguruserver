var React = require('react');
var Colors = require('material-ui/lib/styles/colors');

mixpanel.track('Landing Page');

var Main = React.createClass({
  render: function() {
    var containerStyle = {
      textAlign: 'center',
      paddingTop: '200px',
      color: Colors.darkWhite
    };

    return (
      <div style={{
        width: '100%',
        bottom: '0',
        top: '0',
        position: 'absolute',
        backgroundColor: Colors.green500
      }}>
        <div style={containerStyle}>
          <h1>Field Guide Guru</h1>
          <h2>Coming Soon...</h2>
        </div>
      </div>
    );
  }
});

module.exports = Main;
