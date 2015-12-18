var callOnEach = require('./utility.js').callOnEach;
var parseLimiter = require('./utility.js').parseLimiter;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var Collection = Parse.Object.extend('collection');
var Guides = Parse.Object.extend('fieldguide');


var setParents = function() {
  var query = new Parse.Query(Guides);
  query.doesNotExist('locations');
  query.include('category_location');
  query.include('category_location.location');

  callOnEach(query, function(obj, cb) {
    var cat = obj.get('category_location');
    var text = cat.get('text').toLowerCase();
    var query = new Parse.Query(Collection);
    query.startsWith('searchable_text', text);
    query.include('location');

    parseLimiter.removeTokens(10, function() {
      query.find({
        success: function(results) {
          if (results.length) {
            var col = results[0];
            var loc = col.get('location');
            obj.addUnique('locations', loc);
            parseLimiter.removeTokens(1, function() {
              obj.save({
                success: function(obj) {
                  console.log('Saved ', obj.id);
                  cb();
                }
              });
            });  
          } else {
            console.log("Couldn't find ", text);
            cb();
          }
        },
        error: function(e) {
          console.log(e);
          cb();
        }
      });
    });

  }, true, false);
};

setParents();
