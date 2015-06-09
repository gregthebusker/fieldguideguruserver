var React = require('react/addons');
var Search = require('./searchpage.jsx');
var Landing = require('./landing.jsx');

var Core = React.createClass({
  render: function() {
    var path = window.location.pathname;
    
    if (path.indexOf('/guides') == 0) {
      return <Search />;
    } else {
      return <Landing />;
    }
  }
});

module.exports = Core;
