var express = require('express');
var router = express.Router();

/* GET home page. */
router.use(function(req, res, next) {
  if (req.hostname == 'gregthebusker.com') {
    res.sendFile('/gregthebusker/' + req.originalUrl)
  } else {
    next();
  }
});

module.exports = router;
