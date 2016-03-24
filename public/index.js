function render() {
  $('.property').remove();
  $('.add-btn').remove();

  if(hasOwnProperty.call(data, 'accessDenied')) {
    $('#property-wrapper').html('');
    $('#property-wrapper').append('<p> Guest remote is currently deactivated. </p>');
    return;
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

  $('#flash-toggle').click(function(){
    if( $('#flash .value').val() == "true" ) {
      $('#flash .value').val("false");
      $(this).removeClass('active');
    } else if( $('#flash .value').val() == "false" ) {
      $('#flash .value').val("true");
      $(this).addClass('active');
    }
    saveProperties();
  });

  $('#light-toggle').click(function(){
    if( $('#light .value').val() == "true" ) {
      $('#light .value').val("false");
      $(this).removeClass('active');
    } else if( $('#light .value').val() == "false" ) {
      $('#light .value').val("true");
      $(this).addClass('active');
    }
    saveProperties();
  });

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
