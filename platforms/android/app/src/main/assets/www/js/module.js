(function (args) {
	'use strict'

	var exports = {}
	var _window = args.window
	var _document = args.document
	var $ = args.jQuery
	var BX = args.BX
	var BXMobileApp = args.BXMobileApp
	var general = new General()

	/* *** Constructors *** */

	function General() {
		var self = this

		self.uri = _window.location.protocol + '//' + _window.location.host
		self.pathname = _window.location.pathname
		self.listUrl = {}
		self.mobile = false
		self.mobileAppRoot = 'mobile_app'

		self.objErrors = {}
	}

	/**
	 * @constructor
	 */
	function Module() {
		// Наследуем свойства и методы от General
		General.call(this)

		var self = this

		self.indexFile = 'index.php'
		self.logoutFile = 'services/logout/logout.php'

		// Locations
		self.financeLocation = '/' + self.mobileAppRoot + '/finance/index.php'
		self.personalLocation = '/' + self.mobileAppRoot + '/company/personal.php'
		self.phonebookLocation = '/' + self.mobileAppRoot + '/company/telephones.php'
		self.searchLocation = '/' + self.mobileAppRoot + '/search/index.php'
		self.checkVsdLocation = '/' + self.mobileAppRoot + '/check_vsd/index.php'

		// Scripts
		self.financeScript = '/local/client/app/js/mobile_app/finance.js?290618_1800'
		self.personalScript = '/local/client/app/js/mobile_app/personal.js?02072018_1045'
		self.phonebookScript = '/local/client/app/js/mobile_app/phonebook.js?290618_1800'
		self.searchScript = '/local/client/app/js/mobile_app/search.js?290618_1800'
		self.checkVsdScript = '/local/client/app/js/mobile_app/checkVsd'
		// WhiteList
		self.listUrl['*://corp1.4lapy.ru/*'] = true
		self.listUrl['*://corp2.4lapy.ru/*'] = true
		self.listUrl['*://4lapy.ru/*'] = true
	}

	// Наследуем методы от General.prototype
	Module.prototype = Object.create(General.prototype)

	/**
	 * @constructor
	 */
	function TopBar() {
		// Наследуем свойства и методы от General
		General.call(this)
	}

	// Наследуем методы от General.prototype
	TopBar.prototype = Object.create(General.prototype)

	/**
	 * @constructor
	 */
	function Menu() {
		// Наследуем свойства и методы от General
		General.call(this)

		var self = this

		self.indexFile = 'index.php'
		self.menuSettingFile = 'services/menu/menu_settings.php'


		self.btnSaveSettingsSelector = '#save-settings'
		self.editMenuSelector = '#list-menu'
		self.editNotifySelector = '#list-notify'
		self.itemMenuSelector = '.menu-item'
		self.itemNotifySelector = '.notify-item'
		self.upArrowSelector = '.to-top > svg'
		self.downArrowSelector = '.to-bot > svg'
		self.footerMobileMenuSelector = '.mobile-footer'
		self.clientJsonSettings = {}
	}

	// Наследуем методы от General.prototype
	Menu.prototype = Object.create(General.prototype)

	/**
	 * @constructor
	 */
	function PullPush() {
		// Наследуем свойства и методы от General
		General.call(this)

		var self = this

		self.appId = 'ru.chetyrelapy.live.app'
		self.pullFile = 'services/push/pull.php'
		self.pushFile = 'services/push/push.php'
		//if (_window.platform === 'APPLE' || _window.platform === 'ios')
		if (
			( _window.platform === 'APPLE' || _window.platform === 'ios' )
			// &&
			// ( window.push_test ? ( window.userId  && ( window.userId === 72328 ) ) : true )
		)
		{
			self.appId = 'ru.corp.4lapy.app';
		}
	}

	// Наследуем методы от General.prototype
	PullPush.prototype = Object.create(General.prototype)

	/**
	 * @constructor
	 */
	function Files() {
		// Наследуем свойства и методы от General
		General.call(this)

		var self = this

		self.options = {
			allowEdit: true,
			// Some common settings are 20, 50, and 100
			quality: 50,
			// Corrects Android orientation quirks
			correctOrientation: true
		}

		self.multiple = false

		self.errorMessages = {
			'CAMERA_NOT_FOUND': 'Camera is not defined',
			'IMAGE_REQUIRED': 'Unable to obtain picture',
			'INTERNET_ERROR': 'Нет подключения'
		}

		self.formNamesIgnore = {}

		self.callBackResult = function (args) {

		}

		self.callBackFunctionResult = function (domElement, methodName) {

		}

		self.onBeforeSubmittingForm = function (formElement) {
			return true
		}

		self.submitFormUrl = null

		self.browseElementSelector = '.browse-files'
		self.progressBarElementSelector = '.progress__bar'
	}

	// Наследуем методы от General.prototype
	Files.prototype = Object.create(General.prototype)

	/* *** General *** */

	/**
	 * Метод для инициализации общего модуля
	 *
	 * @constructor
	 */
	General.prototype.Init = function () {
		var self = this

		self.mobile = self.isMobile()
		self.androidVersion = self.getAndroidVersion()
	}

	/**
	 * Метод для определения мобильного устройства
	 *
	 * @returns {boolean}
	 */
	General.prototype.isMobile = function () {
		var platform = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
		var isMobile = platform.test(navigator.userAgent)

		return (isMobile && BXMobileApp)
	}

	/**
	 * Метод для получения версии Android
	 *
	 * @returns {any}
	 */
	General.prototype.getAndroidVersion = function () {
		var userAgent = navigator.userAgent.toLowerCase()
		var match = userAgent.match(/android\s([0-9/.]*)/)

		return match ? Math.round(parseFloat(match[1])) : false
	}

	/**
	 * Метод для перехода на страницу по определённой ссылке
	 *
	 * @param {string} url - ссылка для перехода по нажатию на элемент
	 * @param {string} method - способ загрузки страницы..
	 */
	General.prototype.openPage = function (url, method) {
		if (url && typeof url === 'string' && url !== '' && BXMobileApp) {
			if (method === undefined || method !== 'PageBlank') {
				method = 'PageStart'
			}

			switch (method) {
				case 'PageStart':
					// Загружаем страницу по url в качестве стартовой в навигационной цепочке
					// Перед этим очищается вся цепочка открытых экранов и очищается история переходов.
					BXMobileApp.PageManager.loadPageStart({
						url: url
					})
					break
				case 'PageBlank':
					// Загружаем страницу по url с добавлением нового экрана\страницы к текущей навигационной цепочке с переданным адресом, заголовком и параметрами.
					BXMobileApp.PageManager.loadPageBlank({
						url: url
					})
					break
			}
		}
	}

	/**
	 * Метод для открытия ссылки через адресную строку
	 *
	 * @param {string} url - ссылка
	 * @param {number} second - время в ms, через которое произойдёт редирект
	 * @returns {boolean}
	 */
	General.prototype.openAddress = function (url, second) {
		if (url && typeof url === 'string' && url !== '') {
			if (second === undefined) {
				second = 0
			} else if (typeof second !== 'number') {
				return false
			}

			setTimeout(function () {
				_window.location.href = url
			}, second)
		}

		return false
	}

	/**
	 * Метод для открытия ссылки в окне
	 *
	 * @param {string} url - ссылка
	 * @param {string} target - имя окна
	 * @returns {boolean}
	 */
	General.prototype.openUrl = function (url, target) {
		if (url && typeof url === 'string' && url !== '') {
			if (target === '') target = '_blank'

			_window.open(url, target)
		}

		return false
	}

	/**
	 * Метод для закрытия текущей страницы в приложении bitrix-mobile
	 */
	General.prototype.comeBack = function () {
		var self = this

		if (self.mobile) {
			BXMobileApp.UI.Page.close({drop: true})
		} else {
			_window.history.back()
		}
	}

	/**
	 * Метод для вывода текстового сообщения
	 *
	 * @param {string|number} message - текстовое сообщение
	 */
	General.prototype.alert = function (message) {
		var self = this

		if (self.mobile && message) {
			if (_window.app && typeof _window.app.alert === 'function') {
				_window.app.alert(message)
			} else {
				_window.alert(message)
			}
		}
	}

	/**
	 * Метод для подключения JavaScript-файла
	 *
	 * @param {string} url - ссылка на скрипт
	 */
	General.prototype.addHeadScript = function (url) {
		if (url && typeof url === 'string' && url !== '') {
			var doc = _document
			var scriptElement = doc.createElement('script')

			scriptElement.src = url
			doc.head.appendChild(scriptElement)
		}
	}

	/* *** Module *** */

	/**
	 * Метод для инициализации главного модуля
	 *
	 * @constructor
	 */
	Module.prototype.Init = function () {
		var self = this
		var urls = ''

		if (self.mobile) {
			// Добавляем ссылки в белый список приложения
			if (BXMobileApp.PageManager) {
				for (var url in self.listUrl) {
					urls += url + ';'
				}

				BXMobileApp.PageManager.setWhiteList(urls)
			}

			switch (self.pathname) {
				case self.financeLocation:
					self.addHeadScript(self.financeScript)
					break
				case self.personalLocation:
					self.addHeadScript(self.personalScript)
					break
				case self.phonebookLocation:
					self.addHeadScript(self.phonebookScript)
					break
				case self.searchLocation:
					self.addHeadScript(self.searchScript)
					break
				case self.checkVsdLocation://il
					self.addHeadScript(self.checkVsdScript)
					break
			}
		}
	}

	/**
	 * Метод для получения и открытия SDO-ссылки
	 *
	 * @param {string} url - ссылка
	 */
	Module.prototype.openSdoLink = function (url) {
		var self = this

		if ($ && url && typeof url === 'string' && url !== '') {
			$.ajax({
				url: self.uri + '/' + url,
				type: 'GET',
				success: function (link) {
					self.openPage(link, 'PageBlank')
				}
			})
		}
	}


	/**
	 * Метод для выполнения операции разлогинирования текущего пользователя
	 */
	Module.prototype.logout = function () {
		var self = this

		BX.ajax({
			url: self.logoutFile,
			method: 'POST',
			dataType: 'json',
			data: {'logout': 'Y'},
			timeout: 30,
			onsuccess: function (result) {

				if (result && result['IS_AUTHORIZED'] && result['IS_AUTHORIZED'] === 'N') {
					// Загружаем стартовую страницу
					self.openPage(self.mobileAppRoot + '/' + self.indexFile)
				}
			}
		})
	}

	//qrScaner on check_vsd
	function qrScanner() {
		// Наследуем свойства и методы от General
		General.call(this);
	}

	qrScanner.prototype.scanner = function () {
		BXMobileApp.UI.BarCodeScanner.open({
			callback: function (data) {
				if (data.text) {
					let qrInner = args.document.getElementById("qrInner");
					let message = args.document.getElementById("mes");
					let open = args.document.getElementById("open");
					let withNumber = args.document.getElementById("withNumber");
					qrInner.innerText = "";
					message.innerText = "";
					withNumber.innerText = "";
					open.href = "";
					let err = args.document.getElementById("err");
					err.innerText = "";
					document.getElementById('loader').className = "progress__bar";
					BX.ajax.get(
						'index.php',
						{qrScan: data.text},
						(resp) => {
							let img = args.document.getElementById("img");
							let div = args.document.getElementById("final");
							if (div.style.display == "none") {
								div.style.display = "block";
							}
							resp = JSON.parse(resp);
							if (resp['uuid']) {
								if (resp['message'] == "корректна") {
									let qrInner = args.document.getElementById("qrInner");
									let message = args.document.getElementById("mes");
									let open = args.document.getElementById("open");
									let withNumber = args.document.getElementById("withNumber");
									qrInner.innerText = "" + resp["uuid"];
									message.innerText = "" + resp["message"];
									withNumber.innerText = "" + resp["withNumber"];
									open.href = resp['href'];
									args.document.getElementById("showQr").style.display = "block";
									img.src = '/local/client/img/valid.png';
								} else {
									let qrInner = args.document.getElementById("qrInner");
									let message = args.document.getElementById("mes");
									let withNumber = args.document.getElementById("withNumber");
									qrInner.innerText = "" + resp["uuid"];
									message.innerText = "" + resp["message"];
									withNumber.innerText = "" + resp["withNumber"];
									img.src = '/local/client/img/not_valid.png';
								}
								let scnQr = args.document.getElementById("scnQrErr");
								scnQr.style.display = "none";
							} else {
								let err = args.document.getElementById("err");
								err.innerText = "" + resp["error"];
								args.document.getElementById("showQr").style.display = "none";
								img.src = '/local/client/img/not_valid.png';
								let scnQr = args.document.getElementById("scnQrErr");
								scnQr.style.display = "none";
							}
							document.getElementById('loader').className = "progress__bar hidden";
						},
					);
				} else {
				}
			},
		});
	};
	//qrScanner on check_vsd

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

	/* *** TopBar *** */

	/**
	 * Метод для скрытия шапки приложения
	 *
	 * @returns {TopBar}
	 */
	TopBar.prototype.hideTopBar = function () {
		var self = this;

		try {
			if (self.mobile) {
				BXMobileApp.UI.Page.TopBar.hide();
			}
		} catch (e) {
			self.objErrors['TopBar.hideTopBar'] = e;
		}

		return self
	};

	/**
	 * Метод для отображения шапки приложения
	 *
	 * @returns {TopBar}
	 */
	TopBar.prototype.showTopBar = function () {
		var self = this;

		try {
			if (self.mobile) {
				BXMobileApp.UI.Page.TopBar.show();
			}
		} catch (e) {
			self.objErrors['TopBar.showTopBar'] = e;
		}

		return self;
	};

	/**
	 * Метод для добавления правой кнопки на навигационную панель
	 *
	 * @param {string} nameButton - название кнопки
	 * @param {string} url - ссылка для перехода по нажатию на кнопку
	 * @param {string} typeIcon - тип иконки
	 * @param {string|number|null} badgeCode - идентификатор для бейджа
	 * @returns {TopBar}
	 */
	TopBar.prototype.addRightButton = function (nameButton, url, typeIcon, badgeCode) {
		var self = this;

		try {
			if (self.mobile && nameButton && typeof nameButton === 'string' && nameButton !== '' && url && typeof url === 'string' && url !== '' && typeIcon && typeof typeIcon === 'string' && typeIcon !== '' && (typeof badgeCode === 'string' || typeof badgeCode === 'number' || badgeCode === null)) {
				BXMobileApp.UI.Page.TopBar.addRightButton({
					name: nameButton,
					callback: function () {
						// Открытие url страницы
						self.openPage(url, 'PageBlank');
					},
					type: typeIcon,
					badgeCode: badgeCode
				})
			}
		} catch (e) {
			self.objErrors['TopBar.addRightButton'] = e
		}

		return self;
	};

	/**
	 * Метод для добавления изображения к заголовку на верхней панели
	 *
	 * @param {string} imageUrl - путь до изображения
	 * @returns {TopBar}
	 */
	TopBar.prototype.setTitleImage = function (imageUrl) {
		var self = this;

		try {
			if (self.mobile && imageUrl && typeof imageUrl === 'string' && imageUrl !== '') {
				BXMobileApp.UI.Page.TopBar.title.setImage(imageUrl)
			}
		} catch (e) {
			self.objErrors['TopBar.setTitleImage'] = e;
		}

		return self;
	}

	/**
	 * Метод для добавления текста к заголовку на верхней панели
	 *
	 * @param {string} textTitle - текст заголовка
	 * @returns {TopBar}
	 */
	TopBar.prototype.setTitle = function (textTitle) {
		var self = this;

		try {
			if (self.mobile && textTitle && typeof textTitle === 'string' && textTitle !== '') {
				BXMobileApp.UI.Page.TopBar.title.setText(textTitle);

				BXMobileApp.UI.Page.TopBar.setColors({
					background:"#EFEFEF",
					titleText: "#1D1D1B",
				});
			}
		} catch (e) {
			self.objErrors['TopBar.setTitle'] = e;
		}

		return self
	}

	/**
	 * Метод для скрытия заголовка на верхней панели
	 *
	 * @returns {TopBar}
	 */
	TopBar.prototype.hideTitle = function () {
		var self = this;

		try {
			if (self.mobile) {
				BXMobileApp.UI.Page.TopBar.title.hide();
			}
		} catch (e) {
			self.objErrors['TopBar.hideTitle'] = e;
		}

		return self;
	}

	/**
	 * Метод для отображения заголовка на верхней панели
	 *
	 * @returns {TopBar}
	 */
	TopBar.prototype.showTitle = function () {
		var self = this;

		try {
			if (self.mobile) {
				BXMobileApp.UI.Page.TopBar.title.show();
			}
		} catch (e) {
			self.objErrors['TopBar.showTitle'] = e;
		}

		return self;
	}

	/**
	 * Метод для установки события перехода по url-адресу при клике на заголовок приложения
	 *
	 * @param {string} url - ссылка для перехода
	 * @returns {TopBar}
	 */
	TopBar.prototype.setUrlTitle = function (url) {
		var self = this

		try {
			if (self.mobile) {
				BXMobileApp.UI.Page.TopBar.title.setCallback(function () {
					// Открытие url страницы
					self.openPage(url)
				})
			}
		} catch (e) {
			self.objErrors['TopBar.setUrlTitle'] = e
		}

		return self
	}

	/* *** Menu *** */

	/**
	 * Метод инициализации модуля Menu
	 *
	 * @constructor
	 */
	Menu.prototype.Init = function () {
		var self = this

		if (self.mobile) {
			self.footerMobileMenuElement = $(self.footerMobileMenuSelector)

			initEditMenuFunction.call(self)
			initEditNotifyFunction.call(self)
			setActiveLinkStatusInit.call(self)
			app.enableSliderMenu(true)
		}
	}

	/**
	 * Метод для инициализации функции редактирования меню
	 */
	function initEditMenuFunction() {
		var self = this
		var itemsMenu = null
		var upArrowButton = null
		var downArrowButton = null

		self.editMenuElement = $(self.editMenuSelector)

		if (self.editMenuElement.length !== 0) {
			itemsMenu = self.editMenuElement.find(self.itemMenuSelector)
			upArrowButton = $(self.upArrowSelector)
			downArrowButton = $(self.downArrowSelector)

			if (itemsMenu.length !== 0 && upArrowButton.length !== 0 &&
				downArrowButton.length !== 0) {
				itemsMenu.click(function (e) {
					var currentElement = e.target || e.srcElement
					var _this = $(this)
					var id = 0
					var itemElement = null
					var hidden = 'Y'
					var currentUpArrowButton = null
					var currentDownArrowButton = null

					if (currentElement.nodeName === 'INPUT' &&
						currentElement.type === 'checkbox') {
						if (this.hasAttribute('id')) {
							id = this.getAttribute('id')
							itemElement = _this.closest(self.itemMenuSelector)
							currentUpArrowButton = _this.find(self.upArrowSelector)
							currentDownArrowButton = _this.find(self.downArrowSelector)

							if (currentUpArrowButton.length !== 0 &&
								currentDownArrowButton.length !== 0) {
								if (currentElement.checked) {
									hidden = 'N'

									setTimeout(function () {
										self.editMenuElement.prepend(itemElement)
									}, 1000)

									currentUpArrowButton.attr('visibility', 'visible')
									currentDownArrowButton.attr('visibility', 'visible')
								} else {
									setTimeout(function () {
										self.editMenuElement.append(itemElement)
									}, 1000)

									currentUpArrowButton.attr('visibility', 'visible')
									currentDownArrowButton.attr('visibility', 'visible')
								}
							}

							createClientJsonSettings.apply(self,
								[{'id': id, 'hidden': hidden}])
						}
					}
				})

				upArrowButton.click(function () {
					var itemElement = $(this).closest(self.itemMenuSelector)

					if (itemElement.length !== 0) {
						// Перемещаем текущий пункт меню вместо вышележащего элемента
						itemElement.prev().before(itemElement)
					}
				})

				downArrowButton.click(function () {
					var itemElement = $(this).closest(self.itemMenuSelector)

					if (itemElement.length !== 0) {
						// Перемещаем текущий пункт меню вместо нижележащего элемента
						itemElement.next().after(itemElement)
					}
				})
			}
		}
	}

	/**
	 * Метод для инициализации функции редактирования меню
	 */
	function initEditNotifyFunction() {
		var self = this
		var btnSaveSettings = $(self.btnSaveSettingsSelector)
		var itemsMenu = null

		self.editNotifyElement = $(self.editNotifySelector)

		if (self.editNotifyElement.length !== 0) {
			itemsMenu = self.editNotifyElement.find(self.itemNotifySelector)

			if (itemsMenu.length !== 0) {
				itemsMenu.click(function (e) {
					var currentElement = e.target || e.srcElement
					var _this = $(this)
					var id = 0
					var itemElement = null
					var hidden = 'Y'

					if (currentElement.nodeName === 'INPUT' &&
						currentElement.type === 'checkbox') {
						if (this.hasAttribute('id')) {
							id = this.getAttribute('id')
							itemElement = _this.closest(self.itemNotifySelector)

							if (currentElement.checked) {
								hidden = 'N'

								setTimeout(function () {
									self.editNotifyElement.prepend(itemElement)
								}, 1000)
							} else {
								setTimeout(function () {
									self.editNotifyElement.append(itemElement)
								}, 1000)
							}

							createClientJsonSettings.apply(self,
								[{'id': id, 'hidden': hidden}])
						}
					}
				})
			}
		}

		if (btnSaveSettings.length !== 0) {
			btnSaveSettings.click(function () {
				getSortItemsMenu.call(self, self.editMenuElement.find(self.itemMenuSelector))
				getSortItemsMenu.call(self, self.editNotifyElement.find(self.itemNotifySelector))
				sendParameters.apply(self, [
					function () {
						// Загружаем стартовую страницу
						self.openPage(self.mobileAppRoot + '/' + self.indexFile)
					}])
			})
		}
	}

	/**
	 * Метод для генерации JSON-настроек меню
	 *
	 * @param {object} args - параметры меню
	 */
	function createClientJsonSettings(args) {
		var self = this

		if (args.id && args.id !== null) {
			if (!self.clientJsonSettings[args.id]) {
				self.clientJsonSettings[args.id] = {}
			}

			if (args.hidden !==
				undefined) self.clientJsonSettings[args.id]['HIDDEN'] = args.hidden
			if (args.sort !==
				undefined) self.clientJsonSettings[args.id]['SORT'] = args.sort
		}
	}

	/**
	 * Метод для получения новых данных сортировки меню и сохранения их в объект конфигурации
	 */
	function getSortItemsMenu(itemsMenu) {
		var self = this
		var id = 0

		if (itemsMenu.length !== 0) {
			itemsMenu.each(function (index, element) {
				if (element.hasAttribute('id')) {
					id = element.getAttribute('id')

					createClientJsonSettings.apply(self, [{'id': id, 'sort': ++index}])
				}
			})
		}
	}

	/**
	 * Метод для отправки параметров меню на сервер
	 *
	 * @param {function} callBackFunction - Функция обратного вызова
	 */
	function sendParameters(callBackFunction) {
		var self = this

		if (BX) {
			BX.ajax({
				url: self.menuSettingFile,
				method: 'POST',
				data: {'SETTINGS': self.clientJsonSettings},
				timeout: 30,
				onsuccess: callBackFunction
			})
		}
	}

	/**
	 * Метод для добавления к активному пункту меню в футере класс active
	 */
	function setActiveLinkStatusInit() {
		var self = this

		if (self.footerMobileMenuElement.length) {
			var links = self.footerMobileMenuElement.find('A')
			var linkPathName = null
			var locationPathName = self.pathname

			if (links.length) {
				// Удаляем все классы с ссылок active
				links.removeClass('active')

				links.each(function (index, element) {
					if (element.nodeName === 'A') {
						linkPathName = element.pathname

						// Если pathname текущей ссылки совпадает с pathname URL
						if (linkPathName === locationPathName) {
							// То к текущей ссылке добавляем класс active
							element.className += ' active'
						}
					}
				})
			}
		}
	}

	/* *** PullPush *** */

	/**
	 * Метод инициализации модуля PullPush
	 *
	 * @constructor
	 */
	PullPush.prototype.Init = function () {
		var self = this

		try {
			if (self.mobile) {
				BX.addCustomEvent('UIApplicationDidBecomeActiveNotification', function () {
					self.redirect(self.getParams())
				})

				self.redirect(self.getParams())

				pushInit.call(self)
			}
		} catch (e) {
			self.objErrors['PullPush.Init'] = e
		}
	}

	/**
	 * Метод для инициализации механизма push
	 *
	 * @returns {*}
	 */
	function pushInit() {
		var self = this
		var resultData

		try {
			resultData = _window.app.exec('getToken', {
				callback: function (token) {
					var platform = (_window.platform === 'ios' ? 'APPLE' : 'GOOGLE')
					var deviceName = (typeof _window.device.name === 'undefined'
						? _window.device.model
						: _window.device.name)

					var postData = {
						action: 'save_device_token',
						device_type: platform,
						device_name: deviceName,
						device_token: token,
						uuid: _window.device.uuid,
						app_id: self.appId,
						sessid: BX.bitrix_sessid()
					}

					var config = {
						url: self.pullFile,
						method: 'POST',
						dataType: 'json',
						data: postData,
						timeout: 30,
						onsuccess: function (result) {
							if (result['ERROR']) {
								console.error('Function: PullPush.pushInit | ERROR: ' +
									result['ERROR'])
							} else if (result['RESPONSE'] &&
								result['RESPONSE']['token_status']) {
								console.info('Function: PullPush.pushInit | TOKEN_STATUS: ' +
									result['RESPONSE']['token_status'])
							}
						}
					}

					BX.ajax(config)
				}
			})
		} catch (e) {
			self.objErrors['PullPush.pushInit'] = e
		}

		return resultData
	}

	/**
	 * Метод для получения push-параметров с сервера
	 */
	PullPush.prototype.getParams = function () {
		var self = this
		var pushData = {}
		var pushParams = {}

		try {
			pushData = BXMobileApp.PushManager.getLastNotification()
			pushParams = BXMobileApp.PushManager.prepareParams(pushData)
		} catch (e) {
			self.objErrors['PullPush.getParams'] = e
		}

		return pushParams
	}

	/**
	 * Метод для выполнения редиректа в определенный раздел push-уведомления
	 *
	 * @param {object} pushParams - Push-параметры
	 */
	PullPush.prototype.redirect = function (pushParams) {
		var self = this

		if (typeof pushParams === 'object') {
			if (pushParams['params'] && pushParams['params']['redirect']) {
				if (pushParams['params']['type'] && pushParams['params']['type'] === 'URL') {
					self.openAddress(pushParams['params']['redirect'])
				} else {
					self.openPage(self.mobileAppRoot + '/' + pushParams['params']['redirect'], 'PageBlank')
				}
			}
		}
	}

	/* *** Files *** */

	/**
	 * Метод инициализации модуля Files
	 *
	 * @returns {Files}
	 * @constructor
	 */
	Files.prototype.Init = function () {
		var self = this

		try {
			if (self.mobile) {
				if (typeof self.browseElement === 'undefined') {
					self.browseElement = $(self.browseElementSelector)
				}

				if (typeof self.progressBarElement === 'undefined') {
					self.progressBarElement = $(self.progressBarElementSelector)
				}

				self.registerHandlersForm()

				if (typeof self.browseElement !== 'undefined' && self.browseElement.length) {
					self.initHandlers('click', self.browseElement, 'divElement')
				}
			}
		} catch (e) {
			self.objErrors['Files.Init'] = e
		}

		return self
	}

	/**
	 * Метод для регистрации форм
	 */
	Files.prototype.registerHandlersForm = function () {
		var self = this

		try {
			var forms = _document.forms
			var formsLen = forms.length

			for (var i = 0; i < formsLen; i++) {
				var formName = forms[i].name
				var formElement = _document.forms[formName]
				var formElements = null
				var formElementsLen = 0

				for (var keyFormName in self.formNamesIgnore) {
					if (formName.indexOf(keyFormName) !== -1) {
						self.formNamesIgnore[formName] = true
					}
				}

				if (self.formNamesIgnore[formName]) continue

				if (formElement) {
					formElements = formElement.elements
					formElementsLen = formElements.length

					for (var item = 0; item < formElementsLen; item++) {
						if (formElements[item].type === 'file') {
							self.initHandlers('click', formElements[item], 'inputTypeFileElement')

							if (typeof _window.platform !== 'undefined') {
								if (_window.platform === 'ios') {
									self.initHandlers('change', formElements[item], 'inputTypeFileElement')
								}
							}
						}
					}

					self.initHandlers('submit', formElement, 'formElement', {
						'formElements': formElements,
						'formElementsLen': formElementsLen
					})
				}
			}
		} catch (e) {
			self.objErrors['Files.registerHandlersForm'] = e
		}
	}

	/**
	 * Метод для инициализации обработчиков событий
	 *
	 * @param {string} eventName - имя события
	 * @param domElement - DOM-элемент
	 * @param {string} elementName - название DOM-элемента
	 * @param {object} params - параметры
	 * @returns {Files}
	 */
	Files.prototype.initHandlers = function (eventName, domElement, elementName, params) {
		var self = this

		try {
			if (typeof eventName !== 'undefined' && eventName !== '' && typeof domElement !== 'undefined' && domElement && typeof elementName !== 'undefined' && elementName !== '') {
				switch (eventName) {
					case 'click':
						if (elementName === 'inputTypeFileElement') {
							domElement.onclick = function () {
								self.inputTypeFileElement = {
									element: this,
									name: this.name
								}

								if (typeof _window.platform !== 'undefined') {
									if (_window.platform === 'android') {
										self.showBrowseWindow()

										return false
									}
								}
							}
						}

						if (elementName === 'divElement') {
							domElement.click(function () {
								self.hideBrowseWindow()
							})
						}
						break
					case 'change':
						if (elementName === 'inputTypeFileElement') {
							domElement.onchange = function () {
								if (typeof self.callBackFunctionResult === 'function') {
									self.createMultipleMediaFiles(this, self.callBackFunctionResult)
								}
							}
						}
						break
					case 'submit':
						if (elementName === 'formElement') {
							domElement.onsubmit = function () {
								if (typeof self.onBeforeSubmittingForm === 'function') {
									if (!self.onBeforeSubmittingForm(this)) return false
								}

								var formData = new _window.FormData()
								var url = (typeof this.action !== 'undefined' && this.action !== '') ? this.action : self.pathname

								for (var item = 0; item < params.formElementsLen; item++) {
									var element = params.formElements[item]
									var value = ''

									if (element.type === 'file') continue

									if (typeof element.name !== 'undefined' && element.name !== '') {
										if (typeof element.type !== 'undefined' && (element.type === 'checkbox' || element.type === 'radio')) {
											value = (element.checked) ? 'Y' : 'N'
										} else if (typeof element.value !== 'undefined') {
											value = element.value
										}

										formData.append(element.name, value)
									}
								}

								if (typeof self.blobMediaData !== 'undefined') {
									formData = self.addFormDataFiles(formData, self.inputTypeFileElement.name, self.inputTypeFileElement.name, self.blobMediaData)
								}

								self.sendData(url, formData, function (result) {
									if (typeof self.submitFormUrl === 'string' && self.submitFormUrl !== '') {
										_window.location.href = self.submitFormUrl
									} else {
										_window.location.href = self.pathname
									}
								})

								return false
							}
						}
						break
				}
			}
		} catch (e) {
			self.objErrors['Files.initHandlers'] = e
		}

		return self
	}

	/**
	 * Метод для добавления файлов в объект FormData
	 *
	 * @param formData - объект FormData
	 * @param {string} keyName - название ключа добавляемого файла
	 * @param {string} multipleKeyName - названия ключей добавляемых файлов
	 * @param {object} mediaData - медиа данные
	 * @returns {*}
	 */
	Files.prototype.addFormDataFiles = function (formData, keyName, multipleKeyName, mediaData) {
		var self = this

		try {
			if (typeof formData !== 'undefined' && typeof keyName !== 'undefined' && keyName !== '' && typeof multipleKeyName !== 'undefined' && multipleKeyName !== '' && typeof mediaData === 'object') {
				if (typeof mediaData.fileList !== 'undefined' && mediaData.fileList.length === 1) {
					formData.append(keyName, mediaData.fileList[0], mediaData.fileList[0].name);
				} else if (typeof mediaData.fileList === 'undefined' && typeof mediaData.data !== 'undefined') {
					formData.append(keyName, mediaData.data, mediaData.fileName);
				} else {
					var lenFiles = mediaData.fileList.length;
					var file = null;

					for (var index = 0; index < lenFiles; index++) {
						file = mediaData.fileList[index];

						formData.append(multipleKeyName + index, file, file.name);
					}
				}
			}
		} catch (e) {
			self.objErrors['Files.addFormDataFiles'] = e;
		}

		return formData
	}

	/**
	 * Метод для установки параметров
	 *
	 * @param {string} destinationType - Values: FILE_URI | DATA_URL | NATIVE_URI
	 * @param {string} encodingType - Values: JPEG | PNG
	 * @param {string} mediaType - Values: PICTURE | VIDEO | ALLMEDIA
	 * @returns {Files}
	 */
	Files.prototype.setParameters = function (destinationType, encodingType, mediaType) {
		var self = this
		var intDestinationType = 0
		var intEncodingType = 0
		var intMediaType = 0

		try {
			if (!_window.Camera) {
				self.objErrors['ERROR'] = self.errorMessages['CAMERA_NOT_FOUND']
			}

			switch (destinationType) {
				case 'FILE_URI':
					intDestinationType = _window.Camera.DestinationType.FILE_URI
					break
				case 'DATA_URL':
					intDestinationType = _window.Camera.DestinationType.DATA_URL
					break
				case 'NATIVE_URI':
					intDestinationType = _window.Camera.DestinationType.NATIVE_URI
					break
			}

			switch (encodingType) {
				case 'JPEG':
					intEncodingType = _window.Camera.EncodingType.JPEG
					break
				case 'PNG':
					intEncodingType = _window.Camera.EncodingType.PNG
					break
			}

			switch (mediaType) {
				case 'PICTURE':
					intMediaType = _window.Camera.MediaType.PICTURE
					break
				case 'VIDEO':
					intMediaType = _window.Camera.MediaType.VIDEO
					break
				case 'ALLMEDIA':
					intMediaType = _window.Camera.MediaType.ALLMEDIA
					break
			}
		} catch (e) {
			self.objErrors['Files.setParameters'] = e
		}

		self.options.destinationType = intDestinationType
		self.options.encodingType = intEncodingType
		self.options.mediaType = intMediaType

		return self
	}

	/**
	 * Метод для установки дополнительных параметров
	 *
	 * url: https://cordova.apache.org/docs/en/7.x/reference/cordova-plugin-camera/
	 * @param {object} options - дополнительные параметры
	 * @returns {Files}
	 */
	Files.prototype.setOtherOptions = function (options) {
		var self = this

		try {
			if (options && typeof options === 'object') {
				for (var key in options) {
					self.options[key] = options[key]
				}
			}
		} catch (e) {
			self.objErrors['Files.setOtherOptions'] = e
		}

		return self
	}

	/**
	 * Метод для открытия библиотеки устройства
	 *
	 * @param {function} callBackFunc - функция обратного вызова
	 * @returns {*}
	 */
	Files.prototype.openLibrary = function (callBackFunc) {
		var self = this

		try {
			if (!_window.Camera) {
				self.objErrors['ERROR'] = self.errorMessages['CAMERA_NOT_FOUND']
			}

			self.options.sourceType = _window.Camera.PictureSourceType.PHOTOLIBRARY
		} catch (e) {
			self.objErrors['Files.openLibrary'] = e
		}

		return browse.call(self, callBackFunc, 'openLibrary')
	}

	/**
	 * Метод для открытия камеры устройства
	 *
	 * @param {function} callBackFunc - функция обратного вызова
	 * @returns {*}
	 */
	Files.prototype.openCamera = function (callBackFunc) {
		var self = this

		try {
			if (!_window.Camera) {
				self.objErrors['ERROR'] = self.errorMessages['CAMERA_NOT_FOUND']
			}

			self.options.sourceType = _window.Camera.PictureSourceType.CAMERA
		} catch (e) {
			self.objErrors['Files.openCamera'] = e
		}

		return browse.call(self, callBackFunc, 'openCamera')
	}

	/**
	 *
	 * @param {string} parentMethodName - название родительского метода
	 * @param {function} callBackFunc - функция обратного вызова
	 * @returns {{}}
	 */
	function browse(callBackFunc, parentMethodName) {
		var self = this

		try {
			navigator.camera.getPicture(function cameraSuccess(fileData) {
				if (callBackFunc && typeof callBackFunc === 'function') {
					self.fileData = fileData;
					self.blobMediaData = undefined;

					callBackFunc(null, parentMethodName);
				}
			}, function cameraError(error) {
				self.objErrors['ERROR_BROWSE'] = self.errorMessages['IMAGE_REQUIRED'] + ': ' + error;
			}, self.options);
		} catch (e) {
			self.objErrors['browse'] = e;
		}
	}

	/**
	 * Метод для формирования медиа-файла
	 *
	 * @param {string} mediaType - MIME-тип
	 * @param {string} name - имя файла
	 * @param {function} callBackFunc - функция обратного вызова
	 */
	Files.prototype.createMediaFile = function (mediaType, name, callBackFunc) {
		var self = this

		try {
			var mimeType = (typeof mediaType === 'string' && mediaType !== '') ? mediaType : ''
			var fileName = (typeof name === 'string' && name !== '') ? name : (mimeType !== '') ? 'tmp.' + mediaType.replace(/^\w+\//, '') : 'tmp.tmp'

			if (self.fileData && callBackFunc && typeof callBackFunc === 'function') {
				if (self.options.destinationType === 0) {
					self.base64Data = 'data:' + mimeType + ';base64,' + self.fileData

					self.blobMediaData = {
						'data': dataURItoBlob.call(self, self.base64Data),
						'fileName': fileName
					}

					if (typeof self.callBackResult === 'function') {
						self.callBackResult({
							// 'fileData': self.fileData,
							// 'base64Data': self.base64Data,
							'blobMediaData': self.blobMediaData,
							'inputTypeFileElement': self.inputTypeFileElement
						})
					}

					callBackFunc(self.inputTypeFileElement)
				} else {
					// TODO: It is necessary to complete the processing of data
				}
			}
		} catch (e) {
			self.objErrors['Files.createMediaFile'] = e
		}
	}

	/**
	 * Метод для формирования коллекции файлов
	 *
	 * @param inputElement - DOM-элемент
	 * @param {function} callBackFunc - функция обратного вызова
	 */
	Files.prototype.createMultipleMediaFiles = function (inputElement, callBackFunc) {
		var self = this

		try {
			if (inputElement && callBackFunc && typeof callBackFunc === 'function') {
				if (typeof self.inputTypeFileElement === 'object') {
					// if (typeof self.inputTypeFileElement.fileList === 'undefined') {
					self.inputTypeFileElement.fileList = (inputElement.files.length) ? inputElement.files : undefined
					// }
				}

				self.addMultipleFiles();

				callBackFunc(self.inputTypeFileElement)
			}
		} catch (e) {
			self.objErrors['Files.createMultipleMediaFiles'] = e
		}
	}

	/**
	 * Метод для конвертирования base64 в файл
	 *
	 * @param {string} dataURI - данные в формате base64
	 * @returns {Blob}
	 */
	function dataURItoBlob(dataURI) {
		var self = this

		try {
			// convert base64/URLEncoded data component to raw binary data held in a string
			var byteString = (dataURI.split(',')[0].indexOf('base64') >= 0) ? _window.atob(dataURI.split(',')[1]) : _window.unescape(dataURI.split(',')[1])
			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
			// write the bytes of the string to a typed array
			var arData = new Uint8Array(byteString.length)

			for (var i = 0; i < byteString.length; i++) {
				arData[i] = byteString.charCodeAt(i)
			}

			return new _window.Blob([arData], {type: mimeString})
		} catch (e) {
			self.objErrors['dataURItoBlob'] = e
		}

		return new _window.Blob()
	}

	/**
	 * Метод для добавления файлов в объект blobMediaData
	 */
	Files.prototype.addMultipleFiles = function () {
		var self = this

		try {
			if (typeof self.inputTypeFileElement.fileList !== 'undefined') {
				if (typeof self.blobMediaData === 'object') {
					self.blobMediaData.fileList = self.inputTypeFileElement.fileList;
				} else {
					self.blobMediaData = {
						'fileList': self.inputTypeFileElement.fileList
					}
				}

				self.blobMediaData.data = self.blobMediaData.fileList[0];
				self.blobMediaData.fileName = self.blobMediaData.fileList[0].name.split(/(\\|\/)/g).pop();;

				self.fileData = undefined;

				if (typeof self.callBackResult === 'function') {
					self.callBackResult({
						'blobMediaData': self.blobMediaData,
						'inputTypeFileElement': self.inputTypeFileElement
					})
				}
			}
		} catch (e) {
			self.objErrors['addMultipleFiles'] = e;
		}
	}

	/**
	 * Метод для отпраки данных (объекта FormData) на сервер
	 *
	 * @param {string} url - ссылка для отправки данных
	 * @param {FormData} formData - данные формы
	 * @param {function} callBackFunc - функция обратного вызова
	 */
	Files.prototype.sendData = function (url, formData, callBackFunc) {
		var self = this

		try {
			if (url && typeof url === 'string' && url !== '' && typeof formData === 'object' && callBackFunc && typeof callBackFunc === 'function') {
				if (typeof $ !== 'undefined') {
					// Отправка на сервер
					$.ajax({
						url: url,
						data: formData,
						type: 'POST',
						timeout: 15000,
						cache: false,
						contentType: false,
						processData: false,
						beforeSend: function (XMLHttpRequest) {
							self.showProgressBarWindow()
						},
						complete: function (XMLHttpRequest) {
							self.hideProgressBarWindow()
						},
						error: function (jqXHR, textStatus, errorThrown) {
							self.objErrors['Files.sendData.AJAX'] = 'ERROR: ' + textStatus
							self.showInternetError()
						}
					}).done(function (data) {
						callBackFunc(data)
					})
				}
			}
		} catch (e) {
			self.objErrors['Files.sendData'] = e
		}
	}

	/**
	 * Метод для открытия окна загрузки изображений с устройства
	 *
	 * @param {function} callBackFunc - функция обратного вызова
	 * @returns {boolean}
	 */
	Files.prototype.openImageToUpload = function (callBackFunc) {
		var self = this

		if (callBackFunc && typeof callBackFunc === 'function') {
			if (!self.multiple || self.androidVersion === 4) {
				_window.event.preventDefault()

				self.openLibrary(callBackFunc)
			}
		}
	}

	/**
	 * Метод для показа/скрытия окна выбора запуска камеры или библиотеки устройства
	 */
	Files.prototype.browseWindow = function () {
		var self = this

		if (self.browseElement && self.browseElement.length) {
			self.browseElement.toggleClass('hidden')
		}
	}

	/**
	 * Метод для скрытия окна выбора запуска камеры или библиотеки устройства
	 */
	Files.prototype.hideBrowseWindow = function () {
		var self = this

		if (self.browseElement && self.browseElement.length) {
			self.browseElement.addClass('hidden')
		}
	}

	/**
	 * Метод для показа окна выбора запуска камеры или библиотеки устройства
	 */
	Files.prototype.showBrowseWindow = function () {
		var self = this

		if (self.browseElement && self.browseElement.length) {
			self.browseElement.removeClass('hidden')
		}
	}

	/**
	 * Метод для показа/скрытия окна progressBar
	 */
	Files.prototype.progressBarWindow = function () {
		var self = this

		if (self.progressBarElement && self.progressBarElement.length) {
			self.progressBarElement.toggleClass('hidden')
		}
	}

	/**
	 * Метод для скрытия окна progressBar
	 */
	Files.prototype.hideProgressBarWindow = function () {
		var self = this

		if (self.progressBarElement && self.progressBarElement.length) {
			self.progressBarElement.addClass('hidden')
		}
	}

	/**
	 * Метод для показа окна progressBar
	 */
	Files.prototype.showProgressBarWindow = function () {
		var self = this

		if (self.progressBarElement && self.progressBarElement.length) {
			self.progressBarElement.removeClass('hidden')
		}
	}

	/**
	 * Метод для вывода ошибки Интернет-соединения
	 */
	Files.prototype.showInternetError = function () {
		var self = this

		self.hideProgressBarWindow()
		self.alert(self.errorMessages['INTERNET_ERROR'])
	}

	/**
	 * Метод для отправки фото на сервер
	 *
	 * @param {object} args - аргументы
	 * @returns {*}
	 */
	Files.prototype.uploadPhoto = function (args) {
		var self = this

		try {
			var formData = new _window.FormData()

			if (typeof args !== 'object' || args.parameter === '' || args.url === '') {
				self.objErrors['Files.uploadPhoto'] = 'Invalid argument passed'

				return false
			}

			if (self.blobMediaData) {
				formData.append(args.parameter, self.blobMediaData.data, self.blobMediaData.fileName)
			}

			self.sendData(args.url, formData, function (result) {
				if (args.callBack && typeof args.callBack === 'function') {
					args.callBack(result)
				} else {
					_window.location.href = self.pathname
				}
			})
		} catch (e) {
			self.objErrors['Files.uploadPhoto'] = e
		}

		return self
	}

	/**
	 * Метод для показа изображений
	 *
	 * @param {array} listUrl - ссылки на изображения
	 */
	Files.prototype.showImage = function (listUrl) {
		if (typeof BXMobileApp !== 'undefined' && listUrl && typeof listUrl === 'object') {
			var data = []
			var link
			var key

			for (key in listUrl) {
				link = listUrl[key]
				data[key] = {
					'url': link
				}
			}

			BXMobileApp.UI.Photo.show({'photos': data})
		}
	}

	general.Init()

	exports.qrScanner = new qrScanner()
	exports.OrdersAssemblyBarCodeScanner = new OrdersAssemblyBarCodeScanner()

	exports.qrScanner.androidVersion = general.androidVersion
	exports.OrdersAssemblyBarCodeScanner.androidVersion = general.androidVersion
	exports.module = new Module()
	exports.module.mobile = general.mobile
	exports.module.androidVersion = general.androidVersion
	exports.topBar = new TopBar()
	exports.topBar.mobile = general.mobile
	exports.topBar.androidVersion = general.androidVersion
	exports.menu = new Menu()
	exports.menu.mobile = general.mobile
	exports.menu.androidVersion = general.androidVersion
	exports.pullPush = new PullPush()
	exports.pullPush.mobile = general.mobile
	exports.pullPush.androidVersion = general.androidVersion
	exports.files = new Files()
	exports.files.mobile = general.mobile
	exports.files.androidVersion = general.androidVersion

	exports.showErrors = function () {
		// console.log('Class Module', exports.module.objErrors)
		console.log('Class TopBar', exports.topBar.objErrors);
		// console.log('Class Menu', exports.menu.objErrors)
		console.log('Class PullPush', exports.pullPush.objErrors);
		console.log('Class Files', exports.files.objErrors);
	}

	_window.module4lapy = exports;
})({
	'window': window,
	'document': document,
	'jQuery': this.window.jQuery,
	'BX': this.window.BX,
	'BXMobileApp': this.window.BXMobileApp
});