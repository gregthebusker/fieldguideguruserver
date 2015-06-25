var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Parse = require('parse').Parse;
var parseKeys = require('./parsekeys.js');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);


router.use(bodyParser.json());
router.all('/', function(req, res) {
/*  var text = req.body.TextBody;


  var ScrapedEmail = Parse.Object.extend("scrapedemail");
  var emails = [];

  var matches = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi);
  matches.foreach((str) => {
    email = new ScrapedEmail();
    email.set({
      email: str
    });
  });

  Parse.saveAll(emails);
*/
  res.status(200);
  res.send('success');
});

module.exports = router;
