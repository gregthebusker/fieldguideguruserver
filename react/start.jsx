var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var Typeahead = require('react-typeahead-component');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var MainIcon = require('./mainicon.jsx');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);


mixpanel.track('Start Page');

var optionsCache = {};


var Template = React.createClass({
  render: function() {
    var style = {
      color: 'black'
    };
    if (this.props.isSelected) {
      style.backgroundColor = 'blue';
      style.color = 'white';
    }
    return (
      <div style={style}>
        {this.props.data.get('COUNTRY_NAME_LONG')}
      </div>
    );
  }
});

var Start = React.createClass({
  getOptions(event) {
    var value = event.target.value.toLowerCase();
    this.setState({
      value: event.target.value
    });

    if (optionsCache[value]) {
      this.setState({
        options: optionsCache[value]
      });
      return;
    }

    var Country = Parse.Object.extend('country');
    var cc = new Parse.Query(Country);
    cc.matches('LOCAL_ABBREVIATION_lowercase', value);
    var cn = new Parse.Query(Country);
    cn.matches('COUNTRY_NAME_lowercase', value);
    var cnl = new Parse.Query(Country);
    cnl.matches('COUNTRY_NAME_LONG_lowercase', value);

    var query = new Parse.Query.or(cc, cn, cnl);
    query.limit(5);
    query.find({
      success: function(results) {
        optionsCache[value] = results;
        if (this.state.value == value) {
          this.setState({
            options: results
          });;
        }
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      value: '',
      options: []
    };
  },

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
          <h1>
            <MainIcon />
            Field Guide Guru
          </h1>
          <Typeahead
            placeholder="Location"
            autoFocus={true}
            inputValue={this.state.value}
            options={this.state.options}
            onChange={this.getOptions}
            optionTemplate={Template}
          />
        </div>
      </div>
    );
  }
});

module.exports = Start;
