'use strict';
describe('Given I want to init the script', function() {

	var validOpts, validSlots,validTargeting;

	beforeEach(function(done) {
		validOpts = getValidOpts();
		validSlots = getValidSlots('leader');
		validTargeting = getValidTargeting();
		done();
	});

	describe('When I don\'t pass any params to the init method', function() {
		it('Then it should throw a TypeError', function() {
			expect(function() {
				window.dfp.init();
			}).toThrowError(TypeError);
		});
	});

	describe('When I pass an invalid slts object', function() {
		it('Then it should not throw an error', function() {
			expect(function() {
				window.dfp.init(validOpts,validTargeting,"invalidSltsValue");
			}).not.toThrowError(); //todo Don't we have to show a warn here ?
		});
	});

	describe('When I pass an invalid targeting object', function() {
		it('Then it should not throw an error', function() {
			expect(function() {
				window.dfp.init(validOpts,"invalidTargetingValue",validSlots);
			}).not.toThrowError(); //todo Don't we have to show a warn/info here ?
		});
	});

	describe('When I pass an invalid opts object', function() {
		it('Then it should throw an error', function() {
			expect(function() {
				window.dfp.init("invalidOptsValue", validTargeting,validSlots);
			}).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});

	describe('When I pass an invalid opts object with missing tag object', function() {
		it('Then it should throw an Error', function() {
			delete validOpts.tag;
			expect(validOpts.tag).toBeUndefined();
			expect(function() {
				window.dfp.init(validOpts, validTargeting,validSlots);
			}).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});

	describe('When I pass an invalid opts object with missing tag object', function() {
		it('Then it should throw a TypeError', function() {
			delete validOpts.tag;
			expect(function() {
				window.dfp.init(validOpts, validTargeting,validSlots);
			}).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});

	describe('When I pass an invalid opts object with an invalid tag object', function() {
		it('Then it should throw a TypeError', function() {
			validOpts.tag = 'invalidValue';
			expect(function() {
				window.dfp.init(validOpts, validTargeting,validSlots);
			}).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});

	describe('When I pass an invalid opts object with a missing breakpoints object', function() {
		it('Then it should throw a TypeError', function() {
			delete validOpts.breakpoints;
			expect(function() {
				window.dfp.init(validOpts, validTargeting,validSlots);
			}).toThrowError(TypeError); //todo no error message ?
		});
	});

	describe('When I pass an invalid opts object with an invalid breakpoints object', function() {
		it('Then it should throw a TypeError', function() {
			validOpts.breakpoints = 'invalidValue';
			expect(function() {
				window.dfp.init(validOpts, validTargeting,validSlots);
			}).not.toThrowError(); //todo shouldn't we handle this ?
		});
	});

	describe('When I pass an invalid opts object with a missing callbacks object', function() {
		it('Then it should throw a TypeError', function() {
			delete validOpts.callbacks;
			expect(function() {
				window.dfp.init(validOpts, validTargeting,validSlots);
			}).not.toThrowError();
		});
	});

});