"use strict";
var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var Select = require('react-select');
var LocationEntities = require('./LocationEntities.js');
Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var Locations = [];
for (var key in LocationEntities.Entities) {
  Locations.push(LocationEntities.Entities[key]);
}

var Collection = React.createClass({
  onEntityChange(entity, newValue, options) {
    var current = this.getListForEntity(entity);
    var nextSet = options.map(o => o.obj) || [];

    var toRemove = current.filter(o => {
      return nextSet.indexOf(o) == -1;
    });
    var toAdd = nextSet.filter(o => {
      return current.indexOf(o) == -1;
    });

    toAdd.forEach(obj => {
      this.props.collection.add('children', obj);
      obj.add('parents', this.props.collection.get('location'));
      obj.save();
    });

    toRemove.forEach(obj => {
      this.props.collection.remove('children', obj);
      obj.remove('parents', this.props.collection.get('location'));
      obj.save();
    });

    this.props.collection.save();

    this.forceUpdate();
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
    query.contains('searchable_text', input);
    query.include('location');
    query.find({
      success: (results) => {
        var selected = this.getListForEntity(entity);
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

  getListForEntity(entity) {
      var list = this.props.collection.get('children') || [];
      list = list.filter(obj => {
        return obj.get('type') == entity.key;
      });
      return list;
  },

  renderLocationEntities() {
    return Locations.map(entity => {
      var list = this.getListForEntity(entity);
      var values = list.map(obj => obj.id);
      var options = list.map(this.makeOption);
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
    var collection = this.props.collection;
    return (
      <div>
        <Paper className="book-content collection" zDepth={1}>
          <div className="book-title">
            {collection.get('title')}
          </div>
          {this.renderLocationEntities()}
        </Paper>
      </div>
    );
  },
});

module.exports = Collection;
