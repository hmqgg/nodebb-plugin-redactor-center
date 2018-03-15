(function (module) {
'use strict';
var Plugin = {},
codeRegex = /(?:<pre>(?:.|\n)*?<\/pre>|<code>(?:.|\n)*?<\/code>)/gi,
alignRegex = /\^\[(.+)]/g;

Plugin.parse = function (data, callback) {
	if (data && 'string' === typeof data) {
		data = parser(data);
	} else if (data.postData && data.postData.content && data.postData.content.match(alignRegex)) {
		data.postData.content = parser(data.postData.content);
	} else if (data.userData && data.userData.signature && data.userData.signature.match(alignRegex)) {
		data.userData.signature = parser(data.userData.signature);
	}
	callback(null, data);
};

function parser (data) {
	var codeTags = [];

	data = data.replace(codeRegex, function (match) {
		codeTags.push(match);
		return '___CODE___';
	});

	data = data.replace(alignRegex, function (match, $1) {
		return '<div class="row"><div class="col-md-12 text-center" tabindex="-1">' + $1 + '</div></div>';
	});

	data = data.replace(/___CODE___/gi, function (match) {
		return codeTags.shift();
	});

	return data;
}

module.exports = Plugin;

})(module);
