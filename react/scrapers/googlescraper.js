var callOnEach = require('./utility.js').callOnEach;
var parseLimiter = require('./utility.js').parseLimiter;
var flattenObject = require('./utility.js').flattenObject;
var googleKeys = require('./googlekeys.js');
var google = require('googleapis');
var books = google.books('v1');
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

function parseGoogleBooksData(obj, cb) {
  books.volumes.list({
    auth: googleKeys.serverKey,
    q: 'isbn:' + obj.get('ISBN')
  }, function(err, books) {
    if (books && books.totalItems) {
      var book = books.items[0];
      // More details at https://developers.google.com/books/docs/v1/reference/volumes#resource
      var data = flattenObject(book);
      if (book.volumeInfo.imageLinks) {
        data['fgg_imagehref'] = book.volumeInfo.imageLinks.thumbnail;
      }
      data.googleBookId = data.id;
      delete data.id;
      cb(data);
    } else if (err) {
      console.error(err);
      // Hit rate limit
      if (err.code == 403) {
        process.exit();
      }
    } else {
      return cb({});
    }
  });
}

function main() {
  var FieldGuide = Parse.Object.extend("fieldguide");
  var GoogleBook = Parse.Object.extend("googlebook");

  var query = new Parse.Query(FieldGuide);
  query.exists("ISBN");
  query.doesNotExist("googlebook");
  callOnEach(query, function(obj, cb) {
    parseGoogleBooksData(obj, function(data) {
      var goog = new GoogleBook();
      parseLimiter.removeTokens(1, function() {
        goog.save(data, {
          success: function(g) {
            obj.set({
              googlebook: g,
            });
            parseLimiter.removeTokens(1, function() {
              obj.save(null, {
                success: function(o) {
                  console.log('Saved: ' + obj.id);
                  cb();
                },
                error: function(o, e) {
                  console.error(e)
                  cb();
                }
              });
            });
          },
          error: function(g, e) {
            console.error(e)
            process.exit();
            cb();
          }
        });
      });
    });
  }, true, false);
}

main();
