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
var replace = require('gulp-replace');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var del = require('del') ;
var rev = require('gulp-rev');
var log = require('fancy-log');
var path = require('path');
var es = require('event-stream');
var fs = require('fs');
var shell = require('shelljs');
var browserify = require('./gulptasks/browserify.js');
var version = {
  core: require('./package.json').version,
  engine: require('./merklizer/webapp/package.json').version
}
console.log (version);

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

gulp.task('browserify', browserify());

gulp.task('browserify-ugly', browserify({
  uglify: true
}));

gulp.task('watchify', browserify({
  watch: true
}));

gulp.task('watch', function(){
  return gulp.watch('./client/app/sass/**.scss')
  .on('change', gulp.series('sass'))
});

function callback(err,msg){
  if(err) throw err;
}

gulp.task('run', gulp.series(
    'sass',
    'watchify',
    gulp.parallel(
      'browserSync',
      'watch'
    )
));

gulp.task('default',gulp.series('run'));

gulp.task('clean:dist', function(cb) {
    return del(['./dist'], cb);
});

gulp.task('dist', function(){
   var streams=[];
   streams.push(gulp.src('./client/app/index.html')
   .pipe(replace('CORE_VERSION',version.core))
   .pipe(replace('ENGINE_VERSION',version.engine))
   .pipe(gulp.dest('./dist/')));
   streams.push(gulp.src('./client/app/js/index.min.*')
   .pipe(gulp.dest('./dist/js/')));
   streams.push(gulp.src('./client/app/css/bundle.*')
   .pipe(gulp.dest('./dist/css/')));
   streams.push(gulp.src('./client/app/images/*')
   .pipe(gulp.dest('./dist/images/')));
   streams.push(gulp.src('./merklizer/webapp/dist/**')
   .pipe(gulp.dest('./dist/app/')));
   return merge(streams).pipe(debug({title: 'Files:'}));

});

gulp.task('rev', function(){
  return gulp.src(['./dist/js/index.min.js', './dist/css/bundle.css'])
    .pipe(rev())
    .pipe(renameRevFiles(es))
    .pipe(injectRev(es,'./dist/index.html'));
});

gulp.task('build', gulp.series(
    'sass',
    'browserify',
    'clean:dist',
    'dist',
    'rev'
));

gulp.task('build-ugly', gulp.series(
    'sass',
    'browserify-ugly',
    'clean:dist',
    'dist',
    'rev'
));

gulp.task('clean:gh-pages', function(cb) {
    return del(['./docs/*','!./docs/CNAME'], cb);
});

gulp.task('copy:gh-pages', function(){
  return gulp.src(['./dist/**','.nojekyll'])
  .pipe(gulp.dest('./docs/'));
});

gulp.task('gh-pages', gulp.series('clean:gh-pages','build-ugly', 'copy:gh-pages'));

var revFiles=[];
// rename in place rev files (and their optional map file)
var renameRevFiles=function(es){
  revFiles.splice(0);
  return es.map(function(file,cb){
    if (!revFiles.find(function(f){
      return f.orig==file.revOrigPath;
    })) {
      var basename=path.basename(file.revOrigPath).split('.');
      basename[0]=basename[0]+'-'+file.revHash;
      basename=basename.join('.');
      var dest=path.join(file.revOrigBase,basename);
      fs.renameSync(file.revOrigPath, dest);
      revFiles.push({orig: file.revOrigPath, rev: dest});
      try {
        fs.renameSync(file.revOrigPath+'.map', dest+'.map'); 
        shell.sed('-i',path.basename(file.revOrigPath)+'.map',basename+'.map', dest);
      } catch(e) {}
    }
    return cb(null,file);
  });
}

// replace reference to rev files in specified html
var injectRev=function(es,html){
  var html=path.resolve(html);
  var base=path.dirname(html);
  return es.map(function(file,cb){
    revFiles.forEach(function(file){
      var orig=file.orig.substr(base.length+1);
      var rev=file.rev.substr(base.length+1);
      shell.sed('-i','"'+orig+'"','"'+rev+'"',html);
    });
    return cb(null,file);
  });
}
