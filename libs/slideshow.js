

/*




*/

/*============================================================
=            Packages, Constant Utility Functions            =
============================================================*/



const _mq = require('../libs/media-queries');
const extend = require('extend'); // port of $.extend
const onSrcLoad = require('../helpers/onSrcLoad');
const elsForEach = require("../helpers/elsForEach");
const Velocity = require("velocity-animate");

window.Velocity = Velocity;

const _Promise = require('promise-polyfill');
if (!window.Promise) {
  window.Promise = _Promise;
}

const Deferred = function() {
    var _this = this;
    this.resolve = null;
    this.reject = null;

    this.promise = new Promise(function(r, rj) {
        this.resolve = r;
        this.reject = rj;
    }.bind(this));

    this.then = this.promise.then;
};

window.Deferred = Deferred;


// Random number between a and b
const rand = function( a, b ) {
    var range = b - a;
    var n = Math.round( Math.random() * range );
    return a + n;
};




// Save time on some css styles:
const Css = {
    opacity: function( el, o ) {
        el.style.opacity = o;
    },

    z: function( el, z ) {
        el.style.zIndex = z;
    },

    backgroundImage: function( el, src ) {
        if (!src) {
            el.style.backgroundImage = false;
        } else {
            el.style.backgroundImage = 'url(' + src + ')';
        }

    }
};






/*========================================
=  Settings, config, defaults            =
========================================*/

var directions = [
    'top-left',
    'bottom-right',
    'top-right',
    'bottom-left'
];

var defaults = {
    distance: 0,
    duration: 8000,
    minPan: 0,
    z: 1.05,
    playNextAt: 4000,
    fadeInDelay:  1000,
    fadeOutDelay: 1000,
    fadeDuration: 1200
};


/*====================================
=            Slide Object            =
====================================*/

const Slide = function( el, parent ) {
    var self = this;
    self.el = el;
    self.slideshow = parent;

    self.loaded = false;
    self.rejected = false;
    self.promise = new Deferred();

    return self;
};

Slide.prototype.zIndex = function() {
    var el = this.el;
};

Slide.prototype.fadeOut = function( delay ) {
    var el = this.el;
    var self = this;

    Velocity( el, { opacity: 0 }, {
        queue: false,
        begin: function() {
            Css.z( el, 0 );
        },
        duration: self.slideshow.options.fadeDuration,
        delay: delay
    });

};

Slide.prototype.fadeIn = function( delay ) {
    var el = this.el;
    var self = this;

    Velocity( el, { opacity: 1 }, {
        queue: false,
        begin: function() {
            Css.z( el, 1 );
        },
        duration: self.slideshow.options.fadeDuration,
        delay: delay
    });
};

Slide.prototype.panIfLoaded = function( isStart ) {

    var self = this;

    if (self.loaded) {
        self.pan( isStart );
        return;
    } else {
        this.load();
    }

    // wait for load to resolve first:
    self.promise.promise.then( function() {
        self.pan( isStart );
    });

};

Slide.prototype.load = function() {
    var self = this;

    if (self.loaded) {
        return true;
    }

    if (self.rejected) {
        return false;
    }

    var el = self.el;


    if ( el.tagName === "IMG" ) {
        el.addEventListener('load', function() {
            self.loaded = true;
            self.promise.resolve();
        });
    } else {

        var src = el.getAttribute('data-bg');
        if (!src) {
            // Assume no need to lazy load,
            // perhaps it's just a background image
            // already set.
            self.loaded = true;
            self.promise.resolve();
        } else {
            onSrcLoad( src, function() {
                self.loaded = true;
                Css.backgroundImage( el, src );
                self.promise.resolve();
            });
        }
    }
};


Slide.prototype.reset = function() {
    Velocity( this.el, 'stop' );
    Css.z( this.el, 0 );
    Velocity( this.el, { opacity: 0, scale: 1, translateX: 0, translateY: 0 }, { duration: 0 });
};

