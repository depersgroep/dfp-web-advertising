'use strict';
describe('testing targeting parameters', function() {
	describe('when passing undefined to getSafeTargetValue method', function() {
		it('should log a warning in the console', function() {
			spyOn(console, 'warn').and.callThrough();
			expect(window.dfp.__testonly__.getSafeTargetValue(undefined)).toBeNull(); // eslint-disable-line no-undefined
			expect(console.warn).toHaveBeenCalled();
		});

		it('should return null', function() {
			expect(window.dfp.__testonly__.getSafeTargetValue(undefined)).toBeNull(); // eslint-disable-line no-undefined
		});
	});

	describe('when passing null to getSafeTargetValue method', function() {
		it('should return null', function() {
			expect(window.dfp.__testonly__.getSafeTargetValue(null)).toBeNull();
		});
	});

	describe('when passing a number to getSafeTargetValue method', function() {
		it('should return a string', function() {
			expect(window.dfp.__testonly__.getSafeTargetValue(1)).toBe('1');
		});
	});

	describe('when passing a boolean to getSafeTargetValue method', function() {
		it('should return a string', function() {
			expect(window.dfp.__testonly__.getSafeTargetValue(true)).toBe('true');
		});
	});

	describe('when passing a string to getSafeTargetValue method', function() {
		it('should return the original string', function() {
			expect(window.dfp.__testonly__.getSafeTargetValue('test')).toBe('test');
		});
	});

	describe('when passing an object to getSafeTargetValue method', function() {
		it('should return null', function() {
			var testObject = {
				'test': 1
			};

			expect(window.dfp.__testonly__.getSafeTargetValue(testObject)).toBeNull();
		});
	});

	describe('when passing an empty array to getSafeTargetValue method', function() {
		it('should return null', function() {
			expect(window.dfp.__testonly__.getSafeTargetValue([])).toBeNull();
		});
	});
});
