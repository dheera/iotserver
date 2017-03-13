function LifxLight(device_id, label, state, div) {

  var ui = $('<div></div>');
  ui.addClass('device');
  ui.addClass('device-' + device_id);
  ui.data('name', label);
  ui.data('device_id', device_id);
  ui.data('state', state);

  d_header = $('<div class="device-lifxlight-header"></div>').appendTo(ui);
  d_header_title = $('<button class="device-lifxlight-header-button">' + label + '</button>').longpress(function() {
    $(this).parent().next().slideToggle();
  }, function() {
    $(this).toggleClass('is-on');
    deviceSet(device_id, 'power', $(this).hasClass('is-on')?1:0);
  }).appendTo(d_header);

  d_header_options = $('<div style="padding-top:10pt;padding-bottom:10pt;background:#202020;"></div>').hide().appendTo(ui);

  $('<div style="margin-top:10pt;margin-bottom:10pt;display:inline-block;font-size:14pt;text-align:center;width:10%;color:#ffffff;">H</div><div style="display:inline-block;width:90%;"><input class="slider-h mdl-slider mdl-js-slider" type="range" min="0" max="360" value="0" tabindex="0"></div>').appendTo(d_header_options).find('input').bind('input', function() {
    state = ui.data('state');
    state['color'][0] = parseInt(this.value);
    ui.data('state', state);
    deviceSet(device_id, 'color', state['color']);
    console.log(this.value);
  });
  $('<div style="margin-top:10pt;margin-bottom:10pt;display:inline-block;font-size:14pt;text-align:center;width:10%;color:#ffffff;">S</div><div style="display:inline-block;width:90%;"><input class="slider-s mdl-slider mdl-js-slider" type="range" min="0" max="100" value="0" tabindex="0"></div>').appendTo(d_header_options).find('input').bind('input', function() {
    state = ui.data('state');
    state['color'][1] = parseInt(this.value);
    ui.data('state', state);
    deviceSet(device_id, 'color', state['color']);
    console.log(this.value);
  });
  $('<div style="margin-top:10pt;margin-bottom:10pt;display:inline-block;font-size:14pt;text-align:center;width:10%;color:#ffffff;">B</div><div style="display:inline-block;width:90%;"><input class="slider-b mdl-slider mdl-js-slider" type="range" min="0" max="100" value="0" tabindex="0"></div>').appendTo(d_header_options).find('input').bind('input', function() {
    state = ui.data('state');
    state['color'][2] = parseInt(this.value);
    ui.data('state', state);
    deviceSet(device_id, 'color', state['color']);
    console.log(this.value);
  });
  $('<div style="margin-top:10pt;margin-bottom:10pt;display:inline-block;font-size:14pt;text-align:center;width:10%;color:#ffffff;">K</div><div style="display:inline-block;width:90%;"><input class="slider-k mdl-slider mdl-js-slider" type="range" min="2500" max="8500" value="0" tabindex="0"></div>').appendTo(d_header_options).find('input').bind('input', function() {
    state = ui.data('state');
    state['color'][3] = parseInt(this.value);
    ui.data('state', state);
    deviceSet(device_id, 'color', state['color']);
    console.log(this.value);
  });

  $(div).append(ui);
  componentHandler.upgradeAllRegistered();

  this.update = function(state) {
    ui.find('.slider-h').get(0).MaterialSlider.change(state['color'][0]);
    ui.find('.slider-s').get(0).MaterialSlider.change(state['color'][1]);
    ui.find('.slider-b').get(0).MaterialSlider.change(state['color'][2]);
    ui.find('.slider-k').get(0).MaterialSlider.change(state['color'][3]);
    ui.data('state', state);
    if(ui.data('state')['power']===1) {
      ui.find('button').addClass('is-on');
    } else {
      ui.find('button').removeClass('is-on');
    }
  };

  this.update(state);

}
