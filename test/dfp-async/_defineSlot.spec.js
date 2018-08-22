'use strict';
describe('Given I want to define a slot', function() {
	beforeEach(function(){
		viewport.set(1000); //large
		this.opts = getValidOpts();
		this.slot = getValidSlots('leader')[0];


		window.dfp.init(this.opts);
		this.adUnit = window.dfp.__testonly__.cleanAdUnit(this.opts.tag.adUnit);
		window.googletag = {
			defineSlot: function() {/*stubbed*/},
			defineOutOfPageSlot: function() {/*stubbed*/},
			pubads: function() {/*stubbed*/},

		};

		spyOn(window.googletag, 'defineSlot');
		spyOn(window.googletag, 'defineOutOfPageSlot');
		spyOn(window.googletag, 'pubads');
	});

	describe('And I pass a malformed slot config', function() {
		describe('When the domId is missing', function() {
			it('Then the domId is passed as undefined', function() {
				delete this.slot.domId;
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineSlot).toHaveBeenCalledWith(getAdUnit(this.opts, 'large'), this.slot.sizes['large'], undefined);
			});
		});
		describe('When the slot sizes are missing', function() {
			it('Then the defineSlots does nothing', function() {
				delete this.slot.sizes;
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineSlot).not.toHaveBeenCalled();
				expect(window.googletag.defineOutOfPageSlot).not.toHaveBeenCalled();
				expect(window.googletag.pubads).not.toHaveBeenCalled();
			});
		});
		describe('When the slot sizes object is empty', function() {
			it('Then the defineSlots throws an error', function() {
				var self = this;
				this.slot.sizes = {};
				expect(function() {
					window.dfp.__testonly__.defineSlot(self.slot);
				}).toThrowError(TypeError)
			});
		});
		describe('When the slot config contains unexisting breakpoint names', function() {
			it('Then the defineSlots throws an error', function() {
				var self = this;
				this.slot.sizes = {
					'foobar': [[100,1000]]
				};
				expect(function() {
					window.dfp.__testonly__.defineSlot(self.slot);
				}).toThrowError(TypeError)
			});
		});
	});

	describe('And I pass a valid slot config', function() {
		describe('When the slot targeting object is missing', function() {
			it('Then the defineSlots function is executed successfully', function() {
				delete this.slot.targeting;
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineSlot).toHaveBeenCalledWith(getAdUnit(this.opts, 'large'), this.slot.sizes['large'], this.slot.domId);
			});
		});
		describe('When the slot targeting object is empty', function() {
			it('Then the defineSlots function is executed successfully', function() {
				this.slot.targeting = {};
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineSlot).toHaveBeenCalledWith(getAdUnit(this.opts, 'large'), this.slot.sizes['large'], this.slot.domId);
			});
		});
		describe('When I pass only 1 size', function() {
			it('Then the slot should be defined', function() {
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineSlot).toHaveBeenCalledWith(getAdUnit(this.opts, 'large'), this.slot.sizes['large'], this.slot.domId);
			});
		});
		describe('When I pass multiple slot sizes', function() {
			it('Then the slot should be defined', function() {
				this.slot.sizes.foobar = [[0,99]];
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineSlot).toHaveBeenCalledWith(getAdUnit(this.opts, 'large'), this.slot.sizes['large'], this.slot.domId);
			});
		});
		describe('When I pass an outofpagelot size', function() {
			it('Then the slot should be defined', function() {
				this.slot.outofpage = true;
				delete this.slot.sizes;
				window.dfp.__testonly__.defineSlot(this.slot);
				expect(window.googletag.defineOutOfPageSlot).toHaveBeenCalledWith(getAdUnit(this.opts, 'large'), this.slot.domId);
			});
		});

	});
});