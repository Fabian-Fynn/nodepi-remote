function render() {
  $('.property').remove();
  $('.add-btn').remove();

  for(var key in data) {
    $('#properties').append('<div class="property" id="' + key +'">');
    $('#' + key).append('<input class="key" type="text" disabled="true" value="' + key + '">');
    $('#' + key).append('<input class="value" type="text" value="' + data[key] + '">');
    $('#' + key).append('<button class="false"> 0 </button>');
    $('#' + key).append('<button class="true"> 1 </button>');
    $('#' + key).append('<button class="remove-btn"> X </button>');
  };

  $('#property-wrapper').append('<button class="add-btn"> + </button>');

  $('.add-btn').click(function(){
    addProperty();
  });

  $('.remove-btn').click(function(e){
    removeProperty(e.target.parentElement.id);
  });

  $('.false, .true').click(function(e){
    $('#' + e.target.parentElement.id + ' .value').val(e.target.className);
  });
}
