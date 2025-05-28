var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      height: 2*315,
      width: 2*560,
      videoId: '8nQRnTSDwLs',
      playerVars: {
        start: 311,  // 5:11
        end: 322,    // 5:22
        autoplay: 1,
        controls: 0,
        modestbranding: 1,
        mute: 1,
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  }

  function onPlayerStateChange(event) {
    // When video reaches end time, seek back to start
    if (event.data == YT.PlayerState.PLAYING) {
      checkTime();
    }
  }

  function checkTime() {
    if (player.getCurrentTime() >= 322) {
      player.seekTo(311);
    }
    setTimeout(checkTime, 500);
  }