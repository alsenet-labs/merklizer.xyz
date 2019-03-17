/*
* Copyright (c) 2018 ALSENET SA
*
* Author(s):
*
*      Luc Deschenaux <luc.deschenaux@freesurf.ch>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*/

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var del = require('del') ;

gulp.task('browserSync',function(){
    browserSync.init(["client/app/css/bundle.css", "client/app/js/index.min.js","./client/app/index.html",'./client/app/views/**.html'], {
        watchOptions: {
          ignoreInitial: true
        },
        server: {
            baseDir: "./client/app/",
            routes: {
              "/app": "merklizer/webapp/client/app"
            }
        },
        https: true
    });
});

gulp.task('sass', function () {

  return gulp.src([
    //'./node_modules/font-awesome/scss/font-awesome.scss',
    './client/app/sass/**.scss'
    ])
    .pipe(sass({
      includePaths: [
//        './node_modules/bootstrap/scss'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest('./client/app/css/'));
});

gulp.task('browserify', require('./gulptasks/browserify.js')());

gulp.task('browserify-ugly', require('./gulptasks/browserify.js')({
  uglify: true
}));

gulp.task('watchify', require('./gulptasks/browserify.js')({
  watch: true
}));

gulp.task('watch', function(){
      return gulp.watch("./client/app/sass/**.scss", ['sass']);
});

function callback(err,msg){
  if(err) throw err;
}

gulp.task('run', function() {
  return runSequence(
    'sass',
    'watch',
    'watchify',
    'browserSync'

  );
});

gulp.task('default',['run']);

gulp.task('build', function(callback){
  runSequence(
    'sass',
    'browserify',
    'dist',
    function(err){
      if (err) console.log(err.message);
      callback(err);
    }
  );
});

gulp.task('build-ugly', function(callback){
  runSequence(
    'sass',
    'browserify-ugly',
    'dist',
    function(err){
      if (err) console.log(err.message);
      callback(err);
    }
  );
});

gulp.task('clean:gh-pages', function(cb) {
    return del(['./docs/*','!./docs/CNAME'], cb);
});

gulp.task('gh-pages', ['clean:gh-pages','dist'], function(){
  return gulp.src('./dist/**')
  .pipe(gulp.dest('./docs/'));
});

gulp.task('clean:dist', function(cb) {
    return del(['./dist'], cb);
});

gulp.task('dist', ['clean:dist'], function(){
   var streams=[];
   streams.push(gulp.src('./client/app/index.html')
   .pipe(gulp.dest('./dist/')));
   streams.push(gulp.src('./client/app/js/index.min.*')
   .pipe(gulp.dest('./dist/js/')));
   streams.push(gulp.src('./client/app/css/bundle.*')
   .pipe(gulp.dest('./dist/css/')));
   streams.push(gulp.src('./client/app/images/*')
   .pipe(gulp.dest('./dist/images/')));
   streams.push(gulp.src('./merklizer/webapp/dist/**')
   .pipe(gulp.dest('./dist/app/')));
   return merge.apply(null,streams);

});
