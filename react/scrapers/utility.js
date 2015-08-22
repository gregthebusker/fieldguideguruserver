var parseKeys = require('../parsekeys.js');
var Parse = require('parse').Parse;
var RateLimiter = require('limiter').RateLimiter;

Parse.initialize(parseKeys.appId, parseKeys.jsKey);

var rateLimit = 1000/10;
var parseLimiter = new RateLimiter(1, rateLimit);

var callOnEach = function(query, cb, shouldWait, withSkip) {
  var skip = 0;
  var go = function() {
    if (withSkip) {
      query.skip(skip);
    }
    parseLimiter.removeTokens(1, function() {
      query.find({
        success: function(results) {
          var count = results.length;
          var next = function() {
            skip = skip + results.length;
            if (results.length) {
              parseLimiter.removeTokens(1, function() {
                go();
              });
            }
          };

          results.forEach(function(obj) {
            cb(obj, function() {
              count--;
              console.log(count);
              if (count == 0) {
                console.log('Calling Again');
                next();
              }
            });
          });
          if (!shouldWait) {
            next();
          }

        }
      });
    });
  };
  go();
};

function saveImage(obj, url, cb) {
  var request = require('request').defaults({ encoding: null });

  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = 'data:' + response.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
      var file = new Parse.File('thumbnail.jpg', { base64: data});
      obj.set('fgg_thumbnail', file);
      parseLimiter.removeTokens(1, function() {
        obj.save(null, {
          success: function(o) {
            console.log('Saved Image: ' + obj.id);
            cb();
          },
          error: function(o, e) {
            console.error(e);
            cb();
            // Over Request Limit
            if (e.code == 155) {
              process.exit();
            }
          }
        });
      });
    }
  });
}


var flattenObject = function(ob) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) {
      continue;
    }

    if ((typeof ob[i]) == 'object' && !(ob[i] instanceof Array)) {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) {
          continue;
        }

        toReturn[i + '_' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

module.exports = {
  callOnEach: callOnEach,
  saveImage: saveImage,
  parseLimiter: parseLimiter,
  flattenObject: flattenObject,
};
