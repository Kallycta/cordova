

if(document.querySelector('.important'))document.querySelector('.important').addEventListener('click', () => console.log('click!') );
console.log('!!!');

// function messageCallBack(params) {
//     /* Close the InAppBrowser if we received the p
//     roper message */
//     if (params.data.action == 'scan') {
//         ScanningBarcode()
//     }
//   }
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




   function ScanningBarcode() {  
    cordova.plugins.barcodeScanner.scan(
        function (result) {
           console.log(result)
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : true, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE,PDF_417,DATA_MATRIX, UPC_A,UPC_E,EAN_8,EAN_13", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
        )
    }

  document.querySelector('#btnscan').addEventListener('click', () => {
    postCordovaMessage();
    console.log('event click testing scan');})