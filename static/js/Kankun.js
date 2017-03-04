function Kankun(device_id, label, state, div) {

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

  d_actions.append(action);
  ui.append(d_title);
  ui.append(d_actions);

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
