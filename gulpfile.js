var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('scripts', function() {
  return scripts(false);
});
 
gulp.task('watchScripts', function() {
  return scripts(true);
});

gulp.task('watchStyles', function() {
  gulp.watch('./less/**/*', ['less']);
});

gulp.task('less', function() {
  return gulp.src('./less/**/*')
    .pipe(less({
      paths: ['less']
    }))
    .pipe(gulp.dest('./public/stylessheets/'));
});

gulp.task('watch', ['watchScripts', 'watchStyles']);


function scripts(watch) {
  var bundler, rebundle;
  bundler = browserify('./react/main.js', {
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      console.log('Browserify Updated');
    });
  }
 
  bundler.transform(babelify.configure({
    stage: 1,
  }));
 
  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', function() {
      console.log('Browserify Failed');
    });
    stream = stream.pipe(source('index.js'));
    return stream.pipe(gulp.dest('./public/js'));
  };
 
  bundler.on('update', rebundle);
  return rebundle();
} 
