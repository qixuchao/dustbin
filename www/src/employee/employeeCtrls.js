/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
employeeModule
    .controller('userQueryCtrl',['$scope','$state','$http','HttpAppService','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading',function($scope,$state,$http,HttpAppService,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading){
        $scope.employee_userqueryflag = false;
        //获取数据列表函数
        $scope.emploadMore = function(){
            $scope.employimisshow = false
            $scope.employisshow = true;
            $scope.employLoadmore = function() {
                $scope.empitemPage = $scope.empitemPage + 1;
                var url = ROOTCONFIG.hempConfig.basePath + 'EMPLOYEE_LIST';
                var data = {
                    "I_SYSNAME": {"SysName": "CATL"},
                    "IS_PAGE": {
                        "CURRPAGE": $scope.empitemPage,
                        "ITEMS": "10"
                    },
                    "IS_EMPLOYEE": {"NAME": ''}
                }
                console.log("data"+angular.toJson(data));
                console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
                console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
                HttpAppService.post(url, data).success(function (response) {
                    console.log(angular.toJson(response.ET_EMPLOYEE.item));
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $scope.employisshow = false;
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        if(key != ""){
                            $scope.employee_query_list = [];
                        }
                    } else {
                        if (response.ES_RESULT.ZFLAG == 'S') {
                            if (response.ET_EMPLOYEE.item.length == 0) {
                                $scope.employisshow = false;
                                Prompter.hideLoading();
                                if ($scope.empitemPage == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                console.log(angular.toJson((response.ET_EMPLOYEE.item)));
                                $.each(response.ET_EMPLOYEE.item, function (n, value) {
                                    $scope.employee_query_list.push(value);
                                });
                            }
                            if (response.ET_EMPLOYEE.item.length < 10) {
                                $scope.employisshow = false;
                                if ($scope.empitemPage > 1) {
                                    //console.log("没有更多数据了");
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                            } else {
                                $scope.employisshow = true;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        }
                    }
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                    $scope.employisshow = false;
                });
            }
        };
            $scope.employLoadmoreIm = function() {
                //$scope.empitemImPage = 0;
                //$scope.employimisshow = true;
                $scope.empitemImPage = $scope.empitemImPage + 1;
                var url = ROOTCONFIG.hempConfig.basePath + 'EMPLOYEE_LIST';
                var data = {
                    "I_SYSNAME": {"SysName": "CATL"},
                    "IS_PAGE": {
                        "CURRPAGE": $scope.empitemImPage,
                        "ITEMS": "10"
                    },
                    "IS_EMPLOYEE": {"NAME": $scope.employeefiledvalue}
                }
                console.log("data"+angular.toJson(data));
                console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
                console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
                HttpAppService.post(url, data).success(function (response) {
                    console.log(angular.toJson(response.ET_EMPLOYEE.item));
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $scope.employimisshow = false;
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        if (response.ES_RESULT.ZFLAG == 'S') {
                            Prompter.hideLoading();
                            if (response.ET_EMPLOYEE.item.length == 0) {
                                $scope.employimisshow = false;
                                if ($scope.empitemImPage == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                console.log(angular.toJson((response.ET_EMPLOYEE.item)));
                                $.each(response.ET_EMPLOYEE.item, function (n, value) {
                                    $scope.employee_query_list.push(value);
                                });
                            }
                            if (response.ET_EMPLOYEE.item.length < 10) {
                                $scope.employimisshow = false;
                                if ($scope.empitemImPage > 1) {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                            } else {
                                $scope.employimisshow = true;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');

                        }
                    }
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                    $scope.employimisshow = false;
                });

            }

        //实时搜索变量初始化一次flag
        $scope.employinitflag = true;
        $scope.employlistValueunit = function(){
            $scope.empitemPage = 0;
            $scope.employee_query_list = new Array;
            $scope.emploadMore();
        };
        $scope.employlistValueunit()
        //实时搜索
        //实时搜索变量初始化一次flag
        $scope.employimminitflag = true;
        $scope.employeefiledvalue ='';
        var timer;
        $scope.$watch('employeefiledvalue', function(v1,v2) {
            if($scope.employimminitflag == true){
                $scope.employimminitflag = false;
            }else{
                $scope.employee_query_list = [];
                $scope.employee_query_list = new Array;
                $scope.empitemImPage = 0;
            };
            if( $scope.employinitflag == true){
                $scope.employinitflag = false;
            }else{
                $scope.employisshow = false;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    $scope.employee_query_list = [];
                    $scope.employee_query_list = new Array;
                    $scope.empitemImPage = 0;
                    //console.log($scope.empitemImPage)
                    //$scope.employLoadmoreIm()
                    $scope.employimisshow = true;
                    if(!$scope.$$phase) {
                        $scope.$apply();
                    }
                    $ionicScrollDelegate.resize();
                }, 1000);
            }
        });

        $scope.ll = function() {
            storedb('todo').insert({"name": $scope.employeefiledvalue}, function (err) {
                if (!err) {
                    $scope.employee_query_historylists = (storedb('todo').find().arrUniq());
                } else {
                    alert(err)
                }
            });
            if ($scope.employee_query_historylists.length > 5) {
                $scope.employee_query_historylists = $scope.employee_query_historylists.slice(0, 5);
            };
        };
        $scope.employee_userclearhis = function(){
            storedb('todo').remove();
            $scope.employee_query_historylists = [];
        };
        $scope.employee_govalue = function(value){
            employeeService.set_employeeListvalue(value);
            $state.go('userDetail');
        }
    }])
    .controller('userDetailCtrl',['$scope','$state','Prompter','HttpAppService','$cordovaInAppBrowser','$ionicLoading','$cordovaClipboard','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','employeeService','$window','$ionicActionSheet',function($scope,$state,Prompter,HttpAppService,$cordovaInAppBrowser,$ionicLoading,$cordovaClipboard,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,employeeService,$window,$ionicActionSheet){

        Prompter.showLoading("数据加载中...");
        var url = ROOTCONFIG.hempConfig.basePath + 'EMPLOYEE_DETAIL';
        var data = {
            "I_SYSNAME": { "SysName": "CATL" },
            //"IS_EMPLOYEE": { "PARTNER": employeeService.get_employeeListvalue().PARTNER}
                "IS_EMPLOYEE": { "PARTNER":'E060000051'}
        }
        HttpAppService.post(url, data).success(function (response) {
            $scope.userdetailval = response.ES_EMPLOYEE;
            $scope.userdetailcustomerlist = response.ET_RELATIONSHIP;
            Prompter.hideLoading();
        }).error(function(){
            Prompter.hideLoading();
        });

        $scope.userdetailval = employeeService.get_employeeListvalue();


        $scope.employ_showTitle = false;
        $scope.employee_showTitleStatus = false;
        $scope.employee_TitleFlag=false;

        var employee_position;
        $scope.employ_onScroll = function () {
            employee_position = $ionicScrollDelegate.getScrollPosition().top;
            if (employee_position > 24) {
                $scope.employ_TitleFlag=true;
                $scope.employ_showTitle = true;

                if (employee_position > 25) {
                    $scope.employ_customerFlag = true;
                }else{
                    $scope.employ_customerFlag = false;
                }
                if (employee_position > 26) {
                    $scope.employ_placeFlag = true;
                }else{
                    $scope.employ_placeFlag = false;
                }
                if (employee_position > 36) {
                    $scope.employ_typeFlag = true;
                }else{
                    $scope.employ_typeFlag = false;
                }
            } else {
                $scope.employ_customerFlag = false;
                $scope.employ_placeFlag = false;
                $scope.employ_typeFlag = false;
                $scope.employ_TitleFlag = false;
            }
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }

        $scope.gocustomerList = function(){
            employeeService.set_employeecustomerlist($scope.userdetailcustomerlist)
            $state.go('customerList');
        }
        $scope.userdetailval = employeeService.get_employeeListvalue();
        //电话
        $scope.employeeshowphone =function(types){
            Prompter.showphone(types)
        }
        //邮箱
        $scope.mailcopyvalue = function(valuecopy){
            Prompter.showpcopy(valuecopy)
        }

    }])
    .controller('customerListCtrl',['$scope','$state','ionicMaterialInk','employeeService',function($scope,$state,ionicMaterialInk,employeeService){
        ionicMaterialInk.displayEffect();
        console.log(employeeService.get_employeecustomerlist())
        $scope.employcustomerlist = new Array;
        $.each(employeeService.get_employeecustomerlist(), function (n, value) {
            $scope.employcustomerlist.push(value);
        });

    }])