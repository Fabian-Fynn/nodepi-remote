function componentToHex(c) {
  var hex = parseInt(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  return componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}


//Youtube player
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-placeholder', {
    width: 600,
    height: 400,
    videoId: 'ZW6NmUsok2c',
    playerVars: {
      iv_load_policy: 3,
      autoplay: 1,
      cc_load_policy: 0,
      enablejsapi: 1,
      loop: 1,
      modestbranding: 1,
      showinfo: 0
    },
    events: {
      onReady: initialize
    }
  });
}


function initialize(){
  player.setVolume(100);
  player.setPlaybackQuality("hd1080");
  player.addEventListener("onStateChange", "playerStateChanged");
  player.currentVideo = "ZW6NmUsok2c";
}

function playerStateChanged(state) {
  if(state.data === 0){
  }
};

function changeVideo(videoId) {
  player.loadVideoById({"videoId": videoId});
};

function processVideoProperties() {
  if(data.currentvideo !== player.currentVideo) {
    player.loadVideoById(data.currentvideo);
    player.currentVideo = data.currentvideo;
  }
  if(data.mute && !player.isMuted()) {
    player.mute();
  } else if(data.mute !== true && player.isMuted()) {
    player.unMute();
  }
};
