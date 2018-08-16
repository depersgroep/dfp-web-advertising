'use strict';
describe('Given I want to get the current window width', function() {
	describe('When I ask for the width',function() {
		it('Then it should return the width',function() {
			viewport.set(123);
			expect(window.dfp.__testonly__.getWindowWidth()).toBe(123);
		});
	});
});