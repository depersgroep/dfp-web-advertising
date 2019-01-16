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
