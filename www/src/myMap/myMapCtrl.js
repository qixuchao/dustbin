/**
 * Created by WillJiang on 5/18/16.
 */
myMapModule.controller('myBaiduMapCtrl', ['$scope', '$timeout', '$ionicHistory', '$compile', 'baiduMapApi', '$cordovaGeolocation', 'BaiduMapServ', 'HttpAppService', '$ionicLoading', function ($scope, $timeout, $ionicHistory, $compile, baiduMapApi, $cordovaGeolocation, BaiduMapServ, HttpAppService, $ionicLoading) {
    var map;
    var myBMap;
    var searchLabelStr = '';

    $scope.searchInfo = "";
    $scope.searchFlag = false;

    $scope.changePage = function () {
        $scope.searchFlag = true;
    };

    $scope.cancelSearch = function () {
        $scope.searchFlag = false;
        $scope.searchInfo = "";
    };

    $scope.initLoad = function () {
        console.log('$scope.searchInfo = ' + $scope.searchInfo);
        console.log('$scope.pointsData = ' + angular.toJson($scope.pointsData));
        $scope.searchPointsData = [];
        angular.forEach($scope.pointsData, function (item, index) {
            if ((item.title.indexOf($scope.searchInfo) >= 0)) {
                $scope.searchPointsData.push(item);
            }
        });
    };


    $scope.$on('$ionicView.enter', function () {
        var url = ROOTCONFIG.hempConfig.basePath + 'mapTag';
        var data = {
            "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
            "IS_SEARCH": {"SEARCH": ""},
            "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName}
        };

        HttpAppService.post(url, data).success(function (response, status, func, config) {
            if (response.ES_RESULT.ZFLAG === 'S') {
                $scope.filterBtns = response.ES_RESULT.ZRESULT;
                //$scope.filterBtns = [{"ICON":"ion-wrench","TAG":"服务商"},{"ICON":"ion-cube","TAG":"备件室"},{"ICON":"ion-ios-toggle","TAG":"客户"},{"ICON":"ion-wrench","TAG":"服务商"},{"ICON":"ion-cube","TAG":"备件室"},{"ICON":"ion-ios-toggle","TAG":"客户"},{"ICON":"ion-android-map","TAG":"服务站"},{"ICON":"ion-android-car","TAG":"正式客户"}]                //console.log('$scope.filterBtns = ' + angular.toJson($scope.filterBtns));
            }
        }).error(function (response, status, header, config) {
            console.log('error response = ' + angular.toJson(response));
        });

        var options = {
            timeout: 8000,
            maximumAge: 3000,
            enableHighAccuracy: true
        };

        BaiduMapServ.getCurrentLocation(options).then(function (success) {
            console.log('success = ' + angular.toJson(success));
            var lat = success.lat;
            var lng = success.long;


            // var lng = 116.42918;
            // var lat = 39.93093;
            console.log('lat = ' + lat + '&lng = ' + lng);
            var myMap = document.getElementById('myMap');

            baiduMapApi.then(function (BMap) {
                myBMap = BMap;
                map = new myBMap.Map(myMap);
                var point = new myBMap.Point(lng, lat);  // 创建点坐标
                map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
                map.enableScrollWheelZoom();
                map.addControl(new myBMap.NavigationControl());  //添加默认缩放平移控件

                window.localStorage.map_orig_zoom = map.getZoom();
                getLBSData(lng, lat, 'init');

                map.addEventListener('dragend', resetLBSData);

            });
        }, function (error) {
            console.log('error = ' + angular.toJson(error));
        });
    });

    function getLBSData(lng, lat, type) {
        var zoomdiff = window.localStorage.map_orig_zoom - map.getZoom() > 0 ? window.localStorage.map_orig_zoom - map.getZoom() : 1;//地图级别差,用于计算放大和缩小地图后的点图范围radius

        BaiduMapServ.getLBSData(lng, lat, zoomdiff).then(function (res) {
            console.log('res = ', angular.toJson(res));
            $scope.pointsData = res;
            if (type === 'reset' && searchLabelStr !== '') {
                var typeSearchData = [];
                angular.forEach($scope.pointsData, function (item, index) {
                    if ((item.tags.indexOf(searchLabel) >= 0)) {
                        typeSearchData.push(item);
                    }
                });
                setMapOverlay(typeSearchData, 'init');
            } else {
                setMapOverlay($scope.pointsData, 'init');
            }
        }, function (error) {
            console.log('error = ', angular.toJson(error));
        });
    }

    function resetLBSData(e) {
        var newCenter = map.getCenter();
        getLBSData(newCenter.lng, newCenter.lat, 'reset');
    }

    function openInfoWind(content, e) {//单击热点图层
        var opts = {
            width: 0,     // 信息窗口宽度
            height: 0,      // 信息窗口高度
            title: '<div>类别:' + content.tags + '</div><div>名称:' + content.title + '</div>'
        };
        var position = e.target.getPosition();
        console.log('position = ' + angular.toJson(position));
        var address = '地址: ' + content.address;
        console.log('address = ' + address);
        var point = new myBMap.Point(position.lng, position.lat);
        var infoWindow = new myBMap.InfoWindow(address, opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow, point); //开启信息窗口
    }

    //查询结果展示列表选择事件
    $scope.selectSearchData = function (data) {
        var pointsData = [];
        pointsData.push(data);
        $scope.searchFlag = false;
        $scope.searchInfo = data.title;
        $timeout(function () {
            setMapOverlay(pointsData, 'filter');
        }, 200);
    };

    function setMapOverlay(pointsData, type) {
        console.log('pointsData = ' + angular.toJson(pointsData));

        if (type === 'filter') {
            map.clearOverlays();
            var centerPoi = new myBMap.Point(pointsData[0].location[0], pointsData[0].location[1]);
            map.panTo(centerPoi);// 初始化地图，设置中心点坐标和地图级别
        }

        angular.forEach(pointsData, function (item, index) {
            console.log('imageUrl = ' + item.icon);
            var isImage = varifyIconUrl(item.icon);
            var marker;
            var tempPoi = new myBMap.Point(item.location[0], item.location[1]);
            if (isImage) {
                var myIcon = new myBMap.Icon(encodeURI(item.icon), new myBMap.Size(24, 24), {
                    offset: new myBMap.Size(10, 25), // 指定定位位置
                    // imageOffset: new myBMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                    imageSize: new myBMap.Size(24, 24)
                });
                var markerOpt = {
                    icon: myIcon
                };
                marker = new myBMap.Marker(tempPoi, markerOpt);
            } else {
                marker = new myBMap.Marker(tempPoi);
            }
            var content = item;
            map.addOverlay(marker);
            marker.addEventListener('click', function (e) {
                openInfoWind(content, e);
            });
        });
    }

    function varifyIconUrl(icon) {
        var tmpAry = icon.split('.');
        var iconType = tmpAry[tmpAry.length - 1];
        console.log('iconType = ' + iconType);
        if (iconType === 'png' || iconType === 'jpg' || iconType === 'jpeg') {
            return true;
        }
        return false;
    }

    //页面筛选按钮组
    $scope.menuBtnSelected = function (searchLabel) {
        searchLabelStr = searchLabel;
        //console.log(searchLabel);
        //console.log($scope.pointsData);
        $timeout(function () {
            var typeSearchData = [];
            angular.forEach($scope.pointsData, function (item, index) {
                console.log(item.tags.indexOf(searchLabel));
                if ((item.tags.indexOf(searchLabel) >= 0)) {
                    typeSearchData.push(item);
                }
            });
            setMapOverlay(typeSearchData, 'filter');
        }, 200);
    };
    $scope.buttonShowList = false;
    $scope.showButton = function(){
        $scope.buttonShowList = !$scope.buttonShowList;
    }
}]);