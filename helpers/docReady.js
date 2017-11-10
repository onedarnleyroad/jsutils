// Vanilla JS docready. Due to different browsers, it's
// not quite as simple as DOMContentLoaded so:
// eg:
/*

	Instead of requiring all of jquery:

	const $ = require('jquery');
	$(function() {
		console.log("DOM Is Loaded");
	});

	Make something more lightweight:

	const _$ = require("./utils/docReady");
	_$(function() {
		console.log("DOM Is Loaded");
	});


 */
module.exports = function(fn) {
	if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
};
