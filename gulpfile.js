const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const version = require('gulp-version-number');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
// sourcemaps plugin - https://www.npmjs.com/package/gulp-sourcemaps

let src = './src/';
let dist = './dist/';

let path = {
  src: {
    styles: {
      entry: src + 'sass/style.scss',
      all: src + 'sass/**/*.scss',
      first: src + 'sass/first-loaded.scss',
    },
  },
  dist: {
    styles: dist,
  },
};

gulp.task('styles', function () {
  return (
    gulp
      .src([path.src.styles.entry, path.src.styles.first])
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(version())
      // .pipe(rename({ basename: 'styles' }))
      .pipe(gulp.dest(dist))
      .pipe(browserSync.stream())
  );
});

gulp.task('html', function () {
  return gulp.src(src + 'index.html').pipe(gulp.dest(dist));
});

gulp.task('copy', function () {
  return gulp
    .src([src + 'thinkmoto/**/*', src + 'img/**/*'], { base: './src/' })
    .pipe(gulp.dest(dist));
});

// Static server
gulp.task('watchAll', function () {
  gulp.watch(path.src.styles.all, gulp.series('styles'));
  gulp
    .watch(src + 'index.html')
    .on('change', gulp.series('html', browserSync.reload));
});

gulp.task('server', function () {
  browserSync.init({
    server: './dist',
    open: true,
  });
});

gulp.task('build', gulp.series('copy', 'styles', 'html'));

gulp.task(
  'develope-styles',
  gulp.series('styles', function watchStyles() {
    gulp.watch(path.src.styles.all, gulp.parallel('styles'));
  })
);

exports.serve = gulp.series('build', gulp.parallel('server', 'watchAll'));

exports.styles = gulp.series('styles');
