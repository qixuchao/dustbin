/**
 * Created by WillJiang on 5/18/16.
 */
myMapModule.factory('BaiduMapServ', ['$http', '$cordovaGeolocation', function ($http, $cordovaGeolocation) {
    var baiduMapServ = {
        getLBSData: function (configData, lng, lat) {
            var url = configData.baiduMap.pointQueryUrl + "?ak=" + configData.baiduMap.apiKey + "&geotable_id=" + configData.baiduMap.geotableId + "&location=" + lng + "," + lat + "&radius=" + configData.baiduMap.radius;
            console.log('url = ' + url);
            var promise = $http.get(url).then(function (res) {
                return res.data.contents;
            }, function (error) {
                return error;
            });
            return promise;
        },
        getCurrentLocation: function () {
            var promise;
            if (ionic.Platform.isIOS()) {
                var options = {
                    timeout: 8000,
                    maximumAge: 3000,
                    enableHighAccuracy: true
                };
                promise = $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                    var result = {
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    };
                    return result;
                }, function (error) {
                    return error;
                });
            } else if (ionic.Platform.isAndroid()) {
                promise = window.plugins.baiduMap.getLocation().then(function (position) {
                    var result = {
                        lat: position.location.latitude,
                        long: position.location.lontitude
                    };
                    return result;
                }, function (error) {
                    return error;
                });
            }
            return promise;
        }
    };
    return baiduMapServ;
}]);