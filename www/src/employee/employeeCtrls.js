/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
employeeModule
    .controller('userQueryCtrl',['$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading',function($scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading){

        $scope.EmployeeListHistoryval = function(){
            if(storedb('employdb').find().arrUniq() != undefined || storedb('employdb').find().arrUniq() != null){
                $scope.employee_userqueryflag = false;
                $scope.employee_query_historylists = (storedb('employdb').find().arrUniq());
                if ($scope.employee_query_historylists.length > 5) {
                    $scope.employee_query_historylists = $scope.employee_query_historylists.slice(0, 5);
                };
            }else{
                $scope.employee_userqueryflag = true;
            };
        };
        $scope.EmployeeListHistoryval();


        //广播修改界面显示flag
        $rootScope.$on('employeedeatillist', function(event, data) {
            console.log("接收成功")
            $scope.employ.employeefiledvalue ='';
            $scope.EmployeeListHistoryval();
        });

        //获取数据列表函数
        $scope.employLoadmore = function(){
            //$scope.employisshow = true;
                $scope.empitemPage = $scope.empitemPage + 1;
                var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST';
                var data = {
                    "I_SYSNAME": {"SysName": "CATL"},
                    "IS_PAGE": {
                        "CURRPAGE": $scope.empitemPage,
                        "ITEMS": "10"
                    },
                    "IS_EMPLOYEE": {"NAME":$scope.employ.employeefiledvalue}
                }
                console.log("data"+angular.toJson(data));
                console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
                console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
                HttpAppService.post(url, data).success(function (response) {
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $scope.employisshow = false;
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
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
        //input输入框监听
        //实时搜索
        $scope.employ ={employeefiledvalue :''}
        var employeetimer;
        setTimeout(function(){
            document.getElementById('employeequeryinput').style.display = "none";
            document.getElementById('employeeinputvalueid').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
                if(!$scope.$$phase) {
                    $scope.$apply();
                };
                $scope.employisshow = false;
                clearTimeout(employeetimer);
                employeetimer = setTimeout(function() {
                    if (document.getElementById('employeeinputvalueid').value.length > 0) {
                        document.getElementById('employeequeryinput').style.display = "inline-block";
                        $scope.$apply(function(){
                            $scope.employisshow = false;
                            //删除请求
                            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST')
                            $scope.employee_query_list = [];
                            $scope.employee_query_list = new Array;
                            $scope.empitemPage = 0;
                        });
                        $scope.employee_userqueryflag = true;
                        $ionicScrollDelegate.resize();
                        $scope.employisshow = true;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        };
                    } else {
                        //删除请求
                        $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST');
                        $scope.employee_userqueryflag = false;
                        $scope.employisshow = false;
                        $scope.employee_query_list = [];
                        $scope.empitemPage = 0;
                        if(!$scope.$$phase) {
                            $scope.$apply();
                        };
                        $ionicScrollDelegate.resize();
                        document.getElementById('employeequeryinput').style.display = "none";
                    }
                }, 500);
            });
        },50);

        //清除历史记录
        $scope.employeeiputDeletevalue = function(){
            $scope.employ.employeefiledvalue = '';

        };
        $scope.employee_userClearhis = function(){
            storedb('employdb').remove();
            $scope.employee_query_historylists = [];
        };
        //点击历史记录开始请求
        $scope.EmployHisGetvalue = function(value){
            $scope.employ.employeefiledvalue = value.name;
            $scope.employee_query_list = [];
            $scope.employee_query_list = new Array;
            $scope.empitemPage = 0;
            $scope.employee_userqueryflag = true;
            $ionicScrollDelegate.resize();
            $scope.employisshow = true;
            if(!$scope.$$phase) {
                $scope.$apply();
            };
        }
        //进入详细界面传递标识
        $scope.employee_govalue = function(value){
                $scope.employisshow = false;
                //存储历史记录
                storedb('employdb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                    if (!err) {
                        console.log('历史记录保存成功')
                    } else {
                        $cordovaToast.showShortBottom('历史记录保存失败');
                    }
                });
            employeeService.set_employeeListvalue(value);
            $state.go('userDetail');
        }
    }])
    .controller('userDetailCtrl',['$scope','$state','$rootScope','$ionicHistory','Prompter','HttpAppService','$cordovaInAppBrowser','$ionicLoading','$cordovaClipboard','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','employeeService','$window','$ionicActionSheet',function($scope,$state,$rootScope,$ionicHistory,Prompter,HttpAppService,$cordovaInAppBrowser,$ionicLoading,$cordovaClipboard,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,employeeService,$window,$ionicActionSheet){
        ////返回回退
        $scope.employgoBack = function() {
            console.log("返回成功")
            $rootScope.$broadcast('employeedeatillist');
            $ionicHistory.goBack();
        }


        Prompter.showLoading("数据加载中...");
        var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_DETAIL';
        var data = {
            "I_SYSNAME": { "SysName": "CATL" },
            "IS_EMPLOYEE": { "PARTNER": employeeService.get_employeeListvalue().PARTNER}
            //    "IS_EMPLOYEE": { "PARTNER":'E060000051'}
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
        $.each(employeeService.get_employeecustomerlist().item, function (n, value) {
            $scope.employcustomerlist.push(value);
        });

    }])