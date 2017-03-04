// foo
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var hash = function(input){
    return crypto.createHash('sha1').update(input).digest('hex')
}

app.use('/', express.static(__dirname + '/static'))

var device_config = require('/etc/iotserver/config.json');
var passwd = require('/etc/iotserver/passwd.json');

var drivers = {}
var devices = {};
var webdevices = {};

for(id in device_config) {
  driver_name = device_config[id]['driver'];
  params = device_config[id]['params'];
  if(!(driver_name in drivers)) {
    console.log("Loading driver " + driver_name + "...");
    drivers[driver_name] = require('./drivers/' + driver_name + '.js');
  }
  device = drivers[driver_name](params);
  devices[id] = device;
}

setInterval(function() {
  var id;
  webdevices = {};
  for(id in devices) {
      var device = devices[id];
      var state = {};
      Object.keys(device.properties).forEach(function(key) {
        state[key] = device[key];
      });
      webdevices[id] = {
        'deviceType': device.deviceType,
        'properties': device.properties,
        'label': device_config[id].label,
        'state': state
      };
  }
}, 100);

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
    for(id in webdevices) {
      if(!(id in webdevices_last)) {
        webdevices_update[id] = webdevices[id];
      } else {
        if(JSON.stringify(webdevices[id]) !== webdevices_last[id]) {
          webdevices_update[id] = webdevices[id]
        }
      }
      webdevices_last[id] = JSON.stringify(webdevices[id]);
    }
    if(Object.keys(webdevices_update).length > 0) {
      socket.emit('devices', webdevices_update);
    }
  }, 100);

  socket.on('set', function(data) {
    if(!socket.isAuthenticated) return;
    console.log('set', data);
    if(data && data.length === 3) {
      if(data[0] in devices) {
        if(data[1] in devices[data[0]].properties) {
          devices[data[0]][data[1]] = data[2];
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
