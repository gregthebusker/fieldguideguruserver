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
      value: '',
      searchFocused: false
    };
  },

  onSelectLocation: function(loc) {
    if (!loc) {
      return;
    }
    EnvironmentStore.setLocation(loc.obj);
  },

  componentDidMount() {
    document.body.style.backgroundColor = Colors.green500;
  },

  componentWillUnmount() {
    document.body.style.backgroundColor = '#fff';
  },


  onSearchFocus() {
    this.setState({
      searchFocused: true
    });
  },

  onSearchBlur() {
    this.setState({
      searchFocused: false
    });
  },

  render: function() {
    var containerStyle = {
      paddingTop: '100px',
      color: Colors.darkWhite
    };

    var options = this.getOptions();

    var searchClasses = [
      'search-box-container'
    ];

    if (this.state.searchFocused) {
      searchClasses.push('focused');
    }
    if (this.state.value) {
      searchClasses.push('hasValue');
    }

    return (
      <div style={{
        width: '100%',
        height: '100%',
      }}>
        <div style={containerStyle}>
          <h1 style={{
            textAlign: 'center',
          }}>
            <MainIcon />
            Field Guide Guru
          </h1>
          <div className={searchClasses.join(' ')}>
            <Typeahead
              placeholder="Location"
              autoFocus={true}
              onChange={this.onTextChange}
              inputValue={this.state.value}
              options={this.getOptions()}
              optionTemplate={Template}
              onOptionSelected={this.onSelectLocation}
              onFocus={this.onSearchFocus}
              onBlur={this.onSearchBlur}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Start;
