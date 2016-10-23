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
//    console.log(key);
    $('#properties').append('<div class="property" id="' + key +'">');
    $('#' + key).append('<input class="key" type="text" disabled="true" value="' + key + '">');
    $('#' + key).append('<input class="value" type="text" disabled="true" value="' + data[key] + '">');
    if (key === 'maximize' || key === 'light' || key === 'allowguest' || key === 'hidemenu') {
      if (data[key] === true) {
        $('#toggle-' + key).addClass('active');
      }
      if (key === 'hidemenu') {
        if (data[key] === true) {
          $('.menu').toggleClass('closed');
        }
      }
    }
  });

  $('#toggle-light').css('background-color', 'rgb(' + $('#led .value').val() + ')');
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

  $('#led .value').val(rgb);
  $('#color-input').css('color', colr);
}
