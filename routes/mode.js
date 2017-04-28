var express = require('express');
var router = express.Router();

var modeService = require('../server/modeservice');

/* GET mode page. */
router.get('/', function(req, res, next) {
  modeService.changeMode();
  res.status(200).send(modeService.getMode());
});

module.exports = router;
