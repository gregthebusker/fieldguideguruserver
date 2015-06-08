var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/guides', function(req, res, next) {
  res.render('guides');
});

module.exports = router;
