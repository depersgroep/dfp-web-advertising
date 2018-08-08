'use strict';

window.dfpKrux = (function() {
	function _retrieve(key) {
		var returnValue = '',
			cookieArr;

		key = 'kxdepersgroep_' + key;

		if (window.localStorage && window.localStorage[key]) {
			returnValue = window.localStorage[key];
		} else if (navigator.cookieEnabled) {
			cookieArr = document.cookie.match(key + '=([^;]*)');
			returnValue = cookieArr === null ? '' : cookieArr[1];
		}

		return returnValue;
	}

	return {
		'getUserId': function() {
			return _retrieve('kuid');
		},
		'getSegments': function() {
			var segs = _retrieve('segs');

			return segs === '' ? [] : decodeURIComponent(segs).split(',');
		}
	};
}());
