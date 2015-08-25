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

  var slots, circle, play;

  var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю"]
  // var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю", "ніжності", "ночі"]

  var combos = [
    {video: "4ht80uzIhNs", words: ["вночі", "ночі", "ніжно"]},
    {video: "Soa3gO7tL-c", words: ["нічого", "ніч", "нічне", "ніжності", "любові"]},
    {video: "vx2u5uUu3DE", words: ["нічого", "любові", "ніжності", "ночами", "нічого"]},
    {video: "cl2D7J_FL_U", words: ["ніч", "любов"]},
    {video: "4Kvd-uquuhI", words: ["любов", "ніжність", "вночі"]},
    {video: "ktvTqknDobU", words: ["нічого", "любові", "ніч", "ніжності"]},
    {video: "KVYup3Qwh8Q", words: ["любові", "любов", "ніч", "нічний"]},
    {video: "ScNNfyq3d_w", words: ["ночі", "ніч", "ніжно", "нічого", "ніч"]},
    {video: "1kz6hNDlEEg", words: ["ніч", "любов", "ночей"]},
    {video: "_1hgVcNzvzY", words: ["любові"]},
    {video: "tIgtaM7OV4g", words: ["нічого", "нічого"]},
    {video: "8Zx6RXGNISk", words: ["вночі", "війна"]},
    {video: "X4YK-DEkvcw", words: ["ніжні"]},
    {video: "98W9QuMq-2k", words: ["нічого"]},
    {video: "oM-XJD4J36U", words: ["любов", "нічні", "ніжність"]},
    {video: "i8q8fFs3kTM", words: ["любов", "ніжність"]},
    {video: "XAbcgmwq3EU", words: ["нічних", "вночі"]},
    {video: "VQH8ZTgna3Q", words: ["ніжними", "вночі"]},
    {video: "Nj8r3qmOoZ8", words: ["нічних", "любов"]},
    {video: "qjHlgrGsLWQ", words: ["любов’ю"]},
    {video: "???????", words: ["ніч", "любов"]}
  ];

  function initUI() {
    slots = $(".slot")
    circle = $("#circle")
    play = $('#play')

    updateUI(true)

    $('#field').droppable({
      drop: function(event, ui) {
        var el = $(ui.draggable);

        el.data('dropped-in-circle', true);
        if (el.data('was-in-circle')) {
          return;
        }
        el.data('was-in-circle', true);

        var offset = circle.offset();
        var parentOffset = el.parent().offset();
        var cssTop = parseInt(el.css('top'), 10);
        var cssLeft = parseInt(el.css('left'), 10);
        var top = parentOffset.top + cssTop - offset.top;
        var left = parentOffset.left + cssLeft - offset.left;
        el.appendTo(circle);
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

    if (newState.combo) {
      circle.addClass("combo");
      play.attr('data-video-id', newState.combo);
    }

    makeWordsDraggable();
  }

  function fillSlots(suggWords) {
    for (var i = 0; i < suggWords.length; i++) {
      var slot = $(".slot" + (i+1));
      var word = $("<div>").addClass("word").attr("data-word", suggWords[i]);
      var img = $("<img>").attr("src", images[suggWords[i]]);
      img.attr('data-at2x', images[suggWords[i]].replace('.png', '@2x.png'));
      img.attr("width", "80%");
      img.attr("height", "80%");
      word.append(img);
      slot.append(word);
    }

    slots.find('.word')
      .css({opacity: 0})
      .animate({opacity: 1}, 100);
  }

  function resetUI(callback) {
    // slots.empty();
    circle.removeClass("combo");
    play.attr('data-video-id', '')
    slots.find('.word').animate({opacity: 0}, 100)
    setTimeout(function() {
      slots.find('.word').remove()
      callback()
    }, 100)
  }

  function getCurrentWords() {
    var circleWords = [];
    circle.find(".word").each(function(){
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
      combo: null,
    };

    if (circleWords.length == 0) {
      result.suggestedWords = mainWords;
      return result;
    }

    for (var i in combos) {
      var r = suggest(combos[i], circleWords);
      result.suggestedWords = result.suggestedWords.concat(r.suggestedWords);
      result.combo = result.combo || r.combo;
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
    circle.find(".word").each(function(){
      $(this).remove()
    })
  }

  // expose some stuff
  window.rozd = {
    initUI: initUI,
    dropUI: dropUI,
    updateUI:  updateUI,
    getState: getState,
    suggest: suggest,
    mainWords: mainWords
  }
})()
