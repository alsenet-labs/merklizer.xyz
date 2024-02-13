/*
* Copyright (c) 2018-2024 ALSENET SA
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



/* jshint strict: false */
/* globals require, console */
var gulp = require('gulp');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var glob=require('glob');
var es=require('event-stream');
var debug=require('gulp-debug');
var path = require('path');
var fse = require('fs-extra');
var log = require('fancy-log');

module.exports=function(options){

  function compile(options){

    return glob('./client/app/js/index.js'/*,{ignore: './client/app/js/**.min.js'}*/,function(err,files){

      if (err) return options.callback(err);

      var _watchify=(options && options.watch)?watchify:function(e){return e};
      var tasks=files.map(function(filename){
        var bundler = _watchify(
          browserify({
            entries: [filename]
          },{
            debug: true
          })
          .transform(require('browserify-css'), {
            minify: 'true',
            rootDir: '.',
            output: 'client/app/css/bundle.css',
            autoInject: 'true',
            global: 'true',
            processRelativeUrl: function(relativeUrl) {
              log('relativeURL',relativeUrl)
                var stripQueryStringAndHashFromPath = function(url) {
                    return url.split('?')[0].split('#')[0];
                };
                var rootDir = path.resolve(process.cwd(), 'client/app/');
                var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
                var queryStringAndHash = relativeUrl.substring(relativePath.length);

                //
                // Copying files from '../node_modules/.../' to 'dist/vendor/.../'
                //
                var prefix = '../../../node_modules/';
                if (_.startsWith(relativePath, prefix)) {
                    var vendorPath = 'vendor/' + relativePath.substring(prefix.length);
                    var source = path.join(rootDir, relativePath);
                    var target = path.join(rootDir, vendorPath);

                    log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
                    fse.copySync(source, target);

                    // Returns a new path string with original query string and hash fragments
                    return vendorPath + queryStringAndHash;
                }

                return relativeUrl;
            }
          })
          .transform(babelify, {
              presets: [["env",{
              "targets": {
                "browsers": ["last 2 versions"]
              }
            }]],
            sourceMaps: true
          })
        );

        function rebundle(filename,bundler) {
            var stream=bundler
                .bundle()
                .on('error', function (err) {
                    console.error(err);
                    this.emit('end',err);
                })
                .pipe(source('build.js'))
                .pipe(buffer())
                .pipe(rename(filename.replace(/\.js$/,'\.min.js')))
                .pipe(sourcemaps.init({loadMaps: true}));
            if (options.uglify) {
              stream=stream.pipe(uglify());
            }
            return stream
                .pipe(sourcemaps.write('./'))
                .pipe(debug({title: 'processed:'}))
                .pipe(gulp.dest('./'))
        }

        if (options.watch) {
            bundler.on('update', function () {
                console.log('-> bundling '+filename+'...');
                rebundle(filename,bundler);
            });
        }

        return rebundle(filename,bundler);

      });
      es.merge(tasks).on('end',options.callback);
    });
  }

  return function(callback) {
    options=options||{};
    options.callback=callback||function(){};
    compile(options)
  }

}
