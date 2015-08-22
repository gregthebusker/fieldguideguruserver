var React = require('react');
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
    this.timer = window.setInterval(this.playVideo, 20 * 1000);
    mixpanel.track('Start Page');
  },

  componentWillUnmount() {
    window.clearInterval(this.timer);
  },

  playVideo() {
    React.findDOMNode(this.refs.video).play();
  },

  render: function() {
    return (
      <div className="start-page">
        <div className="start-hero">
          <video
            ref="video"
            className="start-hero-video">
            <source src="/images/forest.mp4" />
          </video>
          <div className="start-hero-overlay">
            <h3 style={{
              textAlign: 'center',
            }}>
              <MainIcon />
              Where do you need a field guide to?
            </h3>
            <LocationTypeahead
              autoFocus={true}
              onSelect={this.onSelectLocation}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Start;
