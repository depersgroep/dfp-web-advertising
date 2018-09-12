'use strict';
describe('TESTING DYNAMIC CALLBACK DEFINITION', function() {
	describe('when a method is defined in the callbacks object', function() {
		describe('and it is not one of the following methods : init, loadSlot, createNewSlot, renderEnded, orientationChange, resize', function() {
			it('it should be available on the dfp object', function() {
				var callbacks = {
					'testmethod': jasmine.createSpy('spy')
				};

				window.dfp.__testonly__.setEventListeners(callbacks, {});

				window.dfp.testmethod();

				expect(window.dfp.testmethod).toBe(callbacks.testmethod);
				expect(window.dfp.testmethod).toHaveBeenCalledWith();
				expect(callbacks.testmethod).toHaveBeenCalledWith();
			});
		});

		describe('and it is one of the following methods : init, loadSlot, createNewSlot', function() {
			it('these should not be overwritten on the dfp object', function() {
				var callbacks, options;

				callbacks = {
					'init': jasmine.createSpy('spy'),
					'loadSlot': jasmine.createSpy('spy'),
					'createNewSlot': jasmine.createSpy('spy')
				};

				options = {
					'breakpoints': [],
					'tag': {
						'networkId': 7191,
						'adUnit': 'target/target.site-%screenSize%/'
					},
					'callbacks': callbacks
				};

				window.dfp.__testonly__.setEventListeners(callbacks, {});

				spyOn(window.dfp, 'init').and.callThrough();
				spyOn(window.dfp, 'loadSlot').and.callThrough();
				spyOn(window.dfp, 'createNewSlot').and.callThrough();

				window.dfp.init(options, [], []);
				expect(window.dfp.init).not.toBe(callbacks.init);
				expect(callbacks.init).not.toHaveBeenCalled();
				expect(window.dfp.init).toHaveBeenCalledWith(options, [], []);

				window.dfp.loadSlot('', {'breakpoints': {}});// eslint-disable-line object-curly-newline
				expect(window.dfp.loadSlot).not.toBe(callbacks.loadSlot);
				expect(callbacks.loadSlot).not.toHaveBeenCalled();
				expect(window.dfp.loadSlot).toHaveBeenCalledWith('', {'breakpoints': {}});// eslint-disable-line object-curly-newline

				window.dfp.createNewSlot('', {'breakpoints': {}});// eslint-disable-line object-curly-newline
				expect(window.dfp.createNewSlot).not.toBe(callbacks.createNewSlot);
				expect(callbacks.createNewSlot).not.toHaveBeenCalled();
				expect(window.dfp.createNewSlot).toHaveBeenCalledWith('', {'breakpoints': {}});// eslint-disable-line object-curly-newline
			});
		});

		describe('and it is one of the following methods : resize, orientationChange', function() {
			it('these should do something', function() {
				var callbacks = {
					'resize': jasmine.createSpy('spy'),
					'orientation': jasmine.createSpy('spy')
				}, resize, orientationChange;

				window.dfp.__testonly__.setEventListeners(callbacks, {});

				if(typeof(Event) === 'function') {
					resize = new Event('resize');
					orientationChange = new Event('orientationchange');
				}else{
					resize = document.createEvent('Event');
					resize.initEvent('resize', true, true);
					orientationChange = document.createEvent('Event');
					orientationChange.initEvent('orientationchange', true, true);
				}

				window.dispatchEvent(resize);
				window.dispatchEvent(orientationChange);

				expect(callbacks.resize).toHaveBeenCalledWith(true);
				expect(callbacks.orientation).toHaveBeenCalledWith(true);
			});
		});
	});
});
