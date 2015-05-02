// Gulpfile.js
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var webpack = require('gulp-webpack');

gulp.task('webpack', function() {
  return gulp.src('public/app/app/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulp.dest('./public/app/'));
});

gulp.task('default', ['webpack'], function () {
  nodemon({ script: 'server.js', ext: '**' })
  .on('restart', function () {
    console.log('Restarted!');
  });
});
