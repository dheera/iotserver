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

socket.on('authResult', function(data) {
  if(data === 1) {
    console.log("authentication successful");
    $('#auth').hide();
  } else {
    console.log("authentication failed");
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
      }
      // componentHandler.upgradeAllRegistered();
    }
  }
});

$(function() {
  console.log("init");
  $('#auth-login').click(function() {
    auth_params = {"username": $('#auth-username').val(), "password": $('#auth-password').val()};
    socket.emit('auth', auth_params);
  });
});
