var express = require('express');
var router = express.Router();

// SET DEBUG=mvc:* ; npm start


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
