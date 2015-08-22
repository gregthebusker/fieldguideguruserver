var getByParse = require('./locationentities.js').getByParse;
var ByArray = require('./locationentities.js').ByArray;

var callOnEach = require('./utility.js').callOnEach;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;
var RateLimiter = require('limiter').RateLimiter;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var rateLimit = 1000/15;
var parseLimiter = new RateLimiter(1, rateLimit);

var Location = Parse.Object.extend('location');


var process = function(obj) {
  var loc = new Location();
  var entity = getByParse(obj);
  loc.set({
    label: entity.getLabel(obj),
    type: entity.key,
  });
  loc.set(entity.key, obj);
  obj.set('location', loc);
  parseLimiter.removeTokens(1, function() {
    Parse.Object.saveAll([loc, obj], {
      success: function(list) {
        console.log('Saved ', list.map(function(o) { o = o || {}; return o.id; }).join(', '));
      } 
    });
  });
};


function main() {
  ByArray.forEach(function(entity) {
    var query = new Parse.Query(entity.parse);
    query.doesNotExist('location');
    callOnEach(query, process);
  });
}

main();
