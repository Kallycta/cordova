
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

  /* OrdersAssemblyBarCodeScanner */
  function OrdersAssemblyBarCodeScanner() {
    // Наследуем свойства и методы от General
    General.call(this);
  }

  OrdersAssemblyBarCodeScanner.prototype.scanner = function (order_id, remove_bandle = false) {
    BXMobileApp.UI.BarCodeScanner.open({
      callback: function (data) {
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
    });
  };
  /* End OrdersAssemblyBarCodeScanner */