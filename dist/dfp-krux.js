'use strict';

window.dfpKrux = (function() {
	function _retrieve(key) {
		var returnValue = '',
			cookieArr;

		if (window.localStorage && window.localStorage[key]) {
			returnValue = window.localStorage[key];
		} else if (navigator.cookieEnabled) {
			cookieArr = document.cookie.match(key + '=([^;]*)');
			returnValue = cookieArr === null ? '' : cookieArr[1];
		}

		return returnValue;
	}

	return {
		'getUserId': function(key) {
			return _retrieve(key + '_kuid');
		},
		'getSegments': function(key) {
			var segs = _retrieve(key + '_segs');

			return segs === '' ? [] : decodeURIComponent(segs).split(',');
		}
	};
}());
