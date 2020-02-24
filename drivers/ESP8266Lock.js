var http = require('http');

function ESP8266Lock(ip) {

  this.deviceType = 'ESP8266Lock';

  let that = this;
  this.actions = {
    "lock": function() {
      that.locked = 0;
    },
    "unlock": function() {
      that.locked = 1;
    }
  };

  this.properties = {
    'locked': {
      'type': 'binary'
    } 
  }

  var state = {'locked': 1};

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
          'path': '/lock/1'
        }
        var req = http.request(options, null);
        req.on('error', function(err) {
          console.log(err);
        });
        req.end();
        state['locked'] = 1;
      } else {
        options = {
          'host': ip,
          'path': '/lock/0'
        }
        var req = http.request(options, null);
        req.on('error', function(err) {
          console.log(err);
        });
        req.end();
        state['locked'] = 0;
      }
    }
  });
}

module.exports = function(params) {
  
  return new ESP8266Lock(params['ip']);

}
 
