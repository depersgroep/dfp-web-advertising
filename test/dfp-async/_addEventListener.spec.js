'use strict';
describe('Given I want to add event listeners to an object', function() {

	beforeEach(function(){
		let testElement = '<button class=\'jasmine-button\' type=\'button\'>Click Me!</button>';
		document.body.insertAdjacentHTML(
			'afterbegin',
			testElement);
		this.elm = document.querySelector('.jasmine-button');

		this.dummyFunction = function() {/*stub*/};
		spyOn(this, 'dummyFunction');
	});

	describe('When I trigger an event',function() {
		it('Then the callback function must be triggered',function() {
			window.dfp.__testonly__.addEventListener(this.elm, 'click', this.dummyFunction);
			this.elm.click();
			expect(this.dummyFunction).toHaveBeenCalled();
		});
	});

});