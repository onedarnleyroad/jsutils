// NEW NODE / BROWSERIFY VERSION

module.exports = (function(w) {

    // usage:
    /*
        Defaults are in place, so:

        (units are necessary, you can use EM if you want)

        desktop: {  min:  "1367px" },
        laptop:  {  max:  "1366px" },
        tablet:  {  max:  "1024px" },
        mobile:  {  max:  "480px" },

        is already set, but can be overriden or added to when initialising

        var media = new MediaQueries({
            desktop: { "1441px"}, ( min width )
            sidebar: { max: "1300px" },
            tablet-only: { max: "1024px", min: "480px" }
        });

        // true when window is max-width 1300px, false otherwise
        console.log( media.matches('sidebar') );

        // true when above mobile but below tablet
        console.log( media.matches('tablet-only') );
    */



    // can we use the matchMedia api?
    // if not use plain old jQuery window size.
    var mq = ('matchMedia' in window);

    var _matchRule = function( rule, debug ) {
        let matches = window.matchMedia( rule ).matches;
        if (debug) { console.log( rule, matches ? "Matches" : "NO" ); }
        return matches;
    }

    var _maxWidth = function( size, debug ) {
        return _matchRule( '(max-width: ' + size + ')', debug );
    };

    var _minWidth = function( size, debug ) {
        return _matchRule( '(min-width: ' + size + ')', debug );
    };

    var _withinWidth = function( min, max, debug ) {
        return _matchRule( '(min-width: ' + min + ') and (max-width: ' + max + ')', debug );
    }

    var MediaQueries = function( config, debug ) {

        if (!mq) {
            console.error("matchMedia not supported on this browser");
            return false;
        }

        var defaults = {
            desktop: {  min:  "1367px" },
            laptop:  {  max:  "1366px" },
            tablet:  {  max:  "1024px" },
            mobile:  {  max:  "480px" },
        };
        this.breakpoints = config || defaults;
        return this;
    };

    MediaQueries.prototype.matches = function( keyword, debug ) {

        if (typeof keyword === 'object') {
            // rely on user to use correct notation
            var rule = keyword;
        } else {
            var rule = this.breakpoints[ keyword ];
        }

        if (!rule) { return -1; }

        var _return = false;

        var _try = function( query ) {


            if (query.hasOwnProperty( 'max' ) && query.hasOwnProperty( 'min') ) {
                return _withinWidth( query.min, query.max, debug );
            } else if (query.hasOwnProperty( 'min' )) {
                return _minWidth( query.min, debug );
            } else if (query.hasOwnProperty( 'max')) {
                return _maxWidth( query.max, debug );
            } else if ( typeof query === "string" ) {
                return _minWidth( query, debug );
            } else {
                return true; // ?
            }

        };

        if ( Array.isArray( rule ) ) {
            rule.forEach( function( _rule ) {

                // only set it to true, don't ever
                // set a true back to a false.
                if ( _try( _rule ) ) {
                    _return = true;
                }

            });
        }  else {
            _return = _try( rule );
        }

        // At this point if anything hit, then _return will be true;;
        return _return;


    };

    return MediaQueries;

})();
