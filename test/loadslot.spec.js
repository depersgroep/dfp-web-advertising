'use strict';
describe('testing the loadslots method', function() {
	describe('loadslots method with element id', function() {
		it('should work', function() {
			var breakpoints, options;

			window.googletag = {};
			window.googletag.cmd = [];

			breakpoints = [{
				'name': 'small',
				'begin': 320,
				'end': 767
			}];

			viewport.set(400);

			options = {
				'breakpoints': breakpoints,
				'tag': {
					'networkId': 7191,
					'adUnit': 'target/target.site-%screenSize%/'
				}
			};

			window.dfp.init(options);

			window.dfp.loadSlot('testID', {
				'breakpoints': {
					'small': true
				}
			});

			expect(window.googletag.cmd.length).toBe(2);
		});
	});

	describe('loadslots method with DOM element', function() {
		beforeEach(
			function prepare() {
				var breakpoints, options, targeting, slots;

				window.googletag = {};
				window.googletag.cmd = [];

				breakpoints = [{
					'name': 'small',
					'begin': 320,
					'end': 767
				}];

				viewport.set(400);

				options = {
					'breakpoints': breakpoints,
					'tag': {
						'networkId': 7191,
						'adUnit': 'target/target.site-%screenSize%/'
					}
				};

				targeting = {};
				slots = [
					{
						'pos': 'leader1',
						'domId': 'leader--1',
						'sizes': {
							'large': [[840, 150], [970, 250], [728, 90], [840, 250]],
							'medium': [[728, 90]],
							'small': [[320, 100], [320, 50]]
						}
					}];

				window.dfp.init(options, targeting, slots);
			}
		);

		it('should work when passing an element to loadSlot method', function() {
			var testElement, elm;

			testElement = '<div class=\'dfp fjs-leaderboard-large\' data-id=\'leader--1\'></div>';

			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);

			elm = document.querySelector('.fjs-leaderboard-large');

			window.dfp.loadSlot(elm, {
				'breakpoints': {
					'small': true
				}
			});

			expect(elm.id).toBe(elm.getAttribute('data-id'));
			expect(window.googletag.cmd.length).toBe(2);
		});

		it('should throw error when element has no or empty data-id attribute', function() {
			var testElement, elm;

			testElement = '<div class=\'dfp fjs-leaderboard-large\'></div>';

			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);

			elm = document.querySelector('.fjs-leaderboard-large');

			expect(function() {
				window.dfp.loadSlot(elm, {
					'breakpoints': {
						'small': true
					}
				});
			}).toThrowError(Error, 'Add data-id attribute when passing element to loadSlot method');
		});

		it('should throw error when no options are given', function() {
			var breakpoints, options;

			window.googletag = {};
			window.googletag.cmd = [];

			breakpoints = [{
				'name': 'small',
				'begin': 320,
				'end': 767
			}];

			viewport.set(400);

			options = {
				'breakpoints': breakpoints,
				'tag': {
					'networkId': 7191,
					'adUnit': 'target/target.site-%screenSize%/'
				}
			};

			window.dfp.init(options);

			expect(function() {
				window.dfp.loadSlot('testID');
			}).toThrowError(Error, 'No valid set-up! Add options');
		});
	});

	it('should throw error when no breakpoints are given', function() {
		var breakpoints, options;

		window.googletag = {};
		window.googletag.cmd = [];

		breakpoints = [{
			'name': 'small',
			'begin': 320,
			'end': 767
		}];

		viewport.set(400);

		options = {
			'breakpoints': breakpoints,
			'tag': {
				'networkId': 7191,
				'adUnit': 'target/target.site-%screenSize%/'
			}
		};

		window.dfp.init(options);

		expect(function() {
			window.dfp.loadSlot('testID', {
				'tag': {
					'networkId': 7191
				}
			});
		}).toThrowError(Error, 'No valid set-up! Add breakpoints');
	});
});
