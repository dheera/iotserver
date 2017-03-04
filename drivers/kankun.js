var http = require('http');

function Kankun(ip) {

  this.deviceType = 'Kankun';

  this.properties = {
    'power': {
      'type': 'binary'
    } 
  }

  var state = {'power': 0};

  Object.defineProperty(this, 'power', {
    get: function() {
      if('power' in state) {
        return state['power'];
      }
    },
    set: function(value) {
      if(value) {
        options = {
          'host': ip,
          'path': '/cgi-bin/1'
        }
        var req = http.request(options, null);
        req.end();
        state['power'] = 1;
      } else {
        options = {
          'host': ip,
          'path': '/cgi-bin/0'
        }
        var req = http.request(options, null);
        req.end();
        state['power'] = 0;
      }
    }
  });
}

module.exports = function(params) {
  
  return new Kankun(params['ip']);

}
 
