'use strict';
describe('On initializing dfp', function() {
	describe('when not passing any params to init method', function() {
		it('should throw a TypeError', function() {
			expect(function() {
				window.dfp.init();
			}).toThrowError(TypeError);
		});
	});

	describe('when passing options object without tag property ', function() {
		it('should throw a TypeError', function() {
			var options = {};

			expect(function() {
				window.dfp.init(options);
			}).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});
});

