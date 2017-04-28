
var moment = require('moment');
var express = require('express');
var router = express.Router();
var modeService = require('../server/modeservice');

/* GET admin page. */
router.get('/', function(req, res, next) {
  res.render('admin',{'varMode': modeService.getMode()});
});

module.exports = router;
