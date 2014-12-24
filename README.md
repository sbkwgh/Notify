#Notify
A small JavaScript library for alerts and notifications. It includes simple notifications, prompt boxes, and confirm boxes. There are two themes, light and dark. You can find a demo [here](http://jsbin.com/xerumomalo/1/edit?html,output) (and using the dark theme [here](http://jsbin.com/xaqizevago/1/edit?html,output)).
###Features

 - Small: only 2KB minified and gzipped
 - Simple to use API
 - Works with or without jQuery

##Documentation

###Installation
Simply add `notify.js` or `notify.min.js` add the end of the `body` tag, and include the CSS	(`notify.css` or `notify_dark.css`) in the `head` tag:

    ...
    <head>
    <link rel="stylesheet" type="text/css" href="notify.css" />
    </head>
    ...
    <script type="text/javascript" src="notify.js"></script>
    </body>
    </html>

###Notify.notify(objectParam)
Displays a plain notification with a title ([example](http://jsbin.com/qapoduguko/1/edit?html,output))

 - objectParam: object literal

Usage:

    {
      message: 'Message for the notification',
      time: 3000,
      title: 'Title for the notification',
    }
   

 - If time is 0, it will not close automatically
 - The default setting for time is 2 minutes
 - The default setting for the title is no title
    
###Notify.prompt(objectParam)
Displays a notification with an input box and two buttons ([example](http://jsbin.com/xolehadano/1/edit?html,output))

 - objectParam: object literal
 
Usage:

     {
      message: 'Message for prompt box',
      time: 0,
      title: 'Title for prompt box',
      buttonOne: 'Value for button one',
      buttonTwo: 'Value for button two'
    }
    

   - If buttonOne or buttonTwo are left blank or not given, the button will no display

###Notify.confirm(objectParam)
Displays a notification with two buttons ([example](http://jsbin.com/dupikahari/2/))

 - objectParam: object literal
 
Usage: 

    {
      message: 'Message for prompt box',
      time: 0,
      title: 'Title for prompt box',
      buttonOne: 'Value for button one',
      buttonTwo: 'Value for button two'
    }
    

   - If buttonOne or buttonTwo are left blank or not given, the button will no display

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

    
