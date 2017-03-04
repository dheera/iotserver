var webdevices;
var socket;

function set(id, property, value) {
  socket.emit('set', [id, property, value]);
}

socket = io('/iot/v0/').connect('//' + document.domain + ':' + location.port);

socket.on('connect', function() {
  console.log('connected');
});

socket.on('devices', function(data) {
  console.log('devices:', data)
  devices = data;
  for(id in devices) {
    if($('.device-' + id).length === 0) {
      deviceHTML = $('<div></div>').addClass('device').addClass('device-' + id).data('device_id', id);
      $('<button>on</button>').click(function() {
        set($(this).parents('.device').data('device_id'), 'power', 1);
      }).appendTo(deviceHTML);
      $('<button>off</button>').click(function() {
        set($(this).parents('.device').data('device_id'), 'power', 0);
      }).appendTo(deviceHTML);
      $('.devices').append(deviceHTML);
    }
  }
});

$(function() {
  console.log("init");

});
