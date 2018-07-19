'use strict';
describe('Given I have a cmd queue', function() {
	var functionResult = 0;

	beforeEach(function() {
		functionResult = 0;
	});


	describe('When I add a random function to the queue', function() {

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

	describe('When I add something else than a function to the queue', function() {

		it('Then it must throw an error', function(){
			expect(function(){window.dfp.cmd.push(1);}).toThrowError();
		});

	});

});