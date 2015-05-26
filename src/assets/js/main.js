
(function() {
    'use strict';


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


    var body = $('body');
    var scrollSections = $('.content-section');
    var scrollPlates = $('.pattern li');
    var parallaxSpeed = -0.4;
    var nav = $('nav.sidenav');
    var bgvid = $('video#bgvid');

    var cur_pos = 0;
    var winH = $(window).height();

    var scrollListener = function() {

        cur_pos = Math.max(0, $(window).scrollTop());
        var is_plates = false;

        if (!Modernizr.touch && parallaxSpeed !== 0) {
            body.each(function() {
                $(this).css('background-position', '50% ' + Math.round(cur_pos * parallaxSpeed) + 'px');
            });
        }

        scrollSections.each(function(i) {
            var top = $(this).offset().top;
            var bottom = top + $(this).outerHeight();
            var is_front = $(this).hasClass('section-front')? 1:0;

            // fuzzy section
            if (cur_pos + winH * 0.75 >= top && cur_pos <= bottom) {
                $(this).addClass('active');

                if (is_front && bgvid.hasClass('ready')) {
                    bgvid.get(0).play();
                }

            } else {
                $(this).removeClass('active');
                if (is_front && bgvid.hasClass('ready')) {
                    bgvid.get(0).pause();
                }
            }
            
            // exact section
            if (cur_pos >= top && cur_pos < bottom) {
                nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
                body.removeClass (function (index, className) {
                    return (className.match (/(^|\s)currentsection-\S+/g) || []).join(' ');
                }).addClass('currentsection-'+i);
            } else {
                nav.find('a[href="#'+$(this).attr('id')+'"]').removeClass('active');
            }
            
            if ($(this).hasClass('section-pattern')) {
                is_plates = $(this).hasClass('active');    
            }
            

        });
        
        if (is_plates) {
            scrollPlates.each(function() {
                var top = $(this).offset().top;
                var bottom = top + $(this).outerHeight();

                $(this).toggleClass('visible', cur_pos + winH * 0.75 >= top && cur_pos <= bottom);
                $(this).toggleClass('active', cur_pos >= top && cur_pos <= bottom);
            });
        }
        
    };
    window.addEventListener('scroll', scrollListener);
    scrollListener();


    var resizeListener = debounce(function() {
        winH = $(window).height(); 
        pep_update();
    }, 200);
    window.addEventListener('resize', resizeListener);


    $('.sidenav').each(function() {
        $(this).find('a.open-nav').click(function(event) {
            event.preventDefault();
            $(this).closest('.sidenav').toggleClass('active');
        });
        $(this).find('li:not(.site) a').click(function(event) {
            event.preventDefault();

            var $el = $(this), 
                id = $el.attr('href');

            $('html, body').animate({
                scrollTop: $(id).offset().top
            }, 500);
             
        });
    });


    $('video#bgvid').bind('play', function() {
        $(this).addClass('ready');
    });

    $('.passion-videos').each(function() {
        $(this).not(':contains(.initial)').find('li:nth(2)').addClass('initial');

        $(this).find('h2 a').click(function(event) {
        	event.preventDefault();
            var isActive = $(this).closest('li').hasClass('active');
            $(this).closest('li').toggleClass('active', !isActive).siblings('li').removeClass('active').parents('ul:first').toggleClass('has-active', !isActive).each(function() {
                $(this).addClass('transition');
                setTimeout(function(elm) {
                    $(elm).removeClass('transition');
                }, 500, this);
            });
        });
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
    var flexslider_start = function(slider) {
        slider.slides.eq(slider.currentSlide).addClass('flex-active-transition');
        slider.attr('data-current-slide', slider.currentSlide);
    },
    flexslider_before = function(slider) {
        slider.slides.eq(slider.currentSlide).removeClass('flex-active-transition');
    },
    flexslider_after = function(slider) {
        //setTimeout(function() {
            slider.slides.eq(slider.currentSlide).addClass('flex-active-transition');
            slider.attr('data-current-slide', slider.currentSlide);
        //}, 500);
    };

	$('.blue-slider, .products').flexslider({
		animation: 'slide',
		slideshow: false,
        controlNav: false,
        start: flexslider_start,
        before: flexslider_before,
        after: flexslider_after,
        startAt:0
	});

    $('.history .flexslider').flexslider({
        animation: 'slide',
        slideshow: false,
        controlNav: false,
        //directionNav: false,
        start: flexslider_start, 
        before: function(slider) {
            flexslider_before(slider);

            history_stop_elms.filter(':nth('+(slider.animatingTo)+')').find('a').each(function() {
                var $li = $(this).closest('li');
                $li.addClass('active').siblings('li').removeClass('active');
                $(history_pep).data('plugin_pep').moveTo($li.data('stop'), 0);
            });
        },
        after: flexslider_after,
        //manualControls: '.history .years li a',
        startAt:0
    });


    var history_pep = $('.history .years ul'),
        history_last_stop = 0,
        history_stop_elms = history_pep.find('li'),
        history_stops = [],
        history_constrain_to = [],
        history_calc_stops = function() {

            var offset = Math.round($(window).width() / 2);

            history_stops = [];
            history_last_stop = 0;

            history_stop_elms.each(function() {
                history_last_stop = Math.round(offset - $(this).offset().left);
                $(this).data('stop', history_last_stop);
                history_stops.push(history_last_stop);
            });

            history_constrain_to = [0,0,0,history_last_stop];
        },
        pep_init = function() {
            history_pep.each(function() {

                $(this).find('a').each(function(i) {
                    $(this).bind('click', function(event) {
                        $('.history .flexslider').flexslider(i);

                        var $li = $(this).closest('li');
                        $li.addClass('active').siblings('li').removeClass('active');
                        $(history_pep).data('plugin_pep').moveTo($li.data('stop'), 0);
                        
                        //event.stopPropagation();
                        event.preventDefault();
                        
                    }).bind('touchend', function() {
                        $(this).trigger('click');
                    });
                }).filter(':first').closest('li').addClass('active');

                history_calc_stops();

                $(this).pep({
                    axis: 'x',
                    constrainTo: history_constrain_to,
                    stops: history_stops,
                    //elementsWithInteraction: 'a',
                    moveTo: function(x,y) {
                        if (this.easing && this.options.stops !== 'undefined') {

                            // snap to nearest stop when easing
                            var dx = 0;
                            if (typeof x === 'string' && x.indexOf('=') !== false) {
                                dx = parseInt(this.$el.css('left'), 10);
                                //eval('dx' + x);
                                dx += parseInt(x.substr(0,1) + x.substr(2), 10);
                            } else {
                                dx = x;
                            }
                            var xClosest = 0;
                            $.each(this.options.stops, function(){
                                if (xClosest === null || Math.abs(this - dx) < Math.abs(xClosest - dx)) {
                                    xClosest = this;
                                }
                            });

                            x = xClosest;
                        }
                        this.$el.stop(true, false).css({ top: y , left: x });
                    },

                });

                // warm up pep object with fake click event, ready for prev/next from flexslider
                var ev = jQuery.Event('click', {originalEvent: {pageX:0, pageY:0}});
                $(this).data('plugin_pep').handleStart(ev);
                $(this).data('plugin_pep').handleStop(ev);
            });
        },
        pep_update = function() {

            // re-calc new stops
            history_calc_stops();

            // find pep obj and re-set options
            var pepObj = $(history_pep).data('plugin_pep');
            pepObj.options.stops = history_stops;
            pepObj.options.constrainTo = history_constrain_to;

            // move pep obj to new stop coordinates
            var $li = $(history_pep).find('li.active');
            pepObj.moveTo($li.data('stop'), 0);
        };

    pep_init();

    $('[data-original]').lazyload({
        //effect : 'fadeIn',
        skip_invisible : false,
        //threshold: 10,
    });

    $(window).load(function() {
        $('[data-original]').trigger('appear');
    });
})();


