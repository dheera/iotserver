function ESP8266Thermostat(device_id, label, state, div) {

  var ui = $('<div></div>');
  ui.addClass('device');
  ui.addClass('device-' + device_id);
  ui.data('name', label);
  ui.data('device_id', device_id);
  ui.data('state', state);

  d_header = $('<div class="device-ESP8266Thermostat-header"></div>').appendTo(ui);
  d_header_title = $('<button class="device-ESP8266Thermostat-header-button">' + label + '</button>').appendTo(d_header);

  d_header_options = $('<div style="padding-top:10pt;padding-bottom:10pt;background:#202020;"></div>').appendTo(ui);

  $('<div class="label" style="margin-top:10pt;margin-bottom:10pt;display:inline-block;font-size:14pt;text-align:center;width:10%;color:#ffffff;">T</div><div style="display:inline-block;width:90%;"><input class="slider-t mdl-slider mdl-js-slider" type="range" min="10" max="30" step="0.5" value="0" tabindex="0"></div>').appendTo(d_header_options).find('input').bind('input', function() {
    state = ui.data('state');
    state['temp'] = parseFloat(this.value);
    ui.data('state', state);
    deviceSet(device_id, 'temp', state['temp']);
    console.log(this.value);
  });

  $(div).append(ui);
  componentHandler.upgradeAllRegistered();

  this.update = function(state) {
    ui.find('.slider-t').get(0).MaterialSlider.change(state['temp']);
    ui.find('.label').text(state['temp'].toFixed(1));
    ui.data('state', state);
  };

  this.update(state);

}
