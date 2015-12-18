var ByArray = require('./locationentities.js').ByArray;

var callOnEach = require('./utility.js').callOnEach;
var parseLimiter = require('./utility.js').parseLimiter;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse/node').Parse;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var Location = Parse.Object.extend('location');


var setParents = function() {
  var query = new Parse.Query(Location);
  query.doesNotExist('parents');
  ByArray.forEach(function(e1) {
    query.include(e1.key);
    ByArray.forEach(function(e2) {
      query.include(e1.key + '.' + e2.key);
      query.include(e1.key + '.' + e2.key + '.location');
    });
  });

  callOnEach(query, function(loc, cb) {
    var type = loc.get('type');
    if (!type) {
      return loc.destroy();
    }
    var entity = loc.get(type);
    loc.add('parents', loc);
    ByArray.forEach(function(e) {
      var r = entity.get(e.key);
      if (r) {
        loc.add('parents', r.get('location'));
      }
    });
    parseLimiter.removeTokens(1, function() {
      loc.save({
        success: function(obj) {
          console.log('Saved ', obj.id);
          cb();
        }
      });
    });
  }, true);
};

setParents();
