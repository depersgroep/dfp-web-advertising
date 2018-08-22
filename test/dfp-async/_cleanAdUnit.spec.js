'use strict';
describe('Given I want to clean my ad unit', function() {

	beforeEach(function(){
		window.dfp.__testonly__.setBreakpointName('foobar');
	});

	describe('When I pass an empty string',function() {
		it('Then it should return an empty string',function() {
			expect(window.dfp.__testonly__.cleanAdUnit("")).toBe("")
		});
	});
	describe('When I pass a string without placeholder',function() {
		it('Then it should return the same string',function() {
			var input = 'this is an example string';
			expect(window.dfp.__testonly__.cleanAdUnit(input)).toBe(input);
		});
	});
	describe('When I pass a string with placeholder',function() {
		it('Then it should return string with the placeholder replaced',function() {
			var input = 'this is an example string with placeholder %screenSize%';
			var output = 'this is an example string with placeholder foobar';
			expect(window.dfp.__testonly__.cleanAdUnit(input)).toBe(output);
		});
	});
});