$(document).ready(function($) {
  var $window = $(window)
  var $container = $('.video-container')
  var $play = $('#play')
  var $body = $('body')
  var $content = $('.video-content')
  var $card = $('.video-content-main')
  var $span = $('.video-span')
  var $playerContent = $('.player-content')
  var $cross = $('.cross')
  var $simbol = $('.simbol')

  var player = {}

  $window.resize(function() {
    if (!player.h) return
    player.h.h.width = $window.width()
    player.h.h.height = $window.height()
  })

  $play.on('click', function () {
    var id = $play.attr('data-video-id')
    if (!id) return
    $body.addClass('overflow-hidden')
    player = new YT.Player('player', {
      height: $window.height(),
      width: $window.width(),
      playerVars: { 'autoplay': 1, 'fs': 0,'showinfo':0,'color':'white','disablekb': 1},
      videoId: id,
      events: {
        'onReady': function(e) {
          e.target.playVideo()
        },
        'onStateChange': function(e) {
          if (e.data == YT.PlayerState.PLAYING) {
            $content.addClass('none')
          }
          else if (e.data == YT.PlayerState.PAUSED) {
            $span.html(player.getCurrentTime())
            $content.removeClass('none')
          }
          else if (e.data == YT.PlayerState.ENDED) {
            closeIframe()
          }
        },
      }
    });
    $container.removeClass('none')
  })

  $(this).keydown(function(e) {
    if (e.which != 27) return
    closeIframe()
  })

  $cross.on('click', function () {
    closeIframe()
  })

  $simbol.on('click', function () {
    var $this = $(this),
      isActive = $this.hasClass('active')
    $simbol.removeClass('active')
    if (isActive) {
      $card.removeClass('pointer')
      $this.removeClass('active')
    }
    else {
      $card.addClass('pointer')
      $this.addClass('active')
    }
  })

  $card.on('click', function (event) {
    var simbol = $('.simbol.active').html()
    var style = "left: " + event.offsetX + "px; top: " + event.offsetY + "px"
    if (!simbol) return
    $(this).append( "<span class='card-simbol' style='"+style+"'>"+simbol+"</span>")
  })

  function closeIframe() {
    rozd.dropUI()
    rozd.updateUI()
    $body.removeClass('overflow-hidden')
    player = null
    $playerContent.html('<div id="player"></div>')
    $container.addClass('none')
    $content.addClass('none')
    $card.html('<span class="video-content-span">хочеться говорити тихо, щоби тебе ніхто не почув, а почувши – не зрозумів</span>')
  }
})
