var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var less = require('gulp-less');
var cssnano = require('cssnano');
var gutil = require('gulp-util');
var webpack = require('webpack');

gulp.task('default', ['webpack', 'less']);

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


var startWebpackDev = (opts) => {
    var WebpackDevServer = require('webpack-dev-server');
    var config = require('./webpack.hot.config.js');

    opts = opts || {};
    opts.publicPath = config.output.publicPath;
    opts.hot = true;
    opts.historyApiFallback = true;

    new WebpackDevServer(webpack(config), opts)
    .listen(8080, 'localhost', (err, result) => {
        if (err) {
            console.log(err);
        }

        console.log('Listening at localhost:8080');
    });
};

gulp.task('webpack-dev', (callback) => {
    startWebpackDev();
});

gulp.task('webpack', (callback) => {
    webpack(require('./webpack.config.js'), (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
            chunkModules: false,
        }));
        callback();
    });
});

gulp.task('webpack-deploy', (callback) => {
    webpack(require('./webpack.prod.config.js'), (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log('[webpack]', stats.toString({
            chunkModules: false,
        }));
        callback();
    });
});
