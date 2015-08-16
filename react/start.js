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
    mixpanel.track('Start Page');
  },

  render: function() {
    return (
      <div className="start-page">
        <div className="start-hero">
          <div>
            <h3 style={{
              textAlign: 'center',
            }}>
              <MainIcon />
              Where do you need a field guide to?
            </h3>
            <LocationTypeahead
              onSelect={this.onSelectLocation}
            />
          </div>
          <video
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            autPplay={true}
            controls={true} >
            <source src="/images/forest.mp4" />
          </video>
        </div>
      </div>
    );
  }
});

module.exports = Start;
