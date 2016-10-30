module.exports = function(res) {

  var parser = require('vdata-parser');

  parser.fromFile(__dirname + '/Calendar.ics', function (err, data) {
    if (err) throw err;
    var events = data.VCALENDAR.VEVENT;
    var cEvents = [];
    for (var i = 0; i < events.length; i++) {
      var sDate = dateConverter(events[i].DTSTART.value);
      var eDate = dateConverter(events[i].DTEND.value);
      var title = events[i].SUMMARY
      var location = '';
      title = title.substring(title.indexOf("-") + 1);
      if (title.indexOf('/') > -1) {
        title = title.substring(0, title.indexOf('/'));
      }
      if (title.indexOf('IL') > -1) {
        title = title.substring(0, title.indexOf('IL'));
      }
      if (title.indexOf('(') > -1) {
        title = title.substring(0, title.indexOf('('));
      }
      if (events[i].hasOwnProperty('LOCATION')) {
        location = events[i].LOCATION;
      }
      var event = {
        title: title,
        start: sDate,
        end: eDate,
        location: location
      }
      cEvents.push(event);
    }

    res.send(cEvents);
  });

  function dateConverter(string) {
    var y = string.substr(0, 4);
    var mo = string.substr(4, 2);
    var d = string.substr(6, 2);
    var h = string.substr(9, 2);
    var m = string.substr(11, 2);
    return y + '-' + mo + '-' + d + 'T' + h + ':' + m + ':00';
  }
}

