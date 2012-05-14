// Cameron Spear's "Slidersel" (that's supposed to be slider + carousel)
(function($) 
{
    $.fn.carousel = function(method)
    {        
        // Method calling logic
        if(methods[method])
        {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } 
        else if (typeof method === 'object' || !method) 
        {        
            return methods.init.apply(this, arguments);
        } 
        else 
        {
            $.error('Method ' +  method + ' does not exist on jQuery.carousel');
        } 
        
        function next() { methods.next.apply(this, arguments); }
    }
    
    
    var defaults =
    {
        slide: '.slide',
        panel: '.panel',
        direction: 'next',
        init: function(prevSlide, curSlide, nextSlide, settings) {},
        before: function(prevSlide, curSlide, nextSlide, settings) {},
        after: function(prevSlide, curSlide, nextSlide, settings) {},
        slideshow: false,
        speed: 800,
        timeout: 8000,
        easing: 'swing',
        fullWidth: false,
        minimum: 1,
        needsStyle: false,
        nextButton: false,
        prevButton: false,
		jump: 1     
    };
    
    var clickable = true;
        
    var methods = 
    {
        init: function(options)
        {            
            return this.each(function()
            {	
                var $this = $(this);
               
                var settings = $.extend({}, defaults, options);
                
                $this.data('carousel', settings);
                                
                settings.curSlideIndex = 0;
				
				$(settings.slide, settings.panel).each(function(index)
				{
					$(this).data('position', index);
				});
                
            	if($(settings.slide).length >= settings.minimum)
            	{             
                    $(window).resize(function()
                    {
                        if(settings.fullWidth) { $this.width(Math.floor($(this).width())) };
                	 	settings.slideAmount = $(settings.slide).outerWidth(true);
						settings.slideWidth = $(settings.slide).outerWidth(true);
                		if(settings.fullWidth) settings.offset = $(settings.slide).outerWidth(true) / 2;
						else settings.offset = 0;
                        settings.numberOfSlides = $(settings.slide).length;
						
						// var w = Math.min(1450, $(this).width());
						// var h = w / 1450 * 520;
						// $this.height(h);
                        
                        // these two lines are the "reset"
            			$(settings.panel).css('left', '-' + ((settings.slideAmount) + settings.offset) + 'px');
                        settings.curSlideIndex = (settings.curSlideIndex % settings.numberOfSlides) + 1;
                        
                        if(settings.fullWidth)
                        {
                            $('img', settings.slide).css('max-width', Math.max(960, $(this).width()));
                            $this.height('auto');
                        }
                    }).resize();
                    
                    if(settings.nextButton) $(settings.prevButton).click(function(event) { event.preventDefault(); $this.carousel('next'); });
                    if(settings.prevButton) $(settings.nextButton).click(function(event) { event.preventDefault(); $this.carousel('prev'); });
                    
                    if(settings.needsStyle)
                    {
                        $this.width(settings.slideAmount).css('overflow', 'hidden');
                        $(settings.panel).width('12000px').css('position', 'relative');
						if(settings.fullWidth) $(settings.panel).css('margin-left', '50%');
						$(settings.slide).css('float', 'left');
                    }

					// if only 1 slide, copy and append twice. if only 2 slides, copy the two slides and append. needs min of 3 slides to work (since 3 can be visible at once)
                    if(settings.numberOfSlides == 1) $(settings.slide + ':last').after($(settings.slide + ':first').clone(true)).after($(settings.slide + ':first').clone(true), settings); 
                    if(settings.numberOfSlides == 2) $(settings.slide + ':last').after($(settings.slide).clone(true), settings); 
                    		
            		$(settings.slide + ':first').before($(settings.slide + ':last'));
                    		
                    // prepare the first slide
            		$(settings.panel).css('left', '-' + ((settings.slideWidth) + settings.offset) + 'px');
                    settings.init($(settings.slide).eq(0), $(settings.slide).eq(1), $(settings.slide).eq(2), settings);
                
                    if(settings.slideshow)
                    {
                        settings.timer = setTimeout(function() { $this.carousel(settings.direction); }, settings.timeout);
                    }     
            	}
            });
        },
        
        next: function() 
        { 
            return $(this).each(function()
            {
                var $this = $(this);
                
                var settings = $this.data('carousel');
          
                // can't chain clicks
            	if(!clickable) return;
            	clickable = false;

                // prep the slider to go forward
				var jump = settings.jump;
				// if we're sliding several at once, jump will be the number we're jumping, so we prepare accodingly
				for(var i=0; i < jump; i++) 
				{
	            	$(settings.slide + ':last').after($(settings.slide).eq(i).clone(true));
				}
				
                // trigger the "slide is about to start" or "before" callback
                settings.before($(settings.slide).eq(0 + (jump - 1)), $(settings.slide).eq(1 + (jump - 1)), $(settings.slide).eq(2 + (jump - 1)), settings);
		
                // advance the slider to the next position
            	$(settings.panel).animate({'left': '-=' + settings.slideAmount}, settings.speed, settings.easing,
            		function()
            		{     
                        // reset the slider positions
						for(var i=0; i < jump; i++) 
						{
	            			$(settings.slide + ':first').remove();
						}
            			$(settings.panel).css('left', '-' + ((settings.slideWidth) + settings.offset) + 'px');
                                
                        // trigger the "slide just finished" or "after" callback
                        settings.after($(settings.slide).eq(0), $(settings.slide).eq(1), $(settings.slide).eq(2), settings);
            
                        // make the slider buttons clickable again
            			clickable = true;
            		}
            	);	
            			            
                if(settings.slideshow)
                {
                    clearTimeout(settings.timer);
                    settings.timer = setTimeout(function() { $this.carousel(settings.direction); }, settings.timeout);
                }                   
            });	
        },
        prev: function() 
        {
            return $(this).each(function()
            {
                var $this = $(this);
                
                var settings = $this.data('carousel');
          
                // can't chain clicks
            	if(!clickable) return;
            	clickable = false;
    
                // prep the slider to go backward by cloning last slide to the front and adjusting positioning
				var jump = settings.jump;
				// if we're sliding several at once, jump will be the number we're jumping, so we prepare accodingly
				for(var i=0; i < jump; i++) 
				{
					var len = $(settings.slide).length;
	            	$(settings.slide + ':first').before($(settings.slide).eq(len - 1 - i).clone(true)); 
				}

            	$(settings.panel).css('left', '-' + ((settings.slideWidth + settings.slideAmount) + settings.offset) + 'px');
            
                // trigger the "slide is about to start" or "before" callback
                settings.before($(settings.slide).eq(3), $(settings.slide).eq(2), $(settings.slide).eq(1), settings);
				
                // advance the slider to the previous position
            	$(settings.panel).animate({'left': '+=' + settings.slideAmount}, settings.speed, settings.easing,
            		function()
            		{        
                        // reset the slider positions
						for(var i=0; i < jump; i++) 
						{
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
		        
                if(settings.slideshow)
                {
                    clearTimeout(settings.timer);
                    settings.timer = setTimeout(function() { $this.carousel(settings.direction); }, settings.timeout);
                }   
            });	
        },
        jump: function(jumpTo)
        {
            return $(this).each(function()
            {
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
        }
    }
})(jQuery);