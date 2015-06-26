var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Parse = require('parse').Parse;

Parse.initialize("iGJkfcqcNFcg2r537QG49nZzL3WhDuSNMm6KgsQM", "nKYTEfMzToWqiM7B8lt54DkbESAhj44taQuacmWm");


router.use(bodyParser.json());
router.all('/', function(req, res) {
  var ScrapedEmail = Parse.Object.extend("scrapedemail");
  if (req.body) {
    var texts = [];
    if (req.body.TextBody) {
      texts.push(req.body.TextBody);
    }
    var wantedHeaders = ['X-Sender'];
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
      matches.forEach(function(str) {
        email = new ScrapedEmail();
        email.set({
          email: str
        });
        emails.push(email);
      });
    });

    Parse.Object.saveAll(emails);
  }

  res.status(200);
  res.send('success');
});

module.exports = router;
