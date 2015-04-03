/* gulpfile.js */

var browserSync   = require('browser-sync');
var gulp          = require('gulp');
var browserify    = require('browserify');  // Bundles JS.
var del           = require('del');  // Deletes files.
var reactify      = require('reactify');
var source        = require('vinyl-source-stream');
var nodemon       = require('gulp-nodemon');

// Define some paths.
var paths = {
  app_js: ['./static/js/src/app.js'],
  js: ['./static/js/src/**/*.js'],
  dest: './static/js/build/'
};

// Clean task - clear the build folder
gulp.task('clean', function(done) {
  del(['static/js/build/*'], done);
});

// Browserify our code and compile React JSX files.
gulp.task('build', ['clean'], function() {
  // copy static files
  // gulp.src(paths.static, {base: './src/'})
  //   .pipe(gulp.dest(paths.dest));

  // Browserify/bundle the JS.
  browserify(paths.app_js)
    .transform(['reactify', {es6: true}]) // es6 oh yeah!
    .bundle()
    .on('error', function(error) {
      console.error(error);
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.reload({stream:true}));
});

// start nodemon to start our node server
// nodemon auto restarts every time the server is updated
gulp.task('start', function() {
  nodemon({
      script: 'index.js',
      ext: 'js',
      ignore: ['./static/', 'gulpfile.js'],
      env: {'NODE_ENV': 'development'}
  });
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['build', 'start'], function() {
  gulp.watch([paths.js], ['build']);
});
