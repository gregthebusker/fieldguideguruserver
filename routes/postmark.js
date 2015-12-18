var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Parse = require('parse/node').Parse;

Parse.initialize("iGJkfcqcNFcg2r537QG49nZzL3WhDuSNMm6KgsQM", "nKYTEfMzToWqiM7B8lt54DkbESAhj44taQuacmWm");

router.use(bodyParser.json({limit: '200mb'}));
router.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
router.all('/', function(req, res) {
  var ScrapedEmail = Parse.Object.extend("scrapedemail");
  if (req.body) {
    var texts = [];
    if (req.body.TextBody) {
      texts.push(req.body.TextBody);
    }
    if (req.body.From) {
      texts.push(req.body.From);
    }
    var wantedHeaders = ['X-Sender', 'X-Original-From'];
    var headers = req.body.Headers;
    if (headers) {
      headers.forEach(function(obj) {
        if (wantedHeaders.indexOf(obj.Name) != -1) {
          texts.push(obj.Value);
        }
      });
    }

    var emails = [];


    texts.forEach(function(text) {
      var matches = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi);
      if (matches) {
        matches.forEach(function(str) {
          if (str.indexOf('yahoogroups.com') > 0 ||
            str.indexOf('googlegroups.com') > 0 ||
            str.indexOf('LISTSERV@') == 0 ||
            str.indexOf('lists.ctbirding.org') > 0 ||
            str.indexOf('envirolink.org') > 0 ||
            emails.indexOf(str) > 0) {
            return;
          }
          emails.push(str);
        });
      }
    });

    var objs = emails.map(function(email) {
      var obj = new ScrapedEmail();
      obj.set({
        email: email
      });
      return obj;
    });

    Parse.Object.saveAll(objs, {
      success: function(list) {
        res.status(200);
        res.send('success');
      }, error: function(error) {
        res.status(200);
        res.send('success');
      }
    });
  } else {
    res.status(200);
    res.send('success');
  }
});

module.exports = router;
