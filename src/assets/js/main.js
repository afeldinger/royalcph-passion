
(function() {
    'use strict';

/*
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }
*/

    var body = $('html, body');
    var scrollSections = $('.content-section');
    var scrollPlates = $('.pattern li');
    var parallaxSpeed = -0.4;
    var nav = $('nav.sidenav');

    var scrollListener = function() {
        var cur_pos = $(window).scrollTop();
        var winH = $(window).height();


        if (!Modernizr.touch && parallaxSpeed !== 0) {
            body.each(function() {
                $(this).css('background-position', '50% ' + (cur_pos * parallaxSpeed) + 'px');
            });
        }

        scrollSections.each(function() {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();

            $(this).toggleClass('active', cur_pos + winH * 0.75 >= top && cur_pos <= bottom);
            nav.find('a[href="#'+$(this).attr('id')+'"]').toggleClass('active', cur_pos >= top && cur_pos < bottom);

            /*
            if (cur_pos >= top && cur_pos <= bottom) {
                nav.find('a').removeClass('active');
                nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
            }
            */
        });

        scrollPlates.each(function() {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();
            $(this).toggleClass('active', cur_pos >= top && cur_pos <= bottom);
        });
        
    };
    scrollListener();
    window.addEventListener('scroll', scrollListener);


    $('.sidenav').each(function() {
        $(this).find('a.open-nav').click(function(event) {
            event.preventDefault();
            $(this).closest('.sidenav').toggleClass('active');
        });
        $(this).find('li a').click(function(event) {
            event.preventDefault();

            var $el = $(this), 
                id = $el.attr('href');

            $('html, body').animate({
                scrollTop: $(id).offset().top
            }, 500);
             
        });
    });

    $('.passion-videos li a').click(function(event) {
    	event.preventDefault();
        var isActive = $(this).closest('li').hasClass('active');
        $(this).closest('li').toggleClass('active', !isActive).siblings('li').removeClass('active').parents('ul:first').toggleClass('has-active', !isActive);
    });

    $('.inspiration-slider').mThumbnailScroller({
        axis:'x',
        type:'hover-50',
        setLeft:'0%',
        speed:20
    }).find('li').click(function() {
        $(this).addClass('active').siblings('li').removeClass('active');
    });

	// init flexsliders on page
	$('.flexslider').flexslider({
		animation: 'slide',
		slideshow: false,
        controlNav: false,
        start: function(slider) {
            slider.slides.eq(slider.currentSlide).addClass('flex-active-transition');
            slider.attr('data-current-slide', slider.currentSlide);
        },
        before: function(slider) {
            slider.slides.eq(slider.currentSlide).removeClass('flex-active-transition');
        },
        after: function(slider) {
            //setTimeout(function() {
                slider.slides.eq(slider.currentSlide).addClass('flex-active-transition');
                slider.attr('data-current-slide', slider.currentSlide);
            //}, 500);
        }
	});

})();


