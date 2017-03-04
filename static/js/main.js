var socket;

var devices = {};
var device_controls = {};

function deviceSet(id, property, value) {
  socket.emit('set', [id, property, value]);
}

socket = io('/iot/v0/').connect('//' + document.domain + ':' + location.port);

socket.on('connect', function() {
  console.log('connected');
});

socket.on('devices', function(data) {
  console.log(data);
  devices = data;
  for(id in devices) {
    if(id in device_controls) {
      device_controls[id].update(devices[id]['state']);
    } else {
      if(devices[id]['deviceType'] === 'LifxLight') {
        device_controls[id] = new LifxLight(id, devices[id]['label'], devices[id]['state']);
        $('.devices').append(device_controls[id].getUI());
      }
      componentHandler.upgradeAllRegistered();
    }
  }
});

$(function() {
  console.log("init");

});
