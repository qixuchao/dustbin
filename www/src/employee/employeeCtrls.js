/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
employeeModule
    .controller('userQueryCtrl',['$scope','$state','$http','HttpAppService','$timeout','$ionicScrollDelegate','ionicMaterialInk','employeeService','$ionicLoading',function($scope,$state,$http,HttpAppService,$timeout,$ionicScrollDelegate,ionicMaterialInk,employeeService,$ionicLoading){

        var data = {
            "I_SYSNAME": { "SysName": "CATL" },
            "IS_PAGE": {
                "CURRPAGE": "1",
                "ITEMS": "10"
            },
            "IS_EMPLOYEE": { "NAME": "" }
        }
        var url =ROOTCONFIG.hempConfig.basePath + 'EMPLOYEE_LIST';
        HttpAppService.post(url, data).success(function(response) {

        }).error(function(){

        })

       //头部上拉滑动
       ionicMaterialInk.displayEffect();
        $scope.employeefiledvalue ='';
        var timer;
        $scope.$watch('employeefiledvalue', function(v1,v2) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                $http({
                    url: 'src/employee/employeeList.json',
                    method: 'GET'
                }).success(function (data, header, config, status) {

                }).error(function (data, header, config, status) {
                });
            }, 1000);
        });
        $scope.employee_userqueryflag = false;
        $scope.employeeQuery = function(){
            console.log(1);
        }
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
        }


        $scope.employee_query_list = [{
            name:'王雨薇',
            sex:'女',
            phoneNumber:'021-67534444',
            mobilenumber:13759941764,
            useid:'100000220',
            email:'yuwei.wang@hand-china.com'
        },{
            name:'龚克',
            sex:'女',
            phoneNumber:'021-67534444',
            mobilenumber:13759941764,
            useid:'100000220',
            email:'yuwei.wang@hand-china.com'
        },{
            name:'王雨薇',
            sex:'女',
            phoneNumber:'021-67534444',
            mobilenumber:13759941764,
            useid:'100000220',
            email:'yuwei.wang@hand-china.com'
        },{
            name:'王雨薇',
            sex:'女',
            phoneNumber:'021-67534444',
            mobilenumber:13759941764,
            useid:'100000220',
            email:'yuwei.wang@hand-china.com'
        }];
        $scope.employee_govalue = function(value){
            employeeService.set_employeeListvalue(value);
            $state.go('userDetail');
        }
    }])
    .controller('userDetailCtrl',['$scope','$state','Prompter','$cordovaInAppBrowser','$ionicLoading','$cordovaClipboard','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','employeeService','$window','$ionicActionSheet',function($scope,$state,Prompter,$cordovaInAppBrowser,$ionicLoading,$cordovaClipboard,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,employeeService,$window,$ionicActionSheet){
        ionicMaterialInk.displayEffect();

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
            $scope.$apply();
        }

        $scope.gocustomerList = function(){
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
    .controller('customerListCtrl',['$scope','$state','ionicMaterialInk',function($scope,$state,ionicMaterialInk){
        ionicMaterialInk.displayEffect();
        $scope.employcustomerlist = [
            '福州景龙汽车有限个公司哈哈',
            '福州景龙汽车有限个公司哈哈',
            '福州景龙汽车有限个公司哈哈'
        ];
        $scope.employeecustomerQuery = function(){
            console.log(2);
        }

    }])