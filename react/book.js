"use strict";
var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var BookPreview = require('./bookpreview.js');
var Select = require('react-select');
var LocationEntities = require('./LocationEntities.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var Locations = [];
for (var key in LocationEntities.Entities) {
  Locations.push(LocationEntities.Entities[key]);
}


var Book = React.createClass({
  componentWillMount() {
    mixpanel.track('Book');
    var Book = Parse.Object.extend('fieldguide');
    var query = new Parse.Query(Book);
    query.equalTo('objectId', this.props.params.bookId);
    query.include('locations');
    query.find().then(results => {
      var book;
      if (results.length) {
        book = results[0];
      }
      this.setState({
        book: book,
      });

      var locations = book.get('locations');
      if (!locations) {
        return;
      }

      var state = {};
      locations.forEach(obj => {
        var type = obj.get('type');
        var a = state[type] || [];
        a.push(obj);
        state[type] = a;
      });
      this.setState(state);
    }.bind(this));
  },

  onEntityChange(entity, newValue, options) {
    var current = this.state[entity.key] || [];
    var nextSet = options.map(o => o.obj) || [];

    var toRemove = current.filter(o => {
      return nextSet.indexOf(o) == -1;
    });
    var toAdd = nextSet.filter(o => {
      return current.indexOf(o) == -1;
    });

    toAdd.forEach(obj => {
      this.state.book.add('locations', obj);
    });

    toRemove.forEach(obj => {
      this.state.book.remove('locations', obj);
    });

    this.state.book.save();

    this.setState({
      [entity.key]: nextSet,
    });
  },

  getInitialState() {
    var state = {
      book: null,
    };

    Locations.forEach(entity => {
      state[entity.key] = [];
    });
    return state;
  },

  makeOption(r) {
    return {
      value: r.id,
      label: r.get('label'),
      obj: r,
    };
  },

  getEntity(entity, input, callback) {
    var query = new Parse.Query(entity.parse);
    query.contains('searchable_text', input.toLowerCase());
    query.include('location');
    query.find({
      success: (results) => {
        var selected = this.state[entity.key];
        var options = selected.map(this.makeOption);
        var ids = options.map(o => o.value);
        var moreOptions = results.filter(r => {
          return ids.indexOf(r.get('location').id) == -1;
        });

        options = options.concat(moreOptions.map(r => {
          return this.makeOption(r.get('location'));
        }.bind(this)));

        callback(null, {
          options: options,
        });
      }
    });
  },

  renderLocationEntities() {
    return Locations.map(entity => {
      var values = this.state[entity.key].map(obj => obj.id);
      var options = this.state[entity.key].map(this.makeOption);
      return (
        <div key={entity.key}>
          <h3>{entity.key}</h3>
          <Select
            className="country-select"
            delimiter=","
            multi={true}
            value={values.join(',')}
            onChange={this.onEntityChange.bind(this, entity)}
            options={options}
            asyncOptions={this.getEntity.bind(this, entity)} 
          />
        </div>
      );
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
