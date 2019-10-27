var express = require('express');
var app = express();
var http = require('http').Server(app);
var request = require('request');
var path = require('path');
var jsonfile = require('jsonfile');
var stateFile = 'data.json';
var bodyParser = require('body-parser');
var secrets = require('./config/secrets.js');
var Logger = require('./logger.js');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

let events;

app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/events', function (req, res) {
  res.send(events);
});

app.get('/remote', function (req, res) {
  requestLatestCommit(res);
  if (authenticated(req.query['auth-key'])) {
    res.sendFile(path.join(__dirname + '/public/remote.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }
});

app.get('/mood', function (req, res) {
  requestLatestCommit(res);
  res.sendFile(path.join(__dirname + '/public/mood.html'));
});

app.get('/guest-remote', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/guest-remote.html'));
});

app.get('/set', function (req, res) {
  if (authenticated(req.query['auth-key'])) {
    res.sendFile(path.join(__dirname + '/public/set.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/unauthorized.html'));
  }
});

app.get('/API/toggle-light', function (req, res) {
  if (authenticated(req.query['auth-key'])) {
    jsonfile.readFile(stateFile, function (err, obj) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if (obj.properties.light) {
          obj.properties.light = false;
          Logger.logLightChange({ on: false, off: true, trigger: 'API' });
        } else {
          obj.properties.light = true;
          Logger.logLightChange({ on: true, off: false, trigger: 'API' });
        }

        jsonfile.writeFile(stateFile, obj, function (err) {
          if (err) {
            console.log(err);
            res.send(err);
          } else {
            console.log(Logger.getLightChanges(null));
            res.send('OK');
          }
        });
      }
    });
  }
});

app.get('/API/data', function (req, res) {
  if (authenticated(req.query['auth-key'])) {
    jsonfile.readFile(stateFile, function (err, obj) {
      if (err) {
        console.log(err);
      } else {
        res.send(obj.properties);
      }
    });
  } else {
    jsonfile.readFile(stateFile, function (err, obj) {
      var properties = obj.properties;
      var guestProperties = obj.guestProperties;
      var approvedProperties = { 'accessDenied': true };

      if (properties.allowguest === true) {
        approvedProperties = filterProperties(properties, guestProperties);
      }
      res.send(approvedProperties);
    });
  }
});

app.post('/API/set', jsonParser, function (req, res) {
  try {
    //console.log(req.body);
    /*if (req.body.allowguest === undefined) {
      throw 500;
    }*/
    saveProperties(stateFile, req, res);
  } catch (err) {
    console.log('err', err);
    res.status(500).send('Something went wrong!');
  }
});

app.get('/API/statistics', function (req, res) {
  if (authenticated(req.query['auth-key'])) {
    Logger.getLightChanges(null, function (stats) {
      res.send(stats);
    });
  } else {
    res.status(403).send('Unauthorized');
  }
});

function saveProperties(stateFile, req, res) {
  jsonfile.readFile(stateFile, function (err, obj) {
    if (authenticated(req.query['auth-key'])) {
      obj.properties = req.body;
      if (obj.properties.light === true) {
        Logger.logLightChange({ on: true, off: false, trigger: 'dashboard' });
      } else if (obj.properties.light === false) {
        Logger.logLightChange({ on: false, off: true, trigger: 'dashboard' });
      }
      if (obj.properties.moodchange === true) {
        handleMoodChanges(obj, function (obje) {
          saveFile(stateFile, obje, res);
        });
      } else {
        saveFile(stateFile, obj, res);
      }
    } else if (obj.properties.allowguest === true) {
      for (var i = 0; i < obj.guestProperties.length; i++) {
        var key = obj.guestProperties[i];
        obj.properties[key] = req.body[key];
      }
      saveFile(stateFile, obj, res);
    } else {
      sendResponse(err, obj, res, { 'code': 423, msg: 'Guest access was deactivated!' });
    }
  });
};

function saveProperty(key, value, res) {
  jsonfile.readFile(stateFile, function (err, obj) {
    if (err) {
      sendResponse(err, null, res, null);
    } else {
      obj.properties[key] = value;
      saveFile(stateFile, obj, res, false);
    }
  });
};

function handleMoodChanges(obj, callback) {
  const props = obj.properties;
  const mood = props.mood;

  if (mood === false) {
    props.led = props.ledbackup;
    props.ledbackup = false;
    props.currentvideo = false;
  } else {
    if (props.ledbackup === false) {
      props.ledbackup = props.led;
    }
    props.led = props[`mood-${mood}-led`];
    props.currentvideo = props[`mood-${mood}-video`];
  }

  props.moodchange = false;

  callback(obj);
};

function saveFile(file, obj, res, respond) {
  jsonfile.writeFile(stateFile, obj, function (err) {
    if (respond !== false) {
      sendResponse(err, obj, res, { 'code': 200, 'msg': 'OK' });
    }
  });
};

function sendResponse(err, obj, res, status) {
  if (err) {
    console.log('err', err);
    res.status(500).send('Something went wrong!');
  } else if (status.code !== 200) {
    res.status(status.code).send(status.msg);
  } else {
    res.send(obj);
  }
};

function authenticated(token) {
  if (token === secrets.token) {
    return true;
  }
  return false;
}

function filterProperties(properties, guestProperties) {
  var result = {};
  for (var i = 0; i < guestProperties.length; i++) {
    var key = guestProperties[i];
    if (hasOwnProperty.call(properties, key)) {
      result[key] = properties[key];
    }
  }
  return result;
}

function requestLatestCommit(res) {
  var path = 'https://api.github.com/repos/Fabian-Fynn/nodepi-remote/git/refs/heads/master';

  makeApiRequest(path, res);
};

function makeApiRequest(path, res) {
  request({
    uri: path,
    method: 'GET',
    timeout: 10000,
    followRedirect: true,
    maxRedirects: 10,
    headers: { 'user-agent': 'node.js' }
  },
    function (err, resp, body) {
      if (err) {
        console.log(err);
      } else if (resp.statusCode === 403) {
        console.log(body);
      } else {
        saveProperty('sha', JSON.parse(body).object.sha, res);
      }
    });
};
http.listen(9900, function () {
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:9900');
});
