var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');
var hash = function(input){
    return crypto.createHash('sha1').update(input).digest('hex')
}

app.use('/', express.static(__dirname + '/static'))


var drivers = {
  'lifx': require('./drivers/lifx.js')
}

var device_config = {
  'light0': { 'driver': 'lifx', 'params' : {'ip': '192.168.1.64'} },
  'light1': { 'driver': 'lifx', 'params' : {'ip': '192.168.1.106'} },
  'light2': { 'driver': 'lifx', 'params' : {'ip': '192.168.1.197'} },
  'light3': { 'driver': 'lifx', 'params' : {'ip': '192.168.1.179'} }
};

var devices = {};
var webdevices = {};

for(id in device_config) {
  device = drivers[device_config[id]['driver']](device_config[id]['params'])
  devices[id] = device;
}

setInterval(function() {
  webdevices = {};
  for(id in devices) {
      device = devices[id];
      var state = {};
      Object.keys(device.properties).forEach(function(key) {
        state[key] = device[key];
      });
      webdevices[id] = {
        'deviceType': device.deviceType,
        'properties': device.properties,
        'state': state
      };
  }
}, 1000);

io.of('/iot/v0/').on('connection', function(socket){
  console.log('connected', socket.id);
  setInterval(function() {
    socket.emit('devices', webdevices);
  }, 1000);
  socket.on('set', function(data) {
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
