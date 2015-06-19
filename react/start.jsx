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
var LIMIT = 5;
var HEADERS = {
  country: 'Countries',
  state: 'States',
  county: 'Counties'
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

var searchCountry = function(str) {
  return search(str, 'country');
}

var search = function(str, className, matches) {
  var Obj = Parse.Object.extend(className);
  var query = new Parse.Query(Obj);
  query.contains('searchable_text', str);
  query.limit(LIMIT);
  return query.find();
}

var searchState = function(str) {
  return search(str, 'state');
}

var searchCounty = function(str) {
  return search(str, 'county');
}

var Start = React.createClass({
  onTextChange(event) {
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

    var p = Parse.Promise.when(
      searchCountry(value),
      searchState(value),
      searchCounty(value)
    );

    p.then(function(results1, results2, results3) {

      var getMapFunction = function(name) {
        return function(v, i) {
          return {
            index: i,
            obj: v,
            className: v.className,
            name: v.get(name)
          };
        };
      };

      var a = results1.map(getMapFunction('COUNTRY_NAME_LONG'));
      var b = results2.map(getMapFunction('SUBNATIONAL1_NAME'));
      var c = results3.map(getMapFunction('SUBNATIONAL2_NAME'));
      var results = a.concat(b, c)
      optionsCache[value] = results;
      if (this.state.value == value) {
        this.setState({
          options: results
        });;
      }
    }.bind(this));
  },

  getInitialState: function() {
    return {
      value: '',
      options: []
    };
  },

  onSelectLocation: function(index) {
    var loc = this.state.options[index];
    if (!loc) {
      return;
    }
    var obj = loc.obj;
    EnvironmentStore.setLocation(obj);
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
            options={this.state.options}
            optionTemplate={Template}
            onOptionSelected={this.onSelectLocation}
          />
        </div>
      </div>
    );
  }
});

module.exports = Start;
