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
            $("html, body").animate({ scrollTop: 180 }, 400);
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
                    resetShare();
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

$('.search-wrapper').on("click", function() {
    $('.search-input').focus();
});

function resetShare() {
    $('.share-tab').removeClass('active');
    $('.share-content').addClass('none');
    $('.share-content').children('.success').addClass('none');
    $('.throw-error').addClass('none');
}

$(document).ready(function($) {
    var $randomWords = $('.random-words');
    var $searchQuery = $('.search-input');
    var $searchResult = $('.search-result');
    var $shareEmail = $('#shareEmail');
    var $shareEmbed = $('#shareEmbed');
    var $img = $('#img');
    var $text = $('#text');
    var $sendEmail = $('#sendEmail');
    var $sendFB = $('.facebook');
    var $sendLink = $('.embed');
    var $embeddableLink = $('#embedEcard');
    var $copyButton = $('#copyButton');
    var $spinner2 = $('#spinner2')
    var data = [];

    $spinner2.hide()

   // var clipboard = new Clipboard('#copyButton');

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

        var top_of_element = $('.search-result').offset().top;
        var bottom_of_element = $('.search-result').offset().top + $('.search-result').outerHeight();
        var bottom_of_screen = $(window).scrollTop() + $(window).height();
        //var top_of_screen = $(window).scrollTop();

        if(bottom_of_screen < bottom_of_element)
            $("html, body").animate({ scrollTop: top_of_element-100}, 400);

    }, 100));

    $randomWords.on('click', function(e) {
        card.update(randomWords());
        resetShare();
        if ($(window).scrollTop() > $('#card-img').offset().top)
            $("html, body").animate({ scrollTop: $('#card-img').offset().top - 10}, 400);
    });

    $sendLink.on('click', function(e) {

        document.getElementById("embedEcard").value = "Завантажуємо..."
        $copyButton.attr('disabled', true)

        $shareEmbed.children('.success').addClass('none');

        var $imageData = card.getImageData();

         $.ajax({
            type: "POST",
            url: "/upload.php",
            processData: false,
            data: $imageData
        }).done(function(o) {

            var vars = [
                'img=' + o.id,
                'video=3_VOPQ1B-F0'
            ]
            var url = document.location.origin + "/" + '?' + vars.join('&')

            document.getElementById("embedEcard").value = url
            $copyButton.attr('disabled', false)
        })

    });

    $embeddableLink.focus(function() {
        $(this).select();
    });

    $copyButton.on('click', function(e) {

        $embeddableLink.select();
        document.execCommand("copy");

        $shareEmbed.children('.success').removeClass('none');

    });

    $sendFB.on('click', function(e) {
        
        var $imageData = card.getImageData();

        var fbpopup = window.open("/loading.html", "pop", "width=600, height=400, scrollbars=no");

        $.ajax({
            type: "POST",
            url: "/upload.php",
            processData: false,
            data: $imageData
        }).done(function(o) {

            var vars = [
                'img=' + o.id,
                'video=3_VOPQ1B-F0'
            ]
            var url = encodeURIComponent(document.location.origin + "/" + '?' + vars.join('&'))

            fbpopup.location.replace("https://www.facebook.com/sharer/sharer.php?u=" + url);

        })

    });

    $sendEmail.on('click', function(e) {
        
        var $imageData = card.getImageData();

        $shareEmail.children('.success').addClass('none');
        $sendEmail.addClass('disabled');
        $spinner2.show();

        $.ajax({
            type: "POST",
            url: "/upload.php",
            processData: false,
            data: $imageData
        }).done(function(o) {
            /*ga('send', 'event', {
                'eventCategory': 'video',
                'eventAction': 'card-email-window-open',
                'eventLabel': cards[currentCard],
                'eventValue': new Date - _t
            });

            ga('send', 'timing', {
                'timingCategory': 'video',
                'timingVar': 'card-upload-time',
                'timingLabel': cards[currentCard],
                'timingValue': new Date - _t
            });*/

            document.getElementById("img").value = o.id
            //document.getElementById("text").value = card.getWords()

            $.ajax({
                type: "POST",
                url: "/mailer.php",
                dataType  : 'json',
                data: { img: document.getElementById("img").value, 
                        text: card.getWords(), 
                        email: document.getElementById("email").value, 
                        name: document.getElementById("name").value, 
                        replyto: document.getElementById("replyto").value }
            })
            .done(function(data) {
                if (!data.success) { 
                    if (data.errors.name) { 
                       $('.throw-error').html(data.errors.name);
                       $('.throw-error').removeClass('none');
                    }
                }
                else {
                   $shareEmail[0].reset();
                   $('.throw-error').addClass('none');
                   $shareEmail.children('.success').removeClass('none');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $('.throw-error').html('Перепрошуємо, виникла помилка: ' + textStatus + ' ' + errorThrown);
            })
            .always(function() {
                $spinner2.hide();
                $sendEmail.removeClass('disabled');
            });
        });
    });
});
