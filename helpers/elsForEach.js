// Sugar to loop through querySelectorAll because I keep
// forgetting the [].forEach.call syntax. You can either
// pass a selector string or a nodelist, to make the code
// in your app a little cleaner, like we're used to doing
// with jQuery.
//
// Effectively this is like a replacement for
// $('.selector').each(),

/*
	Usage:

	First get the function:
		const qsall = require('./utils/elsForEach');

	Loop through '.article' and add '.some-class':

		var myCollection = qsall( '.article', function( article ) {
			article.classList.add('some-class');
		});

	myCollection is the node list, eg:

		var myCollection = document.querySelectorAll('.article');

	You can also pass in node list if you had it already:

		var articles = document.querySelectorAll('.article');
		qsall( articles, function( article ) {
			[...]
		});

*/
module.exports = function( qs, cb ) {

	var nodeList = ( typeof qs === 'string' ) ? document.querySelectorAll(qs) : qs;

	[].forEach.call( nodeList, function(el, i) {
		cb( el, i );
	});

	return nodeList;
};

