/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

 function  onDeviceReady()  {
    let inAppBrowserRef;
    function openInAppBrowser() {
        /* Open URL */
        let open_url = localStorage.getItem('url') || 'https://cordova.vercel.app';
        console.log(localStorage.getItem('url'));
        inAppBrowserRef = cordova.InAppBrowser.open(open_url, '_blank', 'clearcache=yes,clearsessioncache=yes,location=yes,hardwareback=no,zoom=no');
        /* Add event listener to close the InAppBrowser */
        inAppBrowserRef.addEventListener('message', messageCallBack);
      }

       function messageCallBack(params) {
        /* Close the InAppBrowser if we received the p
        roper message */
        if (params.data.action == 'scan') {
            scanBarcode()
        }
      }
       function postCordovaMessage(e) {
     if(e.target.id === 'scan') {
        scanBarcode()
     }

     console.log(window.location.href);
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

    // window.open = cordova.InAppBrowser.open('https://cordova.vercel.app', '_blank', 'location=no');
    document.getElementById('browser').addEventListener('click', openInAppBrowser)
    document.getElementById('scan').addEventListener('click',postCordovaMessage)
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');
    // document.getElementById('browser').addEventListener('click', () => {
    //     console.log(cordova);
    //     cordova.InAppBrowser.open('https://addeo.ru/test.html', '_blank')

    // })

 
    //  document.getElementById('scan').addEventListener('click',  () => {
    //     console.log('click');
    //     console.log(cordova);

    //     cordova.plugins.barcodeScanner.scan(
    //         function (result) {
    //             alert("We got a barcode\n" +
    //                   "Result: " + result.text + "\n" +
    //                   "Format: " + result.format + "\n" +
    //                   "Cancelled: " + result.cancelled);
    //         },
    //         function (error) {
    //             alert("Scanning failed: " + error);
    //         },
    //         {
    //             preferFrontCamera : true, // iOS and Android
    //             showFlipCameraButton : true, // iOS and Android
    //             showTorchButton : true, // iOS and Android
    //             torchOn: true, // Android, launch with the torch switched on (if available)
    //             saveHistory: true, // Android, save scan history (default false)
    //             prompt : "Place a barcode inside the scan area", // Android
    //             resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
    //             formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
    //             orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
    //             disableAnimations : true, // iOS
    //             disableSuccessBeep: false // iOS and Android
    //         }
    //      );
 

    // })
}

