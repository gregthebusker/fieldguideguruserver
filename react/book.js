var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var BookPreview = require('./bookpreview.js');
var Select = require('react-select');
var LocationEntities = require('./LocationEntities.js');
var FieldGuide = require('FieldGuide');
var LocationSelector = require('LocationSelector');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var Locations = [];
for (var key in LocationEntities.Entities) {
  Locations.push(LocationEntities.Entities[key]);
}


var Book = React.createClass({
  componentWillMount() {
    mixpanel.track('Book');
    FieldGuide.fetch(this.props.params.bookId, (fg) => {
      this.setState({
        book: fg,
      });
    });
  },

  getInitialState() {
    var state = {
      book: null,
    };

    return state;
  },

  renderLocationEntities() {
    return Locations.map(entity => {
      return (
        <LocationSelector
          fieldguide={this.state.book}
          location={entity}
          autoSave={true}
          key={entity.key}
        />
      );
    });
  },

  render: function() {
    if (!this.state.book) {
      return <div/>;
    }

    var book = this.state.book;
    var image; 
    if (book.get('thumbnail')) {
      image = <img className="book-image" src={book.get('thumbnail').url()} />;
    }
    return (
      <div>
        <Paper className="book-content" zDepth={1}>
          <div className="book-info-section">
            <div className="book-image-section">
              {image}
            </div>
            <div className="book-details-section">
              <div className="book-title">
                {book.get('title')}
              </div>
              {this.renderLocationEntities()}
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
