Sliderousel
===========

Combination multipurpose easy-to-set up carousel and/or slider jQuery plugin.

A few features aren't completely polished, but the base features work well, and I'm moving it into a more "Beta" type phase. Polishing off the current features and only adding minor functionality.

Use this version at your own risk.

JSHint
======
This code is under JSHint via SublimeLinter. If you want to contribute, I'd really appreciate if your code could pass JSHint with these options:

```json
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
    "browser":   true,
    "devel":     true,
    "jquery":    true
}
```

Changelog
=========

Beta 0.9
--------
* __[Feature]__ Added inital support for pre-built auto navigation
* __[Enhancement]__ Made it so the timer doesn't start until _after_ the animation completes
* __[Enhancement]__ Added minified version (via uglify.js) for convenience
* __[Bugfix]__ Fixed issue where I accidentally mapped the global variables document to window and window to document
* __[Bugfix]__ Fixed issue that caused problems with more than one slider on a page
* __[Bugfix]__ Miscellaneous stability fixes
* __[House Keeping]__ Optimized code (mostly fixing selectors, caching, etc) and commented the code
* __[House Keeping]__ Code is now under JSLint (via SublimeLinter)
