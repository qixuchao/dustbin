function Base64() {}
Base64.prototype.encodeFile = function(filePath, sucess, failure, opts) {
	try {
		var _opts = (opts && typeof opts === "object") ? opts : {}; 
		var args = { filePath: filePath };
		var c = document.createElement('canvas');
		var ctx = c.getContext("2d");
		var img = new Image();
		img.onload = function() {
			var MAX_WIDTH = _opts.max_width || 800;
			var MAX_HEIGHT =  _opts.max_height || 600;
			var width = this.width;
			var height = this.height;
			if (width > MAX_WIDTH) {
				height *= MAX_WIDTH / width;
				width = MAX_WIDTH;
			}
			if (height > MAX_HEIGHT) {
				width *= MAX_HEIGHT / height;
				height = MAX_HEIGHT;
			}
			c.width = width;
			c.height = height;
			ctx.drawImage(img, 0, 0, width, height);
			var dataUri = c.toDataURL("image/png");
			sucess(dataUri);
		};
		img.onerror = function(e){
			failure(e);
		}
		img.src = filePath;
	} catch (e){
		failure(e);
	}
}
cordova.addConstructor(function()  {
	if(!window.plugins){ window.plugins = {}; }
	// shim to work in 1.5 and 1.6
	if (!window.Cordova) { window.Cordova = cordova; };
	window.plugins.Base64 = new Base64();
});
