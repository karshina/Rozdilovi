$(document).ready(function() {
  var $nav = $('.nav')
  $('.menu').on('click', function() {
    if ($nav.hasClass('nav-hide')) {
      $nav.removeClass('nav-hide')
    }
    else {
      $nav.addClass('nav-hide')
    }
  })

  $('body').on('click', function(e) {
    var $el = $(e.target)
    var isParent = $el.parent('.nav').length || $el.parent('.menu').length
    if (!$nav.hasClass('nav-hide') && !isParent) {
      $nav.addClass('nav-hide')
    }
  })
})