// foo
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const slack = require('./slack.js')();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/static'));
app.post('/slack', slack);

require('./socket-iot-v0.js')(app, io);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
