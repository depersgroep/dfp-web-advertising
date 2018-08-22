'use strict';
describe('Given I want to validate my setup', function() {


	describe('When I pass a ppid with special characters',function() {
		it('Then it should throw an error',function() {
			expect(function(){
				window.dfp.__testonly__.isValidPpid(getPpid(100,false));
			}).toThrowError(Error, 'No valid PPID! Make sure it\'s alphanumeric');
		});
	});
	describe('When I pass a ppid shorter than 32 chars',function() {
		it('Then it should throw an error',function() {
			expect(function(){
				window.dfp.__testonly__.isValidPpid(getPpid(31,true));
			}).toThrowError(Error, 'No valid PPID! Make sure it\'s equal or between 32 and 150 characters');
		});
	});
	describe('When I pass a ppid longer than 150 chars',function() {
		it('Then it should throw an error',function() {
			expect(function(){
				window.dfp.__testonly__.isValidPpid(getPpid(151,true));
			}).toThrowError(Error, 'No valid PPID! Make sure it\'s equal or between 32 and 150 characters');
		});
	});
	describe('When I pass a valid ppid',function() {
		it('Then it should return true',function() {
			expect(window.dfp.__testonly__.isValidPpid(getPpid(32,true))).toBe(true);
			expect(window.dfp.__testonly__.isValidPpid(getPpid(33,true))).toBe(true);
			expect(window.dfp.__testonly__.isValidPpid(getPpid(149,true))).toBe(true);
			expect(window.dfp.__testonly__.isValidPpid(getPpid(150,true))).toBe(true);
		});
	});

});