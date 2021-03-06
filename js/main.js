$(document).ready(function($) {
    var $playAlbum = $('#playAlbum');
    var $playAlbumPart = $('.album-part-cta');
    var $albumCTA = $('.view-album-cta');
    var $favoriteTrack = $('.favorites>div');

    function getUrlParam(param){
        var value = decodeURIComponent(
            (RegExp(param + '=' + '(.+?)(&|$)').exec(location.search)||["",""])[1]);
        return value;
    }

    function toggleControls(isShown, opts) {
        opts = $.extend({
            preplay: isShown,
            logoLight: isShown,
            lang: isShown,
            bannerTour: isShown,
            playlist: isShown
        }, opts || {});

        $('.banner-tour').toggle(opts.bannerTour);
        //$('.logo-light').toggleClass('fade', !opts.logoLight);
        $('.lang').toggleClass('none', !opts.lang);
        $('#preplay').toggleClass('hide', !opts.preplay);
        $('.playlist-album').toggleClass('playlist-hide', !opts.playlist);
    }

    $playAlbum.on('click', function() {
        //TMP: skip preplay
        //playVideoPart('1');
        //toggleControls(false, { preplay: true, logoLight: true });
        toggleControls(false);
        $part = getUrlParam('p') != '' ? getUrlParam('p') : '0'
        $time = getUrlParam('t') != '' ? parseInt(getUrlParam('t')) : 0
        videoPlayer.play($part, $time, 1);
    });

    $albumCTA.on('click', function() {
        toggleControls(false);
        videoPlayer.play('0', 0, 1);
    });

    $favoriteTrack.on('click', function(e) {
        toggleControls(false);
        var trackId = $(e.currentTarget).data('videoId');
        videoPlayer.play({ video: trackId }, 1);
    });

    $playAlbumPart.on('click', function(e) {
        toggleControls(false);
        var part = $(e.currentTarget).data('videoPart');
        videoPlayer.play(part, 0, 1);
    });
});
