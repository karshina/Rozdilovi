$(document).ready(function() {
  var $nav = $('.nav')
  var $playlist = $('#playlist')
  var $playlistAlbum = $('.playlist-album')

  $('.menu').on('click', function() {
    if ($nav.hasClass('nav-hide')) {
      $nav.removeClass('nav-hide')

      ga('send', 'event', {
        'eventCategory': 'ui',
        'eventAction': 'show-menu'
      });
    }
    else {
      $nav.addClass('nav-hide')
    }
  })

  $playlist.on('click', function() {
    $playlistAlbum.toggleClass('playlist-hide');
  });

  $('body').on('click', function(e) {
    var $el = $(e.target)
    var isParent = $el.parent('.nav').length || $el.parent('.menu').length || $el.is($nav)
    if (!$nav.hasClass('nav-hide') && !isParent) {
      $nav.addClass('nav-hide')
    }
  })

  $('body').on('click', function(e) {
    if ($playlistAlbum.hasClass('playlist-hide')) {
      return;
    }
    var $el = $(e.target);
    var isClickedInsideMenu = (
      $el.parent('.playlist-album').length ||
      $el.is($playlistAlbum) ||
      $el.is($playlist)
    );
    if (!isClickedInsideMenu) {
      $playlistAlbum.addClass('playlist-hide')
    }
  })
})
