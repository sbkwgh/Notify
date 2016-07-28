#Notify
A small JavaScript library for alerts and notifications. It includes simple notifications, prompt boxes, and confirm boxes. There are two themes, light and dark. You can find a demo [light theme demo](http://jsbin.com/riyisa/1/) (and using the dark theme [dark theme demo](http://jsbin.com/yemigo/1/)).
###Features

 - Small: only 2KB minified and gzipped
 - Simple to use API
 - Works with or without jQuery
 - Supports IE 10+, Firefox 21+ and Chrome 23+

##Documentation

###Installation
Simply include the JavaScript file at the end of the `body` tag, and include the CSS	in the `head` tag:

    ...
    <head>
    <link rel="stylesheet" type="text/css" href="notify-light.min.css" />
    </head>
    ...
    <script type="text/javascript" src="notify.min.js"></script>
    </body>
    </html>

###Notify.notify(objectParam)
Displays a plain notification with a title ([notify example](http://jsbin.com/pejika/1/))

 - objectParam: object literal

Usage:

    {
      message: 'Message for the notification',
      time: 3000,
      title: 'Title for the notification',
      location: 'top-right'
    }
   

 - If time is 0, it will not close automatically
 - The default setting for time is 2 minutes
 - The default setting for the title is no title
 - The default location is top-right, other options:
![Location options](http://i.imgur.com/Ak6XFRK.png)

 - N.b. top-center, center and bottom-center will be stacked one on top of another, instead of tiling like other locations
    
###Notify.prompt(objectParam)
Displays a notification with an input box and two buttons ([prompt example](http://jsbin.com/kekami/1/))

 - objectParam: object literal
 
Usage:

     {
      message: 'Message for prompt box',
      time: 0,
      title: 'Title for prompt box',
      buttonOne: 'Value for button one',
      buttonTwo: 'Value for button two',
      location: 'top-right'
    }
    

   - If buttonOne or buttonTwo are left blank or not given, the button will not display

###Notify.confirm(objectParam)
Displays a notification with two buttons ([confirm example](http://jsbin.com/gofere/1/))

 - objectParam: object literal
 
Usage: 

    {
      message: 'Message for prompt box',
      time: 0,
      title: 'Title for prompt box',
      buttonOne: 'Value for button one',
      buttonTwo: 'Value for button two',
      location: 'top-right'
    }
    

   - If buttonOne or buttonTwo are left blank or not given, the button will not display

###NotifyElement.on(eventName, callback)
All the above methods (`notify`, `prompt`, and `confirm`) return the notify element itself. By calling `on` you can call functions when a user interacts with the notification. The method returns itself for method chaining.

 - eventName: string
 - callback: function

Usage:

    NotifyElement.on('close', cb) //When the users closes the notification
    NotifyElement.on('timeElapsed', cb) //When the time has elapsed
    NotifyElement.on('buttonOne', cb) //When button one is clicked
    NotifyElement.on('buttonTwo', cb) //When button two is clicked
    

   - If no event is handled for buttonOne or buttonTwo, the default behavior is closing the notification box
   - The input box value can be accessed through `this.inputBox`
   - To close the notification, call `this.close()`

    
