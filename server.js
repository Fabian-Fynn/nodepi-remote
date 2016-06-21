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

app.get('/guest-remote', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/guest-remote.html'));
});

app.get('/set', function(req, res) {
  if(authenticated(req.query['auth-key'])) {
    res.sendFile(path.join(__dirname + '/public/set.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }
});

app.get('/API/toggle-light', function(req, res) {
  if (authenticated(req.query['auth-key'])) {
    jsonfile.readFile(stateFile, function(err, obj) {
      if (err){
        console.log(err);
        res.send(err);
      } else {
        console.log(obj);
        if (obj.properties.light) {
          obj.properties.light = false;
        } else {
          obj.properties.light = true;
        }

        jsonfile.writeFile(stateFile, obj, function(err) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            res.send('OK');
          }
        });
      }
    });
  }
});

app.get('/API/data', function(req, res) {
  if(authenticated(req.query['auth-key'])) {
    jsonfile.readFile(stateFile, function(err, obj) {
      if(err){
        console.log(err);
      } else {
        res.send(obj.properties);
      }
    });
  } else {
    jsonfile.readFile(stateFile, function(err, obj) {
      var properties = obj.properties;
      var guestProperties = obj.guestProperties;
      var approvedProperties = {'accessDenied': true};

      if(properties.allowguest === true) {
        approvedProperties = filterProperties(properties, guestProperties);
      }
      res.send(approvedProperties);
    });
  }
});

app.post('/API/set', jsonParser, function(req, res) {
  try {
    if (req.body.allowguest === undefined) {
      throw 500;
    }
    if(authenticated(req.query['auth-key'])) {
      jsonfile.readFile(stateFile, function(err, obj) {
        if(err) {
          console.log(err);
        } else {
          obj.properties = req.body;

          jsonfile.writeFile(stateFile, obj, function(err) {
            if(err) {
              console.log(err);
            } else {
              res.send(obj);
            }
          });
        }
      });
    } else {
        jsonfile.readFile(stateFile, function(err, obj) {
          if(obj.properties.allowguest === true) {
            for(var i = 0; i < obj.guestProperties.length; i++){
              var key = obj.guestProperties[i];
              obj.properties[key] = req.body[key];
            }

            jsonfile.writeFile(stateFile, obj, function(err) {
              if(err) {
                console.log(err);
              } else {
                res.send(obj);
              }
            });
        } else {
          res.status(423).send('Guest access was deactivated!');
        }
      });
    }
  } catch (err) {
    res.status(500).send('Something went wrong!');
    console.log(err);
    console.log(req.body);
  }
});

function authenticated(token) {
  if (token === secrets.token) {
    return true;
  }
    return false;
}

function filterProperties(properties, guestProperties) {
  var result = {};
  for(var i = 0; i < guestProperties.length; i++) {
    var key = guestProperties[i];
    if(hasOwnProperty.call(properties, key)) {
      result[key] = properties[key];
    }
  }
  return result;
}

http.listen(9900, function() {
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:9900');
});

