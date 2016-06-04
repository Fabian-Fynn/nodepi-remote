function render() {

  $('.property').remove();
  $('.add-btn').remove();

  if(hasOwnProperty.call(data, 'accessDenied')) {
    $('#property-wrapper').html('');
    $('#property-wrapper').append('<p> Guest remote is currently deactivated. </p>');
    return;
  }

  if ('led' in data) {
    const rgb = data['led'].split(',');
    window.cw.color(rgbToHex(rgb));
  }

  for(var key in data) {
    $('#properties').append('<div class="property" id="' + key +'">');
    $('#' + key).append('<input class="key" type="text" disabled="true" value="' + key + '">');
    $('#' + key).append('<input class="value" type="text" disabled="true" value="' + data[key] + '">');
    if(key === 'flash' || key === 'light' || key === 'allowguest') {
      if(data[key] === true) {
        $('#' + key + '-toggle').addClass('active');
      }
    }
  };

  $('#allowguest-toggle').click(function(){
    if( $('#allowguest .value').val() == "true" ) {
      $('#allowguest .value').val("false");
      $(this).removeClass('active');
    } else if( $('#allowguest .value').val() == "false" ) {
      $('#allowguest .value').val("true");
      $(this).addClass('active');
    }
    saveProperties();
  });
}

function updateColor(color) {
  const r = (~~color.r);
  const g = (~~color.g);
  const b = (~~color.b);
  const rgb = r + ',' + g + ',' + b;

  $('#led .value').val(rgb);
  saveProperties();
}
