"use strict";

var gulp = require('gulp'),
    connect = require('gulp-connect'), //runs local dev server
    open = require('gulp-open'), //opens URL in browser
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    config = {
        port: 9905,
        devbaseUrl: 'http:localhost',
        paths: {
            html: './src/*.html',
            js: './src/**/*.js',
            mainJs: './src/main.js',
            dist: './dist'
        }
    };


//Start local server
gulp.task('connect', function() {
   connect.server({
       root: ['dist'],
       port: config.port,
       base: config.devBaseUrl,
       livereload: true
   });
});


//Open dev url in browser
gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
        .pipe(open('', { url: config.devbaseUrl + ':' + config.port + '/' }));
});


//Move html files to dist
gulp.task('html', function() {
   gulp.src(config.paths.html)
       .pipe(gulp.dest(config.paths.dist))
       .pipe(connect.reload());
});


//Bundle and move js files
gulp.task('js', function() {
   browserify(config.paths.mainJs)
       .transform(babelify, {presets: ["es2015"]})
       .bundle()
       .pipe(source('main.js'))
       .pipe(gulp.dest(config.paths.dist + '/scripts'))
       .pipe(connect.reload());
});


//Watch files for any changes
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});


gulp.task('default', ['html', 'js', 'open', 'watch']);