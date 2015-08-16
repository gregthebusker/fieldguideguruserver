var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var Typeahead = require('typeahead');
var Parse = require('parse').Parse;
var parseKeys = require('parsekeys');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

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

var LocationTypeahead = React.createClass({
  getDefaultProps() {
    return {
      onSelect: () => {
      },
    };
  },

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
      searchFocused: false,
      location: null,
    };
  },

  getSelection() {
    return this.state.location;
  },

  clearSelection() {
    this.setState(this.getInitialState());
  },

  onSelectLocation: function(loc) {
    if (!loc) {
      return;
    }
    var obj = loc.obj;
    this.setState({
      location: obj,
      value: obj.get('location').get('label'),
    });
    this.props.onSelect(obj);
  },

  onSearchFocus() {
    this.setState({
      searchFocused: true
    });
  },

  onSearchBlur() {
    // Let click land first before blur
    window.setTimeout(() => {
      this.setState({
        searchFocused: false
      });
    }, 100);
  },

  render: function() {
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
      <div className={searchClasses.join(' ')}>
        <Typeahead
          placeholder="Location"
          autoFocus={this.props.autoFocus}
          onChange={this.onTextChange}
          inputValue={this.state.value}
          options={this.getOptions()}
          optionTemplate={Template}
          onOptionSelected={this.onSelectLocation}
          onFocus={this.onSearchFocus}
          onBlur={this.onSearchBlur}
        />
      </div>
    );
  }
});

module.exports = LocationTypeahead;
