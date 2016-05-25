/**
 * Created by WillJiang on 5/18/16.
 */
myMapModule.factory('BaiduMapServ', ['$http', '$cordovaGeolocation', function ($http, $cordovaGeolocation) {
    var baiduMapServ = {
        //获取百度地图LBS数据库的点
        getLBSData: function (lng, lat) {
            var url = ROOTCONFIG.baiduMap.pointQueryUrl + "?ak=" + ROOTCONFIG.baiduMap.apiKey + "&geotable_id=" + ROOTCONFIG.baiduMap.geotableId + "&location=" + lng + "," + lat + "&radius=" + ROOTCONFIG.baiduMap.radius;
            console.log('url = ' + url);
            var promise = $http.get(url).then(function (res) {
                return res.data.contents;
            }, function (error) {
                return error;
            });
            return promise;
        },

        //获取服务端配置的类的数据
        getFilterBtns: function () {
            var url = "";
            var promise = $http.get(url).then(function (res) {

            }, function (error) {

            });
            return promise;
        },

        //定位
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
        },

        locationToAddress: function (lat, lng) {
            var url = ROOTCONFIG.baiduMap.locationToAddQueryUrl + "/?ak=" + ROOTCONFIG.baiduMap.apiKey + "&location=" + lat + "," + lng + "&output=json";
            var promise = $http.get(url).then(function (res) {
                return res.data.result;
            }, function (error) {
                return error;
            });
            return promise;
        }
    };
    return baiduMapServ;
}]);