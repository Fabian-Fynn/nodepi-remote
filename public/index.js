function render() {
  $('.property').remove();
  $('.add-btn').remove();

  if(hasOwnProperty.call(data, 'accessDenied')) {
    $('#property-wrapper').html('');
    $('#property-wrapper').append('<p> Guest remote is currently deactivated. </p>');
    return;
  }

  if ('sha' in data) {
    $('#dev-footer').html('commit: ' + data.sha);
  }

  if (data['devfooter']) {
    $('#dev-footer').show();
  }

  const keys = [];

  for (let key in data) {
    keys.push(key);
  }
  keys.sort();

  keys.forEach(function(key) {
    $('#properties').append('<div class="property" id="' + key +'">');
    $('#' + key).append('<input class="key" type="text" disabled="true" value="' + key + '">');
    $('#' + key).append('<input class="value" type="text" disabled="true" value="' + data[key] + '">');
    if (key === 'maximize' || key === 'light' || key === 'allowguest' || key === 'hidemenu' || key === 'mood') {
      if (data[key] === true) {
        $('#toggle-' + key).addClass('active');
      } else {
        $('#toggle-' + key).removeClass('active');
      }
      if (key === 'hidemenu') {
        if (data[key] === true) {
          $('.menu').addClass('closed');
        } else {
          $('.menu').removeClass('closed');
        }
      }
      if (key === 'mood') {
        $('.rm-Dashboard_Tile-toggleMood').removeClass('active');
        if (data[key] !== 'false') {
          $('#toggle-' + data[key]).addClass('active');
        }
      }
    }
  });

  $('#toggle-light').css('background-color', 'rgb(' + $('#led .value').val() + ')');

  if (player) {
    processVideoProperties();
  }
}

function renderStats() {
  //Light on off
  var oldDate = '';
  $('#statistics').append('<table class="rm-Dashboard_PopupStat-lightSwitch">');
  for (key in stats) {
    var date = new Date(stats[key].createdAt);
    var dateString = date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
    var action = (stats[key].turnOn)? 'ON':'OFF';

    if(oldDate != dateString && oldDate !== '') {
      $('#statistics').append('<tr class="rm-Dashboard_PopupStat-tuple"><td>----</td><td>------</td><tr>');
    }
    oldDate = dateString;
    $('#statistics').append('<tr class="rm-Dashboard_PopupStat-tuple"><td>' + dateString + '</td><td>' + action + '</td></tr>');
  };
    $('#statistics').append('</table>');
}

function getColorWheel(width){
  window.cw = Raphael.colorwheel($("#colorWheel"),width/1.80, 200);
  window.cw.input($("#color-input")[0]);
  window.cw.color('000000');
  window.cw.onchange(updateColor);
  window.cw.ondrag(null, saveProperties);

  var led = localStorage.getItem('led');
  if(led) {
    const rgb = $.map(led.split(','), function(value) {
      return parseInt(value, 10);
    });

    updateColor({r: rgb[0], g: rgb[1], b: rgb[2]});
    window.cw.color(rgbToHex(rgb));
  }
}

function updateColor(color) {
  const r = (~~color.r);
  const g = (~~color.g);
  const b = (~~color.b);
  const rgb = r + ',' + g + ',' + b;
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  const colr = (yiq >= 128) ? 'black' : 'white';

  localStorage.setItem('colr', colr);
  $('#led .value').val(rgb);
  $('#color-input').css('color', colr);
  $('.fc-event').css('background-color', 'rgb(' + rgb + ')');
  $('.fc-event').css('color', colr);
}
