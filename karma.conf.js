module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'src/object.keys-polyfill.js',
			'src/dfp-async-helpers.js',
			'src/dfp-krux.js',
			'src/dfp-async.js',
			'test/**/*.spec.js'
		],
		// coverage reporter generates the coverage
		reporters: ['progress', 'coverage'],
		preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			'src/**/*.js': ['coverage']
		},

		// optionally, configure the reporter
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		}
	});
};
