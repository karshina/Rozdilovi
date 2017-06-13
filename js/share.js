$(document).ready(function($) {
    $('.share-tab').on('click', function(e) {
        var $tab = $(e.currentTarget);
        $('.share-tab').removeClass('active');
        $tab.addClass('active');

        $('.share-content').addClass('none');
        var contentId = $tab.data('contentId');
        $('#' + contentId).removeClass('none');

        var top_of_element = $('#' + contentId).offset().top;
    	var bottom_of_element = $('#' + contentId).offset().top + $('#' + contentId).outerHeight();
    	var bottom_of_screen = $(window).scrollTop() + $(window).height();
    	//var top_of_screen = $(window).scrollTop();

    	if(bottom_of_screen < bottom_of_element)
    		$("html, body").animate({ scrollTop: top_of_element-100}, 400);

    	$('.share-content').children('.success').addClass('none');
    	$('.throw-error').addClass('none');
    });
});
