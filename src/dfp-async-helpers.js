'use strict';
/* exported addClass, removeClass, addEvent */

function hasClass(elm, className) {
	var elmClassNames = elm.className;

	if (elmClassNames) {
		return elmClassNames.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	}

	return false;
}

function addClass(elm, className) {
	if (!hasClass(elm, className)) {
		elm.className += ' ' + className;
	}
}

function removeClass(elm, className) {
	var reg;

	if (hasClass(elm, className)) {
		reg = new RegExp('(\\s|^)' + className + '(\\s|$)');

		elm.className = elm.className.replace(reg, ' ');
	}
}

function addEvent(elem, evnt, func) {
	if (elem.addEventListener) {
		elem.addEventListener(evnt, func, false);
	} else if (elem.attachEvent) {
		elem.attachEvent('on' + evnt, func);
	}
}

window.lazyload = (function() {
	var threshold = window.lazyloadthreshold ? window.lazyloadthreshold : 200,
		screenHeight,
		screenWidth,
		slots = [],
		debounceResize,
		debounceLazy;

	function lazyLoad() {
		var i = slots.length - 1, slot;

		for (; i >= 0; i--) {
			slot = slots[i];

			if (isInViewport(slot.element)) {
				slot.callback.call();
				slots.splice(i, 1);
			}
		}
	}

	function resize() {
		screenHeight = window.innerHeight || document.documentElement.clientHeight;
		screenWidth = window.innerWidth || document.documentElement.clientWidth;
	}

	function isInViewport(el) {
		var rect;

		if (!el || !(el instanceof Element) || isHidden(el)) {
			return false;
		}

		rect = el.getBoundingClientRect();

		return rect.bottom >= 0 &&
			rect.right >= 0 &&
			rect.top - threshold <= screenHeight &&
			rect.left <= screenWidth;
	}

	function isHidden(node) {
		var el, style;

		for (el = node; el; el = el.parentElement) {
			style = getComputedStyle(el);

			if (style.display === 'none') {
				return true;
			}
		}

		return false;
	}

	function throttle(func, wait) {
		var inThrottle;

		return function() {
			var context = this,
				args = arguments;

			if (!inThrottle) {
				func.apply(context, args);
				inThrottle = true;
				setTimeout(function() {
					inThrottle = false;
				}, wait);
			}
		};
	}

	debounceLazy = throttle(function() {
		lazyLoad();
	}, 100);

	debounceResize = throttle(function() {
		resize();
	}, 100);

	window.addEventListener('scroll', debounceLazy);
	window.addEventListener('resize', debounceResize);
	resize();

	return function(elem, cb) {
		slots.push({
			'element': elem,
			'callback': cb
		});
		lazyLoad();
	};
}());
