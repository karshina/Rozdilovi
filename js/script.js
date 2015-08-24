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

var slots = $(".slot")
var circle = $("#circle")
var play = $('#play')
var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю"]
// var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю", "ніжності", "ночі"]

var combos = [
  {video: "19763345", words: ["вночі", "ночі", "ніжно"]},
  {video: "23268412", words: ["нічого", "ніч", "нічне", "ніжності", "любові"]},
  {video: "35241509", words: ["нічого", "любові", "ніжності", "ночами", "нічого"]},
  {video: "72291393", words: ["ніч", "любов"]},
  {video: "111049156", words: ["любов", "ніжність", "вночі"]},
  {video: "101087172", words: ["нічого", "любові", "ніч", "ніжності"]},
  {video: "85153289", words: ["любові", "любов", "ніч", "нічний"]},
  {video: "37600239", words: ["ночі", "ніч", "ніжно", "нічого", "ніч"]},
  {video: "38247141", words: ["ніч", "любов", "ночей"]},
  {video: "98471805", words: ["любові"]},
  {video: "59200119", words: ["нічого", "нічого"]},
  {video: "7691734", words: ["вночі", "війна"]},
  {video: "29216342", words: ["ніжні"]},
  {video: "46666312", words: ["нічого"]},
  {video: "90895864", words: ["любов", "нічні", "ніжність"]},
  {video: "50538575", words: ["любов", "ніжність"]},
  {video: "8994455", words: ["нічних", "вночі"]},
  {video: "23655751", words: ["ніжними", "вночі"]},
  {video: "26689532", words: ["нічних", "любов"]},
  {video: "77444856", words: ["любов’ю"]},
  {video: "???????", words: ["ніч", "любов"]}
];

function initUI() {
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
        el.animate({opacity: 0}, 300, function(){
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
    img.attr("width", "100%");
    img.attr("height", "100%");
    word.append(img);
    slot.append(word);
  }

  slots.find('.word')
    .css({opacity: 0})
    .animate({opacity: 1}, 500);
}

function resetUI(callback) {
  // slots.empty();
  circle.removeClass("combo");
  play.attr('data-video-id', '')
  slots.find('.word').animate({opacity: 0}, 500)
  setTimeout(function() {
    slots.find('.word').remove()
    callback()
  }, 500)
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
