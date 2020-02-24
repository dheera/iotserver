require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
var devices = require('./devices.js');

module.exports = function() {
  return function(req, res) {
    console.log("slack request");
    console.log(req.body);

    let responseText = "";

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
    
    if(tokens.length === 0) {
      errorText = "bad input";
      console.log(errorText); res.send(errorText); return;
    }
    if(tokens[0] === "help") {
      errorText = "help text here";
      console.log(errorText); res.send(errorText); return;
    }

    _id = tokens[0];

    if(!(_id in devices.devices)) {
      errorText = "no device called " + _id + " ... for help try /dheera help";
      console.log(errorText); res.send(errorText); return;
    }

    if(tokens.length === 1) {
      errorText = _id + " = " + devices.devices[_id].toString();
      console.log(errorText); res.send(errorText); return;
    }

    if(tokens[1] === "get") {
      if(tokens.length === 2) {
        errorText = "usage: /dheera [deviceName] get [propertyName]";
        console.log(errorText); res.send(errorText); return;
      }

      _property = tokens[2];

      if(!(_property in devices.devices[_id].properties)) {
        errorText = "no property called " + _property;
        console.log(errorText); res.send(errorText); return;
      }

      responseText = _id + "." + _property + " = " + devices.devices[_id][_property];
      console.log(_property, responseText);
    } else if(tokens[1] in devices.devices[_id].actions) {
      devices.devices[_id].actions[tokens[1]]();
      responseText = _id + " -> " + tokens[1];
    } else {
        errorText = "invalid action";
        console.log(errorText); res.send(errorText); return;
    }

    response = {
      "response_type": "ephemeral",
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
    console.log(responseText, response);
    res.json(response);

  };
}
