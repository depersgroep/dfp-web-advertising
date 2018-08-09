'use strict';
describe('Given I want to load a slot', function() {

	beforeEach(function() {
		window.googletag = {};
		window.googletag.cmd = [];
	});

	describe('When I want to load a slot with an invalid breakpoint', function() {
		it('Then it should do nothing', function() {
			viewport.set(300);
			window.dfp.init(getValidOpts());
			window.dfp.loadSlot('testID', {
				'breakpoints': {
					'small': true
				}
			});
			expect(window.googletag.cmd.length).toBe(0);
		});
	});

	describe('When I want to load a slot with a valid breakpoint',function() {

		beforeEach(function(){
			viewport.set(1000);
			window.dfp.init(getValidOpts(), getValidTargeting(), getValidSlots('leader'));
		});

		describe('And i\'m using a DomId',function() {
			it('Then it will load the slot', function() {
				window.dfp.loadSlot('testID', {
					'breakpoints': {
						'large': true
					}
				});
				expect(window.googletag.cmd.length).toBe(2);
			});
		});

		describe('And i\'m using a dom Element',function() {

			let testElement = '<div class=\'dfp fjs-leaderboard-large\' data-id=\'leader\'></div>';
			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);
			let elm = document.querySelector('.fjs-leaderboard-large');

			it('Then it will load the slot', function() {
				window.dfp.loadSlot(elm, {
					'breakpoints': {
						'large': true
					}
				});
				expect(elm.id).toBe(elm.getAttribute('data-id'));
				expect(window.googletag.cmd.length).toBe(2);
			});
		});

		describe('And i\'m using a dom Element with id attribute',function() {

			let testElement = '<div id=\'fjs-leaderboard-large\' data-id=\'leader\'></div>';
			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);
			let elm = document.querySelector('#fjs-leaderboard-large');

			it('Then it will load the slot', function() {
				window.dfp.loadSlot(elm, {
					'breakpoints': {
						'large': true
					}
				});
				expect(elm.id).toBe(elm.getAttribute('data-id'));
				expect(window.googletag.cmd.length).toBe(2);
			});
		});

		describe('And i\'m using a dom Element without data-id attribute',function() {

			let testElement = '<div class=\'dfp fjs-leaderboard-large\'></div>';
			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);
			let elm = document.querySelector('.fjs-leaderboard-large');

			it('Then it will throw an error', function() {
				expect(function(){
						window.dfp.loadSlot(elm, {
							'breakpoints': {
								'large': true
							}
						})
				}).toThrowError(Error, 'Add data-id attribute when passing element to loadSlot method');
			});
		});

		describe('And I don\'t pass any slot options',function() {
			it('Then it will throw an error', function() {
				expect(function(){
					window.dfp.loadSlot('testID')
				}).toThrowError(Error, 'No valid set-up! Add options');
			});
		});

		describe('And I don\'t pass any valid breakpoints',function() {
			it('Then it will throw an error', function() {
				expect(function(){
					window.dfp.loadSlot('testID', {
						'foo': {
							'bar': true
						}
					})
				}).toThrowError(Error, 'No valid set-up! Add breakpoints');
			});
		});

	});

	describe('When I want to load a slot with disableInitialLoad set to true',function() {
		beforeEach(function(){
			var validOpts = getValidOpts();
			validOpts.disableInitialLoad = true;
			viewport.set(1000);
			window.dfp.init(getValidOpts(), getValidTargeting(), getValidSlots('leader'));
		});


		it('Then it will load the slot', function() {
			let testElement = '<div class=\'dfp fjs-leaderboard-large\' data-id=\'leader\'></div>';
			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);
			let elm = document.querySelector('.fjs-leaderboard-large');
			window.dfp.loadSlot(elm, {
				'breakpoints': {
					'large': true
				}
			});
			expect(elm.id).toBe(elm.getAttribute('data-id'));
			expect(window.googletag.cmd.length).toBe(2);
		});

	});


});