var getByParse = require('./locationentities.js').getByParse;
var ByArray = require('./locationentities.js').ByArray;
var Entites = require('./locationentities.js').Entities;

var callOnEach = require('./utility.js').callOnEach;
var parseLimiter = require('./utility.js').parseLimiter;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;
var RateLimiter = require('limiter').RateLimiter;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var Location = Parse.Object.extend('location');


var removeSelf = function() {
  var query = new Parse.Query(Location);
  query.exists('parents');

  callOnEach(query, function(loc, cb) {
    var parents = loc.get('parents');
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
