"use strict";
var React = require('react');
var Paper = require('material-ui').Paper;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');
var Select = require('react-select');
var LocationEntities = require('./LocationEntities.js');
var Collection = require('./collection.js');
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var Locations = [];
for (var key in LocationEntities.Entities) {
  Locations.push(LocationEntities.Entities[key]);
}

mixpanel.track('Collections');

var Collections = React.createClass({
  componentWillMount() {
    var Collection = Parse.Object.extend('collection');
    var query = new Parse.Query(Collection);
    query.include('children');
    query.include('children.location');
    Locations.forEach(entity => {
      query.include(`children.location.${entity.key}`);
      query.include(`children.location.${entity.key}.location`);
    });
    query.include('location');
    query.find().then(results => {
      this.setState({
        collections: results,
      });
    }.bind(this));
  },

  getInitialState() {
    return {
      collections: [],
    };
  },

  createNewCollection() {
    var title = this.refs.title.getValue();
    var Collection = Parse.Object.extend('collection');
    var collection = new Collection();
    collection.set({
      title: title,
      searchable_text: title.toLowerCase(),
    });

    var Location = Parse.Object.extend('location');
    var loc = new Location();
    loc.set({
      label: title,
      type: 'collection',
    });


    Parse.Object.saveAll([collection, loc], {
      success(list) {
        var c = list[0];
        var l = list[1];
        c.set({
          location: l,
        });
        l.set({
          collection: c,
        });
        Parse.Object.saveAll([c, l], {
          success(list) {
            location.reload();
          },
          error(e) {
            console.log(e);
          }
        });
      },
      error(error) {
        console.log(error);
      },
    });
  },

  render: function() {
    return (
      <div>
        <h2>Collections</h2>
        {this.state.collections.map(c => {
          return <Collection key={c.id} collection={c} />;
        })}
        <Paper className="book-content collections-content" zDepth={1}>
          <TextField
            hintText="Collection Name"
            ref="title"/>
          <RaisedButton primary={true} onClick={this.createNewCollection} label="Create New Collection" />
        </Paper>
      </div>
    );
  },
});

module.exports = Collections;
