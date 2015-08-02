var callOnEach = require('./utility.js').callOnEach;
var saveImage = require('./utility.js').saveImage;
var parseKeys = require('./parsekeys.js');
var Parse = require('parse').Parse;
var RateLimiter = require('limiter').RateLimiter;
var request = require('request');
var cheerio = require('cheerio');

Parse.initialize(parseKeys.appId, parseKeys.jsKey, parseKeys.masterKey);

var rateLimit = 1000 / 15;
var wcLimiter = new RateLimiter(1, 1000 / 10);
var parseLimiter = new RateLimiter(1, rateLimit); 

function getPriceMap(oclcno, cb) {
  var buyingLinksBase = "http://www.worldcat.org/wcpa/servlet/org.oclc.lac.ui.buying.AjaxBuyingLinksServlet?serviceCommand=getBuyingLinks&oclcno=";

  var url = buyingLinksBase + oclcno;
  wcLimiter.removeTokens(1, function() {
    request(url, function(error, response, html) {
      var $ = cheerio.load(html);
      var data = {};
      var sellers = [];
      var prices = [];
      $('.seller a').each(function() {
        var text = $(this).text();
        text = text.replace(/\.com/, '');
        sellers.push(text);
      });
      $('.price').each(function() {
        var text = $(this).text();
        prices.push(text);
      });

      sellers.forEach(function(v, i) {
        if (prices[i] && v) {
          data[v] = prices[i];
        }
      });

      cb(data);
    });
  });
}

function parseWorldCatData(obj, cb) {
  var url = obj.get("URL");
  if (!url) {
    return;
  }

  wcLimiter.removeTokens(1, function() {
    request(url, function(error, response, html) {
      var $ = cheerio.load(html);
      var data = {};
      var h = $('link').first().attr('href');
      var regex = /\d+/;
      var match = regex.exec(h);
      if (match) {
        data.oclcno = match[0];

        var src = $('img.cover').first().attr('src');
        if (src) {
          var imagehref = 'https:' + src;
          data.imagehref = imagehref;
        }
        cb(data);
      } else {
        console.error("Can't get url");
        process.exit();
      }
    });
  });
}

function main() {
  var FieldGuide = Parse.Object.extend("fieldguide");
  var WorldCat = Parse.Object.extend("worldcat");

  var query = new Parse.Query(FieldGuide);
  query.exists("URL");
  query.doesNotExist("worldcat");
  callOnEach(query, function(obj) {
    parseWorldCatData(obj, function(data) {
      obj.set(data);
      getPriceMap(data.oclcno, function(priceData) {
        obj.set('prices', priceData);
        parseLimiter.removeTokens(1, function() {
          obj.save(null, {
            success: function(o) {
              console.log('Saved: ' + obj.id);
            },
            error: function(o, e) {
              console.error(e);
              // Over Request Limit
              if (e.code == 155) {
                process.exit();
              }
            }
          });
        });
      });
    });
  });
}

main();
