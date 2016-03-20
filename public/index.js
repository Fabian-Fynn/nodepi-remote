function render() {
  $('.property').remove();
  $('.add-btn').remove();

  for(var key in data) {
    $('#properties').append('<div class="property" id="' + key +'">');
    $('#' + key).append('<input class="key" type="text" disabled="true" value="' + key + '">');
    $('#' + key).append('<input class="value" type="text" disabled="true" value="' + data[key] + '">');
  };
}
