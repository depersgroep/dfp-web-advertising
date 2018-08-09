'use strict';
describe('Given I want to call the render ended callback', function() {
	describe('Given I pass a slot and a render ended callback', function() {

		beforeEach(function() {
			this.e = {};
			this.e.slot = {};
			this.e.slot.getSlotId = function(){
				return {
					'getDomId': function(){
						return 'foobar';
					}
				}
			};
			this.e.isEmpty = true;
			this.renderEndedCallback = function() {};
		});

		it('Then it should call the render ended callback with the correct params',function() {
			spyOn(this, 'renderEndedCallback');
			window.dfp.__testonly__.slotRenderEnded(this.e, this.renderEndedCallback);

			expect(this.renderEndedCallback).toHaveBeenCalledWith(this.e.slot.getSlotId().getDomId(), this.e.isEmpty, this.e.size)
		});
	});
});