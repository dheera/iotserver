var http = require('http');

function Kankun(ip) {

  this.deviceType = 'Kankun';

  let that = this;

  this.actions = {
    "on": function() { that.power = 1; },
    "off": function() { that.power = 0; }
  }

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
        req.on('error', (err) => {
          console.log("error", err);
        });
        req.on('response', (res) => {
          if(res.statusCode === 200) state['power'] = 1;
        });
        req.end();
        // state['power'] = 1;
      } else {
        options = {
          'host': ip,
          'path': '/cgi-bin/0'
        }
        var req = http.request(options, null);
        req.on('error', (err) => {
          console.log("error", err);
        });
        req.on('response', (res) => {
          if(res.statusCode === 200) state['power'] = 0;
        });
        req.end();
	// state['power'] = 0;
      }
    }
  });
}

module.exports = function(params) {
  
  return new Kankun(params['ip']);

}
 
