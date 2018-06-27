'use strict';
describe('Given I want to test the queue', function() {

	describe('When I add a random function to the queue', function() {
		var functionResult = 0;

		beforeEach(function(done) {
			window.dfp.cmd.push(function(){
				functionResult += 1;
				done();
			});
		});

		it('Then that function must be executed', function(){
			expect(functionResult).toBe(1);
		});

	});

	describe('When I add 2 random functions to the queue', function() {
		var functionResult = 0;
		beforeEach(function(done) {
			window.dfp.cmd.push(function(){
				functionResult += 1;
				done();
			});
			window.dfp.cmd.push(function(){
				functionResult += 1;
				done();
			});
		});

		it('Then that function must be executed', function(){
			expect(functionResult).toBe(2);
		});
	});

});