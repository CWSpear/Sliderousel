Sliderousel
===========

Combination multipurpose easy-to-set up carousel and/or slider jQuery plugin.

A few features aren't completely polished, but the base features work well, and I'm moving it into a more "Beta" type phase. Polishing off the current features and only adding minor functionality.

Use this version at your own risk.

Changelog
=========

Beta 0.9
--------
* __[Feature]__ Added minified version (via uglify.js) for convenience
* __[Feature]__ Added inital support for pre-built auto navigation
* __[Enhancement]__ Made it so the timer doesn't start until _after_ the animation completes
* __[Bugfix]__ Fixed issue where I accidentally mapped the global variables document to window and window to document
* __[Bugfix]__ Fixed issue that caused problems with more than one slider on a page
* __[Bugfix]__ Miscellaneous stability fixes
* __[House Keeping]__ Optimized code (mostly fixing selectors, caching, etc) and commented the code
* __[House Keeping]__ Code is now under JSLint (via SublimeLinter)
