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
