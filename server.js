var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var jsonfile = require('jsonfile');
var stateFile = 'data.json';
var bodyParser = require('body-parser');
var secrets = require('./config/secrets.js');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/remote', function(req, res) {
  if(authenticated(req.query['auth-key'])) {
    res.sendFile(path.join(__dirname + '/public/remote.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }

});

app.get('/set', function(req, res) {
  if(authenticated(req.query['auth-key'])) {
    res.sendFile(path.join(__dirname + '/public/set.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }
});

app.get('/API/data', function(req, res) {
  if(authenticated(req.query['auth-key'])) {
    jsonfile.readFile(stateFile, function(err, obj) {
        res.send(obj);
    });
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }
});

app.post('/API/set', jsonParser, function(req, res) {
  if(authenticated(req.query['auth-key'])) {
    jsonfile.writeFile(stateFile, req.body, function(err) {
      if(err) {
        console.log(err);
      } else {
        res.send(req.body);
      }
    });
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }

});

function authenticated(token) {
  if (token === secrets.token) {
    return true;
  }
    return false;
}

http.listen(9900, function() {
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:9900');
});

