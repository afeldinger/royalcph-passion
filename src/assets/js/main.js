
(function() {
    'use strict';


    $('.passion-videos li a').click(function(event) {
    	event.preventDefault();
        var isActive = $(this).closest('li').hasClass('active');
        $(this).closest('li').toggleClass('active', !isActive).siblings('li').removeClass('active').parents('ul:first').toggleClass('has-active', !isActive);
    });


	// init flexsliders on page
	$('.flexslider').flexslider({
		animation: 'slide',
		slideshow: false,
	});

})();


