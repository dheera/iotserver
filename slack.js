require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
var devices = require('./devices.js');

module.exports = function() {
  return function(req, res) {
    console.log("slack request");
    console.log(req.body);

    if(!process.env.SLACK_VERIFICATION_TOKEN == req.body.token) {
      console.log("unauthorized request");
      res.send("unauthorized request");
      return;
    }

    if(!req.body.text || typeof(req.body.text) != "string") {
      console.log("bad input");
      res.send("bad input");
      return;
    }

    tokens = req.body.text.split(" ");
    console.log(tokens);

    if(tokens.length < 2 || tokens.length > 3) {
      console.log("bad input");
      res.send("bad input");
      return;
    }

    let responseText = "";

    if(tokens.length === 2) {
      _id = tokens[0];
      _property = tokens[1];
      if(!(_id in devices.devices)) {
        responseText = "no device called " + _id;
      } else {
        if(!(_property in devices.devices[_id].properties)) {
          responseText = "no property called " + _property;
        }
        responseText = _id + "." + _property + " = " + devices.devices[_id][_property];
      }
    } else if(tokens.length === 3) {
      _id = tokens[0];
      _property = tokens[1];
      _value = tokens[2];
    }

    response = {
      "blocks": [
         {
           "type": "section",
           "text": {
              "type": "mrkdwn",
              "text": responseText
           }
         }
      ]
    };
    res.json(response);
    // res.send(responseText);

/*    request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
      // Sends welcome message
      res.json();
    });

*/

    // next();
  };
}
