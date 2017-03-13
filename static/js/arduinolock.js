function ArduinoLock(device_id, label, state, div) {

  var ui = $('<div></div>');
  ui.addClass('device');
  ui.addClass('device-' + device_id);
  ui.data('name', label);
  ui.data('device_id', device_id);
  ui.data('state', state);

  d_header = $('<div class="device-arduinolock-header"></div>').appendTo(ui);
  d_header_title = $('<button class="device-arduinolock-header-button">' + label + '</button>').click(function () {
      $(this).toggleClass('is-on');
      deviceSet(device_id, 'locked', $(this).hasClass('is-on')?1:0);
  }).appendTo(d_header);

  $(div).append(ui);
  componentHandler.upgradeAllRegistered();

  this.update = function(state) {
    ui.data('state', state);
    if(ui.data('state')['locked']===1) {
      ui.find('button').addClass('is-on');
    } else {
      ui.find('button').removeClass('is-on');
    }
  };

  this.update(state);

}
