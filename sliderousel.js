// Cameron Spear's "Slidersel" (that's supposed to be slider + carousel)
;(function($, document, window, undefined) {
    $.fn.carousel = function(method) {  
        // Method calling logic
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {        
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.carousel');
        } 
        
        // function next() { methods.next.apply(this, arguments); }
    }
    
    // default slides

    // structure is:
    // <div class="slider">
    //     <div class="panel">
    //         <div class="slide 1">
    //             // ... any content ...
    //         </div>
    //         <div class="slide 2">
    //             // ... any content ...
    //         </div>
    //         <div class="slide 3">
    //             // ... any content ...
    //         </div>
    //     </div>
    // </div>
    var defaults = {
        slide:        '.slide', // default slide class
        panel:        '.panel', // default panel class (section that contains all slides)
        direction:    'next', // [next | prev] indicates direction to move slider if it auto-slides
        init:         function(prevSlide, curSlide, nextSlide, settings) {}, // before-init callback
        before:       function(prevSlide, curSlide, nextSlide, settings) {}, // before-slide callback
        after:        function(prevSlide, curSlide, nextSlide, settings) {}, // after-slide callback
        slideshow:    false, // is this a slideshow? (i.e. auto-advances)
        speed:        800, // transition speed in ms
        timeout:      8000, // timeout between slides (timer starts after last slide transition ends)
        easing:       'swing', // easing. without jQuery UI, only swing and linear are supported
        fullWidth:    false, // should this slideshow take up the entire width of the screen?
        needsStyle:   false, // apply styles via jQuery?
        nextButton:   false, // class for button that moves slideshow forward
        prevButton:   false, // class for button that moves slideshow backward
        slidesToShow: -1, // number of slides to show at one time (-1 for as many as will fit). 
                          // does not initiate if there aren't that many slides. 
                          // does not apply to fullwidth slideshows

        jump:       1 // private var to keep track of jumps?
    };    

    var clickable = true;
        
    var methods = {

        // function is called if no other function was explicitly called
        init: function(options) {

            // return self for chaining
            return this.each(function() {   
                var $this = $(this);
               
                var settings = $.extend({}, defaults, options);
                $this.data('carousel', settings);
                                
                settings.curSlideIndex = 0;

                var $panel = $this.find(settings.panel);
                var $slides = $panel.find(settings.slide);

                // initialize positions (which are based off of initial DOM position)
                $slides.each(function(index) {
                    $(this).data('position', index);
                });
                
                if($slides.length >= settings.slidesToShow || settings.slidesToShow === -1) {    

                    // option to set the styles via jQuery
                    // extra initialization overhead, but easier to set up
                    // must be done first or else the next step may have incorrect numbers
                    if(settings.needsStyle) {
                        $this.width(settings.slideAmount).css('overflow', 'hidden');
                        $panel.width('12000px').css('position', 'relative');
                        
                        if(settings.fullWidth) $panel.css('margin-left', '50%');
                        $slides.css('float', 'left');
                    }

                    $(window).resize(function() {
                        // make sure we have recent version of "slides"
                        $slides = $panel.find(settings.slide);

                        // because of different combinations of settings, this can get complex,
                        // but we need to adjust the slider on screen resize
                        if(settings.fullWidth) {
                            $this.width(Math.floor($(this).width())) 
                            settings.offset = $slides.outerWidth(true) / 2;
                        } else {
                            settings.offset = 0;

                            if(settings.slidesToShow > 0) {
                                $this.width(settings.slidesToShow * settings.slideWidth);                            
                            }
                        }

                        // make sure these settings realign with screen resize
                        settings.slideAmount = settings.slideWidth = $slides.eq(0).outerWidth(true);
                        
                        settings.numberOfSlides = $slides.length;
                        
                        // these two lines are the "reset"
                        $panel.css('left', '-' + ((settings.slideAmount) + settings.offset) + 'px');
                        settings.curSlideIndex = (settings.curSlideIndex % settings.numberOfSlides) + 1;
                        
                        // TODO: This assumes a min width of 960, but probably shouldn't
                        if(settings.fullWidth) {
                            $('img', settings.slide).css('max-width', Math.max(960, $(this).width()));
                            $this.height('auto');
                        }
                    }).resize();
                    
                    // bind buttons
                    if(settings.nextButton) {
                        $(settings.prevButton).click(function(event) { 
                            event.preventDefault(); 
                            $this.carousel('next'); 
                        });
                    }
                    if(settings.prevButton) {
                        $(settings.nextButton).click(function(event) { 
                            event.preventDefault(); 
                            $this.carousel('prev'); 
                        });
                    }
                    
                    // if only 1 slide, copy and append twice. if only 2 slides, copy the two slides and append. needs min of 3 slides to work (since 3 can be visible at once)
                    if(settings.fullWidth) {
                        if(settings.numberOfSlides == 1) {
                            $slides.filter(':last')
                                .after($slides.filter(':first').clone(true))
                                .after($slides.filter(':first').clone(true), settings); 
                        }

                        if(settings.numberOfSlides == 2) {
                            $slides.filter(':last')
                                .after($slides.clone(true), settings);
                        }
                    }
                    
                    // first last slide before first 
                    $slides.filter(':last').insertBefore(
                        $slides.filter(':first')
                    );
                            
                    // prepare the first slide
                    $panel.css('left', '-' + ((settings.slideWidth) + settings.offset) + 'px');
                    settings.init($slides.eq(0), $slides.eq(1), $slides.eq(2), settings);
                
                    // set timeout if this is a slideshow
                    if(settings.slideshow) {
                        settings.timer = setTimeout(function() { $this.carousel(settings.direction); }, settings.timeout);
                    }     
                }
            });
        }, // init()
        
        // move slider in the forward direction (direction depends on settings)
        next: function() { 

            // return self for chaining
            return $(this).each(function() {
                var $this = $(this);
                
                var settings = $this.data('carousel');
          
                // can't chain clicks
                if(!clickable) return;
                clickable = false;

                // prep the slider to go forward
                var jump = settings.jump;
                // if we're sliding several at once, jump will be the number we're jumping, so we prepare accodingly
                for(var i=0; i < jump; i++) {
                    $(settings.slide + ':last').after($(settings.slide).eq(i).clone(true));
                }
                
                // trigger the "slide is about to start" or "before" callback
                settings.before($(settings.slide).eq(0 + (jump - 1)), $(settings.slide).eq(1 + (jump - 1)), $(settings.slide).eq(2 + (jump - 1)), settings);
        
                // advance the slider to the next position
                $(settings.panel).animate({'left': '-=' + settings.slideAmount}, settings.speed, settings.easing,
                    function() {     
                        // reset the slider positions
                        for(var i=0; i < jump; i++) {
                            $(settings.slide + ':first').remove();
                        }

                        $(settings.panel).css('left', '-' + ((settings.slideWidth) + settings.offset) + 'px');
                                
                        // trigger the "slide just finished" or "after" callback
                        settings.after($(settings.slide).eq(0), $(settings.slide).eq(1), $(settings.slide).eq(2), settings);
            
                        // make the slider buttons clickable again
                        clickable = true;
                    }
                );  
                                    
                if(settings.slideshow) {
                    clearTimeout(settings.timer);
                    settings.timer = setTimeout(function() { $this.carousel(settings.direction); }, settings.timeout);
                }                   
            }); 
        }, // next()

        // move slider in the backward direction (direction depends on settings)
        prev: function() {

            // return self for chaining
            return $(this).each(function() {
                var $this = $(this);
                
                var settings = $this.data('carousel');
          
                // can't chain clicks
                if(!clickable) return;
                clickable = false;
    
                // prep the slider to go backward by cloning last slide to the front and adjusting positioning
                var jump = settings.jump;

                // if we're sliding several at once, jump will be the number we're jumping, so we prepare accodingly
                for(var i=0; i < jump; i++) {
                    var len = $(settings.slide).length;
                    $(settings.slide + ':first').before($(settings.slide).eq(len - 1 - i).clone(true)); 
                }

                $(settings.panel).css('left', '-' + ((settings.slideWidth + settings.slideAmount) + settings.offset) + 'px');
            
                // trigger the "slide is about to start" or "before" callback
                settings.before($(settings.slide).eq(3), $(settings.slide).eq(2), $(settings.slide).eq(1), settings);
                
                // advance the slider to the previous position
                $(settings.panel).animate({'left': '+=' + settings.slideAmount}, settings.speed, settings.easing,
                    function() {        
                        // reset the slider positions
                        for(var i=0; i < jump; i++) {
                            $(settings.slide + ':first').remove();
                            $(settings.slide + ':first').before($(settings.slide + ':last'));
                        }
                        $(settings.panel).css('left', '-' + ((settings.slideWidth) + settings.offset) + 'px');                      
                                
                        // trigger the "slide just finished" or "after" callback
                        settings.after($(settings.slide).eq(0), $(settings.slide).eq(1), $(settings.slide).eq(2), settings);
        
                        // make the slider buttons clickable again
                        clickable = true;
                    }
                );
                
                if(settings.slideshow) {
                    clearTimeout(settings.timer);
                    settings.timer = setTimeout(function() { $this.carousel(settings.direction); }, settings.timeout);
                }   
            }); 
        }, // prev()

        // jump to a specified position
        jump: function(jumpTo) {

            // return self for chaining
            return $(this).each(function() {
                var $this = $(this);
                
                var settings = $this.data('carousel');
                var curP = $(settings.slide, settings.panel).eq(1).data('position');
            
                var change = jumpTo - curP;
                
                if(change == 0) return;
                
                settings.jump = Math.abs(change);
                clearTimeout(settings.timer);
                var tempWidth = settings.slideAmount;
            
                settings.slideAmount *= Math.abs(change);
                
                if(change < 0) $this.carousel('prev');
                else $this.carousel('next');
            
                settings.jump = 1;
                settings.slideAmount = tempWidth;
            }); 
        } // jump()
    }
})(jQuery, this, document);