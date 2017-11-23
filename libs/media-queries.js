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

    var _maxWidth = function( size, unit ) {
        return ( window.matchMedia('(max-width: ' + size + unit + ')').matches );
    };

    var _minWidth = function( size, unit ) {
        return ( window.matchMedia('(min-width: ' + size + unit + ')').matches );
    };

    var MediaQueries = function( config ) {

        if (!mq) {
            console.error("matchMedia not supported on this browser");
            return false;
        }

        for ( var prop in config ) {
            if ( typeof config[prop] === "string" ) {
                config[prop] = { min: config[prop] }
            }
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

    MediaQueries.prototype.matches = function( keyword ) {

        if (typeof keyword === 'object') {
            // rely on user to use correct notation
            var rule = keyword;
        } else {
            var rule = this.breakpoints[ keyword ];
        }

        if (!rule) { return -1; }

        if (rule.hasOwnProperty( 'max' )) {


            if (!_maxWidth( rule.max )) {
                return false;
            }
        }

        if (rule.hasOwnProperty( 'min' )) {

            if (!_minWidth( rule.min )) {
                return false;
            }
        }

        // we got this far, must match!
        return true;

    };

    return MediaQueries;

})();
