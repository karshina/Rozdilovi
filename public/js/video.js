$(document).ready(function($) {
  var $window = $(window)
  var $container = $('.video-container')
  var $play = $('#play')
  var $body = $('body')
  var $content = $('.video-content')
  var $card = $('#card')
  var $playerContent = $('.player-content')
  var $cross = $('.cross')
  var $simbol = $('.simbol')
  var $share = $('#share')

  var player = {}
  var track

  var card = Card($card[0])

  $window.resize(function() {
    if (!player.h) return
    player.h.h.width = $window.width()
    player.h.h.height = $window.height()
  })

  $play.on('click', function () {
    track = window.rozd.getCurrentTrack($play.attr('data-video-id'))[0]
    if (!track) return
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
          }
          else if (e.data == YT.PlayerState.PAUSED) {
            var text = track.text.reduce(function (res, cur) {
              return player.getCurrentTime() > cur.time ? cur : res
            }, {})
            $content.removeClass('none')
            card.draw(text.words || '')
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
    $.each($simbol, function(i) {$card.removeClass('pointer-' + i)})
    if (isActive) {
      $card.removeClass('pointer-' + $this.index())
      $this.removeClass('active')
    }
    else {
      $card.addClass('pointer-' + $this.index())
      $this.addClass('active')
    }
  })

  $card.on('click', function (event) {
    var simbol = $('.simbol.active').text()
    if (!simbol) return
    var positon = {
      '.': {x: -1, y: -2},
      ',': {x: -1, y: -2},
      ':': {x: -2, y: 11},
      '–': {x: -1, y: 2},
      '?': {x: -0.6, y: 12.5},
      '!': {x: -0.5, y: 12},
      '(': {x: -1, y: 12.5},
      ')': {x: -1, y: 12.5},
    }
    card.addMark(simbol, event.offsetX + positon[simbol].x, event.offsetY + positon[simbol].y)
  })

  $share.on('click', function() {
    var imageData = card.getImageData()
    // console.log(imageData)
    $share.attr('disabled', true)

    $.ajax({
      type: "POST",
      url: "/upload",
      processData: false,
      data: imageData
    }).done(function(o) {
      $share.attr('disabled', false)
      console.log('saved', o)
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
        isRetina = isHighDensity(),
        width = card.width,
        height = card.height,
        markCorrectionX = 0,
        markCorrectionY = 7

    if (isRetina) {
      card.style.width = width + "px"
      card.style.height = height + "px"
      card.width = card.width * 2
      card.height = card.height * 2
      ctx.scale(2,2)
    }

    function isHighDensity(){
      return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
    }

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
          lines.push({ text: line, x: x, y: y })
          line = words[n] + ' '
          y += lineHeight
        } else {
          line = testLine
        }
      }

      lines.push({ text: line, x: x, y: y })
      return lines
    }

    function draw(text) {
      reset()

      var bg = new Image()
      bg.src = 'img/stopblock.png'
      bg.onload = function(){
        ctx.drawImage(this, 0, 0, this.width, this.height)

        ctx.font = "300 30px FranklinGothicBook"
        ctx.fillStyle = '#908d8d'

        var paddingTop = 30
        var paddingSides = 30
        var txt = canvasWrapText(ctx, text, paddingSides, paddingTop, width - paddingSides, 35)
        for (var i = 0; i < txt.length; i++){
          ctx.fillText(txt[i].text, txt[i].x, txt[i].y)
        }
      }
    }

    function addMark(text, x, y) {
      ctx.fillStyle = '#2C8E31'
      ctx.fillText(text, x + markCorrectionX, y + markCorrectionY)
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
      addMark: addMark,
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
