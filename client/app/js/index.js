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




// force https
if (window.location.protocol!='https:') {
  var href=window.location.href.replace(/[^:]+/,'https');
  window.location.assign(href);
}

window.jQuery=window.$=require('jquery');
require('../css/main.css');

var prevState='validateFile';

window.addEventListener('message',receiveMessage,false);
function receiveMessage(msg){
  if (msg.origin!=window.location.origin) {
    console.log(msg);
    return;
  }
  if (msg.data && msg.data.type) {
    console.log(msg.data.type);
    switch(msg.data.type){
      case 'transitionSuccess':
        console.log(msg.data.toState);
        $('body').removeAttr('data-show-overlay');
        $('body').removeAttr('data-loading');
        $('body').attr('data-merklizer-state',msg.data.toState);
        break;
      case 'filesReady':
        $('body').addClass('hide-intro');
        break;
      case 'transitionStart':
        switch(msg.data.toState) {
          case 'processed':
          case 'chooser':
          case 'validate':
          case 'validateQrCode':
            $('iframe')[0].contentWindow.postMessage({type:'transition',toState:prevState, reload: true}, window.location.origin);
            return;
            break;
        }
        switch(msg.data.fromState) {
          case 'report':
            $('iframe')[0].contentWindow.postMessage({type:'transition',toState:prevState, reload: true}, window.location.origin);
            return;
            break;
        }

        break;

      case 'showOverlay':
        $('body').attr('data-show-overlay','true');
        break;

      case 'hideOverlay':
        $('body').removeAttr('data-show-overlay');
        break;

      default:
        console.log('unhandled message', msg);
        break;
    }
  } else {
    console.log('unhandled message', msg);
  }
}
