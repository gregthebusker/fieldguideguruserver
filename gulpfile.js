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
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');

gulp.task('default', ['scripts', 'less']);

gulp.task('scripts', function() {
  return scripts(false, true);
});
 
gulp.task('watchScripts', function() {
  return scripts(true, false);
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

gulp.task('lint', function () {
    return gulp.src([
          './react/**/*.js',
          '!./react/parsecloud/**/*.js',
          '!./react/typeahead/typeahead.js',
          '!./react/typeahead/aria_status.js'
        ])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        //.pipe(eslint.failOnError());
});

gulp.task('watch', function() {
  gulp.start(['watchScripts', 'watchStyles']);
  //gulp.watch(['./react/**'], ['lint']);
});

function scripts(watch, compact) {
  var bundler, rebundle;
  bundler = browserify([
    './react/main.js',
    './react/dev.js'
  ], {
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch, // required to be true only for watchify
    paths: [
      './react',
      './react/typeahead'
    ]
  });
  if(watch) {
    bundler = watchify(bundler);
    bundler.on('update', function() {
      gutil.log(gutil.colors.green('Reloading...'));
    });
  }
 
  bundler.transform(babelify.configure({
    stage: 1,
    compact: compact,
    optional: [
      "minification.memberExpressionLiterals",
      "minification.propertyLiterals"
    ],
  }));

  bundler.require('./react/main.js', { expose: 'main'});
  bundler.require('./react/dev.js', { expose: 'dev'});

  if (!watch) {
    bundler.transform({
      global: true
    }, uglifyify);
  }
 
  rebundle = function() {
    var stream = bundler.bundle();
    stream.on('error', function(e) {
      gutil.log(gutil.colors.magenta('Browserify Failed', e.message));
    });
    stream = stream.pipe(source('index.js'));
    return stream.pipe(gulp.dest('./public/js'));
  };
 
  bundler.on('update', rebundle);
  return rebundle();
} 
