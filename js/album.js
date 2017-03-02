$(document).ready(function() {
    $download = $('.download-album-cta')

    $download.on('click', function() {
        ga('send', 'event', {
        'eventCategory': 'album',
        'eventAction': 'download',
        'eventLabel': 'Shchastya'
        });

        var emailpage = window.open("/rozdilovi_shchastia_mp3.zip")
    });

});
