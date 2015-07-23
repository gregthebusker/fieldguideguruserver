"use strict";
var React = require('react');
var Colors = require('material-ui/lib/styles/colors');
var Typeahead = require('./typeahead/typeahead.js');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var MainIcon = require('./mainicon.js');
var EnvironmentStore = require('./environmentstore.js');
var LocationTypeahead = require('locationTypeahead');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Start Page');

var Start = React.createClass({
  onSelectLocation: function(loc) {
    if (!loc) {
      return;
    }
    loc.increment('clicks');
    loc.save();
    EnvironmentStore.setLocation(loc);
  },

  componentDidMount() {
    document.body.style.backgroundColor = Colors.green500;
  },

  componentWillUnmount() {
    document.body.style.backgroundColor = '#fff';
  },

  render: function() {
    var containerStyle = {
      paddingTop: '100px',
      color: Colors.darkWhite
    };

    return (
      <div className="start-page" style={{
        width: '100%',
        height: '100%',
      }}>
        <div style={containerStyle}>
          <h1 style={{
            textAlign: 'center',
          }}>
            <MainIcon />
            Where to you need a field guide to?
          </h1>
          <LocationTypeahead
            onSelect={this.onSelectLocation}
          />
        </div>
      </div>
    );
  }
});

module.exports = Start;
