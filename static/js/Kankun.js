function Kankun(name, device_id, attrs) {
  d = $('<div></div>');
  d_title = $('  <div class="device-title">' + name + '</div>');
  d_actions = $('<div class="device-actions"></div>');
  d_actions.append('<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch-' + device_id + '"><input type="checkbox" id="switch-' + device_id + '" class="mdl-switch__input" checked><span class="mdl-switch__label"></span></label>');
  d.append(d_title);
  d.append(d_actions);
  return d;
}

