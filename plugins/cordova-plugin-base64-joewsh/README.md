
Base64 encoding plugin for Cordova
======================================================

This plugin is used to encode image files to base64 using javascript and a HTML5 canvas.

### ! IMPORTANT ! ###
Older browsers found in older platform versions (e.g. Android API < 3) will not support this plugin!

## Example Usage: 

```js
// window.plugins.Base64.encodeFile(filepath, success, failure, options);
// - filepath 	- absolute path to the file e.g. (/mnt/sdcard/...)
// - success 	- callback function to receive encoded file string
// - failure    - callback function to handle failed encoding
// - options    - size options, default -  { max_width: 800, max_height: 600 }

window.plugins.Base64.encodeFile(myFile, function(base64){
	console.log('file base64 encoding: ' + base64);
});
```

## Installation 

cordova plugin add https://github.com/Joewsh/cordova-plugin-base64-joewsh.git

or 

cordova plugin add cordova-plugin-base64-joewsh

## MIT Licence

Copyright 2013 Monday Consulting GmbH

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
