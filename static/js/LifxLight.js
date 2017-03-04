function LifxLight(device_id, label, state, div) {

  var ui = $('<div></div>');
  ui.addClass('device');
  ui.addClass('device-' + device_id);
  ui.data('name', label);
  ui.data('device_id', device_id);
  ui.data('state', state);

  d_title = $('  <div class="device-title">' + label + '</div>');

  d_actions = $('<div class="device-actions"></div>');

  action  = $('<label class="property-power mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-' + device_id + '"><input type="checkbox" id="switch-' + device_id + '" class="mdl-switch__input" checked><span class="mdl-switch__label"></span></label>');
  action.find('input').bind('change', function() {
    deviceSet(device_id, 'power', this.checked ? 1 : 0);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="property-hue mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-h" min="0" max="360" value="' + state['color'][0] + '" step="1"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][0] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="property-saturation mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-s" min="0" max="100" value="' + state['color'][1] + '" step="1"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][1] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="property-brightness mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-v" min="0" max="100" value="' + state['color'][2] + '" step="1"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][2] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  action = $('<p style="width:300px"><input class="property-kelvin mdl-slider mdl-js-slider" type="range" id="slider' + device_id + '-k" min="2500" max="9000" value="' + state['color'][3] + '" step="100"></p>');
  action.find('input').bind('input', function() {
    console.log(this.value);
    device = $(this).parents('.device');
    device_id = device.data('device_id');
    state = device.data('state');
    state['color'][3] = parseInt($(this).val());
    deviceSet(device_id, 'color', state['color']);
  });
  d_actions.append(action);
  ui.append(d_title);
  ui.append(d_actions);

  $(div).append(ui);
  componentHandler.upgradeAllRegistered();

  this.getUI = function() {
    return d;
  }

  this.update = function(state) {
    ui.data('state', state);
    if(ui.data('state')['power']===1) {
      ui.find('.property-power').get(0).MaterialSwitch.on();
    } else {
      ui.find('.property-power').get(0).MaterialSwitch.off();
    }
    ui.find('.property-hue').get(0).MaterialSlider.change(ui.data('state')['color'][0]);
    ui.find('.property-saturation').get(0).MaterialSlider.change(ui.data('state')['color'][1]);
    ui.find('.property-brightness').get(0).MaterialSlider.change(ui.data('state')['color'][2]);
    ui.find('.property-kelvin').get(0).MaterialSlider.change(ui.data('state')['color'][3]);
  };

  this.update(state);

}