Slide.prototype.pan = function( isStart ) {
    var self = this;


    if (self.slideshow.slides.length === 1) {
        // Just fade in, don't do anything else
        // because we can't loop and this was
        // just a very complex lazyloader.
        self.fadeIn( 0 );
        return;
    }

    // Velocity(document.body, { translateX: 100 });

    if (!self.loaded) {
        console.warn("Pan was called without loading first");
    }

    // Decide on a direction
    var m = self.slideshow.getDirection();
    var duration = self.slideshow.options.duration;

    var el = self.el;


    // fade ourselves in

    var fadeInDelay = self.slideshow.options.fadeInDelay;

    if (isStart) {
        fadeInDelay = false;
    }

    self.fadeIn( fadeInDelay );

    // fade the other
    if (self.hasOwnProperty('prev')) {
        var fadeOutDelay = self.slideshow.options.fadeOutDelay;
        self.prev.fadeOut( fadeOutDelay );
    }


    // reset position
    // Or don't? Just update the animation, avoid jumping
    // if (self.slideshow.options.pan) {
    //  Velocity( el, { translateX: 0, translateY: 0 }, { duration: 0 });
    // }

    // animate
    var animX = m.x0;
    var animY = m.y0;
    var _scale = 0;

    var firedNext = false;

    var rangeX = m.x1 - m.x0;
    var rangeY = m.y1 - m.y0;


    var z = self.slideshow.options.z;

    var animationOptions;

    if ( self.slideshow.options.distance > 0 ) {
        animationOptions = {
            translateX: rangeX,
            translateY: rangeY,
            scale: z
        }
    } else {
        animationOptions = {
            scale: z
        };
    }


    self.animation = Velocity( el, animationOptions, {

        queue: false,
        // begin: function() { console.log( "[" + self.index + "]", "Panning") },
        easing: "linear",
        duration: duration,

        // Check time remaining,
        // if we have 33% of the time left
        // then we should trigger the next slide
        // which will fade in and start animating too,
        // thus creating an overlap.

        // Be careful, if the overlap is too close, due to too few elements,
        // you may end up with an animation jump.
        progress: function(elements, complete, remaining, start, tweenValue) {
            var elapsed = duration - remaining;

            // console.log( elapsed );
            if ( elapsed >= self.slideshow.options.playNextAt && !firedNext ) {
                // console.log( elapsed, "Playing next!" );
                firedNext = true;

                if ( self.hasOwnProperty('next') && self.slideshow.animating ) {
                    self.next.panIfLoaded();
                }
            }
        },

        complete: function() {
            Velocity( el, { scale: 1 }, { duration: 1 });
        }
    });

};

/*========================================
=            SlideShow Object            =
========================================*/

const Slideshow = function( options ) {
    var self = this;

    // Find the elements:

    // Find the container


    var container = document.querySelector( options.container );

    if (!container) {
        return false;
    }

    // Find the children
    var slideElements = container.querySelectorAll( options.slide );

    // If none, no point doing anything else
    if (slideElements.length === 0) {
        return false;
    }






    // Extend supplied options with defaults
    self.options = extend( {}, defaults, options);

    self.animating = false;

    // Init
    self.lastDirection = 0;

    /*==============================
    =            Slides            =
    ==============================*/
    self.slides = [];

    elsForEach( slideElements, function( slide, i ) {
        var _Slide = new Slide( slide, self );
        self.slides.push( _Slide );
        _Slide.index = i;
        if ( i >  0 ) {
            _Slide.prev = self.slides[ i - 1 ];
        }
    });

    // Once all slides are initialised,
    // go through them all and apply the 'next',
    // as we did not know 'next' when looping
    // through initially:
    self.slides.forEach(function( e, i ) {

        if (i+1 < self.slides.length) {
            e.next = self.slides[i+1];
        } else {
            // at the end
            e.next = self.slides[0];
        }
    });

    // Finally, our first slide did not know its 'previous'
    // as it will be the last slide, so store that now:
    self.slides[0].prev = self.slides[ self.slides.length - 1];

    self.ready = true;

    return self;

};

Slideshow.prototype.stop = function() {
    this.animating = false;
    this.slides.forEach( function(s) {
        s.reset();
    });
};

Slideshow.prototype.start = function() {
    this.animating = true;
    this.slides[0].panIfLoaded( true );
};

Slideshow.prototype.getDirection = function() {

    var lastDirection = this.lastDirection;
    var distance = this.options.distance;
    var minPan = this.options.minPan;

    // get a random no from 0 - 3
    var i = rand( 0, 3 );

    // But avoid using the same one as last time:
    if (i === lastDirection) {
        // Get the next one...
        i = i + 1;

        // if we were on the last one
        // get the first one:
        if (i > 3) {
            i = 0;
        }
    }
    // save this direction as the last:s
    lastDirection = i;

    // Choose direction:
    var direction = directions[ i ];

    var m = {};
    switch (direction) {
        case 'top-left':
            m.x0 = 0 - rand( minPan, distance );
            m.y0 = 0 - rand( minPan, distance );
            m.x1 = rand( minPan, distance );
            m.y1 = rand( minPan, distance );
        break;

        case 'top-right':
            m.x0 = rand( minPan, distance );
            m.y0 = 0 - rand( minPan, distance );
            m.x1 = 0 - rand( minPan, distance );
            m.y1 = rand( minPan, distance );
        break;

        case 'bottom-left':
            m.x0 = 0 - rand( minPan, distance );
            m.y0 = rand( minPan, distance );
            m.x1 = rand( minPan, distance );
            m.y1 = 0 - rand( minPan, distance );
        break;

        // case 'bottom-right':
        default:
            m.x0 = rand( minPan, distance );
            m.y0 = rand( minPan, distance );
            m.x1 = 0 - rand( minPan, distance );
            m.y1 = 0 - rand( minPan, distance );
        break;
    }

    return m;
};


// Don't export Slide, we only need it in a Slideshow.
module.exports = Slideshow;
