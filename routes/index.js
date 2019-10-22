var express = require('express');
var router = express.Router();
var database = require('../DBparser/DbParser')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Running');
});

console.log(database)


module.exports = router;
