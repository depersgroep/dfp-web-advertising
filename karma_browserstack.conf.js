module.exports = function(config) {
	config.set({

		singleRun: true,
		// global config of our BrowserStack account
		browserStack: {
			username: process.env.BROWSERSTACK_USR,
			accessKey: process.env.BROWSERSTACK_KEY,
			build: process.env.BUILD_TAG + " - " + process.env.BUILD_NUMBER,
			project: 'dfp-web-advertising'
		},

		// define browsers
		// https://www.browserstack.com/list-of-browsers-and-platforms?product=js_testing
		customLaunchers: {
			bs_win10_Chrome: {
				base: 'BrowserStack',
				browser: 'Chrome',
				browser_version: '66.0',
				os: 'Windows',
				os_version: '10',
				name: 'Windows 10 Chrome 66.0'
			},
			bs_win10_Edge: {
				base: 'BrowserStack',
				browser: 'Edge',
				browser_version: '17.0',
				os: 'Windows',
				os_version: '10',
				name: 'Windows 10 Edge 17.0'
			},
			bs_win10_IE11: {
				base: 'BrowserStack',
				browser: 'IE',
				browser_version: '11.0',
				os: 'Windows',
				os_version: '10',
				name: 'Windows 10 IE 11.0'
			},
			bs_OSX_HighSierra_Safari: {
				base: 'BrowserStack',
				browser: 'Safari',
				browser_version: '11.1',
				os: 'OS X',
				os_version: 'High Sierra',
				name: 'OSX High Sierra Safari 11.1'
			},
			bs_win10_FireFox: {
				base: 'BrowserStack',
				browser: 'Firefox',
				browser_version: '60.0',
				os: 'Windows',
				os_version: '10',
				name: 'Windows 10 FireFox 60.0'
			}
		},

		browsers: [	'bs_win10_Chrome',
					'bs_OSX_HighSierra_Safari',
					'bs_win10_IE11',
					'bs_win10_Edge',
					'bs_win10_FireFox'
		],

		frameworks: ['jasmine', 'viewport'],
		files: [
			'src/object.keys-polyfill.js',
			'src/dfp-async-helpers.js',
			'src/dfp-krux.js',
			'src/dfp-async.js',
			'test/**/*.spec.js'
		],

		// coverage reporter generates the coverage
		reporters: ['dots', 'junit', 'coverage'],
		junitReporter : {
			outputDir: 'junitResults',
			outputFile: undefined
		},
		preprocessors: {
			'src/**/*.js': ['coverage']
		},

		// optionally, configure the reporter
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		}
	});
};
