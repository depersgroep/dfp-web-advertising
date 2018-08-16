'use strict';
describe('Given I want to set an id on a DOM element', function() {

	beforeEach(function(){

		this.getElement = function(s) {
			document.body.insertAdjacentHTML('afterbegin',s);
			return document.getElementById('foobar');
		};
	});

	describe('When I pass an empty data id',function() {
		it('Then it should set the data id as id on the element',function() {
			let elm = this.getElement('<div id=\'foobar\' data-id=\'\'></div>');
			expect(function(){
				window.dfp.__testonly__.setIdOnDomElement(elm)
			}).toThrowError(Error, 'Add data-id attribute when passing element to loadSlot method');
		});
	});
	describe('When I pass no data id',function() {
		it('Then it should set the data id as id on the element',function() {
			let elm = this.getElement('<div id=\'foobar\'></div>');
			expect(function(){
				window.dfp.__testonly__.setIdOnDomElement(elm)
			}).toThrowError(Error, 'Add data-id attribute when passing element to loadSlot method');
		});
	});
	describe('When I pass a data id',function() {
		it('Then it should set the data id as id on the element',function() {
			let elm = this.getElement('<div id=\'foobar\' data-id=\'barfoo\'></div>');
			window.dfp.__testonly__.setIdOnDomElement(elm);
			expect(elm.id).toBe('barfoo');
		});
	});
});