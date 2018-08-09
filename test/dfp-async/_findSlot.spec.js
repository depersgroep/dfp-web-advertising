'use strict';
describe('Given I want to find a slot', function() {

	beforeEach(function(){
		window.dfp.__testonly__.setSlots({});
	});

	describe('When I have no slots configured',function() {
		it('Then it should return 0',function() {
			expect(window.dfp.__testonly__.findSlot('foobar')).toEqual({});
		});
	});
	describe('When I have 1 slot configured',function() {
		describe('And i pass an existing domId',function() {
			it('Then it should return the correct slot',function() {
				var input = getValidSlots('foobar')
				window.dfp.__testonly__.setSlots(input);
				expect(window.dfp.__testonly__.findSlot('foobar')).toEqual(input[0]);
			});
		});
		describe('And i pass a non existing domId',function() {
			it('Then it should return an empty object',function() {
				var input = getValidSlots('foobar')
				window.dfp.__testonly__.setSlots(input);
				expect(window.dfp.__testonly__.findSlot('barfoo')).toEqual({});
			});
		});
	});

	describe('When I have multiple slots configured',function() {
		describe('And i pass an existing domId',function() {
			it('Then it should return the correct slot',function() {
				var input = getValidSlots(['foo', 'bar']);
				window.dfp.__testonly__.setSlots(input);
				expect(window.dfp.__testonly__.findSlot('bar')).toEqual(input[1]);
			});
		});
		describe('And i pass a non existing domId',function() {
			it('Then it should return 0t',function() {
				var input = getValidSlots(['foo', 'bar']);
				window.dfp.__testonly__.setSlots(input);
				expect(window.dfp.__testonly__.findSlot('barfoo')).toEqual({});
			});
		});
	});
});