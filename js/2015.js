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
  var ghostInitialDelay = 3000;
  var ghostInterval = 15000;

  var figuredOutDragging = false;
  var hadComboBefore = false;
  var doGhosts = true, forceGhost = false; ghostActive = false, nGhosts = 0;
  var t_loaded = new Date;

  function initUI() {
    ga('send', 'timing', {
      'timingCategory': 'loading',
      'timingVar': 'doc-ready-time',
      'timingValue': new Date - window._t
    });
    ga('send', 'event', {
      'eventCategory': 'loading',
      'eventAction': 'doc-ready-time',
      'eventValue': new Date - window._t
    });

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
      ga('send', 'timing', {
        'timingCategory': 'loading',
        'timingVar': 'words-ready-time',
        'timingValue': new Date - window._t
      });
      ga('send', 'event', {
        'eventCategory': 'loading',
        'eventAction': 'words-ready-time',
        'eventValue': new Date - window._t
      });
      t_loaded = new Date

      // Kick off the initial ghost after ghostInitialDelay and then
      // start showing ghosts randomly every ghostInterval
      setTimeout(randomGhost, ghostInitialDelay)

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

    // If clicked on the field without having combo, then show ghost as a hint
    field.click(function() {
      if (!circle.hasClass("combo")) {
        ga('send', 'event', {
          'eventCategory': 'circle',
          'eventAction': 'play-click-no-combo',
          'eventLabel': figuredOutDragging ? 'dragged-before' : 'no-dragged-before'
        });
        forceGhost = true;
        randomGhost();
        forceGhost = false;
      }
    })

    field.droppable({
      drop: function(event, ui) {
        var el = $(ui.draggable);

        ga('send', 'event', {
          'eventCategory': 'circle',
          'eventAction': 'drop-word',
          'eventLabel': el.attr('data-word')
        });

        if (!figuredOutDragging) {
          ga('send', 'timing', {
            'timingCategory': 'circle',
            'timingVar': 'time-to-first-drag',
            'timingValue': new Date - t_loaded
          });
          ga('send', 'timing', {
            'timingCategory': 'circle',
            'timingVar': 'ghosts-before-first-drag',
            'timingValue': nGhosts
          });
          ga('send', 'event', {
            'eventCategory': 'circle',
            'eventAction': 'first-drag',
            'eventValue': new Date - t_loaded
          });
          ga('send', 'event', {
            'eventCategory': 'circle',
            'eventAction': 'first-drag-seen-ghosts',
            'eventValue': nGhosts
          });
        }

        // Once we drad at least one word, do not do ghosts anymore
        doGhosts = false;
        figuredOutDragging = true;

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

          ga('send', 'event', {
            'eventCategory': 'circle',
            'eventAction': 'move-word-out',
            'eventLabel': el.attr('data-word')
          });
        }

        if (!el.data('was-in-circle')) {
          ga('send', 'event', {
            'eventCategory': 'circle',
            'eventAction': 'drop-word-miss',
            'eventLabel': el.attr('data-word')
          });
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

    $('.ghost-hand').remove()
    fillSlots(newState.suggestedWords);

    if (newState.combo.length != 0) {
      // take a random combo
      var combo = newState.combo[Math.floor(Math.random() * newState.combo.length)]

      circle.addClass("combo");
      play.attr('data-video-id', combo.video);

      ga('send', 'event', {
        'eventCategory': 'circle',
        'eventAction': 'combo',
        'eventLabel': combo.words.join(',')
      });

      if (!hadComboBefore) {
        ga('send', 'timing', {
          'timingCategory': 'circle',
          'timingVar': 'time-to-first-combo',
          'timingValue': new Date - t_loaded
        });
        ga('send', 'event', {
          'eventCategory': 'circle',
          'eventAction': 'first-combo',
          'eventLabel': combo.words.join(','),
          'eventValue': new Date - t_loaded
        });
      }

      hadComboBefore = true;
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

  // ghost timer
  var tGhost = null;

  function randomGhost() {
    if (!doGhosts && !forceGhost) return;
    if (ghostActive) return;
    clearTimeout(tGhost);
    // find slots that are not empty
    var slots = $(".word").closest('.slot');
    var idx = Math.floor(Math.random() * slots.length);
    ghost(slots.eq(idx), function() {
      tGhost = setTimeout(randomGhost, ghostInterval);
    });
  }

  function ghost(slot, callback) {
    var ghSlot = slot.clone(true).addClass('ghost').fadeTo(0, .5).appendTo('.words');
    ghostActive = true;
    nGhosts++;

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
    var wPadding = ghSize.width / 2 * .8,
        hPadding = ghSize.height / 2 * .8;
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
          ghSlot.remove();
          ghostActive = false;
          callback && callback();
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
      result.combo = combo;
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
