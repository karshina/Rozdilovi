$(document).ready(function() {
    $postcardsContainer = $('.postcards-slider>div:first-child')
    $nextPostcard = $('.postcards-slider #next')
    $prevPostcard = $('.postcards-slider #prev')
    $rotatePostcard = $('.postcards-slider #rotate')

    $nextPostcard.on('click', function() {
        var $current = $('.postcards-slider .postcard.current');
        var $next = $($current.next());
        if ($next.length != 0) {
            $current.removeClass('current');
            $next.addClass('current');
            centerSlide($next);
        };
    });

    $prevPostcard.on('click', function() {
        var $current = $('.postcards-slider .postcard.current');
        var $prev = $($current.prev());
        if ($prev.length != 0) {
            $current.removeClass('current');
            $prev.addClass('current');
            centerSlide($prev);
        };
    });

    $rotatePostcard.on('click', function() {
        $('.postcards-slider .postcard.current .flip').toggleClass('rotate');
    });

    $(window).resize(function() {
        centerCurrentSlide();
    });

    function centerSlide($slide) {
        var containerLeft = $postcardsContainer.position().left
        var offset = $slide.offset().left
        var wantedOffset = ($(window).width() - $slide.width()) / 2.0
        $postcardsContainer.css({
            left: containerLeft + (wantedOffset - offset)
        });
    };

    function centerCurrentSlide() {
        centerSlide($('.postcards-slider .postcard.current'));
    };

    centerCurrentSlide();
});
