// vanilla js replacement for
// $(form).serialize();
// useful for preparing an ajax form post.
module.exports = function (form) {
		var field,
			l,
			s = [];

		if (typeof form == 'object' && form.nodeName == "FORM") {
			var len = form.elements.length;

			for (var i = 0; i < len; i++) {
				field = form.elements[i];
				if (field.name && !field.disabled ) {
					if (field.type == 'select-multiple') {
						l = form.elements[i].options.length;

						for (var j = 0; j < l; j++) {
							if (field.options[j].selected) {
								s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
							}
						}
					}
					else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
						s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
					}
				}
			}
		}
		return s.join('&').replace(/%20/g, '+');

};
