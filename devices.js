var device_config = require('/etc/iotserver/config.json');

let drivers = {}
let devices = {};
let webdevices = {};

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

console.log("devices", devices);

setInterval(function() {
  var id;
  // webdevices = {};
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

module.exports = {
  drivers: drivers,
  devices: devices,
  webdevices: webdevices
}

