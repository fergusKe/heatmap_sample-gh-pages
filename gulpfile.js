var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var wrap = require('gulp-wrap');
var browserSync = require('browser-sync');
var compass = require('gulp-compass');
var uglify = require('gulp-uglify');
var tinypng = require('gulp-tinypng');
var clean = require('gulp-clean');

gulp.task('browser-sync', ['build', 'compass', 'uglify', 'tinypng', 'data'], function() {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('build', ['cleanHtml'], function() {
  gulp.src('./src/*.html')
      // .pipe(wrap({src:'layout/default.html'}))
      .pipe(gulp.dest('./dist'));
});

gulp.task('data', ['cleanData'], function() {
  gulp.src('./src/data/**')
      .pipe(gulp.dest('./dist/data'));
});

gulp.task('compass', ['cleanCss'], function(){
  gulp.src('./src/scss/**/*.scss')
      .pipe(compass({
        config_file: './config.rb',
        sourcemap: false,
        time: true,
        css: './dist/css/',
        sass: './src/scss/',
        image: './src/images/',
        style: 'nested' //nested, expanded, compact, compressed
      })).on('error', handleError)
      .pipe(autoprefixer())
      .pipe(minify())
      .pipe(browserSync.reload({stream:true}));
});

gulp.task('uglify', ['cleanJs'], function() {
  gulp.src('./src/js/**/*.js')
      // .pipe(uglify())
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.reload({stream:true}));
});

gulp.task('tinypng', ['cleanImg'], function () {
    gulp.src('./src/images/**/*.{png,jpg,gif,ico}')
        // .pipe(tinypng('qtV_OqBBXFMv9oVj--iIl7V-Z4GI49Vl'))
        .pipe(gulp.dest('./dist/images'));
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('rebuild', ['build'], function () {
    browserSync.reload();
});

gulp.task('cleanHtml', function () {
  return gulp.src('./dist/*.html', {read: false}).pipe(clean({force: true}));
});
gulp.task('cleanCss', function () {
  return gulp.src('./dist/css/**/*.css', {read: false}).pipe(clean({force: true}));
});
gulp.task('cleanJs', function () {
  return gulp.src('./dist/js/**/*.js', {read: false}).pipe(clean({force: true}));
});
gulp.task('cleanImg', function () {
  return gulp.src('./dist/js/**/*.{png,jpg,gif,ico}', {read: false}).pipe(clean({force: true}));
});
gulp.task('cleanData', function () {
  return gulp.src('./dist/data/**', {read: false}).pipe(clean({force: true}));
});

gulp.task('watch', function(){
	gulp.watch(['./src/**/*.html'], ['rebuild']);
  gulp.watch(['./src/scss/*.scss'], ['compass']);
  gulp.watch(['./src/js/**'], ['uglify']);
  gulp.watch(['./src/images/**'], ['tinypng']);
  gulp.watch(['./src/data'], ['data']);
});

gulp.task('default', ['browser-sync', 'watch']);