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
  var $lang = $('.lang')
  var $spinner = $('#spinner')
  
  var cards = [
    'img/cards/_card1.jpg',
    'img/cards/_card28.jpg',
    'img/cards/_card17.jpg',
    'img/cards/_card29.jpg',
    'img/cards/_card31.jpg',
    'img/cards/_card26.jpg',
    'img/cards/_card5.jpg',
    'img/cards/_card16.jpg',
    'img/cards/_card36.jpg',
    'img/cards/_card21b.jpg',
    'img/cards/_card4.jpg',
    'img/cards/_card22.jpg',
    'img/cards/_card41.jpg',
    'img/cards/_card8.jpg',
    'img/cards/_card19.jpg',
    'img/cards/_card32.jpg',
    'img/cards/_card20.jpg',
    'img/cards/_card12.jpg',
    'img/cards/_card30.jpg',
    'img/cards/_card11.jpg',
    'img/cards/_card27.jpg',
    'img/cards/_card13.jpg',
    'img/cards/_card42.jpg',
    'img/cards/_card43.jpg',
    'img/cards/_card44.jpg',
    'img/cards/_card45.jpg',
    'img/cards/_card46.jpg',
    'img/cards/_card47.jpg',
    'img/cards/_card48.jpg',
    'img/cards/_card49a.jpg',
    'img/cards/_card50.jpg',
    'img/cards/_card50a.jpg',
    'img/cards/_card51.jpg',
    'img/cards/_card52.jpg',
    'img/cards/_card53.jpg',
    'img/cards/_card54.jpg',
    'img/cards/_card55.jpg',
    'img/cards/_card56.jpg'
    ]
  var currentCard
  var player = {}
  var text = {}
  var track
  var videoState, videoTime = 1

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

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'play',
      'eventLabel': track.video
    });

    $lang.addClass('none')

    playVideo(track, 1)
  })

  window.onYouTubeIframeAPIReady = function() {
    ga('send', 'timing', {
      'timingCategory': 'video',
      'timingVar': 'youtube-api-ready',
      'timingValue': new Date - window._t
    });
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'youtube-api-ready',
      'eventValue': new Date - window._t
    });

    var s = (document.location.search||""),
        mi = s.match(/img=([^&]+)/),
        mv = s.match(/video=([^&]+)/);

    if (mi && mv) {
      track = window.rozd.getCurrentTrack(mv[1])[0]
      $cardImg.attr('src', '/uploads/' + mi[1] + '.jpg')
      playVideo(track, 0)
      $container.addClass('share-mode')
      // showCard()
      $content.removeClass('none')
      $lang.addClass('none')
      $closeVideo.addClass('none')
      $share.addClass('none')

      ga('send', 'event', {
        'eventCategory': 'video',
        'eventAction': 'card-open-shared',
        'eventLabel': track.video
      });
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
    currentCard = Math.floor(Math.random() * cards.length)
    card.draw(text.words || '', currentCard)

    $content.removeClass('none')
    $closeVideo.addClass('none')
    $share.addClass('none')

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-show',
      'eventLabel': track.video,
      'eventValue': videoTime
    });
  }

  function hideCard() {
    $content.addClass('none')
    $closeVideo.removeClass('none')
    $share.removeClass('none')
    // Reset share mode if any
    $container.removeClass('share-mode')
  }

  function playVideo(track, autoplay) {

    // Hidden overvlow looks very ugly on mobile, removing it does not seem to
    // break the desktop UI too much, so I remove it.
    // $body.addClass('overflow-hidden')

    // Fix https://github.com/karshina/Rozdilovi/issues/51
    // Do not autoplay on Mobile devices
    autoplay = autoplay && Modernizr.videoautoplay

    videoState = YT.PlayerState.PAUSED

    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      playerVars: { 'autoplay': autoplay, 'fs': 0,'showinfo':0,'color':'white','disablekb': 1},
      videoId: track.video,
      events: {
        'onReady': function(e) {
          $logo.addClass('hide')
          autoplay && e.target.playVideo()
        },
        'onStateChange': function(e) {
          videoState = e.data
          videoTime = player.getCurrentTime()

          if (videoState == YT.PlayerState.PLAYING) {
            hideCard()
            $container.removeClass('share-mode')
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

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'esc',
      'eventLabel': track.video
    });

    closeIframe()
  })

  $closeVideo.on('click', function () {
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'close-button-click',
      'eventLabel': track.video
    });

    closeIframe()
  })

  $share.on('click', function () {
    if (Modernizr.videoautoplay) {
      player.pauseVideo()
    } else {
      showCardDebounce()
    }
  })

  $closeCard.on('click', function () {
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-close-click',
      'eventLabel': track.video,
      'eventValue': videoTime
    });

    hideCard()
    Modernizr.videoautoplay && player.playVideo()
  })

  $next.on('click', function () {
    currentCard == cards.length - 1 ? currentCard = 0 : currentCard++
    card.draw(text.words || '', currentCard)

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-next',
      'eventLabel': track.video,
      'eventValue': videoTime
    });
  })

  $prev.on('click', function () {
    currentCard == 0 ? currentCard = cards.length - 1 : currentCard--
    card.draw(text.words || '', currentCard)

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-prev',
      'eventLabel': track.video,
      'eventValue': videoTime
    });
  })

  $fbsend.on('click', function() {
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-fbshare',
      'eventLabel': track.video,
      'eventValue': videoTime
    });

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-fbshare-bg',
      'eventLabel': cards[currentCard],
      'eventValue': videoTime
    });

    ga('send', 'social', {
      'socialNetwork': 'Facebook',
      'socialAction': 'Send',
      'socialTarget': track.video,
    });

    var imageData = card.getImageData()
    $fbsend.attr('disabled', true)

    // open fb popup earlier because otherwise browsers will block it after ajax request
    var fbpopup = window.open("/loading.html", "pop", "width=600, height=400, scrollbars=no")
    var _t = new Date;


    $.ajax({
      type: "POST",
      url: "/upload.php",
      processData: false,
      data: imageData
    }).done(function(o) {
      ga('send', 'event', {
        'eventCategory': 'video',
        'eventAction': 'card-fbshare-window-open',
        'eventLabel': cards[currentCard],
        'eventValue': new Date - _t
      });

      ga('send', 'timing', {
        'timingCategory': 'video',
        'timingVar': 'card-upload-time',
        'timingLabel': cards[currentCard],
        'timingValue': new Date - _t
      });

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
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-shared-play',
      'eventLabel': track.video
    });

    hideCard()
    Modernizr.videoautoplay && player.playVideo()
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
    $lang.removeClass('none')
    card.reset()
  }

  // Card Class
  // receives DOM element of canvas, like so: var card = Card(document.getElementById('card'))
  function Card(card) {
    var ctx = card.getContext('2d'),
        width = 600,
        height = 325,
        fontSize = 30,
        paddingTop = 15,
        paddingSides = 30

    // Scale 2x to make high density image for retina displays
    card.width = width*2
    card.height = height*2
    ctx.scale(2,2)

    // Render the hidden text to preload the font
    ctx.font = "normal " + fontSize + "px FranklinGothicMedium"
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
      // return
      reset()

      $cardImg.replaceWith('<img id="card-img" />')

      var bg = $cardImg[0]
      bg.src = cards[index]

      var _t = new Date;

      $spinner.show()

      var drawText = function() {
        ctx.font = "normal " + fontSize + "px FranklinGothicMedium"

        var txt = canvasWrapText(ctx, text, paddingSides, paddingTop, width-(paddingSides*2), 33)
        for (var i = 0; i < txt.length; i++){
          ctx.fillStyle = '#444444'
          ctx.fillText(txt[i].text, txt[i].x, txt[i].y)
        }

        /* draw site URL
        ctx.font = "200 12px FranklinGothicBook"
        ctx.fillStyle = '#444444'
        var textWidth = ctx.measureText('rozdilovi.org').width
        ctx.fillRect(600-textWidth-33, height-35, textWidth+12, 17);
        ctx.fillStyle = '#ffffff'
        ctx.fillText('rozdilovi.org', 600-textWidth-33+6, height-23)
        */
      }

      var drawBg = function(wasComplete) {
        $spinner.hide()
        reset()
        ctx.drawImage(bg, 0, 0, 600, 325)
        drawText()

        if (!wasComplete) {
          ga('send', 'timing', {
            'timingCategory': 'video',
            'timingVar': 'bg-load-time',
            'timingLabel': cards[index],
            'timingValue': new Date - _t
          });
          ga('send', 'event', {
            'eventCategory': 'video',
            'eventAction': 'bg-load',
            'eventLabel': cards[index],
            'eventValue': new Date - _t
          });
        }
      }

      drawText()

      if (bg.complete) return drawBg(true)

      bg.onload = function() {
        drawBg(false)
      }
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
    $logo.addClass('hide')
    text = {words: "хочеться говорити тихо, щоби тебе ніхто не почув, а почувши – не зрозумів"}
    currentCard = 0
    card.draw(text.words, 0)
    window.card = card
  }
})
