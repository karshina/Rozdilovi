(function($, undefined) {
    $.fn.dropdown = function() {
        var $searchWidget = $(this);
        var $searchInput = $searchWidget.children('.search-input');
        var $searchResult = $searchWidget.children('.search-result');
        var $selected;
        var $highlighted;

        var select = function(i) {
            $selected = $(i);
            card.update($selected.text());
            $searchInput.val('');
            $searchResult.addClass('shrink');
        };

        var highlight = function(i) {
            $highlighted = $(i);
            $highlighted.addClass('selected').siblings('.selected').removeClass('selected');
        };

        var highlighted = function() {
            return $highlighted || ($highlighted = $searchWidget.find('.search-result p.selected').first());
        };

        var scroll = function(event) {
            $searchResult.scrollTo('.selected');
        };

        var hover = function(event) {
            highlight(this);
        };

        var rebind = function(event) {
            bind();
        };

        var bind = function() {
            $searchResult.on('mouseover', 'p', hover);
            $searchWidget.off('mousemove', rebind);
        };

        var unbind = function() {
            $searchResult.off('mouseover', 'p', hover);
            $searchWidget.on('mousemove', rebind);
        };

        $searchResult.on('click', 'p', function(event) {
            select(this);
        });

        $searchInput.on('blur', function() {
            $searchResult.addClass('shrink');
        });

        $searchWidget.keydown(function(event) {
            unbind();
            switch(event.keyCode) {
                case 38:
                    highlight((highlighted() && $highlighted.prev().length > 0) ?
                        $highlighted.prev() : $searchResult.children().last());
                    scroll();
                    break;
                case 40:
                    highlight((highlighted() && $highlighted.next().length > 0) ?
                        $highlighted.next() : $searchResult.children().first());
                    scroll();
                    break;
                case 13:
                    if(highlighted()) {
                        select($highlighted);
                    }
                    break;
                default:
                    $searchResult.scrollTo(0);
                    break;
            }
        });
        bind();
    };

    $.fn.scrollTo = function(target, options, callback) {
        if(typeof options === 'function' && arguments.length === 2) {
            callback = options;
            options = target;
        }
        var settings = $.extend({
            scrollTarget  : target,
            offsetTop     : 100,
            duration      : 100,
            easing        : 'linear'
        }, options);

        return this.each(function(i) {
            var scrollPane = $(this);
            var scrollTarget = (typeof settings.scrollTarget === 'number') ? settings.scrollTarget : $(settings.scrollTarget);
            var scrollY = (typeof scrollTarget === 'number') ? scrollTarget : scrollTarget.position().top + scrollPane.scrollTop() - parseInt(settings.offsetTop, 10);

            scrollPane.animate({scrollTop: scrollY}, parseInt(settings.duration, 10), settings.easing, function() {
                if (typeof callback === 'function') {
                    callback.call(this);
                }
            });
        });
    };
})(jQuery);

$('.search-wrapper').dropdown();

$(document).ready(function($) {
    var $randomWords = $('.random-words');
    var $searchQuery = $('.search-input');
    var $searchResult = $('.search-result');
    var data = [];

    var prepareData = function () {
        _.forEach(window.album2017, function(e) {
            _.forEach(e.text, function(t) {
                data.push(t.words);
            });
        });

        data = _.uniq(data);
    }

    var randomWords = function() {
        return data[Math.floor(Math.random() * data.length)];
    }

    prepareData();
    card.update(randomWords());
    var auto = new AutoSuggestion(data);

    $searchQuery.on('keyup paste focus', _.debounce(function (e) {
        if (e.which == 40 || e.which == 38) return;
        $searchResult.empty();

        var query = $searchQuery.val().trim();

        if (!query) return;

        _.forEach (auto.suggest(query), function(resultItem) {
            $searchResult.append('<p>' + resultItem.sentense + '</p>');
        });

        $('.search-result p:first-child').addClass('selected');

        $searchResult.removeClass('shrink');
    }, 100));

    $randomWords.on('click', function(e) {
        card.update(randomWords());
    });
});
