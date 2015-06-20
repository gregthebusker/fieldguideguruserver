"use strict";
var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var Typeahead = require('./typeahead/typeahead.js');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var MainIcon = require('./mainicon.jsx');
var EnvironmentStore = require('./environmentstore.jsx');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Start Page');

var optionsCache = {};
var HEADERS = {
  country: 'Countries',
  state: 'States'
};


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
      <div>
        {this.renderHeader()}
        <div style={style}>
          {this.props.data.name}
       </div>
      </div>
    );
  },

  renderHeader: function() {
    var data = this.props.data;
    if (data.index == 0) {
      return (
        <div style={{
          borderBottom: '1px solid black',
          color: 'black'
        }}>
          {HEADERS[data.className]}
        </div>
      );
    }
  }
});

var Start = React.createClass({
  onTextChange(event) {
    var value = event.target.value.toLowerCase();
    this.setState({
      value: event.target.value
    });

    if (optionsCache[value]) {
      return;
    }

    Parse.Cloud.run('autoCompleteLocation', {
      text: value
    }, {
      success: (results) => {
        this.cacheOptions(value, results);
        this.forceUpdate();
      }.bind(this),
      error: (error) => {
        console.log(error);
      }
    });
  },

  getOptions() {
    var value = this.state.value.toLowerCase();
    return optionsCache[value];
  },

  cacheOptions(value, options) {
    optionsCache[value.toLowerCase()] = options;
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  onSelectLocation: function(index) {
    var options = this.getOptions();
    if (!options) {
      return;
    }

    var loc = options[index];
    if (!loc) {
      return;
    }
    EnvironmentStore.setLocation(loc.obj);
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
            onChange={this.onTextChange}
            inputValue={this.state.value}
            options={this.getOptions()}
            optionTemplate={Template}
            onOptionSelected={this.onSelectLocation}
          />
        </div>
      </div>
    );
  }
});

module.exports = Start;
