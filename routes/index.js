var express = require('express');
var router = express.Router();

/* GET hello world page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/webhook', function(req, res, next) {
    console.log(req.query);
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'plop') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

module.exports = router;
