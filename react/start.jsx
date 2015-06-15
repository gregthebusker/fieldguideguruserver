var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var Typeahead = require('react-typeahead-component');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var MainIcon = require('./mainicon.jsx');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);


mixpanel.track('Start Page');

var optionsCache = {};
var LIMIT = 5;


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
        {this.props.data.get('SUBNATIONAL1_NAME')}
      </div>
    );
  },

  renderHeader: function(data) {
    return (
      <div>
        "Header"
      </div>
    );
  }
});

var searchCountry = function(str) {
  return search(str, 'country', [
    'LOCAL_ABBREVIATION',
    'COUNTRY_NAME',
    'COUNTRY_NAME_LONG'
  ]);
}

var search = function(str, className, matches) {
  var Obj = Parse.Object.extend(className);
  var queries = matches.map(function(col) {
    var q = new Parse.Query(Obj);
    q.matches(col + '_lowercase', str);
    return q;
  });

  var query = Parse.Query.or.apply(Parse.Query.or, queries);
  query.limit(LIMIT);
  return query;
}

var searchState = function(str) {
  return search(str, 'state', [
    'LOCAL_ABBREVIATION',
    'SUBNATIONAL1_NAME'
  ]);
}

var searchCounty = function(str) {
  return search(str, 'county', [
    'SUBNATIONAL2_NAME'
  ]);
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

    /*
    var query = new Parse.Query.or(
      searchCountry(value),
      searchState(value),
      searchCounty(value)
    );
    */
    var query = searchState(value);

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
            onChange={this.onTextChange}
            inputValue={this.state.value}
            options={this.state.options}
            optionTemplate={Template}
          />
        </div>
      </div>
    );
  }
});

module.exports = Start;
