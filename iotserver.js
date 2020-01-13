// foo
require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var hash = function(input){
    return crypto.createHash('sha1').update(input).digest('hex')
}
var slack = require('./slack.js')();
var devices = require('./devices.js');
var passwd = require('/etc/iotserver/passwd.json');

const bodyParser = require('body-parser');
const request = require("request");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/static'));
app.post('/slack', slack);

io.of('/iot/v0/').on('connection', function(socket){
  var id, property;
  console.log('connected', socket.id);

  socket.isAuthenticated = false;

  socket.on('auth', function(data) {
    if(!'username' in data || !'password' in data) {
      console.log("invalid authentication parameters", data);
      socket.emit("authResult", 0);
      return;
    }
    if(!data['username'] in passwd) {
      console.log("invalid username", data['username']);
      socket.emit("authResult", 0);
      return;
    }
    if(hash(data['password']) !== passwd[data['username']]) {
      console.log("invalid password", data['username']);
      socket.emit("authResult", 0);
      return;
    }
    socket.isAuthenticated = true;
    socket.emit("authResult", 1);
  });

  var webdevices_last = {};
  setInterval(function() {
    if(!socket.isAuthenticated) return;
    var id;
    var webdevices_update = {};
    for(id in devices.webdevices) {
      if(!(id in webdevices_last)) {
        webdevices_update[id] = devices.webdevices[id];
      } else {
        if(JSON.stringify(devices.webdevices[id]) !== webdevices_last[id]) {
          webdevices_update[id] = devices.webdevices[id]
        }
      }
      webdevices_last[id] = JSON.stringify(devices.webdevices[id]);
    }
    if(Object.keys(webdevices_update).length > 0) {
      socket.emit('devices', webdevices_update);
    }
  }, 100);

  socket.on('set', function(data) {
    if(!socket.isAuthenticated) return;
    console.log('set', data);
    if(data && data.length === 3) {
      if(data[0] in devices.devices) {
        if(data[1] in devices.devices[data[0]].properties) {
          devices.devices[data[0]][data[1]] = data[2];
        } else {
          console.log('set: property not found', data);
        }
      } else {
        console.log('set: device not found', data);
      }
    } else {
      console.log('set: invalid message', data);
    }
  });

  socket.on('disconnect', function(){
    console.log('disconnected', socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
