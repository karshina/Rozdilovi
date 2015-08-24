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
  "ніжними": "img/nizhnymy.png",
}

var slots = $(".slot")
var circle = $("#circle")
var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю"]
// var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю", "ніжності", "ночі"]

var combos = [
  ["вночі", "ночі", "ніжно"],
  ["нічого", "ніч", "нічне", "ніжності", "любові"],
  ["нічого", "любові", "ніжності", "ночами", "нічого"],
  ["ніч", "любов"],
  ["любов", "ніжність", "вночі"],
  ["нічого", "любові", "ніч", "ніжності"],
  ["любові", "любов", "ніч", "нічний"],
  ["ночі", "ніч", "ніжно", "нічого", "ніч"],
  ["ніч", "любов", "ночей"],
  ["любові"],
  ["нічого", "нічого"],
  ["вночі", "війна"],
  ["ніжні"],
  ["нічого"],
  ["любов", "нічні", "ніжність"],
  ["любов", "ніжність"],
  ["нічних", "вночі"],
  ["ніжними", "вночі"],
  ["нічних", "любов"],
  ["любов’ю"],
  ["ніч", "любов"],
]

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
  var circleWords = [];
  circle.find(".word").each(function(){
    circleWords.push($(this).attr('data-word'))
  })

  var newState = getState(circleWords);

  fillSlots(newState.suggestedWords);
  slots.find('.word')
    .css({opacity: 0})
    .animate({opacity: 1}, 500);

  if (newState.combo) {
    circle.addClass("combo");
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
}

function resetUI(callback) {
  // slots.empty();
  circle.removeClass("combo");
  slots.find('.word').animate({opacity: 0}, 500)
  setTimeout(function() {
    slots.find('.word').remove()
    callback()
  }, 500)
}

function getState(circleWords) {

  var result = {  
    suggestedWords: [],
    combo: false
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

function suggest(comboArray, circleWords) {
  var result = {  
    suggestedWords: [],
    combo: false
  };

  var comboCopy = [].concat(comboArray);

  for (var i in circleWords) {
    var idx = comboCopy.indexOf(circleWords[i]);
    if (idx == -1) {
      return result;
    }
    comboCopy.splice(idx, 1);
  }

  if (comboCopy.length == 0) {
    result.combo = true;
  }

  result.suggestedWords = comboCopy;

  return result;
}

function uniqueWords(words) {
  var result = [], index = {};
  for (var i = 0, l = words.length; i < l; i++) {
    if (!index[words[i]]) {
      result.push(words[i]);
      index[words[i]] = 1;
    }
  }
  return result
}






