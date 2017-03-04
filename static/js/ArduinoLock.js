function ArduinoLock(name, device_id, attrs) {
  d = $('<div></div>');
  d_title = $('  <div class="device-title">' + name + '</div>');
  d_actions = $('<div class="device-actions"></div>');
  d_actions.append('<button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">lock_open</i></button>');
  d_actions.append('<button class="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored"><i class="material-icons">lock</i></button>');
  d.append(d_title);
  d.append(d_actions);
  return d;
}

