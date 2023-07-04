var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/detail', function(req, res, next) {
  res.render('detail', { title: 'Express' });
});

module.exports = router;
