var React = require('react');
var RaisedButton = require('material-ui/lib/raised-button');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');

var Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  componentWillMount: function() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500
    });
  },

  render: function() {

    var containerStyle = {
      textAlign: 'center',
      paddingTop: '200px'
    };

    return (
      <div style={containerStyle}>
        <h1>Field Guide Guru</h1>
        <h2>Explore field guides</h2>
      </div>
    );
  }
});

module.exports = Main;
