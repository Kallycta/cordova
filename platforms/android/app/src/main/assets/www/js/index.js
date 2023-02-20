
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
       ${ window.location.href === 'https://corp-st-dev.4lapy.ru/mobile_app/' || window.location.href === 'https://corp-st-dev.4lapy.ru/mobile_app/?login=yes'  ? `<a href='https://corp-st-dev.4lapy.ru/mobile_app/menu.php'> <div id='first'> \
       <svg width='30' height='30' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>\
    <path fill-rule='evenodd' clip-rule='evenodd' fill='#1D1D1B'\
        d='M3.66699 6.41667C3.66699 5.91041 4.0774 5.5 4.58366 5.5H17.417C17.9233 5.5 18.3337 5.91041 18.3337 6.41667C18.3337 6.92293 17.9233 7.33333 17.417 7.33333H4.58366C4.0774 7.33333 3.66699 6.92293 3.66699 6.41667ZM3.66699 11C3.66699 10.4937 4.0774 10.0833 4.58366 10.0833H17.417C17.9233 10.0833 18.3337 10.4937 18.3337 11C18.3337 11.5063 17.9233 11.9167 17.417 11.9167H4.58366C4.0774 11.9167 3.66699 11.5063 3.66699 11ZM3.66699 15.5833C3.66699 15.0771 4.0774 14.6667 4.58366 14.6667H17.417C17.9233 14.6667 18.3337 15.0771 18.3337 15.5833C18.3337 16.0896 17.9233 16.5 17.417 16.5H4.58366C4.0774 16.5 3.66699 16.0896 3.66699 15.5833Z'  /> </svg> \
       </div></a> ` : `<div id='arrow' onclick='history.back(-1)'> <div> \
       <svg width='28' height='28' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>\
    <path d='M17 5L5.96725 10.092C5.19266 10.4495 5.19266 11.5505 5.96724 11.908L17 17'stroke='white' stroke-width='2' stroke-linecap='round' /></svg> \
       </div> </div>` } \
         <a href='https://corp-st-dev.4lapy.ru/mobile_app'> \
             <img src='https://corp-st-dev.4lapy.ru/local/templates/light_red/images/new-logo.svg' id='logoImg'> </a> \
         <div id='search'> \
         <svg width='18' height='21' viewBox='0 0 12 14' fill='none' xmlns='http://www.w3.org/2000/svg'>\
    <path\
        fill='#1D1D1B'\
        d='M5.74359 14C6.53333 14 7.17949 13.3538 7.17949 12.5641H4.30769C4.30769 13.3538 4.95385 14 5.74359 14ZM10.0513 9.69231V6.10256C10.0513 3.89846 8.88103 2.05333 6.82051 1.56513V1.07692C6.82051 0.481026 6.33949 0 5.74359 0C5.14769 0 4.66667 0.481026 4.66667 1.07692V1.56513C2.61333 2.05333 1.4359 3.89128 1.4359 6.10256V9.69231L0 11.1282V11.8462H11.4872V11.1282L10.0513 9.69231ZM8.61539 10.4103H2.87179V6.10256C2.87179 4.32205 3.9559 2.87179 5.74359 2.87179C7.53128 2.87179 8.61539 4.32205 8.61539 6.10256V10.4103Z' /> </svg>\
         </div>\
       </div>`) }"})
       

       inAppBrowserRef.insertCSS({code: "#menu_item{background: #e0e0e0;width: 100%;height: 50px; display: flex;justify-content: space-around;align-items: center; z-index: 25}\
                                       #menu_item a{display:block}\
                                       #first span{background: white; width: 30px; height: 2px; display: block; margin-bottom: 5px} \
                                       #search a{color: black; text-decoration: none} #logoImg {width: 150px; }\
                                       #arrow svg{color: white; } " });
        }
           


    // document.getElementById('browser').addEventListener('click', openInAppBrowser)
    // document.getElementById('scan').addEventListener('click',postCordovaMessage)

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    openInAppBrowser()


}


onDeviceReady()