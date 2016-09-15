(function(){
  
  var slots, circle, field, play, playGhost;
  var combos = window.rozd_combos;
  
  function initUI() {

    play = $('#playen');
    play.attr('data-video-id', 'anC35O1EHeQ');

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
