"use strict";
var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var BookPreview = require('./bookpreview.js');
var Select = require('react-select');
var LocationEntities = require('./LocationEntities.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var LocationRelation = Parse.Object.extend('location_relations');

mixpanel.track('Book');

var Book = React.createClass({
  componentWillMount() {
    var Book = Parse.Object.extend('fieldguide');
    var query = new Parse.Query(Book);
    query.equalTo('objectId', this.props.params.bookId);
    query.find().then(results => {
      var book;
      if (results.length) {
        book = results[0];
      }
      this.setState({
        book: book,
      });

      var query = new Parse.Query(LocationRelation);
      query.equalTo('content', book);
      query.include('location');
      return query.find();
    }.bind(this)).then(results => {
      var state = {};
      results.forEach(obj => {
        var loc = obj.get('location');
        var entity = LocationEntities.getByParse(loc);

        var a = state[entity.key] || [];
        a.push(loc);
        state[entity.key] = a;
      });
      this.setState(state);
    }.bind(this));
  },

  componentWillUpdate(nextProps, nextState) {
    var toSave = [];
    for (var key in LocationEntities.Entities) {
      var entity = LocationEntities.Entities[key];
      nextState[entity.key].map(obj => {
        var lr = new LocationRelation();
        lr.set({
          location: obj,
          content: nextState.book,
        });

        toSave.push(lr);
      });
    }

    //Parse.Object.saveAll(toSave);
  },

  getInitialState() {
    var state = {
      book: null,
    };
    for (var key in LocationEntities.Entities) {
      var entity = LocationEntities.Entities[key];
      state[entity.key] = [];
    }
    return state;
  },

  makeOption(r) {
    var entity = LocationEntities.getByParse(r);
    return {
      value: r.id,
      label: entity.getLabel(r),
      obj: r,
    };
  },

  getEntity(entity, input, callback) {
    var query = new Parse.Query(entity.parse);
    query.contains('searchable_text', input);
    query.find({
      success: (results) => {
        var options = results.map(r => {
          return this.makeOption(r);
        }.bind(this));

        callback(null, {
          options: options,
        });
      }
    });
  },

  onEntityChange(entity, newValue, options) {
    this.setState({
      [entity.key]: options.map(x => x.obj),
    });
  },

  renderLocationEntities() {
    return Object.keys(LocationEntities.Entities).map(key => {
      var entity = LocationEntities.Entities[key];
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
