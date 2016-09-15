(function(){
  
  var slots, circle, field, play, playGhost;
  var combos = window.rozd_combos;
  
  function initUI() {

    play = $('#playen');
    play.attr('data-video-id', '5P2mzyJ06NU');

  }

  function retinaSrc(src) {
    if (window.Retina.isRetina()) {
      src = src.replace('.png', '@2x.png')
    }
    return src
  }

  function getCurrentTrack (id) {
    return combos.filter(function (item) {
      return item.video == id
    })
  }

  // expose some stuff
  window.rozd = {
    initUI: initUI,
    getCurrentTrack: getCurrentTrack,
  }
})()
