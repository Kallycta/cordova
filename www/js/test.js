/* OrdersAssemblyBarCodeScanner */
function OrdersAssemblyBarCodeScanner() {
    // Наследуем свойства и методы от General
    General.call(this);
  }
  
  OrdersAssemblyBarCodeScanner.prototype.scanner = function (order_id, remove_bandle = false) {
    window.removeEventListener('storage', getBarcodeFromLocStorage)
    window.addEventListener('storage',getBarcodeFromLocStorage.bind(null, order_id, remove_bandle) )
  
     function getBarcodeFromLocStorage(order_id, remove_bandle = false) {
      if(window.localStorage.getItem('scanInfo')) {
        const data = JSON.parse(window.localStorage.getItem('scanInfo'))
        window.localStorage.removeItem('scanInfo')
        
        if (data.text) {
            console.log(data, order_id);
          document.getElementById('loader').className = "progress__bar";
    
          if (remove_bandle) {
            console.log('отправка скрпита через БХ ajax get');
            BX.ajax.get(
              'index.php',
              {
                order_id: order_id,
                barScan: data.text,
                remove_bandle: remove_bandle
              },
              (resp) => {
                console.log(resp + 'resp ответ получен');
                resp = JSON.parse(resp);
                if (resp['result'] === true) {
                  if (typeof resp['newValues'] !== 'undefined' && typeof resp['newValues']['id'] !== 'undefined') {
                    var cell = document.getElementById(resp['newValues']['id']);
                    cell.innerText = resp['newValues']['value'];
                  }
    
                  if (typeof resp['slots'] !== 'undefined') {
                    $("#addSlotButton")[0].textContent = 'Транспортных мест: ' + resp['slots'];
                  }
    
                  app.confirm({
                    title: "Успех",
                    text: 'Упаковка успешно удалена',
                    buttons: ["Продолжить", "Завершить"],
                    callback: function (buttonIndex) {
                      if (buttonIndex == 1) {
                        module4lapy.OrdersAssemblyBarCodeScanner.scanner(order_id, true)
                      }
                    }
                  });
                } else {
                  app.alert({
                    title: "Ошибка",
                    text: JSON.stringify(resp['errorText'])
                  });
                }
                document.getElementById('loader').className = "progress__bar hidden";
              },
            );
          } else {
            console.log('подготовка к отправке BX аякс гет, в блоке елс');
            BX.ajax.get(
              'index.php',
              {
                order_id: order_id,
                barScan: data.text
              },
              (resp) => {
                console.log(resp  + 'resp получен');
                resp = JSON.parse(resp);
                if (resp['result'] === true) {
                  //Показываем кнопку завершения сборки сразу после первого успешного сканирования
                  if (typeof resp['showFinalButton'] === 'undefined' || resp['showFinalButton'] !== 'N') {
                    document.getElementById("finalButton").style.display = "block";
                  }
    
                  if (typeof resp['newValues'] !== 'undefined' && typeof resp['newValues']['id'] !== 'undefined') {
                    var cell = document.getElementById(resp['newValues']['id']);
                    var row = cell.parentElement;
                    cell.innerText = resp['newValues']['value'];
                    if (typeof resp['newValues']['full'] !== 'undefined') {
                      if (resp['newValues']['full']) {
                        row.classList.remove('orange');
                        row.classList.add('green');
                      } else {
                        row.classList.add('orange');
                      }
                    }
                  }
    
                  if (typeof resp['slots'] !== 'undefined') {
                    $("#addSlotButton")[0].textContent = 'Транспортных мест: ' + resp['slots'];
                  }
                  if (typeof resp['orderFull'] !== 'undefined') {
                    $('#finalButton input').attr('data-full', resp['orderFull']);
                  }
    
                  //Если общий статус заказа равен F, т.е. собран полностью, запрещаем сканирование
                  //и прячем кнопку
                  if (typeof resp['status'] !== 'undefined' && resp['status'] === 'F') {
                    var rowCollection = document.getElementsByClassName("item-row");
                    for (var i = 0; i < rowCollection.length; i++) {
                      rowCollection[i].onclick = null;
                    }
                    // document.getElementById("scanButton").style.display = "none";
                  } else {
                    //Если заказ еще не полон - выводим конфирм с успехом сканирования и вариантами
                    app.confirm({
                      title: "Успех",
                      text: 'Товар успешно отсканирован',
                      buttons: ["Продолжить", "Завершить"],
                      callback: function (buttonIndex) {
                        if (buttonIndex == 1) {
                          module4lapy.OrdersAssemblyBarCodeScanner.scanner(order_id)
                        }
                      }
                    });
                  }
                } 
                else {
                    console.log('пред последний элс');
                 
  
                  // let home = {
                  //   title: "Ошибка",
                  //   text: JSON.stringify(resp['errorText'])
                  // }
              //     BX.addCustomEvent("customAlert", function(){
              //       console.log(app)
              //       // console.log(app.alert)
               
              //       app.alert({text: 'Test alert app', button: 'OK!'})
               
              // });
              // let event = new Event("customAlert", {bubbles: true}); // (2)
              // window.dispatchEvent(event);
                  console.log(navigator)
                  console.log(navigator.notification)
                  // console.log(app)
                  // console.log(app.alert)
                  // navigator.notification.alert('test alert!', function (){}, '', '')
                  app.alert({text: 'Test alert app', button: 'OK!'})
                }
                document.getElementById('loader').className = "progress__bar hidden";
              },
            );
          }
    
          
        } else {
            console.log('последний элс');

        // let home = {
        //     text: "Ошибка сканирования",
        //     button: "OK"
        //   }
        navigator.notification.alert('test alert!', function (){}, '', '')
          // alert(Object.entries(home).join('\n'));
        }
      }
     
     }
        
  };
  /* End OrdersAssemblyBarCodeScanner */