var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var jsonfile = require('jsonfile');
var stateFile = 'data.json';
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/', function(req, res) {
    res.send('Hello Root');
});

app.get('/set', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/API/data', function(req, res) {
    jsonfile.readFile(stateFile, function(err, obj) {
        res.send(obj);
    })
});

app.post('/API/set', jsonParser, function(req, res) {
  jsonfile.writeFile(stateFile, req.body, function(err) {
    if(err) {
      console.log(err);
    } else {
      res.send(req.body);
    }
  });
});


http.listen(9900, function() {
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:9900');
});

