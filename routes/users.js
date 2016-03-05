var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  var url = "http://webdir.tistory.com/467";

});

module.exports = router;
