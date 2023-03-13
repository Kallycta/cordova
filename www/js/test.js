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
          document.getElementById('loader').className = "progress__bar";
    
          if (remove_bandle) {
            BX.ajax.get(
              'index.php',
              {
                order_id: order_id,
                barScan: data.text,
                remove_bandle: remove_bandle
              },
              (resp) => {
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
            BX.ajax.get(
              'index.php',
              {
                order_id: order_id,
                barScan: data.text
              },
              (resp) => {
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
                } else {
                  app.alert({
                    title: "Ошибка",
                    text: JSON.stringify(resp['errorText'])
                  });
                }
                document.getElementById('loader').className = "progress__bar hidden";
              },
            );
          }
    
          
        } else {
          app.alert({
            text: "Ошибка сканирования",
            button: "OK"
          });
        }
      }
     
     }
        
  };
  /* End OrdersAssemblyBarCodeScanner */