'use strict';
describe('Given I want to check if a breakpoint is valid', function() {
	describe('When I pass an undefined opts parameter', function() {
		it('Then I get an error message',function(){
			expect(function(){
				window.dfp.__testonly__.isValidBreakpoint(undefined, 'foobar');
			}).toThrowError(Error, 'No valid set-up! Add options')
		});
	});
	describe('When I pass an undefined opts.breakpoints parameter', function() {
		it('Then I get an error message',function(){
			var breakpoints = getValidOpts();
			delete breakpoints.breakpoints;
			expect(function(){
				window.dfp.__testonly__.isValidBreakpoint(breakpoints, 'foobar');
			}).toThrowError(Error, 'No valid set-up! Add breakpoints')
		});
	});
	describe('When I pass a valid opts parameter and an unexisting breakpointname', function() {
		it('Then I get an error message',function(){
			expect(window.dfp.__testonly__.isValidBreakpoint(getValidOpts(), 'foobar')).toBe(false);
		});
	});
	describe('When I pass a valid opts parameter and an existing breakpointname', function() {
		it('Then I get an error message',function(){
			expect(window.dfp.__testonly__.isValidBreakpoint(getValidOpts(), 'small')).toBe(false);
		});
	});
});