var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var router = express.Router();





router.use(cookieParser());
router.use(bodyParser.json());




/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.render('index', { title: 'Express' });
});

module.exports = router;
