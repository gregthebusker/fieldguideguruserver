"use strict";
var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var BookPreview = require('./bookpreview.js');
var Select = require('react-select');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

mixpanel.track('Book');

var Book = React.createClass({
  componentWillMount() {
    var Book = Parse.Object.extend('fieldguide');
    var query = new Parse.Query(Book);
    query.equalTo('objectId', this.props.params.bookId);
    query.find({
      success: function(results) {
        var book;
        if (results.length) {
          book = results[0];
        }
        this.setState({
          book: book,
        });
      }.bind(this)
    });
  },

  getInitialState() {
    return {
      book: null,
      counties: [],
      selectedOptions: [],
    };
  },

  getCountries(input, callback) {
    var Country = Parse.Object.extend('country');
    var query = new Parse.Query(Country);
    query.contains('searchable_text', input);
    query.find({
      success: (results) => {
        var options = results.map(r => {
          return {
            value: r.id,
            label: r.get('COUNTRY_NAME'),
          };
        });

        callback(null, {
          options: options,
        });
      }
    });
  },

  onCountryChange(newValue, options) {
    this.setState({
      counties: options.map(x => x.value),
      selectedOptions: options,
    });
  },

  render: function() {
    if (!this.state.book) {
      return <div/>;
    }

    var book = this.state.book;
    return (
      <div>
        <Paper className="book-content" zDepth={1}>
          <div className="book-info-section">
            <div className="book-image-section">
              <img className="book-image" src={book.get('thumbnail').url()} />
            </div>
            <div className="book-details-section">
              <div className="book-title">
                {book.get('title')}
              </div>

              <div>
                <h3>Countries</h3>
                <Select
                  className="country-select"
                  delimiter=","
                  multi={true}
                  value={this.state.counties.join(',')}
                  onChange={this.onCountryChange}
                  options={this.state.selectedOptions}
                  asyncOptions={this.getCountries} 
                />
              </div>
            </div>
          </div>
          <div className="book-other-content">
            <p className="book-description">
              {book.get('description')}
            </p>
            <BookPreview
              isbn={book.get('ISBN')}
              height={500}
            />
          </div>
        </Paper>
      </div>
    );
  },
});

module.exports = Book;
