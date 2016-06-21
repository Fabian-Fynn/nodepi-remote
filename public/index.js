function render() {

  $('.property').remove();
  $('.add-btn').remove();

  if(hasOwnProperty.call(data, 'accessDenied')) {
    $('#property-wrapper').html('');
    $('#property-wrapper').append('<p> Guest remote is currently deactivated. </p>');
    return;
  }

  if ('led' in data) {
    const rgb = $.map(data['led'].split(','), function(value) {
      return parseInt(value, 10);
    });

    window.cw.color(rgbToHex(rgb));
    updateColor({r: rgb[0], g: rgb[1], b: rgb[2]});
  }

  const keys = [];

  for (let key in data) {
    keys.push(key);
  }
  keys.sort();

  keys.forEach(function(key) {
    console.log(key);
    $('#properties').append('<div class="property" id="' + key +'">');
    $('#' + key).append('<input class="key" type="text" disabled="true" value="' + key + '">');
    $('#' + key).append('<input class="value" type="text" disabled="true" value="' + data[key] + '">');
    if (key === 'flash' || key === 'light' || key === 'allowguest') {
      if (data[key] === true) {
        $('#' + key + '-toggle').addClass('active');
      }
      if (key === 'light') {
        if (data[key] === true) {
          $('#light-toggle').html('ON');
        } else {
          $('#light-toggle').html('OFF');
        }
      }
    }
  });

  $('#light-toggle').click(function(){
    if( $('#light .value').val() !== "false" ) {
      $('#light .value').val("false");
      $(this).html('OFF');
      $(this).removeClass('active');
    } else if( $('#light .value').val() === "false" ) {
      $('#light .value').val("true");
      $(this).html('ON');
      $(this).addClass('active');
    }
    saveProperties();
  });

  $('#allowguest-toggle').click(function(){
    if( $('#allowguest .value').val() !== "false" ) {
      $('#allowguest .value').val("false");
      $(this).removeClass('active');
    } else if( $('#allowguest .value').val() === "false" ) {
      $('#allowguest .value').val("true");
      $(this).addClass('active');
    }
    saveProperties();
  });

  $('#color-save').click(function(){
    saveProperties();
  });
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
