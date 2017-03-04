function Kankun(device_id, label, state, div) {

  var ui = $('<div></div>');
  ui.addClass('device');
  ui.addClass('device-' + device_id);
  ui.data('name', label);
  ui.data('device_id', device_id);
  ui.data('state', state);

  d_header = $('<div class="device-row device-header"></div>').appendTo(ui);
  d_header_title = $('  <div class="device-header-title">' + label + '</div>').appendTo(d_header);
  d_header_actions = $('<div class="device-header-actions"></div>').appendTo(d_header);

  d_settings = $('<div class="device-row device-settings"></div>').appendTo(ui);
  d_settings_actions = $('<div class="device-settings-actions"></div>').appendTo(d_settings);

  action  = $('<label class="property-power mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-' + device_id + '"><input type="checkbox" id="switch-' + device_id + '" class="mdl-switch__input" checked><span class="mdl-switch__label"></span></label>');
  action.find('input').bind('change', function() {
    deviceSet(device_id, 'power', this.checked ? 1 : 0);
  });

  d_header_actions.append(action);

  $(div).append(ui);
  componentHandler.upgradeAllRegistered();

  this.getUI = function() {
    return ui;
  }

  this.update = function(state) {
    ui.data('state', state);
    if(ui.data('state')['power']===1) {
      ui.find('.property-power').get(0).MaterialSwitch.on();
    } else {
      ui.find('.property-power').get(0).MaterialSwitch.off();
    }
  };

  this.update(state);

}
