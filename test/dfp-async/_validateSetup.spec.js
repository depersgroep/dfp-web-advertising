'use strict';
describe('Given I want to validate my setup', function() {

	beforeEach(function(){
		window.dfp.init(getValidOpts());
		this.runValidateSetup = function(){
			window.dfp.__testonly__.validateSetup();
		}
	});

	describe('When I pass no tag object',function() {
		it('Then an error must be shown',function() {
			window.dfp.__testonly__.setTag(undefined);
			expect(this.runValidateSetup).toThrowError(Error, 'No valid set-up! Add a tag parameter to options object');
		});
	});
	describe('When I pass an empty tag object',function() {
		it('Then an error must be shown',function() {
			window.dfp.__testonly__.setTag({});
			expect(this.runValidateSetup).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});
	describe('When I pass only a networkId',function() {
		it('Then an error must be shown',function() {
			window.dfp.__testonly__.setTag({'networkId': 'foobar'});
			expect(this.runValidateSetup).toThrowError(Error, 'No valid set-up! Add an Ad Unit');
		});
	});
	describe('When I pass only an adUnit',function() {
		it('Then an error must be shown',function() {
			window.dfp.__testonly__.setTag({'adUnit': 'foobar'});
			expect(this.runValidateSetup).toThrowError(Error, 'No valid set-up! Add a DFP network ID');
		});
	});
	describe('When I pass both an adUnit and a networkId',function() {
		it('Then no error must be shown',function() {
			window.dfp.__testonly__.setTag({'adUnit': 'foobar', 'networkId': 'foobar'});
			expect(this.runValidateSetup).not.toThrowError();
		});
	});

});