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

// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

const _doit = ( qs, cb ) => {

	var nodeList = ( typeof qs === 'string' ) ? document.querySelectorAll(qs) : qs;

	if ( nodeList instanceof NodeList ) {
		nodeList.forEach( function(el, i, list) {
			cb( el, i, list );
		});	
	} else {
		cb( nodeList, 0, nodeList );
	}

	return nodeList;

};

module.exports = function( qs, cb ) {

	
	if ( Array.isArray( qs ) ) {

		let chunks = [];

		qs.forEach( ( item ) => {
			chunks.push( _doit( item, cb ) ); 
		});

		return chunks;

	} else {
		return _doit( qs, cb );	
	}
	

	
};

