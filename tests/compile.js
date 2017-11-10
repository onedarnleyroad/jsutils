// Just check everything's hooking up properly:


window.slideshow = require("../libs/slideshow");

require("../helpers/resize.throttle");




window.addEventListener( 'resize.throttle' ,function() {
    console.log("resize.throttle");
});

window.addEventListener( 'resize.end' ,function() {
    console.log("resize.end");
});
