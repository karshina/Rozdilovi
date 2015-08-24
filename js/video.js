$(document).ready(function($) {
  var $window = $(window)
  var $container = $('.video-container')
  var $play = $('#play')
  var $content = $('.video-content')
  var $span = $('.video-span')

  var player

  $play.on('click', function () {
    var src = getSrc()
    if (!src) return
    player = new YT.Player('player', {
      height: $window.height(),
      width: $window.width(),
      playerVars: { 'autoplay': 1, 'fs': 0,'showinfo':0,'color':'white','disablekb': 1},
      videoId: 'M7lc1UVf-VE',
      events: {
        'onReady': function(e) {
          e.target.playVideo()
        },
        'onStateChange': function(e) {
          if (e.data == YT.PlayerState.PLAYING) {
            $content.addClass('none')
          }
          else {
            $span.html(player.getDuration())
            $content.removeClass('none')
          }
        },
      }
    });
    $container.removeClass('none')
  })
})