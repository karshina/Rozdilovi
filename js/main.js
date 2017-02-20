$(document).ready(function($) {
    var $playAlbum = $('#playAlbum');
    var $playAlbumPart = $('.album-part-cta');
    var $albumCTA = $('.view-album-cta');
    var $favoriteTrack = $('.favorites>div');

    function playVideoPart(part, autoplay) {
        var playlist = $.map(album2017, function (video) {
            return video.video;
        });
        var video = $.extend({ playlist: playlist }, album2017[part]);
        videoPlayer.play(video, autoplay);
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
        playVideoPart('0', 1);
    });

    $albumCTA.on('click', function() {
        toggleControls(false);
        playVideoPart('1', 1);
    });

    $favoriteTrack.on('click', function(e) {
        toggleControls(false);
        var trackId = $(e.currentTarget).data('videoId');
        videoPlayer.play({ video: trackId }, 1);
    });

    $playAlbumPart.on('click', function(e) {
        toggleControls(false);
        var part = $(e.currentTarget).data('videoPart');
        playVideoPart(part, 1);
    });
});
