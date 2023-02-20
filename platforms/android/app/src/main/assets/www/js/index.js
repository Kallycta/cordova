
document.addEventListener('deviceready', onDeviceReady, false);


 function  onDeviceReady()  {
     
    // window.open = cordova.InAppBrowser.open('https://corp-st-dev.4lapy.ru/mobile_app', '_blank', 'location=yes', 'toolbar=no');
    let inAppBrowserRef;

    function openInAppBrowser() {
      console.log(history)
        /* Open URL */
        let open_url = localStorage.getItem('url') || 'https://corp-st-dev.4lapy.ru/mobile_app';
        inAppBrowserRef = cordova.InAppBrowser.open(open_url, '_blank','toolbar=no,location=no');

        /* Add event listener to close the InAppBrowser */
        inAppBrowserRef.addEventListener('message', messageCallBack);
        inAppBrowserRef.addEventListener('loadstop', loadStartCallBack);
        inAppBrowserRef.addEventListener('loadstart', () => {
          console.log('start!!');
        });
        inAppBrowserRef.addEventListener('exit', () => {
            inAppBrowserRef = null;
            navigator.app.exitApp();
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

          inAppBrowserRef.executeScript({code:"if (document.getElementById('menu_item') == null){ \
          document.body.insertAdjacentHTML('afterbegin',\
       `<div id='menu_item'>\
       ${ window.location.href === 'https://corp-st-dev.4lapy.ru/mobile_app/' || window.location.href === 'https://corp-st-dev.4lapy.ru/mobile_app/?login=yes'  ? `<a href='https://corp-st-dev.4lapy.ru/mobile_app/menu.php'> <div id='first'> <span></span> <span></span> <span></span></div></a> ` : `<div id='arrow' onclick='history.back(-1)'> <div>&#60;</div> </div>` } \
         <a href='https://corp-st-dev.4lapy.ru/mobile_app'> \
             <img src='https://corp-st-dev.4lapy.ru/local/templates/light_red/images/new-logo.svg' id='logoImg'> </a> \
         <div id='search'> <a href='#' >Search</a></div>\
       </div>`) }"})
       

       inAppBrowserRef.insertCSS({code: "#menu_item{background: #e0e0e0;width: 100%;height: 50px; display: flex;justify-content: space-around;align-items: center; z-index: 25}\
                                       #menu_item a{display:block}\
                                       #first span{background: white; width: 30px; height: 2px; display: block; margin-bottom: 5px} \
                                       #search a{color: black; text-decoration: none} #logoImg {width: 150px; }\
                                       #arrow {color: white; font-size: 32px; font-weight: 700; align-self: baseline; } " });
        }
           


    document.getElementById('browser').addEventListener('click', openInAppBrowser)
    document.getElementById('scan').addEventListener('click',postCordovaMessage)

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    openInAppBrowser()


}


onDeviceReady()