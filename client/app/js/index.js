window.jQuery=window.$=require('jquery');
require('../css/main.css');

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
        $('body').attr('data-merklizer-state',msg.data.toState);
        break;
      case 'filesReady':
        $('body').addClass('hide-intro');
        break;
      default:
        console.log('unhandled message', msg);
        break;
    }
  } else {
    console.log('unhandled message', msg);
  }
}
