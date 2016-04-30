/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerVehicleModule
    .controller('customerVehicleQueryCtrl',['$scope','$state','$http','HttpAppService','CarService','$timeout','$ionicPopover','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','$cordovaDialogs',function($scope,$state,$http,HttpAppService,CarService,$timeout,$ionicPopover,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,$cordovaDialogs) {
        //获取数据列表函数
        $scope.customerVehicleisshow = true;
        $scope.customerVehiclelists = new Array();
        $scope.customerVehiclelists = [];
        $scope.customerVehicletactPage = 0;
        $scope.customerVhicleLoadmore = function(){
            //$scope.customerVehicleisshow = true;
            $scope.customerVehicletactPage = $scope.customerVehicletactPage + 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'CAR_LIST_BY_PRT';

            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": $scope.customerVehicletactPage,
                    "ITEMS": "10"
                },
                "IS_PARTNER_INPUT": { "PARTNER": customeService.get_customerListvalue().PARTNER}
            }
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function (response) {
                console.log(response);
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.customerVehicleisshow = false;
                    $cordovaToast.showShortCenter(response.ES_RESULT.ZRESULT);
                } else {
                    if (response.ES_RESULT.ZFLAG == 'S') {
                        if(response.ET_VEHICL_OUTPUT != ''){
                            if (response.ET_VEHICL_OUTPUT.item.length == 0) {
                                $scope.customerVehicleisshow = false;
                                //Prompter.hideLoading();
                                if ($scope.customerVehicletactPage == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                    $scope.customerVehiclelists = response.ET_VEHICL_OUTPUT.item;
                            }
                            if (response.ET_VEHICL_OUTPUT.item.length < 10) {
                                $scope.customerVehicleisshow = false;
                                if ($scope.customerVehicletactPage > 1) {
                                    //console.log("没有更多数据了");
                                    $cordovaToast.showShortBottom('没有更多数据');
                                }
                            } else {
                                $scope.customerVehicleisshow = true;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }else{
                            $cordovaToast.showShortBottom('查询数据为空');
                        }

                    }
                }
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                //Prompter.hideLoading();
                $ionicLoading.hide();
            });
        }

       $scope.customerVehicleGoDetail = function(value){
           CarService.setData(value);
           $state.go('carDetail');
       };
    }])

