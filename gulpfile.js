// Gulpfile.js
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var webpack = require('gulp-webpack');
var copy = require('gulp-copy2');
var yaml = require('gulp-yaml');
var through = require('through2');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var path = require('path');
var walk = require('walkdir');
var fs = require('fs');
var ENV = process.env.ENV || 'development';

gulp.task('webpack', function () {
  return gulp.src('public/app/app/main.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gulp.dest('./public/app/'));
});

gulp.task('static', function () {
  var paths = [
    {src: 'src/index.html', dest: 'public/app/index.html'},
    {src: 'src/favicon.png', dest: 'public/app/favicon.png'},
    {src: 'src/icon_128.png', dest: 'public/app/icon_128.png'}
  ];
  return copy(paths);
});

gulp.task('apps', ['webpack'], function () {
  walk("./apps", {
    follow_symlinks: false,
    no_recurse: true
  }, function (path, stat) {
    var json = require(path+'/package.json'),
        version = json.version,
        app_name = path.match(/\/([^\/]+)$/)[1],
        dest_dir = './public/apps/'+app_name+'/'+version+'/';

    return gulp.src('./apps/'+app_name+'/dist/**')
        .pipe(gulp.dest(dest_dir))
        .on('end', function() {
          fs.writeFile(dest_dir+'config.json', JSON.stringify(json.bloksmonkey), function (err) {
            if (err) throw err;
          });
        });
  });
});

gulp.task('config', function () {
  return gulp.src('./src/app/config/'+ENV+'/*.yml')
    .pipe(yaml({ space: 2 }))
    .pipe((function () {
      return through.obj(function(file, enc, callback) {
        file.contents = new Buffer('window.config = ' + file.contents.toString() + ';');
        file.path = gutil.replaceExtension(file.path, '.js');
        this.push(file);
        return callback();
      });
    })())
    .pipe(gulp.dest('./public/app/config/'));
});

gulp.task('build', ['static', 'config', 'webpack', 'apps']);

gulp.task('default', ['build'], function () {
  nodemon({
    script: 'server.js',
    ext: '**',
    tasks: ['build']
  }).on('start', function () {
    notifier.notify({
      'title': 'BloksMonkey IDE development server',
      'message': 'Server is ready!',
      'icon': path.join(__dirname, 'src/icon_128.png')
    });
  });
});
