var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Parse = require('parse').Parse;

Parse.initialize("iGJkfcqcNFcg2r537QG49nZzL3WhDuSNMm6KgsQM", "nKYTEfMzToWqiM7B8lt54DkbESAhj44taQuacmWm");


router.use(bodyParser.json());
router.all('/', function(req, res) {
  var text = req.body.TextBody;


  var ScrapedEmail = Parse.Object.extend("scrapedemail");

  var matches = text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi);
  matches.foreach((str) => {
    email = new ScrapedEmail();
    email.set({
      email: str
    });
  });

  Parse.saveAll(emails);

  res.status(200);
  res.send('success');
});

module.exports = router;
