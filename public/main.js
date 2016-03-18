var data;

$('#save-properties').click(function(){
  saveProperties();
});

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

function addProperty() {
  if( $('#new-property .key').val() !== '') {
    $('#new-property .key').attr('disabled', true);
    var newKey = $('#new-property .key').val();
    $('#new-property').attr('id', newKey);

    $('#properties').append('<div class="property" id="new-property">');
    $('#new-property').append('<input class="key" type="text" value="" placeholder="key">');
    $('#new-property').append('<input class="value" type="text" placeholder="value">');
    $('#new-property').append('<button class="false"> 0 </button>');
    $('#new-property').append('<button class="true"> 1 </button>');
    $('#new-property').append('<button class="remove-btn"> X </button>');

    $('.remove-btn').click(function(e){
      removeProperty(e.target.parentElement.id);
    });

    $('.false, .true').click(function(e){
      $('#' + e.target.parentElement.id + ' .value').val(e.target.className);
    });
  }
}

function removeProperty(key) {
  var result = confirm('Do you really want to remove the property ' + key + '?');
  if(result === true) {
    delete data[key];
    $('#' + key).remove();
  }
}

function saveProperties() {
  var newData = {};
  $('.property').each(function(index){
    var key, value;

    $.each($(this)[0].children, function(idx){
      if( $(this).is('.key') ) {
        key = $(this).val();
      } else if( $(this).is('.value') ) {
        value = $(this).val();
      }
    });

    if( key !== '' && key !== undefined) {
      if( value === '' || value === undefined) {
        value = null;
      }

      if( typeof value === string) {
        value = value.toLowerCase();
      }

      if( value === 'true' ) {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      key = key.toLowerCase();
      newData[key] = value;
    }
  });

  data = newData;

  $.ajax({
    type: "POST",
    url: "/API/set",
    // The key needs to match your method's input parameter (case-sensitive).
   data: JSON.stringify(data),
   contentType: "application/json; charset=utf-8",
   dataType: "json",
   success: function(data){
     showAlert('success', 'Saved.');
   },
   failure: function(errMsg) {
     showAlert('error', errMsg);
   }
 });
}

function showAlert(type, msg){
  if(type === 'hidden') {
    $('#alert').removeClass();
  } else {
    $('#alert').addClass(type);
    $('#alert').html(msg);

    setTimeout(function(){
      showAlert('hidden');
    }, 5000);
  }
}

(function(){
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      if(xhttp.responseText !== '') {
        data = JSON.parse(xhttp.responseText);
      } else {
        data = {};
      }
      render();
    }
  };

  xhttp.open("GET", "/API/data", true);
  xhttp.send();
})();

