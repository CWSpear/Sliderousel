Sliderousel
===

Combination multipurpose easy-to-set up carousel and/or slider jQuery plugin.

A few features aren't completely polished, but the base features work well, and I'm moving it into a more "Beta" type phase. Polishing off the current features and only adding minor functionality.


Markup
---

The markup was intended to be as simple as possible. It needs another div inside the slider and outside of the slides, but it will create it for you by default. 

Be aware of this if you are performing any extra JavaScript the slider (i.e. the DOM will not be same). You can put a panel (as I call it) in the markup and define its class in the options

```html
<div class="slider">
    <div class="slide 1">
        // ... any content ...
    </div>
    <div class="slide 2">
        // ... any content ...
    </div>
    <div class="slide 3">
        // ... any content ...
    </div>
</div>
```


Style
---

...None! The script will do all the necessary styling for you. What'd I tell you? Easy to set up, no?

Obviously, there may be some styling you'd like to apply. Maybe some margin on the slides unless you _want_ them touching, etc.

If you want to define all of the styles your own, set needsStyle to false.


Usage
---

```javascript
$('.slider').carousel();
```


Options
---

I will add more detailed options explanations and some tutorial videos eventually, but for now, here's all of the customizable options with a short explanation.

```javascript
var defaults = {
	slide:        '.slide', // default slide selector/jQuery object
	panel:        false,    // default panel selector/jQuery object (section that contains all slides). builds one for you by default
	direction:    'next',   // [next | prev] indicates direction to move slider if it auto-slides
	
	slideshow:    true,     // is this a slideshow? (i.e. auto-advances)
	speed:        800,      // transition speed in ms
	timeout:      8000,     // timeout between slides (timer starts after last slide transition ends)
	fullWidth:    false,    // should this slideshow take up the entire width of the screen?
	
	easing:       'swing',  // without jQuery UI, only swing and linear are supported.
	                        //     see http://jqueryui.com/demos/effect/easing.html for jQuery UI easings
	
	nextButton:   false,    // selector/jQuery object for button that moves slideshow forward
	prevButton:   false,    // selector/jQuery object for button that moves slideshow backward
	navigation:   false,    // automatically build navigation?
	
	needsStyle:   true,     // apply styles via jQuery?
    slideWidth:   'auto',   // define a specific slide width
	slidesToShow: -1,       // number of slides to show at one time (-1 for as many as will fit).
	                        //     does not initiate if there aren't that many slides.
	                        //     does not apply to fullwidth slideshows
	
	// callbacks
    init:   function(prevSlide, curSlide, nextSlide, settings) {}, // before-init callback
    before: function(prevSlide, curSlide, nextSlide, settings) {}, // before-slide callback
    after:  function(prevSlide, curSlide, nextSlide, settings) {}, // after-slide callback
};
```


JSHint
---

This code is under JSHint via SublimeLinter. If you want to contribute, I'd really appreciate if your code could pass JSHint with these options:

```javascript
"jshint_options":
{
    // inclusive  
    "bitwise":   true,
    "eqeqeq":    true,
    "latedef":   true,
    "newcap":    true,
    "noarg":     true,
    "nonew":     true,
    "regexp":    true,
    "trailing":  true,
    "undef":     true,

    // exclusive
    "regexdash": true,
    "sub":       true,

    // environment
    // "browser":   true,
    "devel":     true,
    "jquery":    true
}
```


Changelog
---
### 1.0.1
Minor new functionality

* __[Feature]__ Added option to set a fixed slide width

### 1.0
No new features, just making sure there are no bugs for 1.0.

* __[Bugfix]__ Fixed a bug where direction setting was being ignored
* __[Bugfix]__ Fixed a bug that caused multiple auto slideshows on one page not to function

### 1.0 Beta
The intent for 1.0 Beta was to optimize the code and clean up some things. Once all of the known bugs are squashed and I've tested all the current features, we will go full 1.0.

* __[Feature]__ Added inital support for pre-built auto navigation
* __[Enhancement]__ Made it so you don't have to wrap your code in a panel (the script will do it for you). You can still define one if you have it in your markup. This makes the default syntax simpler. Also made it apply style by default. This makes the default slider to require only simple markup and no CSS.
* __[Enhancement]__ Made it so the timer doesn't start until _after_ the animation completes
* __[Enhancement]__ Added minified version (via uglify.js) for convenience
* __[Bugfix]__ Fixed issue where I accidentally mapped the global variables document to window and window to document
* __[Bugfix]__ Fixed issue that caused problems with more than one slider on a page
* __[Bugfix]__ Miscellaneous stability fixes
* __[House Keeping]__ Optimized code (mostly fixing selectors, caching, etc) and commented the code
* __[House Keeping]__ Code is now under JSLint (via SublimeLinter)
