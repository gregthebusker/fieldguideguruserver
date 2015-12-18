var callOnEach = require('./utility.js').callOnEach;
var parseLimiter = require('./utility.js').parseLimiter;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse/node').Parse;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var Location = Parse.Object.extend('location');


var removeSelf = function() {
  var query = new Parse.Query(Location);
  query.exists('parents');

  callOnEach(query, function(loc, cb) {
    loc.remove('parents', loc);
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

removeSelf();
