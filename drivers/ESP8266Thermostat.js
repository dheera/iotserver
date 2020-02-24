var http = require('http');

function ESP8266Thermostat(ip) {

  this.deviceType = 'ESP8266Thermostat';

  this.properties = {
    'temp': {
      'type': 'linear'
    } 
  }

  var state = {'temp': 21.0};

  Object.defineProperty(this, 'temp', {
    get: function() {
      if('temp' in state) {
        return state['temp'];
      }
    },
    set: function(value) {
      if(value) {
        sanitizedValue = parseFloat(value);
        options = {
          'host': ip,
          'path': '/temp/' + parseFloat(value).toFixed(1)
        }
        var req = http.request(options, null);
        req.on('error', function(err) {
          console.log(err);
        });
        req.end();
        state['temp'] = sanitizedValue;
      }
    }
  });
}

module.exports = function(params) {
  
  return new ESP8266Thermostat(params['ip']);

}
 
