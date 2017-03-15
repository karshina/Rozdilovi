function AutoSuggestion(data) {
    var MAX_LENGTH = 5;
    var MAX_SUGGESTIONS = 10;
    var MIN_SCORE_TO_BEST = 0.1;
    var index;

    var init = function() {
        index = createIndex(data);
    }

    var getNgrams = function(text) {
        text = text.replace('á', 'а');
        text = text.replace('\'', '');
        text = text.replace('’', '');
        text = ' ' + text;
        var result = [];
        for(var i = 1; i <= MAX_LENGTH; i++) {
            for(var j = 0; j < text.length; j++) {
                var currentNgram = text.substring(j, j+i).toLowerCase();
                if (!/^ ?[\wа-яіїє]+ ?$/ig.test(currentNgram)) continue;

                ngramExist = false;
                _.forEach(result, function(e) {
                    if (e.ngram == currentNgram) {
                        if (e.position > j) {
                            e.position = j;
                        }
                        ngramExist = true;
                    };
                });
                if (!ngramExist) {
                    result.push({ ngram: currentNgram, position: j})
                }
            };
        };
        return result;
    };

    var createIndex = function(data) {
        var ngrams = [];
        _.forEach(data, function(e) {
            ngrams.push(getNgrams(e));
        });

        var index = {};
        _.forEach(ngrams, function(e, key) {
            _.forEach(e, function(ngram) {
                if (!index[ngram.ngram]) {
                    index[ngram.ngram] = [];
                };
                index[ngram.ngram].push({ sentenceIndex: key, position: ngram.position });
            });
        });

        return index;
    };

    this.suggest = function(queryText) {
        var queryNgrams = getNgrams(queryText);

        var scores = {};

        _.forEach(queryNgrams, function(ngram) {
            if (!index[ngram.ngram]) return;

            _.forEach(index[ngram.ngram], function (i) {
                if (!scores[i.sentenceIndex]) {
                    scores[i.sentenceIndex] = { score: 0, sentense: data[i.sentenceIndex], debug: [] };
                }

                scoreObject = scores[i.sentenceIndex];

                var score = Math.pow(10, (ngram.ngram.length - 1)) / (Math.log(i.position + 2) * Math.LOG2E);
                if (ngram.ngram[0] == ' ') {
                    score += Math.pow(5, ngram.ngram.length);
                }

                scoreObject.score += score;
                scoreObject.debug.push('ngram=' + ngram.ngram + '; score=' + score);
            });
        });

        var scoreArray = Object.keys(scores).map(function(key) {
            return scores[key];
        })

        var sortedScores = scoreArray.sort(function(a, b) {
            return b.score - a.score;
        });

        var suggestions = [];

        _.forEach(sortedScores, function (e) {
            var currentToFirst = 1;
            if (suggestions.length != 0) {
                currentToFirst = e.score / suggestions[0].score;
            }

            if (suggestions.length < MAX_SUGGESTIONS && currentToFirst > MIN_SCORE_TO_BEST) {
                suggestions.push(e);
            }
        });

        return suggestions;
    };

    init();
};

