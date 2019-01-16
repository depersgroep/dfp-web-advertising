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
