/*
* Copyright (c) 2018-2020 ALSENET SA
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

'use strict';

module.exports=[
  '$rootScope',
  '$state',
  '$stateParams',
  '$window',
  '$transitions',
  function (
    $rootScope,
    $state,
    $stateParams,
    $window,
    $transitions
  ) {

    angular.extend($rootScope,{
      config: require('../../config.json'),
      $state: $state,
      $stateParams: $stateParams,
      mobileApp: (['http:','https:'].indexOf($window.document.location.protocol)<0),
      t: {
        welcome: "WELCOME TO MERKLIZER"
      }
    });

    $transitions.onSuccess({}, function(transition) {
      $rootScope.title = transition.to().title;
      // allow state related css rules
      $('body').removeClass('_'+transition.from().name.replace(/\./g,'_').replace(/([A-Z])/g,function(all,letter){return '-'+letter.toLowerCase()})).addClass('_'+transition.to().name.replace(/\./g,'_').replace(/([A-Z])/g,function(all,letter){return '-'+letter.toLowerCase()}));
    });

  }
];
