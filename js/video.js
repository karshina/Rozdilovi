$(document).ready(function($) {
  var $window = $(window)
  var $container = $('.video-container')
  var $play = $('#play')
  var $playGhost = $('#play-ghost')
  var $playShared = $('#play-shared')
  var $body = $('body')
  var $content = $('.video-content')
  var $card = $('#card')
  var $cardImg = $('#card-img')
  var $playerContent = $('.player-content')
  var $closeVideo = $('#close-video')
  var $share = $('#share')
  var $closeCard = $('#close-card')
  var $next = $('#next')
  var $prev = $('#prev')
  var $fbsend = $('#fbsend')
  var $logo = $('#logo')
  var $spinner = $('#spinner')
  
  var cards = [
    'img/cards/card0.jpg',
    'img/cards/card1.jpg',
    'img/cards/card2.jpg',
    'img/cards/card3.jpg',
    'img/cards/card4.jpg',
    'img/cards/card5.jpg',
    'img/cards/card6.jpg',
    'img/cards/card8.jpg',
    'img/cards/card9.jpg',
    'img/cards/card10.jpg',
    'img/cards/card11.jpg',
    'img/cards/card12.jpg'
    ]
  var currentCard
  var player = {}
  var text = {}
  var track
  var videoState, videoTime

  var showCardDebounce = _.debounce(showCard, 500);

  var card = Card($card[0])

  $window.resize(function() {
    if (!player.h) return
    player.h.h.width = $window.width()
    player.h.h.height = $window.height()
  })

  $playGhost.on('click', function () {
    track = window.rozd.getCurrentTrack($play.attr('data-video-id'))[0]
    if (!track) return
    playVideo(track, 1)
  })

  window.onYouTubeIframeAPIReady = function() {
    var s = (document.location.search||""),
        mi = s.match(/img=([^&]+)/),
        mv = s.match(/video=([^&]+)/),
        mt = s.match(/t=([^&]+)/);

    if (mi && mv && mt) {
      track = window.rozd.getCurrentTrack(mv[1])[0]
      videoTime = parseInt(mt[1], 10)
      $cardImg.attr('src', '/uploads/' + mi[1] + '.jpg')
      playVideo(track, 0)
      $container.addClass('share-mode')
      showCard()
    }
  }
  if (YT && YT.loaded) {
    window.onYouTubeIframeAPIReady()
  }

  function showCard() {
    if (videoState !== YT.PlayerState.PAUSED) {
      return
    }

    text = track.text.reduce(function (res, cur) {
      return videoTime > cur.time ? cur : res
    }, {})
    $content.removeClass('none')
    currentCard = Math.floor(Math.random() * cards.length)
    card.draw(text.words || '', currentCard)
    $closeVideo.addClass('none')
    $share.addClass('none')
  }

  function hideCard() {
    $content.addClass('none')
    $closeVideo.removeClass('none')
    $share.removeClass('none')
  }

  function playVideo(track, autoplay, onReady) {
    $body.addClass('overflow-hidden')
    videoState = YT.PlayerState.PAUSED

    player = new YT.Player('player', {
      height: $window.height(),
      width: $window.width(),
      playerVars: { 'autoplay': autoplay, 'fs': 0,'showinfo':0,'color':'white','disablekb': 1},
      videoId: track.video,
      events: {
        'onReady': function(e) {
          $logo.addClass('hide')
          autoplay && e.target.playVideo()
          onReady && onReady()
        },
        'onStateChange': function(e) {
          videoState = e.data
          videoTime = player.getCurrentTime()

          if (videoState == YT.PlayerState.PLAYING) {
            hideCard()
          }
          else if (videoState == YT.PlayerState.PAUSED) {
            showCardDebounce()
          }
          else if (videoState == YT.PlayerState.ENDED) {
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

  $closeVideo.on('click', function () {
    closeIframe()
  })

  $share.on('click', function () {
    player.pauseVideo()
  })

  $closeCard.on('click', function () {
    hideCard()
    player.playVideo()

    // Reset share mode if any
    $container.removeClass('share-mode')
  })

  $next.on('click', function () {
    currentCard == cards.length - 1 ? currentCard = 0 : currentCard++
    card.draw(text.words || '', currentCard)
  })

  $prev.on('click', function () {
    currentCard == 0 ? currentCard = cards.length - 1 : currentCard--
    card.draw(text.words || '', currentCard)
  })

  $fbsend.on('click', function() {
    var imageData = card.getImageData()
    $fbsend.attr('disabled', true)

    // open fb popup earlier because otherwise browsers will block it after ajax request
    var fbpopup = window.open("/loading.html", "pop", "width=600, height=400, scrollbars=no")

    $.ajax({
      type: "POST",
      url: "/upload.php",
      processData: false,
      data: imageData
    }).done(function(o) {
      $fbsend.attr('disabled', false)

      var vars = [
        'img=' + o.id,
        'video=' + (track && track.video),
        't=' + videoTime
      ]
      var url = encodeURIComponent(document.location.origin + "/" + '?' + vars.join('&'))

      fbpopup.location.replace("https://www.facebook.com/sharer/sharer.php?u=" + url)
    })
  })

  $playShared.on('click', function () {
    hideCard()
    player.playVideo()
    $container.removeClass('share-mode')
  })

  function closeIframe() {
    rozd.dropUI()
    rozd.updateUI()
    $body.removeClass('overflow-hidden')
    player = null
    $playerContent.html('<div id="player"></div>')
    $container.addClass('none')
    $content.addClass('none')
    $logo.removeClass('hide')
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

    // Render the hidden text to preload the font
    ctx.font = "300 30px FranklinGothicBook"
    ctx.fillText("Привіт", -100, -100)

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

      $cardImg.replaceWith('<img id="card-img" />')

      var bg = $cardImg[0]
      bg.src = cards[index]

      $spinner.show()

      var drawText = function() {
        ctx.font = "300 30px FranklinGothicBook"

        var paddingTop = 18
        var paddingSides = 33
        var txt = canvasWrapText(ctx, text, paddingSides, paddingTop, width-(paddingSides*2), 35)
        for (var i = 0; i < txt.length; i++){
          ctx.fillStyle = '#444444'
          ctx.fillRect(txt[i].x-8, txt[i].y-28, txt[i].width+8, 40);
          ctx.fillStyle = '#ffffff'
          ctx.fillText(txt[i].text, txt[i].x, txt[i].y)
        }

        // draw site URL
        ctx.font = "200 12px FranklinGothicBook"
        ctx.fillStyle = '#444444'
        var textWidth = ctx.measureText('rozdilovi.org').width
        ctx.fillRect(600-textWidth-33, height-35, textWidth+12, 17);
        ctx.fillStyle = '#ffffff'
        ctx.fillText('rozdilovi.org', 600-textWidth-33+6, height-23)
      }

      var drawBg = function() {
        $spinner.hide()
        reset()
        ctx.drawImage(bg, 0, 0, 600, 325)
        drawText()        
      }

      drawText()

      if (bg.complete) return drawBg()
      bg.onload = drawBg
    }

    function reset() {
      ctx.clearRect(0, 0, width, height)
    }

    function getImageData() {
      var url = card.toDataURL("image/jpeg", 0.7),
          prefix = "data:image/jpeg;base64,"
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
    text = {words: "хочеться говорити тихо, щоби тебе ніхто не почув, а почувши – не зрозумів"}
    currentCard = 0
    card.draw(text.words, 0)
    window.card = card
  }
})
