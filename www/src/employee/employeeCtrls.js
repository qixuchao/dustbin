/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
employeeModule
    .controller('userQueryCtrl',['$scope','$state','$http','$timeout','ionicMaterialInk','employeeService','$ionicLoading',function($scope,$state,$http,$timeout,ionicMaterialInk,employeeService,$ionicLoading){
        ionicMaterialInk.displayEffect();
        $scope.employeefiledvalue ='';
        //var timer;
        //$scope.$watch('employeefiledvalue', function(v1,v2) {
        //    clearTimeout(timer);
        //    timer = setTimeout(function() {
        //        $http({
        //            url: 'src/employee/employeeList.json',
        //            method: 'GET'
        //        }).success(function (data, header, config, status) {
        //
        //        }).error(function (data, header, config, status) {
        //        });
        //    }, 1000);
        //});

        $scope.employee_userqueryflag = false;

        //$scope.employee_query_historylist = [{
        //    name:'王娇',
        //},{
        //    name:'王娇交',
        //},{
        //    name:'王欢',
        //}];
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
    .controller('userDetailCtrl',['$scope','$state','$ionicLoading','$ionicPopup','ionicMaterialInk','employeeService','$window','$ionicActionSheet',function($scope,$state,$ionicLoading,$ionicPopup,ionicMaterialInk,employeeService,$window,$ionicActionSheet){
        ionicMaterialInk.displayEffect();
        $scope.gocustomerList = function(){
            $state.go('customerList');
        }
        $scope.userdetailval = employeeService.get_employeeListvalue();
        var phone_number;
        $scope.callphone = function (phone_number) {
            $window.location.href = "tel:" + phone_number;
        };

        $scope.employeeshowphone = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '确定'},
                ],
                titleText: '是否拨打电话',
                cancelText: '取消',
                buttonClicked: function (index) {
                    if (index == 0) {
                        $scope.callphone($scope.userdetailval.phoneNumber);
                        return true;
                    }
                }
            });
        };

        $scope.employeeshowmoblie = function () {
            $ionicActionSheet.show({
                buttons: [
                    {text: '确定'},
                    {text: '保存到通讯录'},
                ],
                titleText: '是否拨打电话',
                cancelText: '取消',
                buttonClicked: function (index) {
                    if (index == 0) {
                        try{
                            $scope.callphone($scope.userdetailval.mobilenumber);
                            return true;
                        }catch(e){alert(e.message)}
                    };
                    if (index == 1) {
                        var Contact = navigator.contacts.create();
                        var phoneNumbers = [];
                        phoneNumbers[0] = new ContactField('mobile', $scope.userdetailval.mobilenumber, true);
                        if (detectOS() == "Android") {
                            Contact.displayName = $scope.userdetailval.name; // ios 不支持 displayName
                        }
                        // 判断是否是ios设备
                        if (detectOS() == "iPhone") {
                            var name = new ContactName();// add by ciwei for ios
                            name.givenName = $scope.userdetailval.name.substring(1, $scope.userdetailval.name.length);// add by ciwei  for ios
                            name.familyName = $scope.userdetailval.name.substring(0, 1);
                            Contact.name = name; // add by ciwei  for ios
                        };
                        Contact.phoneNumbers = phoneNumbers;
                        Contact.save(onSaveSuccess, onSaveError);
                    };

                    function onSaveSuccess() {
                        $ionicLoading.show({template: '添加成功', noBackdrop: true, duration: 1500});
                    }
                    function onSaveError() {
                        $ionicLoading.show({template: '添加失败', noBackdrop: true, duration: 1500});
                    }
                    return true;
                }
            })
        }
    }])
    .controller('customerListCtrl',['$scope','$state','ionicMaterialInk',function($scope,$state,ionicMaterialInk){
        ionicMaterialInk.displayEffect();
        $scope.employcustomerlist = [
            '福州景龙汽车有限个公司哈哈',
            '福州景龙汽车有限个公司哈哈',
            '福州景龙汽车有限个公司哈哈'
        ]

    }])