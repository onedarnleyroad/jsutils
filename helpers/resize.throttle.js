// Resize Event. Just include this, and a 'resize.throttle' event will be a debounced
// resize event to the window. We could refactor this to different events, but it
// works as it is.
(function() {

    var resizeEnd;

    var throttle = function(type, name, obj) {

    	// Deprecated, but at lease xbrowser compatable.
    	// use new CustomerEvent if browsers remove it.
    	var event = document.createEvent('Event');
		event.initEvent('resize.throttle', true, true); // can bubble, and is cancellable

        var endEvent = document.createEvent('Event');
        endEvent.initEvent('resize.end', true, true); // can bubble, and is cancellable

        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(event);

                // Maybe dispatch an end event?
                clearTimeout( resizeEnd );
                resizeEnd = setTimeout(function() {
                     obj.dispatchEvent(endEvent);
                }, 500);

                running = false;
            });
        };

        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "resize.throttle");

})();


