var baiduMap = function() {
};

baiduMap.prototype.getLocation = function(successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function() {}}
    if (typeof errorCallback != "function")  {
        return
    }
    if (typeof successCallback != "function") {
        return
    }
    cordova.exec(successCallback, errorCallback, "BaiduMap", "getLocation", options);
};
//-------------------------------------------------------------------
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.baiduMap) {
    window.plugins.baiduMap = new baiduMap();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = baiduMap;
}