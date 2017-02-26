$(document).ready(function($) {
    var $searchQuery = $('.search-input');
    var $searchResult = $('.search-result');

    var prepareData = function () {
        var data = [];

        _.forEach(window.album2017, function(e) {
            _.forEach(e.text, function(t) {
                data.push(t.words);
            });
        });

        return _.uniq(data);
    }

    var auto = new AutoSuggestion(prepareData());

    $searchQuery.on('keyup', _.debounce(function (e) {
        $searchResult.empty();

        var query = $searchQuery.val().trim();

        if (!query) {
            return;
        }

        _.forEach (auto.suggest(query), function(resultItem) {
            $searchResult.append('<p>' + resultItem.sentense + '</p>');
        });

        $searchResult.removeClass('shrink');
    }, 100));

    $searchQuery.on('blur', function() {
        $searchResult.addClass('shrink');
    });
});
