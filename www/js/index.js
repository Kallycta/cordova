
document.addEventListener('deviceready', onDeviceReady, false);

 function  onDeviceReady()  {
    setTimeout(() => {
        
    // window.open = cordova.InAppBrowser.open('https://corp-st-dev.4lapy.ru/mobile_app', '_blank', 'location=yes', 'toolbar=no');
    let inAppBrowserRef;

    function openInAppBrowser() {
        /* Open URL */
        let open_url = localStorage.getItem('url') || 'https://corp-st-dev.4lapy.ru/mobile_app';
        inAppBrowserRef = cordova.InAppBrowser.open(open_url, '_blank','toolbar=no');
        

        /* Add event listener to close the InAppBrowser */
        inAppBrowserRef.addEventListener('message', messageCallBack);
        inAppBrowserRef.addEventListener('loadstart', loadStartCallBack);
        inAppBrowserRef.addEventListener('exit', () => {
            inAppBrowserRef = null;
        })
      }

       function messageCallBack(params) {
        /* Close the InAppBrowser if we received the p
        roper message */
        if (params.data.action == 'scan') {
            scanBarcode()
        }
      }
       function postCordovaMessage(e) {
     if(e.target.id === 'scan' && !inAppBrowserRef ) {
        scanBarcode()
        return
     }


      localStorage.setItem('url', window.location.href)
        /* Send an action = 'close' JSON object to Cordova via postMessage API */
        var message = {action: 'scan'};
        if (!webkit.messageHandlers.cordova_iab) {
          console.warn('Cordova IAB postMessage API not found!');
          throw 'Cordova IAB postMessage API not found!';
        } else {
          console.log('Message sent!');
          webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify(message));
        }
      }



      function scanBarcode() {
        if(inAppBrowserRef) inAppBrowserRef.close()
        console.log(cordova);
        console.log('click');

        cordova.plugins.barcodeScanner.scan(
            function (result) {
                alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                        openInAppBrowser()
            },
            function (error) {
                alert("Scanning failed: " + error);
                openInAppBrowser()
            },
            {
                preferFrontCamera : true, // iOS and Android
                showFlipCameraButton : true, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt : "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations : true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
            );
      }
      function loadStartCallBack() {
        if(inAppBrowserRef) {



            // browserWrap.appendChild(popup);
            inAppBrowserRef.executeScript({code:"  console.log('script working'); setTimeout(() => { document.body.insertAdjacentHTML('afterbegin',`<div id='menu_item'><a href='#'>Test!</a> <br> <div  id='back' onclick='history.back(-1)' >back</div> </div>`) }, 500)"})
          setTimeout(() => {
            inAppBrowserRef.insertCSS({ code: "#menu_item{background: red; width: 100%; height: 50px , position: fixed}" });
          },500)

        }
   
      } 


    // window.open = cordova.InAppBrowser.open('https://cordova.vercel.app', '_blank', 'location=no');
    document.getElementById('browser').addEventListener('click', openInAppBrowser)
    document.getElementById('scan').addEventListener('click',postCordovaMessage)

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    }, 3000)

}


