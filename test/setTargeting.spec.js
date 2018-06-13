'use strict';
describe('testing setTargeting method', function() {
	beforeEach(function() {
		Object
			.keys(window.dfp.__testonly__.debugParameters)
			.forEach(function(key) {
				delete window.dfp.__testonly__.debugParameters[key];
			});
	});
	describe('when passing an object and an empty targeting object', function() {
		it('should do nothing', function() {
			var object = jasmine.createSpyObj('object', ['setTargeting']);

			window.dfp.__testonly__.setTargeting(object, {});
			expect(object.setTargeting).not.toHaveBeenCalled();
			expect(window.dfp.__testonly__.debugParameters).toEqual({});
		});
	});

	describe('when passing an object/slot to setTargeting method and a targeting object with a valid key value pair', function() {
		describe('and false or no value as third parameter (addToDebug)', function() {
			it('should call setTargeting method on the object with the given key and value from the targeting object without adding them to the debugParameters', function() {
				var object = jasmine.createSpyObj('object', ['setTargeting']);

				window.dfp.__testonly__.setTargeting(object, {
					'key1': 'value1'
				});

				expect(object.setTargeting).toBeDefined();
				expect(object.setTargeting).toHaveBeenCalledWith('key1', 'value1');

				expect(window.dfp.__testonly__.debugParameters).not.toEqual(jasmine.objectContaining({
					'key1': 'value1'
				}));
			});
		});

		describe('and true as third parameter (addToDebug)', function() {
			it('should call setTargeting method on the object with the given key and value from the targeting object', function() {
				var object = jasmine.createSpyObj('object', ['setTargeting']);

				window.dfp.__testonly__.setTargeting(object, {
					'key1': 'value1'
				}, true);

				expect(object.setTargeting).toBeDefined();
				expect(object.setTargeting).toHaveBeenCalledWith('key1', 'value1');

				expect(window.dfp.__testonly__.debugParameters).toEqual({
					'key1': 'value1'
				});
			});
		});
	});
});
