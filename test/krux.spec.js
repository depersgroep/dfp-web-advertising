'use strict';
describe('TEST KRUX MODULE', function() {
	beforeEach(function() {
		if (window.localStorage) {
			window.localStorage.clear();
		}

		if (document.cookie) {
			document.cookie = 'kxdepersgroep_kuid=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
			document.cookie = 'kxdepersgroep_segs=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	});

	describe('When there are no krux values in the localStorage', function() {
		it('should return an empty user and empty params in dfpKrux object', function() {
			expect(window.dfpKrux.getUserId()).toEqual('');
			expect(window.dfpKrux.getSegments()).toEqual([]);
		});
	});

	describe('When there are Krux values in the localStorage', function() {
		it('should return them in the dfpKrux object', function() {
			window.localStorage.setItem('kxdepersgroep_kuid', 'TEST_USER');
			window.localStorage.setItem('kxdepersgroep_segs', 'value1,value2,value3,value4');

			expect(window.dfpKrux.getUserId()).toEqual('TEST_USER');
			expect(window.dfpKrux.getSegments()).toEqual(['value1', 'value2', 'value3', 'value4']);
		});
	});

	describe('When localStorage is not available and user and segments are set in the cookie', function() {
		describe('and the kxdepersgroep_kuid is set in the cookie', function() {
			it('should return the user', function() {
				delete window.localStorage;

				document.cookie = 'kxdepersgroep_kuid=TEST_COOKIE_USER';

				expect(window.dfpKrux.getUserId()).toBe('TEST_COOKIE_USER');
			});
		});

		describe('and the kxdepersgroep_segs is set in the cookie', function() {
			it('should return the segments as an array', function() {
				delete window.localStorage;

				document.cookie = 'kxdepersgroep_segs=value1,value2,value3,value4';

				expect(window.dfpKrux.getSegments()).toEqual(['value1', 'value2', 'value3', 'value4']);
			});
		});

		describe('and the kxdepersgroep_segs is set in the cookie and are escaped', function() {
			it('should return the unescaped segments as an array', function() {
				delete window.localStorage;

				document.cookie = 'kxdepersgroep_segs=val%26ue1,val%20ue2,value3,value4';

				expect(window.dfpKrux.getSegments()).toEqual(['val&ue1', 'val ue2', 'value3', 'value4']);
			});
		});
	});

	describe('When localStorage is not available and user and segments are not set in the cookie', function() {
		describe('and the kxdepersgroep_kuid is not set in the cookie', function() {
			it('should return an empty string', function() {
				delete window.localStorage;

				expect(window.dfpKrux.getUserId()).toBe('');
			});
		});

		describe('and the kxdepersgroep_segs is not set in the cookie', function() {
			it('should return an empty array', function() {
				delete window.localStorage;

				expect(window.dfpKrux.getSegments()).toEqual([]);
			});
		});
	});
});
