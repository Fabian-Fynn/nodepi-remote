var data;
var stats;

$('#save-properties').click(function () {
  saveProperties();
});

$('#toggle-hidemenu').click(function (el) {
  $(this).toggleClass('active');
  $('.menu').toggleClass('closed');
  if ($('#hidemenu .value').val() !== 'false') {
    $('#hidemenu .value').val('false');
  } else if ($('#hidemenu .value').val() === 'false') {
    $('#hidemenu .value').val('true');
  }
  saveProperties();
});

$('#toggle-light').click(function (el) {
  $(this).toggleClass('active');
  $(this).css('background-color', 'rgb(' + $('#led .value').val() + ')');
  if ($('#light .value').val() !== "false") {
    $('#light .value').val("false");
  } else if ($('#light .value').val() === "false") {
    $('#light .value').val("true");
  }
  saveProperties();
});

$('#toggle-maximize').click(function () {
  if ($(this).hasClass('active')) {
    location.reload();
  } else {
    $(this).addClass('active');
    var elem = document.getElementById('fullscreen'); // Make the body go full screen.
    requestFullScreen(elem);
  }
});

$('#toggle-colorPicker').click(function (ev) {
  ev.stopPropagation();
  $('#colorWheelContainer').toggleClass('active');
});

$('#toggle-calendar').click(function () {
  $('.rm-Dashboard_Popup').addClass('active');
  $('.rm-Dashboard_Popup-calendar').addClass('active');
  $('.rm-Dashboard_Popup-calendar').show();
});

$('#close-popup').click(function () {
  $('.rm-Dashboard_Popup').removeClass('active');
  $('.rm-Dashboard_Popup-calendar').hide();
  $('.rm-Dashboard_Popup-statistics').hide();
});

$('#toggle-statistics').click(function () {
  $('.rm-Dashboard_Popup').addClass('active');
  $('.rm-Dashboard_Popup-calendar').hide();
  $('.rm-Dashboard_Popup-statistics').show();
});

$('#close-statistics').click(function () {
  $('.rm-Dashboard_Popup').removeClass('active');
  $('.rm-Dashboard_Popup-statistics').removeClass('active');
});

$('#toggle-fire').click(function (el) {
  $('.rm-Dashboard_Tile-toggleMood').removeClass('active');
  if ($('#mood .value').val() === 'fire') {
    $(this).removeClass('active');
    $('#mood .value').val('false');
    $('#moodchange .value').val('true');
  } else if ($('#mood .value').val() !== 'fire') {
    $(this).addClass('active');
    $('#mood .value').val('fire');
    $('#moodchange .value').val('true');
  }
  saveProperties();
});

$('#toggle-beach').click(function (el) {
  $('.rm-Dashboard_Tile-toggleMood').removeClass('active');
  if ($('#mood .value').val() === 'beach') {
    $(this).removeClass('active');
    $('#mood .value').val('false');
    $('#moodchange .value').val('true');
  } else if ($('#mood .value').val() !== 'beach') {
    $(this).addClass('active');
    $('#mood .value').val('beach');
    $('#moodchange .value').val('true');
  }
  saveProperties();
});

$('#toggle-sunset').click(function (el) {
  $('.rm-Dashboard_Tile-toggleMood').removeClass('active');
  if ($('#mood .value').val() === 'sunset') {
    $(this).removeClass('active');
    $('#mood .value').val('false');
    $('#moodchange .value').val('true');
  } else if ($('#mood .value').val() !== 'sunset') {
    $(this).addClass('active');
    $('#mood .value').val('sunset');
    $('#moodchange .value').val('true');
  }
  saveProperties();
});

$('#toggle-river').click(function (el) {
  $('.rm-Dashboard_Tile-toggleMood').removeClass('active');
  if ($('#mood .value').val() === 'river') {
    $(this).removeClass('active');
    $('#mood .value').val('false');
    $('#moodchange .value').val('true');
  } else if ($('#mood .value').val() !== 'river') {
    $(this).addClass('active');
    $('#mood .value').val('river');
    $('#moodchange .value').val('true');
  }
  saveProperties();
});

$('#toggle-mute').click(function (el) {
  if ($('#mute .value').val() === 'true') {
    $(this).removeClass('active');
    $('#mute .value').val('false');
  } else if ($('#mute .value').val() === 'false') {
    $(this).addClass('active');
    $('#mute .value').val('true');
  }
  saveProperties();
});

$('.rm-Dashboard_Tile-preset').click(function (el) {
  var id = $(this).prop('id');
  $('#led .value').val($('#color-' + id + ' .value').val());
  saveProperties();
});

