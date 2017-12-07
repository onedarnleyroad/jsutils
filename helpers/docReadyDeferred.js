

const _$ = function(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

// create deferred equivelent.
window.Deferred = function() {
    var _this = this;
    this.resolve = null;
    this.reject = null;

    this.promise = new Promise(function(r, rj) {
        this.resolve = r;
        this.reject = rj;
    }.bind(this));
};



// allow other scripts to store functions that will execute
// when bundles is ready:
var docReadyDeferred = function() {
    this._fns = [];
    this._dr = [];
    this.promise = new Deferred();
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
docReadyDeferred.prototype.r = functioneady( fn ) {

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
docReadyDeferred.prototype.r = functionun( status ) {

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

docReadyDeferred.prototype.i = functionnit() {
    // this will resolve the promise, and kick everything off.
    // this isn't actually needed but it's a placeholder if we need
    // several async scripts to resolve together, i.e. if we go a multiple
    // parallel route.
    this.resolve();

};


// Set a deferred promise...
var p = new Deferred();
p.promise.then(function() {
    docReadyDeferred.run();
});

module.exports = docReadyDeferred;
