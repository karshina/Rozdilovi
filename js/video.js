window.onYoutubeReady = $.Callbacks();

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
  var $closeVideo = $('#closeVideo')
  var $share = $('#share')
  var $playlist = $('#playlist')
  var $lyrics = $('#lyric')
  var $closeCard = $('#close-card')
  var $next = $('#next')
  var $prev = $('#prev')
  var $fbsend = $('#fbsend')
  var $emailsend = $('#emailsend')
  var $logo = $('.logo-light')
  var $lang = $('.lang')
  var $spinner = $('#spinner')
  var $playlistAlbum = $('.playlist-album')

  var cards = [
  /*  'img/cards/_card1.jpg',
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
    'img/cards/_card56.jpg' */
    'img/cards/_card2017-1.jpg',
    'img/cards/_card2017-2.jpg',
    'img/cards/_card2017-3.jpg',
    'img/cards/_card2017-4.jpg',
    'img/cards/_card2017-5.jpg',
    'img/cards/_card2017-6.jpg',
    'img/cards/_card2017-7.jpg',
    'img/cards/_card2017-8.jpg',
    'img/cards/_card2017-9.jpg',
    'img/cards/_card2017-22.jpg',
    'img/cards/_card2017-10.jpg',
    'img/cards/_card2017-11.jpg',
    'img/cards/_card2017-12.jpg',
    'img/cards/_card2017-13.jpg',
    'img/cards/_card2017-14.jpg',
    'img/cards/_card2017-15.jpg',
    'img/cards/_card2017-16.jpg',
    'img/cards/_card2017-17.jpg',
    'img/cards/_card2017-18.jpg',
    'img/cards/_card2017-19.jpg',
    'img/cards/_card2017-20.jpg',
    'img/cards/_card2017-21.jpg',
    'img/cards/_card2017-23.jpg',
    'img/cards/_card2017-24.jpg',
    'img/cards/_card2017-25.jpg',
    //'img/cards/_card2017-26.jpg',
    'img/cards/_card2017-27.jpg',
    'img/cards/_card2017-28.jpg',
    'img/cards/_card2017-29.jpg',
    'img/cards/_card2017-30.jpg',
    'img/cards/_card2017-31.jpg',
    'img/cards/_card2017-32.jpg',
    'img/cards/_card2017-33.jpg',
    'img/cards/_card2017-34.jpg',
    'img/cards/_card2017-35.jpg',
    'img/cards/_card2017-36.jpg',
    'img/cards/_card2017-37.jpg',
    'img/cards/_card2017-38.jpg',
    'img/cards/_card2017-39.jpg'
    ]
  var currentCard
  var player = {}
  var text = {}
  var track
  var videoState, videoTime = 1

  var playlist = $.map(window.album2017, function (video) {
        return video.video;
  });

  var shiftedPlaylist = function(videoId) {
    var vIndex = _.indexOf(playlist, videoId)
    return _.union(_.rest(playlist, vIndex + 1), _.first(playlist, vIndex))
  }

  var showCardDebounce = _.debounce(showCard, 500);
  var updateCardDebounce = _.debounce(updateCard, 500);

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

    playVideo(track, 0, 1)
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
      //track = window.rozd.getCurrentTrack(mv[1])[0]
      $cardImg.attr('src', '/uploads/' + mi[1] + '.jpg')
      playVideo(0, 0, 0)
      $container.addClass('share-mode')
      // showCard()
      $content.removeClass('none')
      $lang.addClass('none')
      $playlist.addClass('none')
      $closeVideo.addClass('none')
      $share.addClass('none')
      $lyrics.addClass('none')

      ga('send', 'event', {
        'eventCategory': 'video',
        'eventAction': 'card-open-shared',
        'eventLabel': track.video
      });
    }

    window.onYoutubeReady.fire();
  }

  if (YT && YT.loaded) {
    window.onYouTubeIframeAPIReady()
  }

  function updateCard(words) {
    text = { words: words };
    currentCard = currentCard || Math.floor(Math.random() * cards.length);
    card.draw(text.words || '', currentCard);
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
    $playlist.addClass('none')
    $lyrics.addClass('none')
    $closeVideo.addClass('none')
    $share.addClass('none')

    $playlistAlbum.addClass('playlist-hide')

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-show',
      'eventLabel': track.video,
      'eventValue': videoTime
    });
  }

  function hideCard() {
    $content.addClass('none')
    $playlist.removeClass('none')
    $lyrics.removeClass('none')
    $closeVideo.removeClass('none')
    $share.removeClass('none')
    // Reset share mode if any
    $container.removeClass('share-mode')
  }

  function playVideo(currentTrack, seek, autoplay) {
    track = album2017[currentTrack];

    // Hidden overvlow looks very ugly on mobile, removing it does not seem to
    // break the desktop UI too much, so I remove it.
    // $body.addClass('overflow-hidden')

    // Fix https://github.com/karshina/Rozdilovi/issues/51
    // Do not autoplay on Mobile devices
    autoplay = autoplay //&& Modernizr.videoautoplay

    videoState = YT.PlayerState.PAUSED

    resetPlayer();

    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      playerVars: {
        'autoplay': autoplay,
        'fs': 0,'showinfo':0,'rel':0,
        'color':'white',
        'disablekb': 1,
        'modestbranding': 1,
        'playlist': shiftedPlaylist(track.video).join(),
        'loop': 1,
        'start': seek,
        //'listType': 'playlist',
        //'list': 'PLhDqT4Y3v_tL095_KOrrmL6lm20gbRsNQ'
      },
      videoId: track.video,
      events: {
        'onReady': function(e) {
          var tries = 10;

          var startPlaying = function() {
            player.playVideo()

            if (seek > 0)
              e.target.seekTo(seek, true)

            var videoState = player.getPlayerState()
            var okStates = [YT.PlayerState.PLAYING, YT.PlayerState.BUFFERING]

            if (!_.contains(okStates, videoState) && tries > 0) {
              tries -= 1;
              setTimeout(startPlaying, 50)
            }
          }

          if (autoplay)
            startPlaying()
        },
        'onStateChange': function(e) {
          videoState = e.data
          videoTime = player.getCurrentTime()

          if (videoState == YT.PlayerState.PLAYING) {
            $logo.addClass('fade')
            hideCard()
            $container.removeClass('share-mode')

            track = _.find(window.album2017, function(item) {
                return item.video == player.getVideoData().video_id;
            })
          }
          else if (videoState == YT.PlayerState.PAUSED) {
            showCardDebounce()
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
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'close-button-click',
      'eventLabel': track.video
    });

    closeIframe()
  })

  $lyrics.on('click', function () {
      // player.pauseVideo()
      videoTime = player.getCurrentTime()
      link = track.lyrics.reduce(function (res, cur) {
        return videoTime > cur.time ? cur : res
      }, {})
      //alert(JSON.stringify(link))
      var lyricspage = window.open(link.link, "lyrics")
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

    //TMP: skip GA
    if (!track) return

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

    //TMP: skip GA
    if (!track) return

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
    $emailsend.attr('disabled', true)

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
      $emailsend.attr('disabled', false)

      var vars = [
        'img=' + o.id,
        'video=' + (track && track.video),
        't=' + videoTime
      ]
      var url = encodeURIComponent(document.location.origin + "/" + '?' + vars.join('&'))

      fbpopup.location.replace("https://www.facebook.com/sharer/sharer.php?u=" + url)
    })
  })

  $emailsend.on('click', function() {
    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-email',
      'eventLabel': track.video,
      'eventValue': videoTime
    });

    ga('send', 'event', {
      'eventCategory': 'video',
      'eventAction': 'card-email-bg',
      'eventLabel': cards[currentCard],
      'eventValue': videoTime
    });

    var imageData = card.getImageData()
    $fbsend.attr('disabled', true)
    $emailsend.attr('disabled', true)

    // open fb popup earlier because otherwise browsers will block it after ajax request
    var emailpage = window.open("/loading.html")
    var _t = new Date;

    $.ajax({
      type: "POST",
      url: "/upload.php",
      processData: false,
      data: imageData
    }).done(function(o) {
      ga('send', 'event', {
        'eventCategory': 'video',
        'eventAction': 'card-email-window-open',
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
      $emailsend.attr('disabled', false)

      var vars = [
        'img=' + o.id,
        'video=' + (track && track.video),
        'text=' + text.words
      ]
      var url = document.location.origin + "/postcard.php" + '?' + vars.join('&')

      emailpage.location.replace(url)
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

  function resetPlayer() {
    player = null
    $playerContent.html('<div id="player"></div>')
  }

  function closeIframe() {
    //rozd.dropUI()
    //rozd.updateUI()
    $body.removeClass('overflow-hidden')
    resetPlayer();
    $container.addClass('none')
    $content.addClass('none')
    $logo.removeClass('fade')
    $lang.removeClass('none')
    card.reset()
  }

  // Card Class
  // receives DOM element of canvas, like so: var card = Card(document.getElementById('card'))
  function Card(card) {
    var ctx = card.getContext('2d'),
        width = 600,
        height = 325,
        fontSize = 29,
        paddingTop = 15,
        paddingSides = 30

    // Scale 2x to make high density image for retina displays
    card.width = width*2
    card.height = height*2
    ctx.scale(2,2)

    // Render the hidden text to preload the font
    ctx.font = "normal " + fontSize + "px FranklinGothicBook"
    ctx.fillText("Привіт", -100, -100)

    function canvasWrapText(ctx, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' '),
          line = '',
          lines = []

      y = 75

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
        ctx.font = "normal " + fontSize + "px FranklinGothicBook"

        var txt = canvasWrapText(ctx, text, paddingSides, paddingTop, width-(paddingSides*2), 33)
        for (var i = 0; i < txt.length; i++){
          ctx.fillStyle = '#444444'
          ctx.fillText(txt[i].text.replace("&nbsp;", " "), width/2-(txt[i].width/2), txt[i].y)
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

      if (bg.complete) {
        // get rid of old callback
        bg.onload = function() {}
        return drawBg(true)
      }

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

    function getWords() {
      return text.words
    }

    return {
      draw: draw,
      reset: reset,
      getImageData: getImageData,
      getWords: getWords
    }
  }

  // For quick access to card development
  if (document.location.hash == "#video-content-dev") {
    $container.removeClass('none')
    $content.removeClass('none')
    $logo.addClass('fade')
    text = {words: "хочеться говорити тихо, щоби тебе ніхто не почув, а почувши – не зрозумів"}
    currentCard = 0
    card.draw(text.words, 0)
    window.card = card
  }

  window.videoPlayer = {
    play: playVideo
  };

  window.card = {
    update: updateCardDebounce,
    getImageData: card.getImageData,
    getWords: card.getWords
  }
})
