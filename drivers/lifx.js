var LifxClient = require('node-lifx').Client;
var client = new LifxClient();

client.init();

function LifxLight(ip) {

  this.deviceType = 'LifxLight';

  this.properties = {
    'power': {
      'type': 'binary'
    }, 
    'color': {
      'type': 'hsbk'
    }
  }

  var attrs = {'color': 'hsbk', 'power': 'binary'};
  var state = {'color': [0, 0, 0, 0], 'power': 0};

  var _light = client.light(ip);

  setInterval(function(_this) {
    if(!_light) {
      _light = client.light(ip);
    }
    _light.getState(function(error, data) {
      if(data) {
        state['color'] = [data['color']['hue'], data['color']['saturation'], data['color']['brightness'], data['color']['kelvin']];
        state['power'] = data['power'];
        
      }
    });
  }, 500, this);

  Object.defineProperty(this, 'power', {
    get: function() {
      if('power' in state) {
        return state['power'];
      }
    },
    set: function(value) {
      if(!_light) return;
      if(value) {
        _light.on();
      } else {
        _light.off();
      }
    }
  });
  Object.defineProperty(this, 'color', {
    get: function() {
      if('color' in state) {
        return state['color'];
      }
    },
    set: function(value) {
      if(!_light) return;
      if(value) {
        _light.color(value[0], value[1], value[2], value[3]);
      }
    }
  });
}

module.exports = function(params) {
  
  return new LifxLight(params['ip']);

}
 
