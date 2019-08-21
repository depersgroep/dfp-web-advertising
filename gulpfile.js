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
	merge = require('merge-stream'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	eslint = require('gulp-eslint'),
	header = require('gulp-header'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	stripCode = require('gulp-strip-code'),
	colors = require('ansi-colors'),
	yargs = require('yargs'),
	gulpIf = require('gulp-if');

// helper functions
function onError(err) {
	console.log('\n', colors.bold(colors.red('Error ocurred: ') + err.message + ' @ ' + err.fileName + ':' + err.lineNumber), '\n');
	this.emit('end');
}

function getArgument(key) {
	return yargs.argv[key] ? yargs.argv[key] : null;
}

// clean folders
gulp.task('clean', function clean(cb) {
	del(pkg.clean, {
		'force': true
	}).then(function() {
		cb(null);
	}, function() {
		cb('Something went wrong with the clean task.');
	});
});

// Javascript
gulp.task('eslint', function eslinting() {
	return gulp.src(pkg.js.hint.src)
		.pipe(plumber({
			'errorHandler': onError
		}))
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('jsbuild', function jsbuild() {
	var sourcemapsArg = getArgument('sourcemaps'),
		writeSourcemaps = sourcemapsArg === 'true';

	return merge(pkg.js.files.map(function(o) {
		return gulp.src(o.src)
			.pipe(plumber({
				'errorHandler': onError
			}))
			.pipe(replace('__VERSION__', pkg.version))
			.pipe(stripCode({
				'start_comment': 'start-test-block',
				'end_comment': 'end-test-block'
			}))
			.pipe(gulpIf(writeSourcemaps, sourcemaps.init()))
			.pipe(concat(o.file + '.js'))
			.pipe(gulp.dest(o.dest))
			.pipe(uglify({
				'compress': {
					'hoist_funs': false // hoist function declarations - otherwise functions are alphabetized, which can cause errors
				}
			}))
			.pipe(gulpIf(writeSourcemaps, sourcemaps.write('maps')))
			.pipe(gulpIf(!writeSourcemaps, header('/* v' + pkg.version + ' */\n')))
			.pipe(rename(o.file + '.min.js'))
			.pipe(gulp.dest(o.dest));
	}));
});

gulp.task('js', gulp.series(['eslint', 'jsbuild']));

// pre-commit
// on Mac, make sure the folder exists
gulp.task('hook', function hook() {
	return gulp.src(pkg.git.hooks.src)
		.pipe(gulp.dest(pkg.git.hooks.dest));
});

// default task
gulp.task('default', gulp.series(['hook', 'clean', 'js'], function watch() {
	// watch
	gulp.watch(pkg.js.watch, gulp.series(['js']));
}));

// deploy task
gulp.task('deploy', gulp.series(['hook', 'clean', 'js']));
