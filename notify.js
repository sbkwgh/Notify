(function(window, undefined) {
	'use strict';
	
	/*'Global' el*/
	//The array containing all the notify objects
	var _notifyArray = [];

	//The notify bars
	var _notifyBarTopLeft = _el('div'),
		_notifyBarBottomLeft = _el('div'),
		_notifyBarTopRight = _el('div'),
		_notifyBarBottomRight = _el('div');

	_set(_notifyBarTopLeft, {id: 'Notify_notify-bar-top-left'});
	_set(_notifyBarTopRight, {id: 'Notify_notify-bar-top-right'});
	_set(_notifyBarBottomLeft, {id: 'Notify_notify-bar-bottom-left'});
	_set(_notifyBarBottomRight, {id: 'Notify_notify-bar-bottom-right'});

	_append(document.body, [
		_notifyBarTopLeft,
		_notifyBarTopRight,
		_notifyBarBottomLeft,
		_notifyBarBottomRight
	]);
	//This is the div which contains the middle-center notify
	//(the one in the "center center" of the screen)
	var centerDiv = _el('div');
	_set(centerDiv, {id: 'Notify_center-div'});
	_append(document.body, [centerDiv]);
	
	//Create custom events
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

	/*Shortcut functions*/
	//Shortcut for document.createElement function
	function _el(tagName) {
	return document.createElement(tagName);
	};
	//Shortcut for el.setAttribute
	//Pass in the element and an object:
	//keys => attribute, value => attribute value
	function _set(el, setObj) {
		for(var attribute in setObj) {
			if(setObj.hasOwnProperty(attribute)) {
				el.setAttribute(attribute, setObj[attribute])
			}
		}
	};
	//Shortcut for el.appendChild
	//Pass in the parent element and an array of children
	function _append(parent, appendArray) {
		appendArray.forEach(function(child) {
			if(typeof child === 'undefined') return ;
			parent.appendChild(child);
		});
	};

	/*Other 'global' functions*/
	//Function called if no cb for the button is added
	//Simply closes the notifcation/alert
	function _defaultClose() {
		this.close();
	};

	//Remove notify from dom and form _notifyArray
	function _removeElement(currentNotify) {
		//var currentNotify = el.parentElement.parentElement;
		var index = _notifyArray.indexOf(currentNotify);
		//Fade out the notification
		currentNotify.classList.add('Notify_fade-out');

		setTimeout(function() {
			currentNotify.parentElement.removeChild(currentNotify);
		}, 500);

		//Remove the element from the array
		_notifyArray.splice(index, 1);
	};

	//Actually creates the notify, returns the notify element
	function _createNote(noteObj) {

		//Adds an event listener to the buttons
		var _notifyButton = function(buttonEl, buttonElName) {
			var currentNotify = buttonEl.parentElement.parentElement.parentElement;

			buttonEl = _el('input');
			buttonEl.addEventListener('click', function() {
				if(inputBox) rootDiv.inputBox = inputBox.value;
				buttonEl.dispatchEvent(_events[buttonElName]);
			});

		}

		//Create elements needed for the notify
		var subDiv = _el('div'),
			rootDiv = _el('div'),
				titleSection = _el('div'),
					close = _el('span'),
					title = _el('span'),
					timeCreated = _el('span'),
				message = _el('p'),
					inputBox,
					centerButtons = _el('div'),
						buttonOne,
						buttonTwo;

		title.innerHTML = noteObj.title + ' ';
		timeCreated.innerHTML = 'Just now';
		message.innerHTML = noteObj.message;
		close.innerHTML = '&times;';
		close.addEventListener('click', function() {
			var currentNotify = this.parentElement.parentElement;
			currentNotify.dispatchEvent(_events.close);
			_removeElement(currentNotify);
		});
			
		//Set element attributes
		_set(rootDiv, {class: 'Notify'});
		rootDiv.classList.add('Notify_fade-in');
			_set(titleSection, {class: 'Notify_title-section'});
				_set(close, {class: 'Notify_close'});
				_set(title, {class: 'Notify_title'});
				_set(timeCreated, {
					class: 'Notify_time-created',
					'data-time-created': Date.now(),
					'data-milliseconds-to-delete': (noteObj.millisecondsToDelete === undefined ? 120000 : (noteObj.millisecondsToDelete ? noteObj.millisecondsToDelete : 0))
				});
			_set(message, {class: 'Notify_message'});
				_set(centerButtons, {class: 'Notify_center-buttons'});

		//Append different elements into one another
		_append(rootDiv, [titleSection, message])
			_append(titleSection, [close, title, timeCreated]);
			_append(message, [inputBox, centerButtons]);
				_append(centerButtons, [buttonOne, buttonTwo]);


		//Creates the elements if they are included as
		//a noteObj parameter
		if(noteObj.inputBox) {
			inputBox = _el('input');
			_set('inputBox', {type: 'text'});
		} if (noteObj.buttonOne) {
			_notifyButton(buttonOne, 'buttonOne');
			_set('buttonOne', {
				type: 'button',
				value: noteObj.buttonOne || 'OK'
			});
		} if(noteObj.buttonTwo) {
			_notifyButton(buttonTwo, 'buttonTwo');
			_set('buttonTwo', {
				type: 'button',
				value: noteObj.buttonTwo || 'Cancel'
			});
		}
		
		_notifyArray.push(rootDiv);

		//Set and do various stuff to align the notifies on the page
		switch(noteObj.location) {
			case 'middle-center':
				rootDiv.classList.add('Notify_middle-center');
				subDiv.style.paddingLeft = "calc(50% - 7em)"
				_set(subDiv, {class: 'Notify_sub-div'});
				_append(centerDiv, [subDiv]);
					_append(subDiv, [rootDiv]);
				break;
			case 'top-left':
				_append(_notifyBarTopLeft, [rootDiv]);
				break;
			case 'top-center':
				rootDiv.classList.add('Notify_center-top');
				_append(document.body, [rootDiv]);
				break;
			case 'bottom-center':
				rootDiv.classList.add('Notify_center-bottom');
				_append(document.body, [rootDiv]);
				break;
			case 'bottom-left':
				_append(_notifyBarBottomLeft, [rootDiv]);
				break;
			case 'top-right':
				_append(_notifyBarTopRight, [rootDiv]);
				break;
			case 'bottom-right':
				_append(_notifyBarBottomRight, [rootDiv]);
				break;
			default:
				_append(_notifyBarTopRight, [rootDiv]);
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

	/*'Public' functions (the ones added to the Notify object)*/
	//A plain notification
	var notify = function(obj) {
		return _createNote({
			title: obj.title || '',
			message: obj.message,
			millisecondsToDelete: obj.time,
			location: obj.location
		});
	};
	//Notification with buttons and input box
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
	//Notification with buttons
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