
document.addEventListener('deviceready', onDeviceReady, false);


 function  onDeviceReady()  {
     
    // window.open = cordova.InAppBrowser.open('https://corp-st-dev.4lapy.ru/mobile_app', '_blank', 'location=yes', 'toolbar=no');
    let inAppBrowserRef;
setTimeout
    function openInAppBrowser() {
      StatusBar.overlaysWebView(true);
      StatusBar.styleDefault();
      StatusBar.backgroundColorByHexString("#EFEFEF");
        /* Open URL */
        let open_url = localStorage.getItem('url') || 'https://corp-st-dev.4lapy.ru/mobile_app';
        inAppBrowserRef = cordova.InAppBrowser.open(open_url, '_blank','location=no,zoom=no');
 
        /* Add event listener to close the InAppBrowser */
        inAppBrowserRef.addEventListener('message', messageCallBack);
        inAppBrowserRef.addEventListener('loadstop', loadStartCallBack);
        inAppBrowserRef.addEventListener('loadstart', () => {
          inAppBrowserRef.executeScript({code: "console.log('start'); document.addEventListener('readystatechange', () => { if (document.readyState == 'interactive') {document.body.style.display = 'none'; }}); "})
          inAppBrowserRef.insertCSS({code: "body{transition: opacity 0.6s ease} "})
        });
        inAppBrowserRef.addEventListener('exit', () => {
            inAppBrowserRef = null;
            // navigator.app.exitApp();
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

          inAppBrowserRef.executeScript({code:"console.log('stop');  if (document.getElementById('menu_item') == null){ \
            console.log(document.cookie.BITRIX_SM_UIDL);\
            console.log(window.localStorage);\
          document.body.insertAdjacentHTML('afterbegin',\
       `<div id='block'><div id='menu_item'>\
       ${ window.location.href === 'https://corp-st-dev.4lapy.ru/mobile_app/' || window.location.href === 'https://corp-st-dev.4lapy.ru/mobile_app/?login=yes'  ? `<a href='https://corp-st-dev.4lapy.ru/mobile_app/menu.php'> <div id='first'> \
       <svg width='30' height='30' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>\
    <path fill-rule='evenodd' clip-rule='evenodd' fill='#1D1D1B'\
        d='M3.66699 6.41667C3.66699 5.91041 4.0774 5.5 4.58366 5.5H17.417C17.9233 5.5 18.3337 5.91041 18.3337 6.41667C18.3337 6.92293 17.9233 7.33333 17.417 7.33333H4.58366C4.0774 7.33333 3.66699 6.92293 3.66699 6.41667ZM3.66699 11C3.66699 10.4937 4.0774 10.0833 4.58366 10.0833H17.417C17.9233 10.0833 18.3337 10.4937 18.3337 11C18.3337 11.5063 17.9233 11.9167 17.417 11.9167H4.58366C4.0774 11.9167 3.66699 11.5063 3.66699 11ZM3.66699 15.5833C3.66699 15.0771 4.0774 14.6667 4.58366 14.6667H17.417C17.9233 14.6667 18.3337 15.0771 18.3337 15.5833C18.3337 16.0896 17.9233 16.5 17.417 16.5H4.58366C4.0774 16.5 3.66699 16.0896 3.66699 15.5833Z'  /> </svg> \
       </div></a> ` : `<div id='arrow' onclick='history.back(-1)'> <div> \
       <svg width='17' height='17' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>\
       <path d='M11 1L2.00281 5.08963C1.22121 5.4449 1.22121 6.5551 2.00281 6.91037L11 11'\
           stroke='#2B2A30' stroke-width='1.5' stroke-linecap='round' />\
   </svg> \
       </div> </div>` } \
         <a href='https://corp-st-dev.4lapy.ru/mobile_app'> \
         <svg width='200' height='30' viewBox='0 0 240 30' fill='none' xmlns='http://www.w3.org/2000/svg'>\
         <path\
             d='M72.3656 16.7606H57.7757C57.6882 18.2626 59.1063 20.1388 60.9096 20.9462C63.3724 22.0564 65.6659 21.4152 68.0645 18.9157L70.8541 21.0056C69.5597 22.8321 67.6548 24.1155 65.4967 24.6153C59.4098 26.0105 53.6031 21.9199 53.8248 14.6173C53.9357 10.4257 56.2526 6.99409 59.8358 5.71168C64.5863 3.97806 71.5836 5.9551 72.4298 13.7564C72.4604 14.7582 72.439 15.761 72.3656 16.7606ZM68.5839 13.3052C68.3154 10.6335 65.8235 8.55554 62.9639 8.60897C60.3727 8.65647 57.7757 10.9422 57.6357 13.3052H68.5839Z'\
             fill='#1D1D1B' />\
         <path\
             d='M147.241 16.7605H132.476C132.605 17.7193 132.993 18.6231 133.595 19.3722C134.198 20.1212 134.992 20.6865 135.89 21.0055C138.679 22.0861 140.961 21.1896 142.846 18.9097L145.665 21.0174C144.723 22.2973 143.483 23.3197 142.057 23.9932C140.631 24.6666 139.064 24.9701 137.495 24.8765C135.258 24.7984 133.127 23.8908 131.503 22.3247C129.878 20.7587 128.873 18.6424 128.677 16.3746C128.42 13.4833 128.91 10.7938 130.772 8.49018C131.696 7.31215 132.896 6.38962 134.263 5.80757C135.63 5.22552 137.118 5.00265 138.592 5.15949C141.586 5.36135 144.043 6.60813 145.706 9.21451C147.165 11.5003 147.468 14.0413 147.241 16.7605ZM132.505 13.2992H143.447C143.173 10.586 140.582 8.49612 137.681 8.61486C135.149 8.72173 132.557 11.055 132.505 13.2992Z'\
             fill='#1D1D1B' />\
         <path\
             d='M187.398 12.6995C187.544 10.1763 186.33 8.54359 184.112 8.3061C181.626 8.00925 180.22 9.06011 179.829 11.5656H176.327C176.255 10.236 176.621 8.92007 177.366 7.8252C178.302 6.48162 179.714 5.56003 181.305 5.25445C182.774 4.91886 184.3 4.93105 185.764 5.29007C187.094 5.5698 188.303 6.27174 189.217 7.29488C190.13 8.31802 190.701 9.60959 190.847 10.9837C190.932 11.5456 190.977 12.1132 190.981 12.6817C190.981 16.4636 190.981 20.2455 190.981 24.0215C190.981 24.1759 190.981 24.3362 190.981 24.5262H187.964C187.853 23.8553 187.73 23.1725 187.602 22.4126C186.708 23.3959 185.586 24.1367 184.34 24.5677C182.794 25.091 181.132 25.1488 179.554 24.734C177.459 24.1699 176.053 22.846 175.644 20.6433C175.207 18.3041 175.825 16.2915 177.815 14.8666C179.504 13.7512 181.449 13.1026 183.459 12.9845C184.754 12.848 186.056 12.7945 187.398 12.6995ZM187.398 15.6681C186.814 15.6681 186.295 15.6384 185.758 15.6681C184.007 15.769 182.256 15.9709 180.721 16.9386C180.201 17.2072 179.783 17.6455 179.536 18.1835C179.288 18.7215 179.225 19.3283 179.356 19.9071C179.601 20.9342 180.453 21.5755 181.784 21.7358C181.879 21.7417 181.974 21.7417 182.07 21.7358C185.285 21.8545 187.695 19.1294 187.38 15.6859L187.398 15.6681Z'\
             fill='#1D1D1B' />\
         <path d='M198.247 8.90564V24.4786H194.716V5.50964H209.889V24.4667H206.359V8.90564H198.247Z'\
             fill='#1D1D1B' />\
         <path\
             d='M169.149 8.90548H163.704C163.622 10.2769 163.61 11.6306 163.459 12.9664C163.261 15.3224 162.946 17.6667 162.513 19.99C161.866 23.0594 159.811 24.609 156.724 24.704H156.111V21.3733L156.695 21.3139C157.201 21.304 157.692 21.1324 158.097 20.8234C158.502 20.5145 158.802 20.0838 158.953 19.5922C159.341 18.3049 159.607 16.9829 159.747 15.644C160.004 12.4499 160.121 9.23795 160.296 6.03194C160.296 5.8657 160.296 5.69353 160.331 5.50354H172.703V24.5022H169.149V8.90548Z'\
             fill='#1D1D1B' />\
         <path\
             d='M112.663 5.4739H120.133C121.907 5.41986 123.635 6.05324 124.968 7.24598C126.301 8.43871 127.138 10.1018 127.312 11.8989C127.485 13.6961 126.982 15.4932 125.902 16.9269C124.823 18.3606 123.249 19.3238 121.498 19.6219C119.74 19.7775 117.975 19.831 116.211 19.7822V24.4903H112.663V5.4739ZM116.246 16.2972C117.658 16.2972 119.041 16.3803 120.413 16.2972C121.261 16.1956 122.046 15.7884 122.626 15.1491C123.205 14.5099 123.54 13.6809 123.57 12.8121C123.652 11.0607 122.479 9.29143 120.798 9.06582C119.283 8.95375 117.763 8.93987 116.246 9.02426V16.2972Z'\
             fill='#1D1D1B' />\
         <path\
             d='M89.2256 24.5201V5.52148H92.7564V11.6663C94.5238 11.602 96.2935 11.6476 98.0554 11.8029C99.1678 11.9768 100.205 12.4817 101.035 13.254C101.866 14.0263 102.454 15.0315 102.724 16.1429C103.094 17.2393 103.16 18.4181 102.915 19.5501C102.67 20.6821 102.123 21.7237 101.335 22.5609C100.764 23.216 100.058 23.7346 99.2671 24.0795C98.4761 24.4243 97.6199 24.587 96.7598 24.5557C94.4722 24.5082 89.4708 24.5201 89.2256 24.5201ZM92.7914 21.0944C93.019 21.0944 95.6335 21.1478 96.7423 21.0469C97.4485 20.969 98.1024 20.6317 98.5816 20.0983C99.0608 19.565 99.3322 18.8721 99.3451 18.1496C99.3807 17.4499 99.1628 16.7612 98.7325 16.214C98.3023 15.6669 97.6896 15.2994 97.0108 15.1811C95.6038 15.0968 94.1935 15.0869 92.7856 15.1514L92.7914 21.0944Z'\
             fill='#1D1D1B' />\
         <path\
             d='M214.179 24.5201V5.52148H217.721V11.6663C219.058 11.6663 220.324 11.6663 221.59 11.6663C222.129 11.6599 222.666 11.7077 223.195 11.8088C224.7 12.174 226.018 13.0921 226.897 14.3864C227.776 15.6807 228.154 17.26 227.957 18.8205C227.81 20.3639 227.109 21.798 225.989 22.8493C224.868 23.9005 223.406 24.4953 221.882 24.5201C219.344 24.526 216.805 24.5201 214.179 24.5201ZM217.762 21.035C219.123 21.1119 220.487 21.1119 221.847 21.035C222.581 20.9271 223.245 20.5354 223.702 19.9414C224.158 19.3475 224.372 18.5971 224.298 17.8468C224.242 17.0858 223.899 16.3761 223.341 15.8654C222.784 15.3546 222.054 15.0819 221.305 15.1039H217.75L217.762 21.035Z'\
             fill='#1D1D1B' />\
         <path\
             d='M50.9535 24.5023H47.452V16.9207C46.26 17.5977 44.9337 17.9934 43.5711 18.0784C41.5168 18.1912 39.6318 17.7816 38.0911 16.2676C37.5424 15.7405 37.1043 15.1058 36.8034 14.4017C36.5025 13.6976 36.345 12.9388 36.3404 12.171C36.2878 10.0337 36.3404 5.64026 36.3404 5.50964H39.8419C39.8419 6.15085 39.8069 10.4137 39.9353 11.9157C40.0754 13.5425 40.9916 14.4212 42.579 14.5934C44.1165 14.7807 45.6721 14.4513 47.0085 13.6553C47.1515 13.5793 47.2683 13.4607 47.3434 13.3153C47.4184 13.17 47.4482 13.0049 47.4286 12.8419C47.4286 10.6274 47.4286 5.78275 47.4286 5.53933H50.9302L50.9535 24.5023Z'\
             fill='#1D1D1B' />\
         <path d='M77.8339 8.90548H72.2431V5.50354H87.078V8.86392H81.5106V24.4725H77.8339V8.90548Z'\
             fill='#1D1D1B' />\
         <path d='M104.895 5.50354H108.461V24.5022H104.895V5.50354Z' fill='#1D1D1B' />\
         <path d='M233.437 24.4902H229.86V5.49158H233.437V24.4902Z' fill='#1D1D1B' />\
         <path d='M29.4832 0H14.7416V30H29.4832V0Z' fill='#F7BDC6' />\
         <path d='M14.7416 0H0V30H14.7416V0Z' fill='#EA5B0C' />\
         <path\
             d='M20.8401 14.6289C20.309 14.3498 20.2215 13.8214 20.7701 13.5246C21.0619 13.4177 21.8906 13.2574 22.7134 13.0912C24.4117 12.7468 24.9544 11.4347 24.9136 9.77234C24.9136 9.57641 24.6043 9.40424 24.4117 9.42205C22.3633 9.48142 20.9101 10.0158 20.3265 8.00309C19.9589 6.86317 19.3636 6.29321 19.0543 6.34665C18.6399 6.34665 18.8851 7.53406 18.7742 8.00903C18.7158 8.00903 18.1322 6.22791 17.5603 6.34071C17.1168 6.42383 17.2977 7.06503 17.251 8.82834C17.251 9.68328 17.1518 12.2125 15.5002 12.8121C14.3797 13.2277 12.4655 13.0437 10.9073 12.8121C10.2958 12.6195 9.73011 12.3001 9.24597 11.874C8.76183 11.4479 8.36974 10.9243 8.09441 10.3364C7.98353 10.1048 7.77927 10.1345 7.71507 10.3779C7.60248 10.9737 7.62157 11.5875 7.77096 12.1749C7.92034 12.7622 8.19628 13.3085 8.57879 13.7739C7.46996 14.6289 4.84379 16.7425 4.00342 18.9332C3.89837 19.2835 4.9255 20.0375 5.22313 19.8297C6.5829 18.6423 8.68384 16.8196 9.48336 16.8256C9.60592 16.9859 7.11397 18.1852 5.46824 21.4327C5.36903 21.783 6.57123 22.7151 6.86303 22.5014C8.25782 21.1121 8.98147 20.2335 10.9482 19.2954C12.8876 18.5378 15.0058 18.3889 17.0292 18.8679C18.9609 19.3488 20.3382 20.1563 22.4742 21.7533C23.2328 22.347 23.8806 21.2606 23.6939 20.7262C22.7134 18.6126 19.2235 16.9977 19.3519 16.6712C19.4803 16.3447 21.6863 17.639 23.6472 18.8382C24.1666 19.0401 25.0011 18.0902 24.7502 17.6508C23.583 16.0894 22.0948 15.3354 20.8518 14.6289'\
             fill='#13120D' />\
     </svg>\
         </a> \
         <div id='search'> \
         <svg width='18' height='21' viewBox='0 0 12 14' fill='none' xmlns='http://www.w3.org/2000/svg'>\
    <path\
        fill='#1D1D1B'\
        d='M5.74359 14C6.53333 14 7.17949 13.3538 7.17949 12.5641H4.30769C4.30769 13.3538 4.95385 14 5.74359 14ZM10.0513 9.69231V6.10256C10.0513 3.89846 8.88103 2.05333 6.82051 1.56513V1.07692C6.82051 0.481026 6.33949 0 5.74359 0C5.14769 0 4.66667 0.481026 4.66667 1.07692V1.56513C2.61333 2.05333 1.4359 3.89128 1.4359 6.10256V9.69231L0 11.1282V11.8462H11.4872V11.1282L10.0513 9.69231ZM8.61539 10.4103H2.87179V6.10256C2.87179 4.32205 3.9559 2.87179 5.74359 2.87179C7.53128 2.87179 8.61539 4.32205 8.61539 6.10256V10.4103Z' /> </svg>\
         </div>\
       </div></div>`) ;document.body.style.display = 'block';} "})
       

       inAppBrowserRef.insertCSS({code: "body{transition: opacity 0.6s ease} \
                                        #block{margin-bottom: 100px}\
                                        #menu_item{ position: fixed; background: #EFEFEF;width: 100%;height: 50px; display: flex;justify-content: space-around;align-items: center; z-index: 25}\
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