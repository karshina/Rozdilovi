$(document).ready(function($) {
  var $window = $(window)
  var $container = $('.video-container')
  var $play = $('#play')
  var $playGhost = $('#play-ghost')
  var $body = $('body')
  var $content = $('.video-content')
  var $card = $('#card')
  var $playerContent = $('.player-content')
  var $cross = $('.cross')
  var $closecard = $('#closecard')
  var $next = $('#next')
  var $prev = $('#prev')
  var $share = $('#share')
  
  var cards = [
    'img/card0.png',
    'img/card1.png',
    'img/card2.png',
    'img/card3.png',
    'img/card4.png',
    'img/card5.png',
    'img/card6.png',
    'img/card7.png',
    'img/card8.png'
    ]
  var currentCard
  var player = {}
  var text = {}
  var track

  var card = Card($card[0])

  $window.resize(function() {
    if (!player.h) return
    player.h.h.width = $window.width()
    player.h.h.height = $window.height()
  })

  $playGhost.on('click', function () {
    track = window.rozd.getCurrentTrack($play.attr('data-video-id'))[0]
    if (!track) return
    playVideo(track)
  })

  window.onYouTubeIframeAPIReady = function() {
    var m = (document.location.search||"").match(/video=([^&]+)/)
    if (m) {
      var track = window.rozd.getCurrentTrack(m[1])[0]
      playVideo(track)
    }
  }

  function playVideo(track) {
    $body.addClass('overflow-hidden')
    player = new YT.Player('player', {
      height: $window.height(),
      width: $window.width(),
      playerVars: { 'autoplay': 1, 'fs': 0,'showinfo':0,'color':'white','disablekb': 1},
      videoId: track.video,
      events: {
        'onReady': function(e) {
          e.target.playVideo()
        },
        'onStateChange': function(e) {
          if (e.data == YT.PlayerState.PLAYING) {
            $content.addClass('none')
            $cross.removeClass('none')
          }
          else if (e.data == YT.PlayerState.PAUSED) {
            text = track.text.reduce(function (res, cur) {
              return player.getCurrentTime() > cur.time ? cur : res
            }, {})
            $content.removeClass('none')
            currentCard = Math.floor(Math.random() * cards.length)
            card.draw(text.words || '', currentCard)
            $cross.addClass('none')
          }
          else if (e.data == YT.PlayerState.ENDED) {
            closeIframe()
          }
        },
      }
    });
    $container.removeClass('none')
  }

  $(this).keydown(function(e) {
    if (e.which != 27) return
    closeIframe()
  })

  $cross.on('click', function () {
    closeIframe()
  })

  $closecard.on('click', function () {
    player.playVideo()
  })

  $next.on('click', function () {
    currentCard == cards.length - 1 ? currentCard = 0 : currentCard++
    card.draw(text.words || '', currentCard)
  })

  $prev.on('click', function () {
    currentCard == 0 ? currentCard = cards.length - 1 : currentCard--
    card.draw(text.words || '', currentCard)
  })

  $share.on('click', function() {
    var imageData = card.getImageData()
    $share.attr('disabled', true)

    // open fb popup earlier because otherwise browsers will block it after ajax request
    var fbpopup = window.open("/loading.html", "pop", "width=600, height=400, scrollbars=no")

    $.ajax({
      type: "POST",
      url: "/upload.php",
      processData: false,
      data: imageData
    }).done(function(o) {
      $share.attr('disabled', false)
      console.log('saved', o)

      var url = encodeURIComponent(document.location.origin + "/" + '?img=' + o.id + '&video=' + (track && track.video))
      fbpopup.location.replace("https://www.facebook.com/sharer/sharer.php?u=" + url)
    })
  })

  function closeIframe() {
    rozd.dropUI()
    rozd.updateUI()
    $body.removeClass('overflow-hidden')
    player = null
    $playerContent.html('<div id="player"></div>')
    $container.addClass('none')
    $content.addClass('none')
    card.reset()
  }

  // Card Class
  // receives DOM element of canvas, like so: var card = Card(document.getElementById('card'))
  function Card(card) {
    var ctx = card.getContext('2d'),
        width = card.width,
        height = card.height,
        markCorrectionX = 0,
        markCorrectionY = 7

    // Scale 2x to make high density image for retina displays
    card.style.width = width + "px"
    card.style.height = height + "px"
    card.width = card.width * 2
    card.height = card.height * 2
    ctx.scale(2,2)

    function canvasWrapText(ctx, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' '),
          line = '',
          lines = []

      y += lineHeight

      for (var n = 0, len = words.length; n < len; n++) {
        var testLine = line + words[n] + ' ',
            metrics = ctx.measureText(testLine),
            testWidth = metrics.width

        if (testWidth > maxWidth) {
          lines.push({ text: line, x: x, y: y, width: ctx.measureText(line).width })
          line = words[n] + ' '
          y += lineHeight
        } else {
          line = testLine
        }
      }

      lines.push({ text: line, x: x, y: y, width: ctx.measureText(line).width })
      return lines
    }

    function draw(text, index) {
      reset()

      var bg = new Image()
      bg.src = cards[index]
      bg.onload = function(){
        ctx.drawImage(this, 0, 0, 600, 325)

        ctx.font = "300 30px FranklinGothicBook"

        var paddingTop = 25
        var paddingSides = 30
        var txt = canvasWrapText(ctx, text, paddingSides, paddingTop, width-(paddingSides*2), 35)
        for (var i = 0; i < txt.length; i++){
          ctx.fillStyle = '#444444'
          ctx.fillRect(txt[i].x-8, txt[i].y-28, txt[i].width+8, 40);
          ctx.fillStyle = '#ffffff'
          ctx.fillText(txt[i].text, txt[i].x, txt[i].y)
        }

        /*
        ctx.font = "200 12px FranklinGothicBook"
        ctx.fillStyle = '#444444'
        ctx.fillRect(500, height-35, ctx.measureText('rozdilovi.org').width+15, 20);
        ctx.fillStyle = '#ffffff'
        ctx.fillText('rozdilovi.org', 505, height-23)
        */

      }
    }

    function reset() {
      ctx.clearRect(0, 0, width, height)
    }

    function getImageData() {
      var url = card.toDataURL("image/png"),
          prefix = "data:image/png;base64,"
      return url.substr(prefix.length)
    }

    return {
      draw: draw,
      reset: reset,
      getImageData: getImageData
    }
  }

  // For quick access to card development
  if (document.location.hash == "#video-content-dev") {
    $container.removeClass('none')
    $content.removeClass('none')
    card.draw("хочеться говорити тихо, щоби тебе ніхто не почув, а почувши – не зрозумів")
  }
})
