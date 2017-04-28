var express = require('express');
var router = express.Router();

var db = require('in-mem');
var insert = db.insert;

const request = require('request');

var modeService = require('../server/modeservice');

/* GET hello world page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/webhook', function(req, res, next) {
    //console.log(req.query);
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'plop') {
    //console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    //console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

router.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
//          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  //console.log("Received message for user %d and page %d at %d with message:",
    //senderID, recipientID, timeOfMessage);
  //console.log(JSON.stringify(message));
  //console.log(JSON.stringify(event.sender));
  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;


  if (messageText) {
    const personA = insert('messages', {id: senderID, date: message.date, message: messageText});

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
      break;

      default:
        if (modeService.getMode() == 'OFF') {
  //        sendTextMessage(senderID, messageText);
            sendTextMessage(senderID, `Hello ! Merci pour ton message. Malheureusement, personne n'est disponible pour te répondre maintenant. Nous reviendrons vers toi au plus tôt ! En attendant, tu peux peut être me donner ton numéro de téléphone, comme ça je t'appelle direct !
             @+ !`);
        }
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAGZB0CRIFwUBAFpnL08z0yM1jlZBdFSj2M4XOAAlWdHU0OoBjZCeAtGiJpu8qzfRxNTk2CZANr6Bbcnt8k4MvZBzqz5Pp6MhcWucOsj6UWfvHXKTSSS2BBdy9b3LcqTzvvQCtpnWxfEloXwlpfLn9HDZBTJFhfA4Pi0PzB64mpQZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      //console.log("Successfully sent generic message with id %s to recipient %s",
      //  messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      //console.error(response);
      //console.error(error);
    }
  });
}

module.exports = router;
