var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var less = require('gulp-less');
var cssnano = require('cssnano');
var uglifyify = require('uglifyify');

gulp.task('default', ['scripts', 'less']);

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
  var processors = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ];
  return gulp.src('./less/**/*')
    .pipe(less({
      paths: ['less']
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/stylesheets/'));
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

  if (!watch) {
    bundler.transform({
      global: true
    }, uglifyify);
  }
 
  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', function(e) {
      console.log('Browserify Failed', e.message);
    });
    stream = stream.pipe(source('index.js'));
    return stream.pipe(gulp.dest('./public/js'));
  };
 
  bundler.on('update', rebundle);
  return rebundle();
} 
