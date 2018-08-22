'use strict';
describe('Given I want to get the dom id as a string', function() {
	describe('When I ask the id based on a string',function() {
		it('Then it should return the id as a string',function() {
			expect(window.dfp.__testonly__.getIdString('foobar')).toBe('foobar');
		});
	});
	describe('When I ask the id based on an element without id',function() {
		it('Then it should return an empty string',function() {
			let testElement = '<div class=\'foobar\' data-id=\'foobar\'></div>';
			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);
			let elm = document.querySelector('.foobar');
			expect(window.dfp.__testonly__.getIdString(elm)).toBe('');
		});
	});
	describe('When I ask the id based on an element with id',function() {
		it('Then it should return the id as a string',function() {
			let testElement = '<div id=\'foobar\' data-id=\'foobar\'></div>';
			document.body.insertAdjacentHTML(
				'afterbegin',
				testElement);
			let elm = document.getElementById('foobar');
			expect(window.dfp.__testonly__.getIdString(elm)).toBe('foobar');
		});
	});
	describe('When I ask the id based on a number',function() {
		it('Then it should return undefined',function() {
			expect(window.dfp.__testonly__.getIdString(1)).toBeUndefined();
		});
	});
});