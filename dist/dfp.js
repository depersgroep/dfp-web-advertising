/* eslint-disable */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
(function() {
	'use strict'
	if (!Object.keys) {
		Object.keys = (function() {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function(obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}

				return result;
			};
		}());
	}
}());

/**
 *  @fileOverview DFP layer for asynchronous loading of advertisements.
 *
 *  @author       Yannick Van Avermaet
 *  @author       Thijs D'Hulster
 *  @author       Peter Vercauteren
 */

/**
 *  Public DFP namespace.
 *  @module dfp
 *  @return dfp
 */
'use strict';

window.dfp = (function(tar, w, d, c) {
	var queueList = tar.cmd ? tar.cmd : [],
		tag,
		breakpointName,
		slots,
		urlParameters = {},
		debugParameters = {},
		version = '5.0.1',
		services = {},
		defaultServices = {
			'async': true,
			'singleRequest': true,
			'collapseEmpty': true,
			'requestNonPersonalizedAds': 1,
			'ppid': false,
			'disableInitialLoad': false
		};

	/**
	 * Override window.dfp.cmd Array
	 *
	 * @alias dfp.cmd
	 */
	tar.cmd = {
		'push': function(fn) {
			queueList.push(fn);
			_next();
		}
	};

	/**
	 * Initializing global DFP configuration
	 *
	 * @alias dfp.init
	 *
	 * @param {Object} opts Set of options (single request, collapse empty divs, initial load, ...)
	 * @param {Object} targeting Global targeting parameters
	 * @param {Object} slts Predefined slots
	 */
	tar.init = function(opts, targeting, slts) {
		w.googletag = w.googletag || {};
		w.googletag.cmd = w.googletag.cmd || [];

		urlParameters = _getParameters(w.location.search);

		_addPerformanceMark('dfp-init-begin');

		tag = opts.tag || {};

		_validateSetup();
		_initServices(opts.services);

		slots = slts;
		breakpointName = _resolveBreakpointName(opts.breakpoints);

		if (breakpointName !== null) {
			w.googletag.cmd.push(function() {
				if (services.async) {
					w.googletag.pubads().enableAsyncRendering();
				}

				if (services.singleRequest) {
					w.googletag.pubads().enableSingleRequest();
				}

				if (services.collapseEmpty) {
					w.googletag.pubads().collapseEmptyDivs();
				}

				if (services.ppid && _isValidPpid(services.ppid)) {
					w.googletag.pubads().setPublisherProvidedId(services.ppid);
				}

				if (services.disableInitialLoad) {
					w.googletag.pubads().disableInitialLoad();
				}

				w.googletag.pubads().setRequestNonPersonalizedAds(services.requestNonPersonalizedAds ? 1 : 0);

				_setGlobalTargeting(targeting);
				_defineSlots(slots);

				if (typeof opts.callbacks !== 'undefined') {
					_setEventListeners(opts.callbacks, opts.breakpoints);
				}

				w.googletag.enableServices();
			});
		}
		_addPerformanceMark('dfp-init-end');
	};

	/**
	 * Load a defined slot based on breakpoint
	 *
	 * @alias dfp.loadSlot
	 *
	 * @param {any} domIdOrElement String or object of known node element where the slot needs to be loaded
	 * @param {Object} opts Breakpoint object
	 */
	tar.loadSlot = function(domIdOrElement, opts) {
		var domId;

		if (_isValidBreakpoint(opts, breakpointName)) {
			domId = domIdOrElement;

			if (typeof domIdOrElement !== 'string') {
				_setIdOnDomElement(domIdOrElement);
				domId = domIdOrElement.id;
			}

			w.googletag.cmd.push(function() {
				w.googletag.display(domId);

				if (services.disableInitialLoad) {
					w.googletag.pubads().refresh([_findSlot(domId).gslot]);
				}
				_addPerformanceMark('dfp-load-' + domId);
				_displayDebug(domId);
			});
		}
	};

	/**
	 * Refresh an existing slot
	 *
	 * @alias dfp.refreshSlot
	 *
	 * @param {any} domIdOrElement String or object of known node element where the slot needs to be refreshed
	 * @param {Object} targeting Local targeting object
	 * @param {boolean} overrideSlotTargeting Whether or not the targeting values need to be appended or overridden
	 */
	tar.refreshSlot = function(domIdOrElement, targeting, overrideSlotTargeting) {
		var domId, slot;

		domId = _getIdString(domIdOrElement);
		slot = _findSlot(domId);

		w.googletag.cmd.push(function() {
			if (typeof targeting !== 'undefined') {
				_setLocalTargeting(slot, targeting, overrideSlotTargeting);
			}
			_addPerformanceMark('dfp-refresh-' + domId);
			_displayDebug(slot);

			w.googletag.pubads().refresh([slot.gslot]);
		});
	};

	/**
	 * Refresh an an array of slots
	 *
	 * @alias dfp.refreshSlots
	 *
	 * @param {Array} slts Array of slots that needs to be refreshed
	 * @example
	 * [
	 * 		{
	 * 			'domId': 'leader--1';
	 * 			'targeting': {
	 * 				'key': 'value'
	 * 			},
	 * 			'overrideTargetValues': true
	 * 		}
	 * ]
	 */
	tar.refreshSlots = function(slts) {
		var slotsToRefresh = [],
			slotsList = [],
			i = 0, j = 0,
			len = slts.length,
			slot;

		if (typeof slts !== 'undefined' && slts.length > 0) {
			for (; j < len; j++) {
				slot = _findSlot(slts[j].domId);
				slotsList.push(slot);
				slotsToRefresh.push(slot.gslot);
			}

			w.googletag.cmd.push(function() {
				for (; i < len; i++) {
					slot = slotsList[i];

					if (typeof slts[i].targeting !== 'undefined') {
						_setLocalTargeting(slot, slts[i].targeting, slts[i].overrideSlotTargeting);
					}

					_addPerformanceMark('dfp-refresh-' + slot.domId);
					_displayDebug(slot);
				}
				w.googletag.pubads().refresh(slotsToRefresh);
			});
		}
	};

	/**
	 * Load a defined slot based on breakpoint
	 *
	 * @alias dfp.loadLazySlot
	 *
	 * @param {any} slot String or object of known node element where the slot needs to be loaded
	 * @param {Object} opts Breakpoint object
	 */
	function _loadLazySlot(slot, opts) {
		if (_isValidBreakpoint(opts, breakpointName)) {
			w.googletag.cmd.push(function() {
				_defineSlot(slot);

				w.googletag.display(slot.domId);

				_displayDebug(slot);
			});
		}
	}

	/**
	 * Set global targeting parameter
	 *
	 * @param {Object} targeting Global targeting parameters
	 */
	function _setGlobalTargeting(targeting) {
		if (typeof urlParameters.adops !== 'undefined') {
			targeting.adops = urlParameters.adops;
		}

		targeting.screen = breakpointName;
		targeting.targeted = !services.requestNonPersonalizedAds;

		_setTargeting(w.googletag.pubads(), targeting, true);
	}

	/**
	 * Set local targeting
	 *
	 * @param {Object} slot Slot on which targeting parameters should be set
	 * @param {Object} targeting Targeting parameters
	 * @param {boolean} overrideTargetValues Whether or not the targeting values need to be appended or overridden
	 */
	function _setLocalTargeting(slot, targeting, overrideTargetValues) {
		var key;

		if (overrideTargetValues) {
			_clearLocalTargeting(slot);
		}

		for (key in targeting) {
			if (Object.hasOwnProperty.call(targeting, key)) {
				slot.targeting[key] = targeting[key];
			}
		}
		_setTargeting(slot.gslot, targeting, false);
	}

	/**
	 * Clear local targeting
	 *
	 * @param {Object} slot Slot whose targeting parameters should be cleared
	 */
	function _clearLocalTargeting(slot) {
		slot.targeting = {};
		slot.gslot.clearTargeting(); // https://developers.google.com/doubleclick-gpt/reference#googletag.Slot_clearTargeting
	}

	/**
	 * Set targeting parameters
	 *
	 * @param {Object} obj Object to which targeting parameters should be set
	 * @param {Object} targeting Targeting parameters
	 * @param {boolean} addToDebug Whether or not the values should be shown in the debug console
	 */
	function _setTargeting(obj, targeting, addToDebug) {
		var key,
			value;

		for (key in targeting) {
			if (Object.hasOwnProperty.call(targeting, key)) {
				value = _getSafeTargetValue(targeting[key]);

				if (value) {
					if (addToDebug) {
						debugParameters[key] = value;
					}

					obj.setTargeting(key, value);
				}
			}
		}
	}

	/**
	 * Validate target value (only boolean, number, string or arrays are accepted)
	 *
	 * @param {any} value Value to be validated as targeting value
	 * @returns targeting value
	 */
	function _getSafeTargetValue(value) {
		if (typeof value === 'boolean' || typeof value === 'number') {
			return value.toString();
		} else if (typeof value === 'string' || typeof value === 'object' && value instanceof Array && value.length > 0) {
			return value;
		}

		if (typeof value === 'object' && value instanceof Array && value.length !== 0 || value !== null) {
			c.warn('Targeting values should be either a boolean, number, string or an array');
		}

		return null;
	}

	/**
	 * Define list of slots
	 *
	 * @param {Array} slts Array list of slots
	 */
	function _defineSlots(slts) {
		var i = 0,
			l = slts.length,
			slot;

		for (; i < l; i++) {
			slot = slts[i];

			_defineSlot(slot);
		}
	}

	/**
	 * Define one slot at a time
	 *
	 * @param {Object} slot Defined slot with their corresponding configuration
	 */
	function _defineSlot(slot) {
		var slt;

		if (typeof slot.sizes === 'undefined' && slot.outofpage) {
			slt = w.googletag.defineOutOfPageSlot('/' + tag.networkId + '/' + _cleanAdUnit(tag.adUnit), slot.domId);
		} else if (typeof slot.sizes !== 'undefined' && slot.sizes[breakpointName].length > 0) {
			slt = w.googletag.defineSlot('/' + tag.networkId + '/' + _cleanAdUnit(tag.adUnit), slot.sizes[breakpointName], slot.domId);
		}

		if (typeof slt !== 'undefined') {
			slot.gslot = slt;

			slt.addService(w.googletag.pubads()).setTargeting('slot', slot.domId);
			_setLocalTargeting(slot, slot.targeting, false);
			_addPerformanceMark('dfp-define-' + slot.domId);
		}
	}

	/**
	 * Set Event Listeners and only allow custom callbacks
	 *
	 * @param {Object} cbs List of custom callbacks
	 * @param {Object} breakpoints Breakpoints
	 */
	function _setEventListeners(cbs, breakpoints) {
		var callbackFnKeys = Object.keys(cbs),
			i = 0,
			l = callbackFnKeys.length,
			key;

		if (typeof cbs.renderEnded === 'function') {
			w.googletag.pubads().addEventListener('slotRenderEnded', function(e) {
				_slotRenderEnded(e, cbs.renderEnded);
			});
		}

		if (typeof cbs.resize === 'function') {
			_addEventListener(w, 'resize', function() {
				var bp = _resolveBreakpointName(breakpoints);

				cbs.resize(bp === breakpointName);
			});
		}

		if (typeof cbs.orientation === 'function') {
			_addEventListener(w, 'orientationchange', function() {
				var bp = _resolveBreakpointName(breakpoints);

				cbs.orientation(bp === breakpointName);
			});
		}

		for (; i < l; i++) {
			key = callbackFnKeys[i];

			if (typeof cbs[key] === 'function'
				&& key !== 'renderEnded'
				&& key !== 'resize'
				&& key !== 'orientation'
				&& key !== 'init'
				&& key !== 'loadSlot'
				&& key !== 'loadLazySlot'
				&& key !== 'version') {
				tar[key] = cbs[key];
			}
		}
	}

	/**
	 * Renderended callback called upon 'successful' rendering of slot
	 *
	 * @param {Object} e Event listener object
	 * @param {function} renderEndedCallback Renderended Callback
	 */
	function _slotRenderEnded(e, renderEndedCallback) {
		_addPerformanceMark('dfp-renderended-' + e.slot.getSlotId().getDomId());
		renderEndedCallback(e.slot.getSlotId().getDomId(), e.isEmpty, e.size);
	}

	/**
	 * Display all available debug parameters through console or alert
	 *
	 * @param {any} o Slot
	 */
	function _displayDebug(o) {
		var slot,
			debugMessage,
			debugParamKey,
			slotKey,
			targetValue;

		if (typeof urlParameters.taginfo !== 'undefined') {
			slot = typeof o === 'string' ? _findSlot(o) : o; // get slot from global slots-array or slot was passed as a parameter
			debugMessage = 'version=' + version +
				'\nnetworkId=' + tag.networkId +
				'\nadUnit=' + _cleanAdUnit(tag.adUnit) +
				(typeof slot.sizes === 'undefined' ? '' : '\nsize=' + slot.sizes[breakpointName]) +
				(typeof slot.outofpage === 'undefined' ? '' : '\noutofpage=' + slot.outofpage) +
				'\nslot=' + slot.domId;

			for (slotKey in slot.targeting) {
				if (Object.hasOwnProperty.call(slot.targeting, slotKey)) {
					targetValue = _getSafeTargetValue(slot.targeting[slotKey]);

					if (targetValue) {
						debugMessage += '\n' + slotKey + '=' + targetValue;
					}
				}
			}

			for (debugParamKey in debugParameters) {
				if (Object.hasOwnProperty.call(debugParameters, debugParamKey)) {
					debugMessage += '\n' + debugParamKey + '=' + debugParameters[debugParamKey];
				}
			}

			if (urlParameters.taginfo === 'console') {
				c.log(debugMessage + '\n--------------');
			} else {
				w.alert(debugMessage); // eslint-disable-line no-alert
			}
		}
	}

	/**
	 * Add event listeners to the provided element
	 *
	 * @param {Object} elem Node element on which to attach the event to
	 * @param {string} evnt Event string name (click, hover, ...)
	 * @param {function} func Function to be called when event is triggered
	 */
	function _addEventListener(elem, evnt, func) {
		if (elem.addEventListener) {
			elem.addEventListener(evnt, func, false);
		} else if (elem.attachEvent) {
			elem.attachEvent('on' + evnt, func);
		}
	}

	/**
	 * Check for tag validity
	 */
	function _validateSetup() {
		if (tag) {
			if (typeof tag.networkId === 'undefined' || !tag.networkId) {
				throw new Error('No valid set-up! Add a DFP network ID');
			}

			if (typeof tag.adUnit === 'undefined' || !tag.adUnit) {
				throw new Error('No valid set-up! Add an Ad Unit');
			}
		} else {
			throw new Error('No valid set-up! Add a tag parameter to options object');
		}
	}

	/**
	 * Initialize option services
	 */
	function _initServices(optServices) {
		var opt;

		services = optServices || {};

		for (opt in defaultServices) {
			if (Object.hasOwnProperty.call(defaultServices, opt) && !Object.hasOwnProperty.call(services, opt)) {
				services[opt] = defaultServices[opt];
			}
		}
	}

	/**
	 * Check for valid PPID
	 *
	 * @param {string} ppid PPID id
	 */
	function _isValidPpid(ppid) {
		if (!/^[a-zA-Z0-9]+$/.test(ppid)) {
			throw new Error('No valid PPID! Make sure it\'s alphanumeric');
		}

		if (ppid.length < 32 || ppid.length > 150) {
			throw new Error('No valid PPID! Make sure it\'s equal or between 32 and 150 characters');
		}

		return true;
	}

	/**
	 * Check whether current breakpoint is valid
	 *
	 * @param {Object} opts Options object containing basic config
	 * @param {string} bpName Breakpoint name
	 * @returns Returns if breakpoint (bpName) is a valid breakpoint
	 */
	function _isValidBreakpoint(opts, bpName) {
		if (typeof opts === 'undefined') {
			throw new Error('No valid set-up! Add options');
		}

		if (typeof opts.breakpoints === 'undefined') {
			throw new Error('No valid set-up! Add breakpoints');
		}

		return typeof opts.breakpoints[bpName] !== 'undefined' && opts.breakpoints[bpName];
	}

	/**
	 * Get the query string parameters
	 *
	 * @param {string} str Url
	 * @returns Object with a list of key/value pairs
	 */
	function _getParameters(str) {
		var qsParm = {},
			params = str.substring(1).split('&'),
			l = params.length,
			i = 0,
			pos;

		for (; i < l; i++) {
			pos = params[i].indexOf('=');

			if (pos > 0) {
				qsParm[params[i].substring(0, pos)] = params[i].substring(pos + 1);
			}
		}

		return qsParm;
	}

	/**
	 * Calculate current breakpoint
	 *
	 * @param {object} breakpoints List of available breakpoints
	 * @returns The current breakpoint (based on screenwidth)
	 */
	function _resolveBreakpointName(breakpoints) {
		var windowWidth = _getWindowWidth(),
			i = 0,
			l = breakpoints.length,
			breakpoint;

		for (; i < l; i++) {
			breakpoint = breakpoints[i];

			if (breakpoint.begin <= windowWidth && breakpoint.end >= windowWidth) {
				return breakpoint.name;
			}
		}

		return null;
	}

	/**
	 * Replace the screenSize placeholder with the current breakpoint
	 *
	 * @param {string} str Current ad unit
	 * @returns The current ad unit including the breakpoint
	 */
	function _cleanAdUnit(str) {
		return str.replace('%screenSize%', breakpointName);
	}

	/**
	 * Find the corresponding googletag slot
	 *
	 * @param {string} domId Ad slot ID
	 * @returns The googletag slot
	 */
	function _findSlot(domId) {
		var i = 0,
			l = slots.length,
			slot = {};

		for (; i < l; i++) {
			if (slots[i].domId === domId) {
				slot = slots[i];
				break;
			}
		}

		return slot;
	}

	function _getWindowWidth() {
		if (w.self.innerWidth) {
			return w.self.innerWidth;
		} else if (d.documentElement && d.documentElement.clientHeight) {
			return d.documentElement.clientWidth;
		} else if (d.body) {
			return d.body.clientWidth;
		}

		return 0;
	}

	function _getIdString(domIdOrElement) {
		var domId = domIdOrElement;

		if (typeof domId !== 'string') {
			domId = domIdOrElement.id;
		}

		return domId;
	}

	/**
	 * If a multi slot is used, add the ID attribute
	 *
	 * @param {Object} element Element which needs it's ID to be set
	 */
	function _setIdOnDomElement(element) {
		var id = element.getAttribute('data-id');

		if (typeof id !== 'undefined' && id) {
			element.id = id;
		} else {
			throw new Error('Add data-id attribute when passing element to loadSlot method');
		}
	}

	/**
	 * Add performance marks
	 *
	 * @param {string} mark Mark title
	 */
	function _addPerformanceMark(mark) {
		if (w.performance && w.performance.mark) {
			w.performance.mark(mark);
		}
	}

	/**
	 * Start invoking asynchronous functions
	 */
	function _next() {
		queueList.shift().call();
	}

	// Used by site
	tar.loadLazySlot = _loadLazySlot;
	tar.version = version;


	while (queueList.length > 0) {
		_next();
	}

	return tar;
}(window.dfp || {}, window, document, console));
