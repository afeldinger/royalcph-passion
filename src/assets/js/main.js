
$.extend($.lazyLoadXT, {
  autoLoadTime: 2500,
  //autoInit:  false,
  //srcAttr: 'data-original',
  //bgAttr: 'data-bg',
});

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

    var bgvid = false;
    if (!Modernizr.touch) {
        $('.section-front').append('<video autoplay preload="auto" id="bgvid" loop muted><source src="http://player.vimeo.com/external/128246668.sd.mp4?s=e00445b30f892f28b83d2d8e83b89842&profile_id=112" type="video/mp4"><source src="http://player.vimeo.com/external/128246668.m3u8?p=high,standard&s=943b7f40797fc7532c026fbcd237c006" type="application/x-mpegURL"></video>');
        bgvid = $('video#bgvid');
        bgvid.bind('play', function() {
            $(this).addClass('ready');
        });
    } else {

    }

    var cur_pos = 0;
    var winH = $(window).height();

    var fuzzyFactor = !Modernizr.touch? 0.75 : 1;

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

            if (cur_pos + winH * fuzzyFactor >= top && cur_pos <= bottom) {
                $(this).addClass('active');

                if (!Modernizr.touch && is_front && bgvid.hasClass('ready')) {
                    bgvid.get(0).play();
                }

            } else {
                $(this).removeClass('active');
                if (!Modernizr.touch && is_front && bgvid.hasClass('ready')) {
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

                //$(this).toggleClass('visible', cur_pos + winH >= top * 1.1 && cur_pos * 1.2 <= bottom);
                //$(this).toggleClass('visible', cur_pos + winH * 0.3 >= top && cur_pos + winH * 0.65 <= bottom);
                $(this).toggleClass('visible', cur_pos + winH * 0.3 >= top);
                $(this).toggleClass('active', cur_pos >= top && cur_pos <= bottom);
            });
        }
        
    };
    window.addEventListener('scroll', scrollListener);
    scrollListener();


    var resizeListener = debounce(function() {
        winH = $(window).height(); 
        scrollListener();
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
        speed:20,
        callbacks: {
            whileScrolling: function() {
                if (!$(this).hasClass('loaded')) {
                    if ($(this).find('img:not(.lazy-loaded)').length == 0) {
                        $(this).addClass('loaded');
                    }
                    $(window).trigger('scroll');
                }
                
                
            }
        }
    }).find('li').click(function() {
        $(this).toggleClass('active').siblings('li').removeClass('active');
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

              setTimeout(function() {
                $(window).trigger('scroll');
              }, 50);
        //}, 500);
    };

    $('.blue-slider, .products').flexslider({
        animation: 'slide',
        animationSpeed: Modernizr.touch ? 300 : 600,
        slideshow: false,
        controlNav: false,
        start: flexslider_start,
        before: flexslider_before,
        after: flexslider_after,
        startAt:0
    });

    $('.history .flexslider').flexslider({
        animation: 'slide',
        animationSpeed: Modernizr.touch ? 300 : 600,
        slideshow: false,
        controlNav: false,
        //directionNav: false,
        start: flexslider_start, 
        before: function(slider) {
            flexslider_before(slider);

            history_stop_elms.filter(':nth('+(slider.animatingTo)+')').find('a').each(function() {
                var $li = $(this).closest('li');
                $li.addClass('active').siblings('li').removeClass('active');

                var pepObj = $(history_pep).data('plugin_pep');

                // Find current x offset
                
                var cx = 0;
                var dx = 0;
                if ( !pepObj.shouldUseCSSTranslation() ) {
                    cx = parseInt(pepObj.$el.css('left'), 10);
                    dx = $li.data('stop');
                } else {
                    if ( !pepObj.cssX ) {
                        var matrixArray  = pepObj.matrixToArray( pepObj.matrixString() );
                        pepObj.cssX = pepObj.xTranslation( matrixArray );    
                    }
                    cx = pepObj.cssX;
                    dx = $li.data('stop') - cx;
                }

                pepObj.options.moveTo.call(pepObj, dx, 0);
/*
                var point = $li.offset();
                var ev = jQuery.Event('click', {originalEvent: {pageX:point.left, pageY:point.top}});
                pepObj.handleMove(ev);
*/

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

                        //event.stopPropagation();
                        event.preventDefault();
                        
                    });
                    if (Modernizr.touch) {
                        $(this).bind('tap', function() {
                            $(this).trigger('click');
                        });
                    }

                }).filter(':first').closest('li').addClass('active');

                history_calc_stops();

                $(this).pep({
                    axis: 'x',
                    //debug: true,
                    //useCSSTranslation: false,
                    constrainTo: history_constrain_to,
                    stops: history_stops,
                    //elementsWithInteraction: 'a',
                    moveTo: function(x,y) {

                        // Find current x offset
                        var cx = 0;
                        if ( !this.shouldUseCSSTranslation() ) {
                            cx = parseInt(this.$el.css('left'), 10);
                        } else {
                            if ( !this.cssX ) {
                                var matrixArray  = this.matrixToArray( this.matrixString() );
                                this.cssX = this.xTranslation( matrixArray );    
                            }
                            cx = this.cssX;
                        }

                        // Find integer delta x - how much are we moving the timeline?
                        var dx = 0;
                        if (typeof x === 'string' && x.indexOf('=') !== false) {
                            dx = parseInt(x.substr(0,1) + x.substr(2), 10);
                        } else {
                            dx = x;
                        }

                        // snap to nearest stop when easing
                        if (this.easing && this.options.stops !== 'undefined') {

                            var xClosest = null;
                            $.each(this.options.stops, function(){
                                if (xClosest === null || Math.abs(this - cx - dx) < Math.abs(xClosest - cx - dx)) {
                                    xClosest = this;
                                }
                            });
                            x = xClosest;
                            dx = xClosest - cx;

                        }

                        if ( !this.shouldUseCSSTranslation() ) {
                            this.moveTo( x, 0 );
                        } else {
/*
                            if ( this.options.constrainTo ) {
                                var hash = this.handleConstraint(dx, 0);
                                dx = (hash.x === false) ? dx : 0 ;
                            }
*/
                            this.moveToUsingTransforms( dx, 0 );
                        }


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
            pepObj.options.moveTo.call(pepObj, $li.data('stop'), 0);
        };

    pep_init();

/*
    $('[data-original]').lazyload({
        //effect : 'fadeIn',
        skip_invisible : false,
        //threshold: 10,
    });
*/


    $('[data-original]').lazyLoadXT({
        srcAttr: 'data-original',
        visibleOnly: false,
        edgeY: 200,
    });


    $('[data-src]').lazyLoadXT({
        srcAttr: 'data-src',
    });


    $(window).bind('load', function() {

        // When page is loaded, begin fetching and playing background video
        if (!Modernizr.touch) {
            bgvid.attr('preload', 'auto').attr('autoplay', 'true');
        }

        //$('[data-original]').trigger('appear');

    });


})();