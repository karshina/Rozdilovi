$(document).ready(function($) {
    var $randomWords = $('.random-words');
    var $searchQuery = $('.search-input');
    var $searchResult = $('.search-result');
    var $searchResultItem = $('.search-result p');
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

    $searchQuery.on('keydown', function(e) {
        var key = e.which;

        if (key == 40 || key == 38) {
            var $sel = $('.search-result p.selected');
            if ($sel.length == 0) return;

            $('.search-result p').removeClass('selected');

            if (key == 40) {
                if ($sel.next().length == 0) {
                    $('.search-result p:first-child').addClass('selected');
                } else {
                    $sel.next().addClass('selected');
                }
            } else {
                if ($sel.prev().length == 0) {
                    $('.search-result p:last-child').addClass('selected');
                } else {
                    $sel.prev().addClass('selected');
                }
            }
        } else if (key == 13) {
            // card.update();
        }
    });

    $searchQuery.on('keyup', _.debounce(function (e) {
        if (e.keyCode == 40 || e.keyCode == 38) return;
        $searchResult.empty();

        var query = $searchQuery.val().trim();

        if (!query) return;

        _.forEach (auto.suggest(query), function(resultItem) {
            $searchResult.append('<p>' + resultItem.sentense + '</p>');
        });

        $('.search-result p:first-child').addClass('selected');

        $searchResult.removeClass('shrink');
    }, 100));

    $searchQuery.on('blur', function() {
        $searchResult.addClass('shrink');
    });

    $searchResultItem.on('click', function(e) {
        // card.update();
    });

    $randomWords.on('click', function(e) {
        card.update(randomWords());
    });
});
