var socket;

var devices = {};
var device_controls = {};

function deviceSet(id, property, value) {
  socket.emit('set', [id, property, value]);
}

socket = io('/iot/v0/').connect('//' + document.domain + ':' + location.port);

socket.on('connect', function() {
  console.log('connected');
  if(auth_params) {
    socket.emit('auth', auth_params);
  }
});

socket.on('reconnect', function() {
  console.log('connected');
  if(auth_params) {
    socket.emit('auth', auth_params);
  }
});


socket.on('authResult', function(data) {
  if(data === 1) {
    console.log("authentication successful");
    localStorage.setItem("auth_params", JSON.stringify(auth_params));
    $('#auth').hide();
  } else {
    console.log("authentication failed");
    localStorage.removeItem("auth_params");
    auth_params = null;
  }
});

socket.on('devices', function(data) {
  console.log(data);
  devices = data;
  for(id in devices) {
    if(id in device_controls) {
      device_controls[id].update(devices[id]['state']);
    } else {
      if(devices[id]['deviceType'] === 'LifxLight') {
        var div = $('<div></div>');
        $('.devices').append(div);
        device_controls[id] = new LifxLight(id, devices[id]['label'], devices[id]['state'], div);
      } else if(devices[id]['deviceType'] === 'Kankun') {
        var div = $('<div></div>');
        $('.devices').append(div);
        device_controls[id] = new Kankun(id, devices[id]['label'], devices[id]['state'], div);
      } else if(devices[id]['deviceType'] === 'ArduinoLock') {
        var div = $('<div></div>');
        $('.devices').append(div);
        device_controls[id] = new ArduinoLock(id, devices[id]['label'], devices[id]['state'], div);
      } else if(devices[id]['deviceType'] === 'ESP8266Lock') {
        var div = $('<div></div>');
        $('.devices').append(div);
        device_controls[id] = new ESP8266Lock(id, devices[id]['label'], devices[id]['state'], div);
      } else if(devices[id]['deviceType'] === 'ESP8266Thermostat') {
        var div = $('<div></div>');
        $('.devices').append(div);
        device_controls[id] = new ESP8266Thermostat(id, devices[id]['label'], devices[id]['state'], div);
      }
    }
  }
});

var auth_params = null;

var auth_params_stored = localStorage.getItem("auth_params");
if(auth_params_stored) {
  try {
    auth_params = JSON.parse(auth_params_stored);
  } catch(err) {
    localStorage.removeItem("auth_params");
  }
}

$(function() {
  console.log("init");
  $('#auth-login').click(function() {
    auth_params = {"username": $('#auth-username').val(), "password": $('#auth-password').val()};
    socket.emit('auth', auth_params);
  });
});