$('.rm-Dashboard').click(function (e) {
  if (e.target.id !== '#colorWheelContainer' && $('#colorWheelContainer').hasClass('active')) {
    $('#colorWheelContainer').removeClass('active');
  }
});

$('#color-input').change(function () {
  saveProperties();
});

$('#toggle-allowguest').click(function () {
  if ($('#allowguest .value').val() !== "false") {
    $('#allowguest .value').val("false");
    $(this).removeClass('active');
  } else if ($('#allowguest .value').val() === "false") {
    $('#allowguest .value').val("true");
    $(this).addClass('active');
  }
  saveProperties();
});

function addProperty() {
  if ($('#new-property .key').val() !== '') {
    $('#new-property .key').attr('disabled', true);
    var newKey = $('#new-property .key').val();
    $('#new-property').attr('id', newKey);

    $('#properties').append('<div class="property" id="new-property">');
    $('#new-property').append('<input class="key" type="text" value="" placeholder="key">');
    $('#new-property').append('<input class="value" type="text" placeholder="value">');
    $('#new-property').append('<button class="false"> 0 </button>');
    $('#new-property').append('<button class="true"> 1 </button>');
    $('#new-property').append('<button class="remove-btn"> X </button>');

    $('.remove-btn').click(function (e) {
      removeProperty(e.target.parentElement.id);
    });

    $('.false, .true').click(function (e) {
      $('#' + e.target.parentElement.id + ' .value').val(e.target.className);
    });
  }
}

function removeProperty(key) {
  var result = confirm('Do you really want to remove the property ' + key + '?');
  if (result === true) {
    delete data[key];
    $('#' + key).remove();
  }
}

function saveProperties() {
  var token = getParameterByName('auth-key');
  var newData = {};
  $('.property').each(function (index) {
    var key, value;

    $.each($(this)[0].children, function (idx) {
      if ($(this).is('.key')) {
        key = $(this).val();
      } else if ($(this).is('.value')) {
        value = $(this).val();
      }
    });

    if (key !== '' && key !== undefined) {
      if (value === '' || value === undefined) {
        value = null;
      }

      //if( typeof value === 'string') {
      //  value = value.toLowerCase();
      //}

      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      if (typeof key === 'string') {
        key = key.toLowerCase();
      }

      newData[key] = value;
      localStorage.setItem(key, value);
    }
  });

  $('#toggle-light').css('background-color', 'rgb(' + $('#led .value').val() + ')');

  data = newData;

  $.ajax({
    type: "POST",
    url: "/API/set?auth-key=" + token,
    // The key needs to match your method's input parameter (case-sensitive).
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      //showAlert('success', 'Saved.');
    },
    failure: function (errMsg) {
      showAlert('error', errMsg);
    },
    error: function (err) {
      showAlert('error', err.responseText);
      setTimeout(function () {
        location.reload();
      }, 2000);
    }
  });
}

function showAlert(type, msg) {
  if (type === 'hidden') {
    $('#alert').removeClass();
  } else {
    $('#alert').addClass(type);
    $('#alert').html(msg);

    setTimeout(function () {
      showAlert('hidden');
    }, 5000);
  }
}

function getParameterByName(name) {
  var url = window.location.href;
  url = url.toLowerCase();
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function requestData(token, req) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var dat;
      if (xhttp.responseText !== '') {
        dat = JSON.parse(xhttp.responseText);
      } else {
        dat = {};
      }
      if (req === 'data') {
        data = dat;
        render();
      } else if (req === 'stats') {
        stats = dat;
        renderStats();
      }
    }
  };

  var url;
  if (req === 'data') {
    url = "/API/data?auth-key=" + token;
  } else if (req === 'stats') {
    url = "/API/statistics?auth-key=" + token;
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}

function requestFullScreen(element) {
  // Supports most browsers and their versions.
  var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

  if (requestMethod) { // Native full screen.
    requestMethod.call(element);
  } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");
    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }
}

(function () {
  var token = getParameterByName('auth-key');
  var tokenQuery = '';

  if (token !== null) {
    tokenQuery = '?auth-key=' + token;
  }

  requestData(token, 'data');
  requestData(token, 'stats');

  $('.menu').append('<a href="/' + tokenQuery + '"><div class="logo"></div></a><ul><a href="/guest-remote' + tokenQuery + '"><li>Guest Remote</li></a><a href="/remote' + tokenQuery + '"><li>Remote Control</li></a><a href="/mood' + tokenQuery + '"><li>Mood Display</li></a><a href="/set' + tokenQuery + '"><li>Set Properties</li></a></ul>');
})();

