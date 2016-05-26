/**
 * Created by WillJiang on 5/18/16.
 */
myMapModule.controller('myBaiduMapCtrl', ['$scope', '$timeout', '$ionicHistory', '$compile', 'baiduMapApi', '$cordovaGeolocation', 'BaiduMapServ', 'HttpAppService', '$ionicLoading', function ($scope, $timeout, $ionicHistory, $compile, baiduMapApi, $cordovaGeolocation, BaiduMapServ, HttpAppService, $ionicLoading) {
    var map;
    var myBMap;

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

        var startTime = new Date().getTime();
        HttpAppService.post(url, data).success(function (response, status, func, config) {
            if (response.ES_RESULT.ZFLAG === 'S') {
                $scope.filterBtns = response.ES_RESULT.ZRESULT;
                console.log('$scope.filterBtns = ' + angular.toJson($scope.filterBtns));
            }
        }).error(function (response, status, header, config) {
            console.log('error response = ' + angular.toJson(response));
        });

        var options = {
            timeout: 8000,
            maximumAge: 3000,
            enableHighAccuracy: true
        };

        // BaiduMapServ.getCurrentLocation().then(function (success) {
        //     console.log('success = ' + angular.toJson(success));
        //     var lat = success.lat;
        //     var lng = success.long;
        //
        // }, function (error) {
        //     console.log('error = ' + angular.toJson(error));
        // });

        var lng = 116.42918;
        var lat = 39.93093;
        console.log('lat = ' + lat + '&lng = ' + lng);
        var myMap = document.getElementById('myMap');

        baiduMapApi.then(function (BMap) {
            myBMap = BMap;
            map = new myBMap.Map(myMap);
            var point = new myBMap.Point(lng, lat);  // 创建点坐标
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
            map.enableScrollWheelZoom();
            map.addControl(new myBMap.NavigationControl());  //添加默认缩放平移控件

            BaiduMapServ.getLBSData(lng, lat).then(function (res) {
                console.log('res = ', angular.toJson(res));
                $scope.pointsData = res;
                setMapOverlay($scope.pointsData, 'init');
            }, function (error) {
                console.log('error = ', angular.toJson(error));
            });
        });
        // }, function (error) {
        //   console.log('error = ' + angular.toJson(error));
        // });


    });

    function openInfoWind(content, e) {//单击热点图层
        var opts = {
            width: 0,     // 信息窗口宽度
            height: 0,      // 信息窗口高度
            title: '名称: ' + content.title
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
        map.clearOverlays();
        var myIcon = new myBMap.Icon("../../img/apps/acPlan.png", new myBMap.Size(23, 23), {
            offset: new myBMap.Size(10, 25), // 指定定位位置
            imageOffset: new myBMap.Size(0, 0 - 10 * 25) // 设置图片偏移
        });


        angular.forEach(pointsData, function (item, index) {
            var tempPoi = new myBMap.Point(item.location[0], item.location[1]);
            var markerOpt = {
                icon: myIcon
            };
            // var marker = new myBMap.Marker(tempPoi,markerOpt);
            var marker = new myBMap.Marker(tempPoi);
            var content = item;
            map.addOverlay(marker);
            marker.addEventListener('click', function (e) {
                openInfoWind(content, e);
            });
        });

        if (type === 'filter') {
            var centerPoi = new myBMap.Point(pointsData[0].location[0], pointsData[0].location[1]);
            map.panTo(centerPoi);// 初始化地图，设置中心点坐标和地图级别
        }

    }

    //页面筛选按钮组
    $scope.menuBtnSelected = function (searchLabel) {
        $timeout(function () {
            var typeSearchData = [];
            angular.forEach($scope.pointsData, function (item, index) {
                if ((item.tags.indexOf(searchLabel) >= 0)) {
                    typeSearchData.push(item);
                }
            });
            setMapOverlay(typeSearchData, 'filter');
        }, 200);
    };
}]);