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

function getPriceMap(data, cb) {
  data.prices = {};
  var buyingLinksBase = "http://www.worldcat.org/wcpa/servlet/org.oclc.lac.ui.buying.AjaxBuyingLinksServlet?serviceCommand=getBuyingLinks&oclcno=";

  var url = buyingLinksBase + data.oclcno;
  wcLimiter.removeTokens(1, function() {
    request(url, function(error, response, html) {
      var $ = cheerio.load(html);
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
          data.prices[v] = prices[i];
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
          data.ffg_imagehref = imagehref;
        }



        var details = $('#details').find('tr').each(function() {
          var tr = $(this);
          var id = tr.attr('id');
          if (!id) {
            return;
          }
          var key = id.replace('-', '_');
          var d = {
            label: tr.find('th').text(),
            value: tr.find('td').text()
          };
          data[key] = d;
        });

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
  callOnEach(query, function(obj, cb) {
    parseWorldCatData(obj, function(data) {
      getPriceMap(data, function(data) {
        var wc = new WorldCat();
        parseLimiter.removeTokens(1, function() {
          wc.save(data, {
            success: function(w) {
              obj.set({
                worldcat: w,
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
    });
  }, true, false);
}

main();
