(function(){
  var images = {
    "вночі": "img/vnochi.png",
    "любові": "img/lubovi.png",
    "війна": "img/vijna.png",
    "нічого": "img/nichogo.png",
    "ніжні": "img/nizhni.png",
    "ніч": "img/nich.png",
    "любов’ю": "img/luboviu.png",
    "ночі": "img/nochi.png",
    "ніжно": "img/nizhno.png",
    "нічне": "img/nichne.png",
    "ніжності": "img/nizhnosti.png",
    "ночами": "img/nochamy.png",
    "любов": "img/lubov.png",
    "ніжність": "img/nizhnist.png",
    "нічний": "img/nichny.png",
    "ночей": "img/nochey.png",
    "нічні": "img/nichni.png",
    "нічних": "img/nichnyh.png",
    "ніжними": "img/nizhnymy.png"
  }
  
  var slots, circle, field, play, playGhost;
  var mainWords = ["вночі", "нічого", "любові", "ніжні",  "війна", "любов", "любов’ю"];
  var combos = window.rozd_combos;

  var doGhosts = true;

  function initUI() {
    slots = $(".slot")
    circle = $("#circle")
    field = $("#field")
    play = $('#play')
    playGhost = $('#play-ghost')

    if (document.location.hash == "#animate") {
      // animate two layers of the sky with different speed
      width = $('body').outerWidth();
      mid = $('#midground')
      fore = $('#foreground')
      doScroll(mid, width, 120);
      doScroll(fore, width, 60);
    }

    updateUI(true)

    // Preload the rest of word images in advance as soon as words around the circle loaded
    var imgEls = $(".slot .word img"), i = imgEls.length;
    var done = function() {
      // Kick off the initial ghost after 3 sec and then
      // start showing ghosts randomly every 15 seconds
      setTimeout(randomGhost, 3000)
      setInterval(randomGhost, 15000)

      for (var prop in images) {
        var imageObj = new Image();
        imageObj.src = retinaSrc(images[prop]);
      }
    }
    var loaded = function() {
      --i || done()
    }
    imgEls.each(function(){
      this.complete ? loaded() : this.onload = loaded
    });

    // PlayGhost square actions, propagate hover events to play button
    playGhost.on('mouseenter', function (){
      play.addClass('hover')
    }).on('mouseleave', function(){
      play.removeClass('hover')
    })

    field.droppable({
      drop: function(event, ui) {
        var el = $(ui.draggable);

        circle.removeClass("dragover");

        // Once we drad at least one word, do not do ghosts anymore
        doGhosts = false;

        el.data('dropped-in-circle', true);
        if (el.data('was-in-circle')) {
          return;
        }
        el.data('was-in-circle', true);

        var offset = field.offset();
        var parentOffset = el.parent().offset();
        var cssTop = parseInt(el.css('top'), 10);
        var cssLeft = parseInt(el.css('left'), 10);
        var top = parentOffset.top + cssTop - offset.top;
        var left = parentOffset.left + cssLeft - offset.left;
        
        el.appendTo(field);
        el.css({'top' : top, 'left' : left, 'position': 'absolute'});
        updateUI();
      },

      over: function() {
        circle.addClass("dragover");
      },

      out: function() {
        circle.removeClass("dragover");
      }
    });
  }

  function makeWordsDraggable() {
    $('.word:not(.ui-draggable)').draggable({
      start: function(event, ui) {
        $(ui.helper).data('dropped-in-circle', false);
      },
      stop: function(event, ui) {
        var el = $(ui.helper)
        if (el.data('was-in-circle') && !el.data('dropped-in-circle')) {
          el.animate({opacity: 0}, 100, function(){
            el.remove();
          })
          updateUI();
        }
      },
    });
  }

  function updateUI(noReset) {
    if (noReset) {
      doUpdateUI()
    } else {
      resetUI(doUpdateUI)
    }
  }

  function doUpdateUI() {
    var newState = updateState()

    fillSlots(newState.suggestedWords);

    if (newState.combo.length != 0) {
      circle.addClass("combo");
      play.attr('data-video-id', newState.combo[Math.floor(Math.random() * newState.combo.length)]);
    }

    makeWordsDraggable();
  }

  function fillSlots(suggWords) {
    var freeSlots = [], words = [];
    $(".slot").each(function(){
      var slot = $(this), word = slot.find('.word');
      if (suggWords.indexOf(word.attr('data-word')) > -1) {
        words.push(word.attr('data-word'));
        return;
      }

      word.remove();
      freeSlots.push(slot);
    });

    for (var i = 0; i < suggWords.length; i++) {
      if (words.indexOf(suggWords[i]) > -1) {
        continue;
      }
      var slot = freeSlots.shift();
      if (!slot) {
        continue;
      }
      var word = $("<div>").addClass("word").attr("data-word", suggWords[i]);
      var src = retinaSrc(images[suggWords[i]]);
      var img = $("<img>").attr("src", src).attr("data-at2x", src);
      word.append(img);
      slot.append(word);
      word.css({opacity: 0})
          .animate({opacity: 1}, 100);
    }

  }

  function resetUI(callback) {
    // slots.empty();
    circle.removeClass("combo");
    play.attr('data-video-id', '');
    callback();
  }

  function retinaSrc(src) {
    if (window.Retina.isRetina()) {
      src = src.replace('.png', '@2x.png')
    }
    return src
  }

  function randomGhost() {
    if (!doGhosts) return;
    // find slots that are not empty
    var slots = $(".word").closest('.slot')
    var idx = Math.floor(Math.random() * slots.length)
    ghost(slots.eq(idx))
  }

  function ghost(slot) {
    var ghSlot = slot.clone(true).addClass('ghost').fadeTo(0, .5).appendTo('.words')

    // make ghost hand
    var ghHand = $('<div class="ghost-hand"></div>').appendTo(ghSlot)
    ghHand.css("transform", "translate(100px,100px)")

    // Calculate coordinates
    var ghOffset = ghSlot.offset(),
        playOffset = circle.offset(),
        playSize = {
          width: circle.outerWidth(), 
          height: circle.outerHeight()
        },
        playCenter = {
          left: playOffset.left + playSize.width/2,
          top: playOffset.top + playSize.height/2
        },
        ghSize = {
          width: ghSlot.outerWidth(), 
          height: ghSlot.outerHeight()
        },
        ghCenter = {
          left: ghOffset.left + ghSize.width/2,
          top: ghOffset.top + ghSize.height/2
        },
        deltaTop = playCenter.top - ghCenter.top,
        deltaLeft = playCenter.left - ghCenter.left;

    // development helper function that draws red square by given coordinates
    var makeMarker = function(top, left) {
      var dv = $('<div>').css({
        position: 'absolute',
        top: top,
        left: left,
        backgroundColor: 'red',
        width: '2px',
        height: '2px'
      })
      dv.appendTo('body')
    }

    // Adjust destination delta to make words not overlap the play button
    var wPadding = ghSize.width / 2,
        hPadding = ghSize.height / 2;
    if (deltaTop < 0) {
      hPadding = hPadding * -1;
    }
    if (deltaLeft < 0) {
      wPadding = wPadding * -1;
    }
    deltaTop -= hPadding
    deltaLeft -= wPadding

    // Move hand to the word
    var step1 = function() {
      ghHand.animate({transform: "translate(0, 0)"}, {
        duration: 1000,
        complete: step2
      })
    }

    // Move the word to the circle
    var step2 = function() {
      ghHand.addClass("grab")
      ghSlot.animate({
        transform: "translate(" + (deltaLeft) + "px," + (deltaTop) + "px)"
      }, {
        duration: 1400,
        complete: step3
      })
    }

    // Word disappear
    var step3 = function() {
      ghHand.removeClass("grab")
      ghSlot.animate({opacity: 0}, {
        duration: 1000,
        complete: function() {
          ghSlot.remove()
        }
      })
    }

    // Kick off the animation
    step1()
  }

  function getCurrentWords() {
    var circleWords = [];
    field.find(".word").each(function(){
      if ($(this).data('dropped-in-circle')) {
        circleWords.push($(this).attr('data-word'))
      }
    })
    return circleWords
  }

  function updateState() {
    var circleWords = getCurrentWords()
    return getState(circleWords);
  }

  function getState(circleWords) {

    var result = {  
      suggestedWords: [],
      combo: [],
    };

    if (circleWords.length == 0) {
      result.suggestedWords = mainWords;
      return result;
    }

    $('#arrow').addClass('none')

    for (var i in combos) {
      var r = suggest(combos[i], circleWords);
      result.suggestedWords = result.suggestedWords.concat(r.suggestedWords);
      result.combo = r.combo ? result.combo.concat(r.combo) : result.combo;
    }

    result.suggestedWords = uniqueWords(result.suggestedWords);

    return result;
  }

  function suggest(combo, circleWords) {
    var result = {  
      suggestedWords: [],
      combo: null
    };

    var comboCopy = [].concat(combo.words);

    for (var i in circleWords) {
      var idx = comboCopy.indexOf(circleWords[i]);
      if (idx == -1) {
        return result;
      }
      comboCopy.splice(idx, 1);
    }

    if (comboCopy.length == 0) {
      result.combo = combo.video;
    }

    result.suggestedWords = comboCopy;

    return result;
  }

  function uniqueWords(words) {
    var result = [];
    for (var i = 0; i < words.length; i++) {
      if (result.indexOf(words[i]) == -1) {
        result.push(words[i]);
      }
    }
    return result
  }

  function dropUI() {
    field.find(".word").each(function(){
      $(this).remove()
    })
  }

  function getCurrentTrack (id) {
    return combos.filter(function (item) {
      return item.video == id
    })
  }

  function doScroll(obj, shift, duration) {
    TweenMax.to(obj, duration, {css:{backgroundPosition:shift + "px 0"}, repeat:-1, ease:Linear.easeNone});
  }

  // expose some stuff
  window.rozd = {
    initUI: initUI,
    dropUI: dropUI,
    updateUI:  updateUI,
    getState: getState,
    suggest: suggest,
    getCurrentTrack: getCurrentTrack,
    mainWords: mainWords,
  }
})()
