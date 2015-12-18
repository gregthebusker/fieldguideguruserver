var callOnEach = require('./utility.js').callOnEach;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse/node').Parse;
var RateLimiter = require('limiter').RateLimiter;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var rateLimit = 1000/15;
var parseLimiter = new RateLimiter(1, rateLimit); 

function saveSubject(text, cb) {
  saveObject('subject', text, cb);
}

function saveLocation(text, cb) {
  saveObject('category_location', text, cb);
}

function saveObject(name, text, cb) {
  var Obj = Parse.Object.extend(name);

  var query = new Parse.Query(Obj);
  query.equalTo('text', text);
  parseLimiter.removeTokens(1, function() {
    query.find({
      success: function(results) {
        if (results.length) {
          cb(results[0]);
          return;
        }

        var obj = new Obj();
        obj.set('text', text);
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

function main() {
  var FieldGuide = Parse.Object.extend('fieldguide');

  var query = new Parse.Query(FieldGuide);
  query.doesNotExist('category_location');
  callOnEach(query, function(obj, cb) {
    var st = obj.get('Subject_Term');
    var groups = st.split(',');

    var index;
    groups.some(function(v, i) {
      var text = v.trim();
      if (text[1] == text[1].toLowerCase()) {
        index = i;
      }
    });

    var subject = groups[index].trim();
    groups.splice(index, 1);
    var locationText = groups.join(',').trim();

    saveSubject(subject, function(subObj) {
      saveLocation(locationText, function(locObj) {
        obj.set({
          'category_subject': subObj,
          'category_location': locObj
        });
        parseLimiter.removeTokens(1, function() {
          obj.save(null, {
            success: function(o) {
              console.log('Saved: ' + obj.id);
              cb();
            },
            error: function(o, e) {
              console.error(e);
            }
          });
        });
      });
    });
  }, true);
}

main();
