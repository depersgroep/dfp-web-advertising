'use strict';
describe('Given I want to get parameters from a string', function() {
	describe('When I pass an empty string',function() {
		it('Then it should return an empty object',function() {
			expect(window.dfp.__testonly__.getParameters("")).toEqual({});
		});
	});
	describe('When I pass a parameter without value',function() {
		it('Then it should return an empty object',function() {
			expect(window.dfp.__testonly__.getParameters("?foobar")).toEqual({});
		});
	});
	describe('When I pass a single key value',function() {
		it('Then it should return an empty object',function() {
			expect(window.dfp.__testonly__.getParameters("?foo=bar")).toEqual({'foo':'bar'});
		});
	});
	describe('When I pass multiple key values',function() {
		it('Then it should return an empty object',function() {
			expect(window.dfp.__testonly__.getParameters("?foo=bar&bar=foo")).toEqual({'foo':'bar', 'bar':'foo'});
		});
	});
});