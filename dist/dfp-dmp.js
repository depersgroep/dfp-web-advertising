'use strict';
/* exported getFromLocalStorage */

function getFromLocalStorage(key) {
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

'use strict';

window.dfp = window.dfp || {};
window.dfp.dmp = window.dfp.dmp || {};

'use strict';
/* eslint-disable no-undef */
/* eslint-disable no-multi-assign */

window.dfp.dmp.krux = window.dfpKrux = (function() {
	return {
		'getUserId': function(key) {
			return getFromLocalStorage(key + '_kuid');
		},
		'getSegments': function(key) {
			var segs = getFromLocalStorage(key + '_segs');

			return segs === '' ? [] : decodeURIComponent(segs).split(',');
		}
	};
}());

'use strict';
/* eslint-disable no-undef */

window.dfp.dmp.cxense = (function() {
	return {
		'getSegments': function() {
			var segs = getFromLocalStorage('CxSegments');

			return segs === '' ? [] : decodeURIComponent(segs).split(',');
		}
	};
}());
