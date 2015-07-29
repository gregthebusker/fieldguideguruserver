var request = require('request');
var cheerio = require('cheerio');
var RateLimiter = require('limiter').RateLimiter;
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var rateLimit = 1000 / 25;
var bibLimiter = new RateLimiter(1, rateLimit); 
var parseLimiter = new RateLimiter(1, rateLimit); 

var urlRoot = "http://bibleaves.library.illinois.edu";
var urlTemplate = urlRoot + "/catalog?f%5Bcollection_facet%5D%5B%5D=fldg&search_field=all_fields&page=";

function getNumberOfPages(cb) {
  request(urlTemplate, function(error, response, html) {
    var $ = cheerio.load(html);
    var last = $("ul.pagination li a").last();
    var pages = last.text();
    cb(pages);
  });
}

function parsePages(pages, cb) {
  var go = function (url) {
    return function() {
      request(url, function(error, response, html) {
        var $ = cheerio.load(html);
        $("#documents .document").each(function(node) {
          var href = $(this).find('a').first().attr('href');
          cb(href);
        });
      });
    };
  };

  for (var i = 1; i <= pages; i++) {
    url = urlTemplate + i;
    bibLimiter.removeTokens(1, go(url));
  }
}

function parseBookPage(href, cb) {
  var url = urlRoot + href;
  bibLimiter.removeTokens(1, function() {
    request(url, function(error, response, html) {
      var $ = cheerio.load(html);
      var data = {};
      var doc = $('#document').first();
      title = doc.find('h1').text();
      if (!title) {
        return;
      }

      data.title = title;

      keys = [];
      values = [];
      doc.find('dt').each(function() {
        var text = $(this).text();
        text = text.replace(/:/, '');
        text = text.replace(/ /, '_');
        keys.push(text);
      });
      doc.find('dd').each(function() {
        var text = $(this).text();
        values.push(text);
      });

      keys.forEach(function(v, i) {
        data[v] = values[i];
      });

      cb(data);
    });
  });
}

function saveToParse(data, cb) {
  var FieldGuide = Parse.Object.extend("fieldguide");

  var query = new Parse.Query(FieldGuide);
  // Match on ISBN and if that doesn't exist match on title.
  if (data.ISBN) {
    query.equalTo("ISBN", data.ISBN);
  } else {
    query.equalTo("title", data.title);
  }
  parseLimiter.removeTokens(1, function() {
    query.find({
      success: function(results) {
        var obj;
        if (results.length) {
          obj = results[0];
        } else {
          obj = new FieldGuide();
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

function main() {
  var i = 1;
  var j = 1;
  getNumberOfPages(function(pages) {
    console.log("Found pages: " + pages);
    parsePages(pages, function(href) {
      //console.log("Parsing: " + href);
      parseBookPage(href, function(data) {
        //console.log("Bib Data: " + JSON.stringify(data));
        saveToParse(data, function(result) {
          console.log("Saved " + i + ": " + result.id);
          i++;
        });
      });
    });
  });
}

main();
