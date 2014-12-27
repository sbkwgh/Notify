(function(window, undefined) {
	'use strict';

	/*Shortcut functions*/
	//Shortcut for document.createElement
	var _el = function(tagName) {
	return document.createElement(tagName);
	};
	//Shortcut for document.createTextNode
	var _txt = function(text) {
	return document.createTextNode(text);
	};
	//Shortcut for el.setAttribute
	//Pass in an object with keys of the attribute
	//containing an array of the element and the value
	var _set = function(setObj) {
		for(var attribute in setObj) {
			if(setObj.hasOwnProperty(attribute)) {
				//If there is only one item, you don't need to 
				//Put it into an array
				if(!Array.isArray(setObj[attribute][0])) {
					var el = setObj[attribute][0];
					var value = setObj[attribute][1];

					el.setAttribute(attribute, value);
					continue;
				}

				setObj[attribute].forEach(function(item) {
					var el = item[0];
					var value = item[1];

					if(typeof el === 'undefined') return ;	

					el.setAttribute(attribute, value);
				});
			}
		}
	};
	//Shortcut for el.appendChild
	//Pass in an array of arrays, with the first item as the parent
	//and the second item as the child to append
	var _append = function(appendArray) {
		appendArray.forEach(function(item) {
			var parent = item[0];
			var children = item[1];

			//If there is only one item, you don't need to 
			//Put it into an array
			if(!Array.isArray(children)) {
				parent.appendChild(children);
				return ;
			}

			children.forEach(function(child) {
				if(typeof child === 'undefined') return ;
				parent.appendChild(child);
			});
		});
	};

	var _defaultClose = function() {
		this.close();
	};

	var _notifyArray = [];

	var _notifyBarTopLeft = _el('div'),
		_notifyBarBottomLeft = _el('div'),
		_notifyBarTopRight = _el('div'),
		_notifyBarBottomRight = _el('div');

	_set({
		'id': [
			[_notifyBarTopLeft, 'Notify_notify-bar-top-left'],
			[_notifyBarTopRight, 'Notify_notify-bar-top-right'],
			[_notifyBarBottomLeft, 'Notify_notify-bar-bottom-left'],
			[_notifyBarBottomRight, 'Notify_notify-bar-bottom-right']
		]
	});
	_append([
		[document.body, [
			_notifyBarTopLeft,
			_notifyBarTopRight,
			_notifyBarBottomLeft,
			_notifyBarBottomRight
		]]
	])
	
	var _events = {};
	if(Event in window) {
		_events = {
			close: new Event('close'),
			timeElapsed: new Event('timeElapsed'),
			buttonOne: new Event('buttonOne'),
			buttonTwo: new Event('buttonTwo')
		};
	} else {
		//Events for internet explorer which don't support new Event()
		_events = {
			close: document.createEvent('Event'),
			timeElapsed: document.createEvent('Event'),
			buttonOne: document.createEvent('Event'),
			buttonTwo: document.createEvent('Event')
		};
		_events.close.initEvent('close', true, true);
		_events.timeElapsed.initEvent('timeElapsed', true, true);
		_events.buttonOne.initEvent('buttonOne', true, true);
		_events.buttonTwo.initEvent('buttonTwo', true, true);
	}

	var _removeElement = function(el) {
		var currentNotify = el.parentElement.parentElement;
		var index = _notifyArray.indexOf(currentNotify);
		
		currentNotify.classList.add('Notify_fade-out');

		setTimeout(function() {
			currentNotify.parentElement.removeChild(currentNotify);
		}, 500);

		_notifyArray.splice(index, 1);
	};

	var centerDiv = _el('div');
	centerDiv.setAttribute('id', 'Notify_center-div');
	document.body.appendChild(centerDiv);

	var _createNote = function(noteObj) {
		var rootDiv = _el('div'),
			subDiv = _el('div'),
				titleSection = _el('div'),
					close = _el('span'),
					title = _el('span'),
					timeCreated = _el('span'),
				message = _el('p'),
					inputBox,
					centerButtons = _el('div'),
						buttonOne,
						buttonTwo;

		if(noteObj.inputBox) {
			inputBox = _el('input');
		} if (noteObj.buttonOne) {
			buttonOne = _el('input');
			buttonOne.addEventListener('click', function() {
				if(inputBox) rootDiv.inputBox = inputBox.value;
				this.parentElement.parentElement.parentElement.dispatchEvent(_events.buttonOne);
			});
		} if(noteObj.buttonTwo) {
			buttonTwo = _el('input');
			buttonTwo.addEventListener('click', function() {
				if(inputBox) rootDiv.inputBox = inputBox.value;
				this.parentElement.parentElement.parentElement.dispatchEvent(_events.buttonTwo);
			});
		}
		
		var titleTxt = _txt(noteObj.title + ' '),
			messageTxt = _txt(noteObj.message);
			close.innerHTML = '&times;';
			timeCreated.innerHTML = 'Just now';

		close.addEventListener('click', function() {
			this.parentElement.parentElement.dispatchEvent(_events.close);
			_removeElement(this);
		});

		_set({
			'class': [
				[rootDiv, 'Notify'],
				[titleSection, 'Notify_title-section'],
				[close, 'Notify_close'],
				[title, 'Notify_title'],
				[timeCreated, 'Notify_time-created'],
				[message, 'Notify_message'],
				[centerButtons, 'Notify_center-buttons']
			],
			'data-time-created': [
				timeCreated,
				Date.now()
			],
			'data-milliseconds-to-delete': [
				timeCreated,
				(noteObj.millisecondsToDelete === undefined ? 120000 : (noteObj.millisecondsToDelete ? noteObj.millisecondsToDelete : 0))
			],
			'type': [
				[inputBox, 'text'],
				[buttonOne, 'button'],
				[buttonTwo, 'button']
			],
			'value': [
				[buttonOne, noteObj.buttonOne || 'OK'],
				[buttonTwo, noteObj.buttonTwo || 'Cancel']
			]
		});

		_append([
			[title, titleTxt],
			[message, [
				messageTxt,
				inputBox,
				centerButtons
			]],
			[centerButtons, [
				buttonOne,
				buttonTwo
			]],
			[titleSection, [
				close,
				title,
				timeCreated
			]],
			[rootDiv, [
				titleSection,
				message
			]]
		]);
		
		_notifyArray.push(rootDiv);

		rootDiv.classList.add('Notify_fade-in');

		switch(noteObj.location) {
			case 'middle-center':
				rootDiv.classList.add('Notify_middle-center');
				subDiv.style.paddingLeft = "calc(50% - 7em)"
				subDiv.setAttribute('class', 'Notify_sub-div')
				subDiv.appendChild(rootDiv);
				centerDiv.appendChild(subDiv)
				break;
			case 'top-left':
				_notifyBarTopLeft.appendChild(rootDiv);
				break;
			case 'top-center':
				rootDiv.classList.add('Notify_center-top');
				document.body.appendChild(rootDiv);
				break;
			case 'bottom-center':
				rootDiv.classList.add('Notify_center-bottom');
				document.body.appendChild(rootDiv);
				break;
			case 'bottom-left':
				_notifyBarBottomLeft.appendChild(rootDiv);
				break;
			case 'top-right':
				_notifyBarTopRight.appendChild(rootDiv);
				break;
			case 'bottom-right':
				_notifyBarBottomRight.appendChild(rootDiv);
				break;
			default:
				_notifyBarTopRight.appendChild(rootDiv);
		}

		rootDiv.on = function(event, func) {
			this.removeEventListener(event, _defaultClose);
			this.addEventListener(event, func);
			return this;
		};
		rootDiv.close = function() {
			_removeElement(close);
		};

		return rootDiv;
	};

	var notify = function(obj) {
		return _createNote({
			title: obj.title || '',
			message: obj.message,
			millisecondsToDelete: obj.time,
			location: obj.location
		});
	};

	var prompt = function(obj) {
		return _createNote({
			title: obj.title || '',
			message: obj.message,
			millisecondsToDelete: obj.time,
			inputBox: true,
			buttonOne: obj.buttonOne || '',	
			buttonTwo: obj.buttonTwo || '',
			location: obj.location
		}).on('buttonTwo', _defaultClose)
		  .on('buttonOne', _defaultClose);
	};

	var confirm = function(obj) {
		return _createNote({
			title: obj.title || '',
			message: obj.message,
			millisecondsToDelete: obj.time,
			buttonOne: obj.buttonOne || '',
			buttonTwo: obj.buttonTwo || '',
			location: obj.location
		}).on('buttonTwo', _defaultClose)
		  .on('buttonOne', _defaultClose);
	};

	setInterval(function() {
		if(!_notifyArray) return ;
		_notifyArray.forEach(function(item) {
			var el = item.querySelector('.Notify_time-created');

			var timeCreated = new Date(+el.getAttribute('data-time-created'));
			var millisecondsToDelete = +el.getAttribute('data-milliseconds-to-delete');
			var millisecondsElapsed = Date.now() - timeCreated;
			var timePhrase = 'Just now';

			var correctPlural = function(number, word) {
				word = ' ' + word;

				if(number === 1) {
					return word + ' ago';
				} else {
					return word + 's ago';
				}
			};

			var timeElapsed = {
				minutes: Math.floor(millisecondsElapsed/1000/60),
				hours: Math.floor(millisecondsElapsed/1000/60/60),
				date:
					timeCreated.getDate() + '/' +
					timeCreated.getMonth() + 1 + '/' +
					timeCreated.getFullYear()
			};

			if(timeElapsed.minutes) {
				timePhrase =
					timeElapsed.minutes +
					correctPlural(timeElapsed.minutes, 'minute');
			}
			if(timeElapsed.hours) {
				timePhrase =
					timeElapsed.hours +
					correctPlural(timeElapsed.hours, 'hour');
			}
			if(timeElapsed.hour > 24) {
				timePhrase = timeElapsed.date;
			}
			
			el.innerHTML = timePhrase;
			if(+millisecondsToDelete && millisecondsElapsed > millisecondsToDelete) {
				item.dispatchEvent(_events.timeElapsed);
				_removeElement(el);
			}
			
			
		});
	}, 1000);
	
	window.Notify = {
		notify: notify,
		prompt: prompt,
		confirm: confirm,
	};
})(window);