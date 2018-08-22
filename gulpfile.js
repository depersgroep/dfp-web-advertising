'use strict';

/*
* de Persgroep Frontend gulpfile
*
* Commands:
	* gulp default
		* js: eslint
		* WATCH FILES ABOVE
	* gulp deploy
		* js: eslint
* Flags:
	* --sourcemaps=true|false: Null, empty or not true ==> sourcemaps (default)
*/

/* do NOT change the order of the pipes as this could cause unwanted effects */
var pkg = require('./package.json'),
	del = require('del'),
	es = require('event-stream'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	eslint = require('gulp-eslint'),
	header = require('gulp-header'),
	plumber = require('gulp-plumber'),
	shell = require('gulp-shell'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	gUtil = require('gulp-util'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	stripCode = require('gulp-strip-code');

// helper functions
function onError(err) {
	gUtil.log('\n', gUtil.colors.bold(gUtil.colors.red('Error ocurred: ') + err.message + ' @ ' + err.fileName + ':' + err.lineNumber), '\n');
	gUtil.beep();
	this.emit('end');
}

function getArgument(key) {
	return gUtil.env[key] ? gUtil.env[key] : null;
}

// clean folders
gulp.task('clean', function(cb) {
	del(pkg.clean, {
		'force': true
	}).then(function() {
		cb(null);
	}, function() {
		cb('Something went wrong with the clean task.');
	});
});

// Javascript
gulp.task('eslint', function() {
	return gulp.src(pkg.js.hint.src)
		.pipe(plumber({
			'errorHandler': onError
		}))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('js', ['eslint'], function() {
	gulp.start('jsbuild');
});

gulp.task('jsbuild', function() {
	var sourcemapsArg = getArgument('sourcemaps'),
		writeSourcemaps = sourcemapsArg === 'true';

	return es.merge(pkg.js.files.map(function(o) {
		return gulp.src(o.src)
			.pipe(plumber({
				'errorHandler': onError
			}))
			.pipe(replace('__VERSION__', pkg.version))
			.pipe(stripCode({
				'start_comment': 'start-test-block',
				'end_comment': 'end-test-block'
			}))
			.pipe(writeSourcemaps ? sourcemaps.init() : gUtil.noop())
			.pipe(concat(o.file + '.js'))
			.pipe(gulp.dest(o.dest))
			.pipe(uglify({
				'compress': {
					'hoist_funs': false // hoist function declarations - otherwise functions are alphabetized, which can cause errors
				}
			}))
			.pipe(writeSourcemaps ? sourcemaps.write('maps') : gUtil.noop())
			.pipe(writeSourcemaps ? gUtil.noop() : header('/* v' + pkg.version + ' */\n'))
			.pipe(rename(o.file + '.min.js'))
			.pipe(gulp.dest(o.dest));
	}));
});

// default task
gulp.task('default', ['hook', 'clean'], function() {
	// pay attention when upgrading gulp: https://github.com/gulpjs/gulp/issues/505#issuecomment-45379280
	gulp.start('js');

	// watch
	gulp.watch(pkg.js.watch, ['js']);
});

// deploy task
gulp.task('deploy', ['hook', 'clean'], function() {
	// pay attention when upgrading gulp: https://github.com/gulpjs/gulp/issues/505#issuecomment-45379280
	gulp.start('js');
});

// pre-commit
// on Mac, make sure the folder exists
gulp.task('hook', shell.task([
	'cp ' + pkg.git.hooks.precommit.src + ' ' + pkg.git.hooks.precommit.dest
]));
