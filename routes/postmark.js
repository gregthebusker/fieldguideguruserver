var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  console.log(req.body);

  res.status(200);
  res.send('success');
});

module.exports = router;
