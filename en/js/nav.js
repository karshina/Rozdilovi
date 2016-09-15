$(document).ready(function() {
  var $nav = $('.nav')
  $('.menu_en').on('click', function() {
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

  $('body').on('click', function(e) {
    var $el = $(e.target)
    var isParent = $el.parent('.nav').length || $el.parent('.menu_en').length || $el.is($nav)
    if (!$nav.hasClass('nav-hide') && !isParent) {
      $nav.addClass('nav-hide')
    }
  })
})
