'use strict';
describe('-----SETGLOBALTARGETING TESTS -----', function() {
	describe('when passing empty array as value in targeting params', function() {
		it('should not be added to debugParameters', function() {
			var targeting = {
				'key': []
			};

			window.googletag = {
				'pubads': function() {
					return {
						'setTargeting': function() {
							console.log('mocked setTargeting function');
						}
					};
				}
			};

			window.dfp.__testonly__.setGlobalTargeting(targeting);

			expect(window.dfp.__testonly__.debugParameters).not.toEqual(jasmine.objectContaining({
				'key': []
			}));
		});
	});

	describe('when passing a not empty array as value in targeting params', function() {
		it('should not be added to debugParameters', function() {
			var targeting = {
				'key': [1, 2, 3]
			};

			window.googletag = {
				'pubads': function() {
					return {
						'setTargeting': function() {
							console.log('mocked setTargeting function');
						}
					};
				}
			};

			window.dfp.__testonly__.setGlobalTargeting(targeting);

			expect(window.dfp.__testonly__.debugParameters).toEqual(jasmine.objectContaining({
				'key': [1, 2, 3]
			}));
		});
	});

	describe('when passing number as value in targeting params', function() {
		it('should not be added to debugParameters as a string', function() {
			var targeting = {
				'key': 1
			};

			window.googletag = {
				'pubads': function() {
					return {
						'setTargeting': function() {
							console.log('mocked setTargeting function');
						}
					};
				}
			};

			window.dfp.__testonly__.setGlobalTargeting(targeting);

			expect(window.dfp.__testonly__.debugParameters).toEqual(jasmine.objectContaining({
				'key': '1'
			}));
		});
	});

	describe('when passing string as value in targeting params', function() {
		it('should not be added to debugParameters as a string', function() {
			var targeting = {
				'key': 'value'
			};

			window.googletag = {
				'pubads': function() {
					return {
						'setTargeting': function() {
							console.log('mocked setTargeting function');
						}
					};
				}
			};

			window.dfp.__testonly__.setGlobalTargeting(targeting);

			expect(window.dfp.__testonly__.debugParameters).toEqual(jasmine.objectContaining({
				'key': 'value'
			}));
		});
	});

	describe('when passing string as value in targeting params', function() {
		it('should not be added to debugParameters as a string', function() {
			var targeting = {
				'key1': 'value',
				'key2': 1,
				'key3': [],
				'key4': [1, 2, 3]
			};

			window.googletag = {
				'pubads': function() {
					return {
						'setTargeting': function() {
							console.log('mocked setTargeting function');
						}
					};
				}
			};

			window.dfp.__testonly__.setGlobalTargeting(targeting);

			expect(window.dfp.__testonly__.debugParameters).toEqual(jasmine.objectContaining({
				'key1': 'value',
				'key2': '1',
				'key4': [1, 2, 3]
			}));
		});
	});
});
