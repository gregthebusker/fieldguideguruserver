require('babel/polyfill');
var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');

var FieldGuide = require('FieldGuide');

//Needed for React Developer Tools
window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var DevPage = React.createClass({
  fetchBook() {
    FieldGuide.fetch('bXfOVrSxG9', (fg) => {
      console.log(fg);
    });
  },

  render() {
    return (
      <div>
        Dev Page
        <br/>
        <button onClick={this.fetchBook}>Get FieldGuide for bXfOVrSxG9</button>
      </div>
    );
  },
});


var run = () => {
  React.render(<DevPage />, document.body);
};

module.exports = {
  run: run,
};
