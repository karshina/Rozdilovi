var images = {
  "вночі": "word0.png",
  "ночі": "word1.png",
  "ніжно": "word2.png",
  "нічого": "word3.png",
  "ніч": "word4.png",
  "нічне": "word5.png",
  "ніжності": "word6.png",
  "любові": "word7.png",
  "ночами": "word8.png",
  "любов": "word9.png",
  "ніжність": "word10.png",
  "нічний": "word11.png",
  "ночей": "word12.png",
  "війна": "word13.png",
  "ніжні": "word14.png",
  "нічні": "word15.png",
  "нічних": "word16.png",
  "ніжними": "word17.png",
  "любов’ю": "word18.png"
}

var slots = $(".slot")
var circle = $(".circle")
var mainWords = ["вночі", "нічого", "ніч", "любові", "ніжні", "війна", "любов’ю"]

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

function updateUI() {
  resetUI()

  var circleWords = [];
  circle.find(".word").each(function(){
    circleWords.push($(this).attr('data-word'))
  })

  var newState = getState(circleWords)

  fillSlots(newState.suggestedWords)

  if (newState.combo) {
    circle.addClass("combo")
  }
}

function resetUI() {
  slots.empty()
  circle.removeClass("combo")
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

  result.suggestedWords = $.unique(result.suggestedWords);
  result.suggestedWords.reverse()

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









