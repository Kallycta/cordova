
if(document.querySelector('#scanButton')) {
  document.querySelector(".green").addEventListener('click', () => {
    postCordovaMessage();
  })
}

   function postCordovaMessage(e) {

  localStorage.setItem('url', window.location.href)
    /* Send an action = 'close' JSON object to Cordova via postMessage API */
    var message = {action: 'scan', url: `${window.location.href}`};
    console.log(window.location.href);
    if (!webkit.messageHandlers.cordova_iab) {
      console.warn('Cordova IAB postMessage API not found!');
      throw 'Cordova IAB postMessage API not found!';
    } else {
      console.log('Message sent!');
      webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
    }
  }

  document.querySelector('#btnscan').addEventListener('click', () => {
    postCordovaMessage();
  })

  