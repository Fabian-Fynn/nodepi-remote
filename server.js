var express = require('express');
var app = express();
var http = require('http').Server(app);

app.get('/', function(req, res) {
  res.send('Hello World');
});

http.listen(9900, function() {
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:9900');
});
