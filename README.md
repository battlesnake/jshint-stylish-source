# jshint-stylish-source

Fork of jshint-stylish, which also displays the offending line of source and
highlights terms in the source which are single-quoted in the error message.

## Screenshot

![screenshot](jshint-stylish-source-screenshot.png)

## Usage

This is pretty much a drop in replacement for jshint-stylish:

    var gulp = require('gulp');
    var jshint = require('gulp-jshint');
    var jshintReporter = require('jshint-stylish-source');
    
    gulp.task('lint', function () {
    	return gulp.src(['**/*.js', '!**/node_modules/**', '!**/bower_components/**'])
    		.pipe(jshint())
    		.pipe(jshint.reporter(jshintReporter))
    		;
    });
