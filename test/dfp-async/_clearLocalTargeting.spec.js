'use strict';
describe('Given I want to clear the local targeting parameters', function() {

	beforeEach(function(){
		window.dfp.init(getValidOpts(),getValidTargeting(),getValidSlots('leader'));
		this.slot = window.dfp.__testonly__.getSlots()[0];
		this.slot.gslot = {
			clearTargeting: function() {

			}
		};
		spyOn(this.slot.gslot,'clearTargeting');
	});

	describe('When I pass a valid slot with targeting parameters',function() {
		it('Then the targeting object should be empty',function() {
			window.dfp.__testonly__.clearLocalTargeting(this.slot);

			expect(this.slot.targeting).toEqual({});
			expect(this.slot.gslot.clearTargeting).toHaveBeenCalled();
		});

	});

	describe('When I pass a valid slot with empty targeting parameters',function() {
		it('Then the targeting object should be empty',function() {
			this.slot.targeting = {};
			window.dfp.__testonly__.clearLocalTargeting(this.slot);

			expect(this.slot.targeting).toEqual({});
			expect(this.slot.gslot.clearTargeting).toHaveBeenCalled();
		});

	});

	describe('When I pass a valid slot without targeting parameters',function() {
		it('Then the targeting object should be empty',function() {
			delete this.slot.targeting;
			window.dfp.__testonly__.clearLocalTargeting(this.slot);

			expect(this.slot.targeting).toEqual({});
			expect(this.slot.gslot.clearTargeting).toHaveBeenCalled();
		});
	});

	describe('When I pass a slot without gslot object',function() {
		it('Then the targeting object should be empty',function() {
			delete this.slot.gslot;
			expect(function(){
				window.dfp.__testonly__.clearLocalTargeting(this.slot)
			}).toThrowError(TypeError);


		});
	});

});