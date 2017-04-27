
var moment = require('moment');
var express = require('express');
var router = express.Router();

var lastConnections = [
  {id: 74555555555551, date: moment().format('YYYY-MM-DD')},
  {id: 2, date: moment().format('YYYY-MM-DD')},
  {id: 3, date: moment().format('YYYY-MM-DD')},
]
/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('admin',{'lastConnections': lastConnections});
});

module.exports = router;
