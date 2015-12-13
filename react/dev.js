require('babel-polyfill');
var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');

var FieldGuide = require('FieldGuide');
var LocationEntities = require('LocationEntities').Entities;
var LocationSelector = require('LocationSelector');

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var DevPage = React.createClass({
  getInitialState() {
    return {
      fieldguide: null,
    };
  },

  fetchBook() {
    FieldGuide.fetch('bXfOVrSxG9', (fg) => {
      console.log(fg);
      this.setState({
        fieldguide: fg,
      });
    });
  },

  renderSelectors() {
    if (!this.state.fieldguide) {
      return;
    }

    return (
      <div>
        <LocationSelector
          fieldguide={this.state.fieldguide}
          location={LocationEntities.State}
          autoSave={false}
        />
        <LocationSelector
          fieldguide={this.state.fieldguide}
          location={LocationEntities.Collection}
          autoSave={false}
        />
      </div>
    );
  },

  render() {
    return (
      <div>
        Dev Page
        <br/>
        <button onClick={this.fetchBook}>Get FieldGuide for bXfOVrSxG9</button>
        <br/>
        {this.renderSelectors()}
      </div>
    );
  },
});


var run = () => {
  ReactDOM.render(<DevPage />, document.getElementById('react-body'));
};

module.exports = {
  run: run,
};
