'use strict';
describe('Given I want to resolve a breakpoint name', function() {
	describe('And I have a single breakpoint configured', function() {
		beforeEach(function(){
			this.breakpoints = [
				new Object(getSingleBreakpoint('foobar', 100, 200))
			]
		});
		describe('When I want to resolve a breakpoint with a viewport smaller than the begin width', function() {
			it('Then it returns null', function() {
				viewport.set(99);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
			});
		});
		describe('When I want to resolve a breakpoint with a viewport equal to the begin width', function() {
			it('Then it returns the breakpoint name', function() {
				viewport.set(100);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');

			});
		});
		describe('When I want to resolve a breakpoint with a viewport larger than the begin width', function() {
			it('Then it returns the breakpoint name', function() {
				viewport.set(101);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport smaller than the end width', function() {
			it('Then it returns the breakpoint name', function() {
				viewport.set(199);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport equal to the end width', function() {
			it('Then it returns the breakpoint name', function() {
				viewport.set(200);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport larger than the begin width', function() {
			it('Then it returns null', function() {
				viewport.set(201);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
			});
		});
	});

	describe('And I have multiple breakpoints configured', function() {
		beforeEach(function(){
			this.breakpoints = [
				new Object(getSingleBreakpoint('barfoo', 100, 200)),
				new Object(getSingleBreakpoint('foobar', 201, 300)),
				new Object(getSingleBreakpoint('farboo', 301, 400))
			]
		});
		describe('When I want to resolve a breakpoint with a viewport smaller than the begin width of any breakpoint', function() {
			it('Then it returns null', function() {
				viewport.set(99);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
			});
		});
		describe('When I want to resolve a breakpoint with a viewport smaller than the begin width of the second breakpoint', function() {
			it('Then it returns the BP name of the first breakpoint', function() {
				viewport.set(200);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('barfoo');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport equal to the begin width of the second breakpoint', function() {
			it('Then it returns the BP name of the second breakpoint', function() {
				viewport.set(201);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport larger than the begin width of the second breakpoint', function() {
			it('Then it returns the BP name of the second breakpoint', function() {
				viewport.set(201);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport smaller than the end width of the second breakpoint', function() {
			it('Then it returns the BP name of the second breakpoint', function() {
				viewport.set(299);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport equal to the end width of the second breakpoint', function() {
			it('Then it returns the BP name of the second breakpoint', function() {
				viewport.set(300);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport larger than the end width of the second breakpoint', function() {
			it('Then it returns the BP name of the third breakpoint', function() {
				viewport.set(301);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('farboo');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport larger than the end width of any breakpoint', function() {
			it('Then it returns null', function() {
				viewport.set(401);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
			});
		});
	});
	describe('And I have the width of the breakpoint configured to infinity', function() {
		beforeEach(function(){
			this.breakpoints = [
				new Object(getSingleBreakpoint('barfoo', -Infinity, 100)),
				new Object(getSingleBreakpoint('foobar', 101, 200)),
				new Object(getSingleBreakpoint('farboo', 201, Infinity))
			];
		});
		describe('When I want to resolve a breakpoint with a viewport between -infinity and the end width', function() {
			it('Then it returns barfoo', function() {
				viewport.set(50);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('barfoo');
			});
		});
		describe('When I want to resolve a breakpoint with a viewport between the begin width and infinity', function() {
			it('Then it returns farboo', function() {
				viewport.set(800);
				expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('farboo');
			});
		});
	});

	describe('And I have a misconfigured breakpoint configuration', function() {
		describe('When both begin and end width are equal', function() {
			beforeEach(function(){
				this.breakpoints = [
					new Object(getSingleBreakpoint('foobar', 100, 100))
				]
			});
			describe('And I my viewport equals the begin and end width', function() {
				it('Then it returns the breakpoint name', function() {
					viewport.set(100);
					expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toEqual('foobar');
				});
			});
			describe('And I my viewport is smaller than the begin width', function() {
				it('Then it returns null', function() {
					viewport.set(99);
					expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
				});
			});
			describe('And I my viewport is larger than the end width', function() {
				it('Then it returns null', function() {
					viewport.set(101);
					expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
				});
			});

		});


		describe('When the end width is smaller than the begin width', function() {
			beforeEach(function(){
				this.breakpoints = [
					new Object(getSingleBreakpoint('foobar', 200, 100))
				]
			});
			describe('And I my viewport is smaller than the end width', function() {
				it('Then it returns null', function() {
					viewport.set(50);
					expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull()
				});
			});
			describe('And I my viewport is in between the begin and end width', function() {
				it('Then it returns null', function() {
					viewport.set(150);
					expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
				});
			});
			describe('And I my viewport is larger than the begin width', function() {
				it('Then it returns null', function() {
					viewport.set(250);
					expect(window.dfp.__testonly__.resolveBreakpointName(this.breakpoints)).toBeNull();
				});
			});

		});
	});

});