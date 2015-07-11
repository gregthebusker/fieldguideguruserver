"use strict";
var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var BookPreview = require('./bookpreview.js');
var Select = require('react-select');
var LocationEntities = require('LocationEntities');
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
        var entity;
        if (loc instanceof LocationEntities.Country.parse) {
          entity = LocationEntities.Country;
        }

        var a = state[entity.key + 'selectedOptions'] || [];
        var b = state[entity.key] || [];
        a.push(this.makeOption(loc, entity));
        b.push(loc.id);
        state[entity.key + 'selectedOptions'] = a;
        state[entity.key] = b;
      });
      this.setState(state);
    }.bind(this));
  },

  componentWillUpdate(nextProps, nextState) {
    var entity = LocationEntities.Country;
    var toSave = nextState[entity.key + 'selectedOptions'].map(option => {
      var lr = new LocationRelation();
      lr.set({
        location: option.obj,
        content: nextState.book,
      });

      return lr;
    });
    //Parse.Object.saveAll(toSave);
  },

  getInitialState() {
    var state = {
      book: null,
    };
    for (var key in LocationEntities) {
      var entity = LocationEntities[key];
      state[entity.key] = [];
      state[entity.key + 'selectedOptions'] = [];
    }
    return state;
  },

  makeOption(r, entity) {
      return {
        value: r.id,
        label: entity.getLabel(r),
        entity: entity,
        obj: r,
      };
  },

  getEntity(entity, input, callback) {
    var query = new Parse.Query(entity.parse);
    query.contains('searchable_text', input);
    query.find({
      success: (results) => {
        var options = results.map(r => {
          return this.makeOption(r, entity);
        }.bind(this));

        callback(null, {
          options: options,
        });
      }
    });
  },

  onEntityChange(entity, newValue, options) {
    this.setState({
      [entity.key]: options.map(x => x.value),
      [entity.key + 'selectedOptions']: options,
    });
  },

  renderLocationEntities() {
    return Object.keys(LocationEntities).map(key => {
      var entity = LocationEntities[key];
      return (
        <div key={entity.key}>
          <h3>{entity.key}</h3>
          <Select
            className="country-select"
            delimiter=","
            multi={true}
            value={this.state[entity.key].join(',')}
            onChange={this.onEntityChange.bind(this, entity)}
            options={this.state[entity.key + 'selectedOptions']}
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
