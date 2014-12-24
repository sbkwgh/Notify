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

	var _events = {
		close: new Event('close'),
		timeElapsed: new Event('timeElapsed'),
		buttonOne: new Event('buttonOne'),
		buttonTwo: new Event('buttonTwo')
	};

	var _removeElement = function(el) {
		var currentNotify = el.parentElement.parentElement;
		var index = Notify._notifyArray.indexOf(currentNotify);
		
		currentNotify.classList.add('Notify_fade-out');

		setTimeout(function() {
			currentNotify.parentElement.removeChild(currentNotify);
		}, 500);

		Notify._notifyArray.splice(index, 1);
	};

	var _createNote = function(noteObj) {
		var rootDiv = _el('div'),
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
				noteObj.millisecondsToDelete || 120000
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
			]],
			[Notify.notifyBar, rootDiv]
		]);
		
		Notify._notifyArray.push(rootDiv);

		rootDiv.classList.add('Notify_fade-in');

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
			millisecondsToDelete: obj.time
		});
	};

	var prompt = function(obj) {
		return _createNote({
			title: obj.title || '',
			message: obj.message,
			millisecondsToDelete: obj.time,
			inputBox: true,
			buttonOne: obj.buttonOne || '',	
			buttonTwo: obj.buttonTwo || ''
		}).on('buttonTwo', _defaultClose)
		  .on('buttonOne', _defaultClose);
	};

	var confirm = function(obj) {
		return _createNote({
			title: obj.title || '',
			message: obj.message,
			millisecondsToDelete: obj.time,
			buttonOne: obj.buttonOne || '',
			buttonTwo: obj.buttonTwo || ''
		}).on('buttonTwo', _defaultClose)
		  .on('buttonOne', _defaultClose);
	};

	var notifyBar = _el('div');
	notifyBar.setAttribute('id', 'Notify_notify-bar');
	document.body.appendChild(notifyBar);
	
	setInterval(function() {
		if(!Notify._notifyArray) return ;
		Notify._notifyArray.forEach(function(item) {
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

			if(millisecondsToDelete && millisecondsElapsed > millisecondsToDelete) {
				item.dispatchEvent(_events.timeElapsed);
				_removeElement(el);
			}
			
			
		});
	}, 1000);
	
	window.Notify = {
		notifyBar: document.getElementById('Notify_notify-bar'),
		notify: notify,
		prompt: prompt,
		confirm: confirm,
		_notifyArray: []
	};
})(window);