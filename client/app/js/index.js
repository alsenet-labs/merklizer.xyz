/*
* Copyright (c) 2019 ALSENET SA
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

require('../css/main.css');
window.angular=require('angular');
require('@uirouter/angularjs/release/angular-ui-router.js');
window.jQuery=window.$=require('jquery');


// force https
if (window.location.protocol!='https:') {
  var href=window.location.href.replace(/[^:]+/,'https');
  window.location.assign(href);
}

angular.module(
  "app",
   [
     'ui.router',
   ]
)
.config(require('./config.js'))
.run(require('./run.js'))
.controller("MainCtrl", require('./controllers/main.js'))
.controller("HomeCtrl", require('./controllers/home.js'));
