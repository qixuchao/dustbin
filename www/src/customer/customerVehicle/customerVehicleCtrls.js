/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerVehicleModule
    .controller('customerVehicleQueryCtrl',['$scope','$state','$http','HttpAppService','CarService','$timeout','$ionicPopover','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,HttpAppService,CarService,$timeout,$ionicPopover,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading) {
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
                "IS_USER": { "BNAME": "HANDLCX02" },
                "IS_PAGE": {
                    "CURRPAGE": "1",
                    "ITEMS": "10"
                },
                "IS_PARTNER_INPUT": { "PARTNER": customeService.get_customerWorkordervalue().PARTNER}
            }

            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.customerVehicleisshow = false;
                    $cordovaToast.showShortCenter('无符合条件数据');
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
                                $.each(response.ET_VEHICL_OUTPUT.item, function (n, value) {
                                    $scope.customerVehiclelists.push(value);
                                });
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
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
                $scope.customerVehicleisshow = false;
            });
        }

       $scope.customerVehicleGoDetail = function(value){
           CarService.setData(value);
           $state.go('carDetail');
       };
    }])

