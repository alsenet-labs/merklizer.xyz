window.jQuery=window.$=require('jquery');
require('../css/main.css');

var prevState='validateFile';

window.addEventListener('message',receiveMessage,false);
function receiveMessage(msg){
  if (msg.origin!=document.location.origin) {
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
        var title="Merklizer";
        switch(msg.data.toState) {
          case 'validateFile': title+=" - Validating" ; prevState=msg.data.toState; break;
          case 'anchor': title+=" - Anchoring" ; prevState=msg.data.toState; break;
          default: break;
        }
        console.log(title);
        $('title').text(title);
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
            $('iframe')[0].contentWindow.postMessage({type:'transition',toState:prevState, reload: true});
            return;
            break;
        }
        switch(msg.data.fromState) {
          case 'report':
            $('iframe')[0].contentWindow.postMessage({type:'transition',toState:prevState, reload: true});
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
