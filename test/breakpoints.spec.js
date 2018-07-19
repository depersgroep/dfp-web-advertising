'use strict';
describe('TESTING NEW EXPLICIT BREAKPOINT DEFINITION', function() {
	function generateRandomBreakPointName() {
		return 'BREAKPOINT-' + Math.random().toString(36).substr(2, 5);
	}

	describe('resolveNewBreakpoint name method', function() {
		describe('When window width is less than any specified breakpoint', function() {
			it('should return null', function() {
				var breakpointName = generateRandomBreakPointName(),
					breakpoints = [{
						'name': breakpointName,
						'begin': 100,
						'end': 200
					}];

				viewport.set(1);

				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBeNull();
			});
		});

		describe('When window width is less than any specified breakpoint', function() {
			it('should return null', function() {
				var breakpoints = [{
					'name': generateRandomBreakPointName(),
					'begin': 320,
					'end': 767
				}, {
					'name': generateRandomBreakPointName(),
					'begin': 768,
					'end': 983
				}, {
					'name': generateRandomBreakPointName(),
					'begin': 984,
					'end': 1200
				}];

				viewport.set(1);

				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBeNull();
			});
		});

		describe('When window width is between begin and end of any specified breakpoint', function() {
			it('should return the breakpoint name', function() {
				var breakpointName = generateRandomBreakPointName(),
					breakpoints = [{
						'name': breakpointName,
						'begin': 100,
						'end': 200
					}];

				viewport.set(101);

				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBe(breakpointName);
			});
		});

		describe('When window width is equal to breakpoint begin', function() {
			it('should return the breakpoint name', function() {
				var breakpointName = generateRandomBreakPointName(),
					breakpoints = [{
						'name': breakpointName,
						'begin': 100,
						'end': 200
					}];

				viewport.set(100);

				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBe(breakpointName);
			});
		});

		describe('When window width is equal to breakpoint end', function() {
			it('should return the breakpoint name', function() {
				var breakpointName = generateRandomBreakPointName(),
					breakpoints = [{
						'name': breakpointName,
						'begin': 100,
						'end': 200
					}];

				viewport.set(200);

				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBe(breakpointName);
			});
		});

		describe('When window width is bigger than breakpoint end', function() {
			it('should return null', function() {
				var breakpointName = generateRandomBreakPointName(),
					breakpoints = [{
						'name': breakpointName,
						'begin': 100,
						'end': 200
					}];

				viewport.set(201);

				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBeNull();
			});
		});

		describe('When using -Infinity as breakpoint begin', function() {
			describe('and the breakpoint end is bigger than window width', function() {
				it('should still return the breakpoint name', function() {
					var breakpointName = generateRandomBreakPointName(),
						breakpoints = [{
							'name': breakpointName,
							'begin': -Infinity,
							'end': 200
						}];

					viewport.set(100);

					expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBe(breakpointName);
				});
			});

			describe('and the breakpoint end is smaller than window width', function() {
				it('should return null', function() {
					var breakpointName = generateRandomBreakPointName(),
						breakpoints = [{
							'name': breakpointName,
							'begin': -Infinity,
							'end': 200
						}];

					viewport.set(300);

					expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBeNull();
				});
			});
		});

		describe('When using Infinity as breakpoint end', function() {
			describe('and the breakpoint begin is smaller than window width', function() {
				it('should still return the breakpoint name', function() {
					var breakpointName = generateRandomBreakPointName(),
						breakpoints = [{
							'name': breakpointName,
							'begin': 100,
							'end': Infinity
						}];

					viewport.set(150);

					expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBe(breakpointName);
				});
			});

			describe('and the breakpoint begin is bigger than window width', function() {
				it('should return null', function() {
					var breakpointName = generateRandomBreakPointName(),
						breakpoints = [{
							'name': breakpointName,
							'begin': 100,
							'end': Infinity
						}];

					viewport.set(50);

					expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBeNull();
				});
			});
		});

		describe('When using multiple breakpoints', function() {
			it('should still return a valid breakpoint', function() {
				var expectedBreakpointName = generateRandomBreakPointName(),
					breakpoints = [{
						'name': generateRandomBreakPointName(),
						'begin': 100,
						'end': 200
					}, {
						'name': expectedBreakpointName,
						'begin': 201,
						'end': 300
					}, {
						'name': generateRandomBreakPointName(),
						'begin': 301,
						'end': 400
					}];

				viewport.set(250);
				expect(window.dfp.__testonly__.resolveBreakpointName(breakpoints)).toBe(expectedBreakpointName);
			});
		});
	});
});
