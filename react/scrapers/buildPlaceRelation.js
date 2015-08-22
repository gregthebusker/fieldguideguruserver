var callOnEach = require('./utility.js').callOnEach;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;
var RateLimiter = require('limiter').RateLimiter;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var rateLimit = 1000/15;
var parseLimiter = new RateLimiter(1, rateLimit); 

function main() {
  var Country = Parse.Object.extend('country');
  var State = Parse.Object.extend('state');
  var County = Parse.Object.extend('county');

  var query = new Parse.Query(County);
  query.doesNotExist('countries');
  callOnEach(query, function(obj) {
    var stateCode = obj.get('SUBNATIONAL1_CODE');
    var countryCode = obj.get('COUNTRY_CODE');

    var sQ = new Parse.Query(State);
    var cQ = new Parse.Query(Country);
    sQ.equalTo('SUBNATIONAL1_CODE', stateCode);
    cQ.equalTo('COUNTRY_CODE', countryCode);

    parseLimiter.removeTokens(1, function() {
      Parse.Promise.when(
        sQ.find(),
        cQ.find()
      ).then(function(states, countries) {
        var state = states[0];
        var country = countries[0];
        obj.set('state', state);
        obj.set('country', country);
        if (state) {
          state.addUnique('counties', obj);
          state.set('country', country);
        }
        if (country) {
          country.addUnique('counties', obj);
          country.addUnique('states', state);
        }
        parseLimiter.removeTokens(1, function() {
          Parse.Object.saveAll([obj, state, country], {
            success: function(list) {
              console.log('Saved: ' + list.map(function(o) { o = o || {}; return o.id; }).join(', '));
            }
          });
        });
      });
    });
  });





  query = new Parse.Query(State);
  query.doesNotExist('countries');
  callOnEach(query, function(obj) {
    var countryCode = obj.get('COUNTRY_CODE');

    var cQ = new Parse.Query(Country);
    cQ.equalTo('COUNTRY_CODE', countryCode);

    parseLimiter.removeTokens(1, function() {
      Parse.Promise.when(
        cQ.find()
      ).then(function(countries) {
        var country = countries[0];
        obj.set('country', country);
        if (country) {
          country.addUnique('states', obj);
        }
        parseLimiter.removeTokens(1, function() {
          Parse.Object.saveAll([obj, country], {
            success: function(list) {
              console.log('Saved: ' + list.map(function(o) { o = o || {}; return o.id; }).join(', '));
            }
          });
        });
      });
    });
  });
}

main();
