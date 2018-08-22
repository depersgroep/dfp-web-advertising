'use strict';
describe('Given I want to get a safe target value', function() {
	describe('Given I pass a boolean value', function() {
		it('Then it should return this value as a string',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue(true);
			expect(value).toBe(value.toString());
		});
	});
	describe('Given I pass a number value', function() {
		it('Then it should return this value as a string',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue(123);
			expect(value).toBe(value.toString());
		});
	});
	describe('Given I pass an empty object', function() {
		it('Then it should return null',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue({});
			expect(value).toBeNull();
		});
	});
	describe('Given I pass an object with a key value', function() {
		it('Then it should return null',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue({'foo': 'bar'});
			expect(value).toBeNull();
		});
	});
	describe('Given I pass an empty Array object', function() {
		it('Then it should return null',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue([]);
			expect(value).toBeNull();
		});
	});
	describe('Given I pass an Array object with a value', function() {
		it('Then it should return null',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue(['foo','bar']);
			expect(value).toEqual(['foo','bar']);
		});
	});
	describe('Given I pass a null value', function() {
		it('Then it should return null',function() {
			var value = window.dfp.__testonly__.getSafeTargetValue(null);
			expect(value).toBeNull();
		});
	});
	describe('Given I pass an undefined value', function() {
		beforeEach(function(){
			spyOn(console, 'warn').and.callThrough();
			this.value = window.dfp.__testonly__.getSafeTargetValue(undefined);
		});
		it('Then it should return null',function() {
			expect(this.value).toBeNull();
		});
		it('And it should log a warning in the console', function() {
			expect(console.warn).toHaveBeenCalled();
		});

	});
});