
$(document).ready(function($) {
    $('.share-tab').on('click', function(e) {
        var $tab = $(e.currentTarget);
        $('.share-tab').removeClass('active');
        $tab.addClass('active');

        $('.share-content').addClass('none');
        var contentId = $tab.data('contentId');
        $('#' + contentId).removeClass('none');
    });
});
