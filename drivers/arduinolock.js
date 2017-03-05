var http = require('http');

function ArduinoLock(ip) {

  this.deviceType = 'ArduinoLock';

  this.properties = {
    'locked': {
      'type': 'binary'
    } 
  }

  var state = {'locked': 0};

  Object.defineProperty(this, 'locked', {
    get: function() {
      if('locked' in state) {
        return state['locked'];
      }
    },
    set: function(value) {
      if(value) {
        options = {
          'host': ip,
          'path': '/arduino/lock/1'
        }
        var req = http.request(options, null);
        req.end();
        state['locked'] = 1;
      } else {
        options = {
          'host': ip,
          'path': '/arduino/lock/0'
        }
        var req = http.request(options, null);
        req.end();
        state['locked'] = 0;
      }
    }
  });
}

module.exports = function(params) {
  
  return new ArduinoLock(params['ip']);

}
 
