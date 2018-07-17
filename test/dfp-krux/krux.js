'use strict';

function removeCookies() {
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++){
		createCookie(cookies[i].split("=")[0],"",-1);
	}
}

describe('Krux Suite - ', function(){

	beforeEach(function() {
		removeCookies()
	});

	describe('Given the local Storage is empty', function(){
		beforeEach(function() {
			if (window.localStorage) {
				window.localStorage.clear();
			}
		});

		describe('And no cookie is set', function() {
			it('Then it should return an empty user and empty params in dfpKrux object', function() {
				expect(window.dfpKrux.getUserId()).toEqual('');
				expect(window.dfpKrux.getSegments()).toEqual([]);
			});
		});
		describe('And cookies are set', function() {
			document.cookie = 'kxdepersgroep_kuid=TEST_COOKIE_USER';
			document.cookie = 'kxdepersgroep_segs=value1,value2,value3,value4';

			it('Then the dfpKrux object should return the correct values for userId and segments', function() {
				expect(window.dfpKrux.getUserId()).toEqual('TEST_COOKIE_USER');
				expect(window.dfpKrux.getSegments()).toEqual(['value1','value2','value3','value4']);
			});
		});
		describe('And cookies are set with escaped characters', function() {
			document.cookie = 'kxdepersgroep_segs=val%26ue1,val%20ue2,value3,value4';

			it('Then the dfpKrux object should return the correct unescaped values', function() {
				expect(window.dfpKrux.getSegments()).toEqual(['val&ue1', 'val ue2', 'value3', 'value4']);
			});
		});
	});

	describe('Given the local Storage is not empty', function(){
		beforeEach(function() {
			if (window.localStorage) {
				window.localStorage.setItem('kxdepersgroep_kuid', 'TEST_USER');
				window.localStorage.setItem('kxdepersgroep_segs', 'value1,value2,value3,value4');
			}
		});

		describe('And no cookie is set', function() {
			it('Then the dfpKrux object should return the localStorage values',function(){
				expect(window.dfpKrux.getUserId()).toEqual('TEST_USER');
				expect(window.dfpKrux.getSegments()).toEqual(['value1', 'value2', 'value3', 'value4']);
			})
		});

		describe('And cookies are set', function() {
			document.cookie = 'kxdepersgroep_kuid=TEST_COOKIE_USER';
			document.cookie = 'kxdepersgroep_segs=value1,value2,value3,value4';

			it('Then the dfpKrux object should return the localStorage values',function(){
				expect(window.dfpKrux.getUserId()).toEqual('TEST_USER');
				expect(window.dfpKrux.getSegments()).toEqual(['value1', 'value2', 'value3', 'value4']);
			})
		});
	});

});