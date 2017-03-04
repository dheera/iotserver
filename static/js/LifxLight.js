function LifxLight(device_id, label, state) {

  var d = $('<div></div>');
  d.addClass('device');
  d.addClass('device-' + device_id);
  d.data('name', label);
  d.data('device_id', device_id);
  d.data('state', state);

  d_title = $('  <div class="device-title">' + label + '</div>');

  d_actions = $('<div class="device-actions"></div>');

  action  = $('<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-' + device_id + '"><input type="checkbox" id="switch-' + device_id + '" class="mdl-switch__input" checked><span class="mdl-switch__label"></span></label>');
  action.find('input').bind('change', function() {
    deviceSet(device_id, 'power', this.checked ? 1 : 0);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="lifxlight-property-hue mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-h" min="0" max="360" value="' + state['color'][0] + '" step="1"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][0] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-s" min="0" max="100" value="' + state['color'][1] + '" step="1"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][1] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-v" min="0" max="100" value="' + state['color'][2] + '" step="1"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][2] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-k" min="2500" max="9000" value="' + state['color'][3] + '" step="100"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][3] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  d.append(d_title);
  d.append(d_actions);

  this.getUI = function() {
    return d;
  }

  this.update = function(state) {
    d.data('state', state);
    d.find('.lifxlight-property-hue').get(0).MaterialSlider.change(d.data('state')['color'][0]);
  };

}
