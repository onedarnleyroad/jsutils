

function aContainsB( a, b ){
    return ( a !== b && a.contains(b) );
}

var ScrollJacker = function( el, exclusions ) {

    this.el = el;

    this.locked = false;
    this.exclusions = exclusions || [];

    _init( this.el, this );
};

ScrollJacker.prototype.lock = function() {
    this.locked = true;
};

ScrollJacker.prototype.unlock = function() {
    this.locked = false;
};

 /*========================================
=            Scroll Disabling            =

These events are always active, but the
state of scrolling, and the visibility
of the overlay will define whether they
kick in or not.
========================================*/

var _prevent = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    ev.returnValue = false;
    return false;
};

var _init = function( scrollerEl, _scrollJacker ) {
    // Stop scrolling the window, if scrolling is locked

    window.addEventListener('scroll', function(e) {
        if ( _scrollJacker.locked ) {
            // this doesn't really do anything as far as I can see,
            // but may for certain browsers, and can help on touch?
            _prevent(e);
        }
    });

    /*----------  TOUCH SCROLLING DISABLE  ----------*/

    // Stop scrolling ANYTHING if scrolling is Locked
    // AND if the touchstart target is NOT the modal__content (i.e. the only thing we allow to scroll)
    document.addEventListener('touchstart', function(ev) {

        var isInExclusions = false;

        if (_scrollJacker.exclusions.length) {
            _scrollJacker.exclusions.forEach(function( ex ) {

                if ( aContainsB( ex, ev.target )) {
                    isInExclusions = true;
                }
            });
        }

        // create a boolean deciding if
        var notScrollingContent = (

            _scrollJacker.locked && // our scrolling is locked AND
            ( ev.target != scrollerEl ) && // our target is NOT the scroller AND
            !aContainsB( scrollerEl, ev.target ) && // our target is NOT a CHILD of the scroller AND
            !isInExclusions // the target is not also in our exclusions list.
        );

        console.log( _scrollJacker.locked  );

        if (notScrollingContent) {
            _prevent(ev);
        }
    });

    // When the scrolling container is scrolling,
    // never let it get to the top or the bottom, just a pixel down, so
    // that scrolling never bubbles up

    // Do we need some sort of listener on 'allowed' elemenets? eg has class click handler??
    scrollerEl.addEventListener('touchmove', function (ev) {
        // .modal-inner-scroller

        if ( !_scrollJacker.locked ) { return; }

        var scrollTop = scrollerEl.scrollTop;


        // if it is at the top, then scroll it down by a pixel
        if (scrollTop === 0) {
            scrollerEl.scrollTop = 1;
            _prevent(ev);
        }

        var scrollHeight = scrollerEl.scrollHeight;
        var offsetHeight = scrollerEl.offsetHeight;
        var contentHeight = scrollHeight - offsetHeight;
        // if it is at the end of the scroll, scroll it up by a pixel

        //  console.log( $this.scrollTop(), contentHeight );

        if (contentHeight == scrollTop) {
            scrollerEl.scrollTop = scrollTop-1;
            _prevent(ev);
        }


    });

    /*----------  DESKTOP SCROLLING DISABLE  ----------*/

    // stop keyboard scrolling...
    // Space(32) PgUp(33), PgDn(34), End(35), Home(36), Left(37), Up(38), Right(39), Down(40)

    var downKeys = [ 32, 34, 35, 40 ];
    var upKeys = [ 33, 36, 38 ];

    document.addEventListener( 'keydown', function(e) {

        if ( !_scrollJacker.locked ) { return; }

        if ( _scrollJacker.locked && e.target == scrollerEl ) {

            var key = e.which;

            if ( upKeys.indexOf( key ) > -1) {
                //console.log("Pushing Up");
                if (scrollerEl.scrollTop === 0) { e.preventDefault(); }

            } else if ( downKeys.indexOf( key ) > -1) {

                //console.log("Pushing Down");
                var scrollTop = scrollerEl.scrollTop;
                var scrollHeight = scrollerEl.scrollHeight;
                var offsetHeight = scrollerEl.offsetHeight;
                var contentHeight = scrollHeight - offsetHeight;
                if (contentHeight == scrollTop) { e.preventDefault(); }
            } else {
                return true;
            }
        }

    });

    // Bind to the mousewheel

    var wheelEv = function(ev) {

        if ( !_scrollJacker.locked ) { return; }

        var scrollTop = scrollerEl.scrollTop,
        scrollHeight = scrollerEl.scrollHeight,
        height = scrollerEl.clientHeight,

        delta = ev.type == 'DOMMouseScroll' ?
                    ev.detail * -40 :
                    ev.wheelDelta,
        up = delta > 0;



        if (!up && -delta > scrollHeight - height - scrollTop) {
            // Scrolling down, but this will take us past the bottom.
            scrollerEl.scrollTop = scrollHeight;
            return _prevent(ev);

        } else if (up && delta > scrollTop) {
            // Scrolling up, but this will take us past the top.
            scrollerEl.scrollTop = 0;
            return _prevent(ev);
        }

    };

    scrollerEl.addEventListener('DOMMouseScroll', wheelEv );
    scrollerEl.addEventListener('mousewheel', wheelEv );

    /*=====  End of Scroll Disabling  ======*/
};



module.exports = ScrollJacker;
