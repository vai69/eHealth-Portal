var express = require('express');
var cookieParser = require('cookie-parser');
var router = express.Router();





router.use(cookieParser());





/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
