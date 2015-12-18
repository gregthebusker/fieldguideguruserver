var request = require('request');
var RateLimiter = require('limiter').RateLimiter;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var rateLimit = 1000 / 20;
var parseLimiter = new RateLimiter(1, rateLimit); 

var baseUrl = 'http://ebird.org/ws1.1/ref/location/list?rtype=';

function saveToParse(data, className, idKey, cb) {
  var CN = Parse.Object.extend(className);
  var query = new Parse.Query(CN);
  query.equalTo(idKey, data[idKey]);
  parseLimiter.removeTokens(1, function() {
    query.find({
      success: function(results) {
        var obj;
        if (results.length) {
          obj = results[0];
        } else {
          obj = new CN();
        }
        obj.set(data);
        parseLimiter.removeTokens(1, function() {
          obj.save(null, {
            success: function(o) {
              cb(o);
            },
            error: function(o, e) {
              console.error(e);
            }
          });
        });
      }
    });
  });
}

function fetchAndBuild(param, cb) {
  var url = baseUrl + param;
  request(url, function(err, response, html) {
    var rows = html.split('\n');
    var header = rows.shift();
    var keys = header.split(',');
    rows.forEach(function(row) {
      var values = row.split(',');
      if (values.length != keys.length) {
        return;
      }

      var text = [];
      var data = {};
      keys.forEach(function(key, i) {
        data[key] = values[i];

        text.push(values[i].toLowerCase());
      });
      data['searchable_text'] = text.join(', ');

      cb(data);
    });
  });
}

function main() {
  fetchAndBuild('country', function(data) {
    saveToParse(data, 'country', 'COUNTRY_CODE', function(obj) {
      console.log('Saving: ' + obj.get('COUNTRY_CODE'));
    });
  });
  fetchAndBuild('subnational1', function(data) {
    if (!data.LOCAL_ABBREVIATION) {
      return;
    }
    saveToParse(data, 'state', 'SUBNATIONAL1_CODE', function(obj) {
      console.log('Saving: ' + obj.get('SUBNATIONAL1_CODE'));
    });
  });
  fetchAndBuild('subnational2', function(data) {
    saveToParse(data, 'county', 'SUBNATIONAL2_CODE', function(obj) {
      console.log('Saving: ' + obj.get('SUBNATIONAL2_CODE'));
    });
  });
}

main();
