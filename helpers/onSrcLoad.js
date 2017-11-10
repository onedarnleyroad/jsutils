
// Create an image element, run the callback
// when the SRC has loaded. Useful since there's
// no 'load' event for a background image on an
// element, so you can use this.
//
// EG:
/*
	const onSrcLoad = require('./utils/onSrcLoad');

	var div = document.querySelector('div');
	var src = div.getAttribute('data-bg');

	if (src) {
		onSrcLoad( src, function() {
			// The image is loaded, and thus in the cache:
			// So this image will appear instantly:

			div.style.backgroundImage = 'url(' + src + ')';
			div.classList.add('background-loaded');
		});
	}

*/
module.exports = function( src, cb ) {
	var i = document.createElement('img');
	i.src = src;
	i.addEventListener('load', cb );
};
