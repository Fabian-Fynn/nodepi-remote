module.exports = function(res) {
//  console.log(res);

var parser = require('vdata-parser');

parser.fromFile(__dirname + '/Calendar.ics', function (err, data) {
  if (err) throw err;
  var events = data.VCALENDAR.VEVENT;
  var cEvents = [];
  for (var i = 0; i < events.length; i++) {
    var sDate = dateConverter(events[i].DTSTART.value);
    var eDate = dateConverter(events[i].DTEND.value);
    var title = events[i].SUMMARY
    title = title.substring(title.indexOf("-") + 1);
    if (title.indexOf('/') > -1) {
      title = title.substring(0, title.indexOf('/'));
    }
    if (title.indexOf('IL') > -1) {
      title = title.substring(0, title.indexOf('IL'));
    }
    var event = {
      title: title,
      start: sDate,
      end: eDate
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
/*var ical = require('ical')
, months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


  ical.fromURL('https://connect.fh-salzburg.ac.at/home/fhoffmann.mmt-m2016@fh-salzburg.ac.at/Calendar', {}, function(err, data) {
    var asdf = [];
    for (var k in data){
      if (data.hasOwnProperty(k)) {
         var ev = data[k]
         asdf.push(ev)
         console.log("Conference",
         ev.summary,
         'is in',
         ev.location,
         'on the', ev.start.getDate(), 'of', months[ev.start.getMonth()]);
       console.log(k);
      }
    }
    return res.send(asdf);
  });
*/
}

