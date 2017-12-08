
// New version, promise free.
// This will need adapting if we have to run several that depend on each other, eg promise all,
// but at that point we are maybe better off using loadjs.

const _$ = function(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};


// allow other scripts to store functions that will execute
// when bundles is ready:
var docReadyDeferred = function( pathToPolyfill ) {
    this._fns = [];
    this._dr = [];
    this.resolved = false;
};

docReadyDeferred.prototype.q = function( fn ) {
    if ( this.resolved ) {
        fn();
    } else {
        this._fns.push( fn );
    }
};

// run when bundle is ready, inside doc ready.
docReadyDeferred.prototype.ready = function( fn ) {

    if ( this.resolved ) {
        _$(function() {
            fn();
        });
    } else {
        this._dr.push( fn );
    }
};

// Can have a think about what we'd
// like to pass to the function
docReadyDeferred.prototype.run = function( status ) {

    // If a function got queued after
    // the first run, then we can test
    // against that and run
    this.resolved = true;

    // Run asap
    this._fns.forEach(( fn ) => {
        fn( status );
    });

    // run doc ready
    _$(() => {
        this._dr.forEach(( fn ) => {
            fn( status );
        });
    });
};





module.exports = docReadyDeferred;
