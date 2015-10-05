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
   
  var imageObj = new Image();

  for (var prop in images) {
    imageObj.src = images[prop];
  }
  
  var slots, circle, field, play;

  var mainWords = ["вночі", "нічого", "любові", "ніжні",  "війна", "любов", "любов’ю"];
  var combos = window.rozd_combos;

  function initUI() {
    slots = $(".slot")
    circle = $("#circle")
    field = $("#field")
    play = $('#play')

    updateUI(true)

    field.droppable({
      drop: function(event, ui) {
        var el = $(ui.draggable);

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
      var img = $("<img>").attr("src", images[suggWords[i]]);
      img.attr('data-at2x', images[suggWords[i]].replace('.png', '@2x.png'));
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
