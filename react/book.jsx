"use strict";
var React = require('react');

mixpanel.track('Book');

var Book = React.createClass({
  render: function() {
    return (
      <div>
        Book Page
      </div>
    );
  }
});

module.exports = Book;
