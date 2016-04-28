/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
employeeModule
    .controller('userQueryCtrl',['$ionicActionSheet','$window','$scope','$state','$http','HttpAppService','$rootScope','$timeout','$cordovaToast','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter','$ionicLoading',
        function($ionicActionSheet,$window,$scope,$state,$http,HttpAppService,$rootScope,$timeout,$cordovaToast,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter,$ionicLoading){
        $scope.searchFlag=false;
        $scope.employ={
            employeefiledvalue:''
        };
        $scope.EmployeeListHistoryval = function(){
            $scope.employee_userqueryflag = false;
            if(storedb('employdb').find() != undefined || storedb('employdb').find() != null){
                $scope.employee_query_historylists = (storedb('employdb').find());
                if ($scope.employee_query_historylists.length > 5) {
                    $scope.employee_query_historylists = $scope.employee_query_historylists.slice(0, 5);
                };
            };

            //常用联系人显示
            if (JSON.parse(localStorage.getItem("usuaemploydb")) != null || JSON.parse(localStorage.getItem("usuaemploydb")) != undefined) {
                $scope.usuaemployee_query_list = JSON.parse(localStorage.getItem("usuaemploydb"));
                if ($scope.usuaemployee_query_list.length > 15) {
                    $scope.usuaemployee_query_list = $scope.usuaemployee_query_list.slice(0, 15);
                };
            } else {
                $scope.usuaemployee_query_list = [];
            };
        };
        $scope.EmployeeListHistoryval();


        //广播修改界面显示flag
        $rootScope.$on('employeedeatillist', function(event, data) {
            //数据初始化
            //删除请求
            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST');
            $scope.employee_userqueryflag = false;
            $scope.employisshow = false;
            $scope.employee_query_list = [];
            $scope.empitemPage = 0;

            $scope.employ.employeefiledvalue ='';
            $scope.EmployeeListHistoryval();
        });

        //获取数据列表函数
        $scope.employLoadmore = function(){
            //$scope.employisshow = true;
                $scope.empitemPage += 1;
                var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST';
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_PAGE": {
                        "CURRPAGE": $scope.empitemPage,
                        "ITEMS": "10"
                    },
                    "IS_EMPLOYEE": {"NAME":$scope.employ.employeefiledvalue}
                };
                //console.log("data"+angular.toJson(data));
                //console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
                //console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
                HttpAppService.post(url, data).success(function (response) {
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $scope.employisshow = false;
                        $cordovaToast.showShortCenter('无符合条件数据');
                    } else {
                        if (response.ES_RESULT.ZFLAG == 'S') {

                            if(response.ET_EMPLOYEE != '') {

                                if (response.ET_EMPLOYEE.item.length == 0) {
                                    $scope.employisshow = false;
                                    Prompter.hideLoading();
                                    if ($scope.empitemPage == 1) {
                                        $cordovaToast.showShortBottom('数据为空');
                                    } else {
                                        $cordovaToast.showShortBottom('没有更多数据');
                                    }
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                } else {
                                    console.log(angular.toJson((response.ET_EMPLOYEE.item)));
                                    $.each(response.ET_EMPLOYEE.item, function (n, value) {
                                        if($scope.employ.employeefiledvalue===""){
                                            $scope.employee_query_list=new Array;
                                        }else{
                                            $scope.employee_query_list.push(value);
                                        }

                                    });
                                }
                                if (response.ET_EMPLOYEE.item.length < 10) {
                                    $scope.employisshow = false;
                                    if ($scope.empitemPage > 1) {
                                        //console.log("没有更多数据了");
                                        $cordovaToast.showShortBottom('没有更多数据');
                                    }
                                } else {
                                    $scope.employisshow = true;
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }else{
                                $cordovaToast.showShortBottom('搜索数据为空');
                            }

                        };
                    }
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                    $scope.employisshow = false;
                });
            }
        //input输入框监听
        //实时搜索
        $scope.initLoad=function(){
            //$http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST');
            $scope.empitemPage = 0;
            $scope.employee_query_list=new Array;
            Prompter.showLoading("正在加载");
            $scope.employLoadmore();
        };
        $scope.search = function (x, e){
            Prompter.showLoading('正在搜索');
            $scope.searchFlag=true;
            $scope.employ.employeefiledvalue = x;
            $scope.initLoad();
        };
        $scope.cancelSearch=function(){
            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
            $scope.searchFlag=false;
            $scope.employ.employeefiledvalue = '';
            $scope.employee_query_list=new Array;
            $scope.EmployeeListHistoryval();
            //$scope.conitemImPage=0;
        };
        //显示搜索页面
        $scope.changePage=function(){
            $scope.searchFlag=true;
        };
        $rootScope.$on('employeeBack',function(event, data) {
            console.log("接收成功" + data);
            $scope.searchFlag = data;
            $scope.employ.employeefiledvalue = "";
            $scope.cancelSearch();
        });
        //清除输入框内的内容
        $scope.initSearch = function () {
            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST')
            $scope.employ.employeefiledvalue = '';
            $scope.empitemPage=0;
            $scope.employee_query_list=new Array;
            Prompter.showLoading("正在加载")
            $scope.employLoadmore();
        };
        //var employeetimer;
        //setTimeout(function(){
        //    document.getElementById('employeequeryinput').style.display = "none";
        //    document.getElementById('employeeinputvalueid').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
        //        if(!$scope.$$phase) {
        //            $scope.$apply();
        //        };
        //        $scope.employisshow = false;
        //        clearTimeout(employeetimer);
        //        employeetimer = setTimeout(function() {
        //            if (document.getElementById('employeeinputvalueid').value.length > 0) {
        //                document.getElementById('employeequeryinput').style.display = "inline-block";
        //                $scope.$apply(function(){
        //                    $scope.employisshow = false;
        //                    //删除请求
        //                    $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST')
        //                    $scope.employee_query_list = [];
        //                    $scope.employee_query_list = new Array;
        //                    $scope.empitemPage = 0;
        //                });
        //                $scope.employee_userqueryflag = true;
        //                $ionicScrollDelegate.resize();
        //                $scope.employisshow = true;
        //                if(!$scope.$$phase) {
        //                    $scope.$apply();
        //                };
        //            } else {
        //                //删除请求
        //                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST');
        //                $scope.employee_userqueryflag = false;
        //                $scope.employisshow = false;
        //                $scope.employee_query_list = [];
        //                $scope.empitemPage = 0;
        //                if(!$scope.$$phase) {
        //                    $scope.$apply();
        //                };
        //                $ionicScrollDelegate.resize();
        //                document.getElementById('employeequeryinput').style.display = "none";
        //            }
        //        }, 500);
        //    });
        //},50);

        //清除历史记录
        $scope.employeeiputDeletevalue = function(){
            $http['delete'](ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST');
            $scope.employee_userqueryflag = false;
            $scope.employisshow = false;
            $scope.employee_query_list = [];
            $scope.empitemPage = 0;
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
        };
        //电话
        //$scope.employeequeryphone =function(types){
        //    if(types == undefined || types == ""){
        //        $cordovaToast.showShortBottom('没有数据');
        //    }else{
        //        Prompter.showphone(types)
        //    }
        //}
        //拨打电话
        $scope.employeequeryphone = function(data){
            //console.log(angular.toJson(data));
            //console.log(data.TEL_NUMBER);
            if((data.TEL_NUMBER==undefined) && (data.MOB_NUMBER==undefined)){
                $cordovaToast.showShortBottom('无号码');
            }else{
                var number=[];
                if(data.TEL_NUMBER!==undefined){
                    number.push({text:data.TEL_NUMBER});
                    //console.log(number);
                }
                if(data.MOB_NUMBER!==undefined){
                    number.push({text:data.MOB_NUMBER});
                    //console.log(number);
                }

                $ionicActionSheet.show({
                    buttons:number,
                    titleText: '拨打电话',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        if (index == 0) {
                            $window.location.href = "tel:" + data.TEL_NUMBER;
                            return true;
                        };
                        if (index == 1) {
                            $window.location.href = "tel:" + data.MOB_NUMBER;
                            return true;
                        }
                    }
                })
            }
        };
        //进入详细界面传递标识
        //初始化本地数据
        if (JSON.parse(localStorage.getItem("usuaemploydb")) != null || JSON.parse(localStorage.getItem("usuaemploydb")) != undefined) {
            $scope.employeehislistvalue = JSON.parse(localStorage.getItem("usuaemploydb"));
        }else{
            $scope.employeehislistvalue = new Array;
        }

        $scope.employee_govalue = function(value){
            $scope.employisshow = false;
            $scope.usuallyemployeelist = value;
            //存储历史记录

            //存储历史记录
            if($scope.employ.employeefiledvalue != ''){
                if(storedb('employdb').find() != undefined || storedb('employdb').find() != null){
                    var employeehislistvalue = storedb('employdb').find();
                    var employeehislistvaluelength = storedb('employdb').find().length;
                    //判断是否有相同的值
                    var emplyeehislistflag = true;
                    for(var i=0;i<employeehislistvaluelength;i++){
                        if(employeehislistvalue[i].name ==  $scope.employ.employeefiledvalue) {
                            //删除原有的，重新插入
                            storedb('employdb').remove({"name":employeehislistvalue[i].name}, function (err) {
                                if (!err) {
                                } else {
                                }

                            })
                            storedb('employdb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            emplyeehislistflag = false;
                        }
                    };
                    if(emplyeehislistflag == true){
                        storedb('employdb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                            if (!err) {
                            } else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }else{
                    storedb('employdb').insert({"name": $scope.employ.employeefiledvalue}, function (err) {
                        if (!err) {
                        } else {
                            $cordovaToast.showShortBottom('历史记录保存失败');
                        }
                    });
                };
            };


            //存储常用联系人
            if (JSON.parse(localStorage.getItem("usuaemploydb")) != null || JSON.parse(localStorage.getItem("usuaemploydb")) != undefined) {
                //判断是否有相同的值
                var usuaemployhislistflag = true;
                for(var i=0;i<$scope.employeehislistvalue.length;i++){
                    if($scope.employeehislistvalue[i].NAME_LAST == $scope.usuallyemployeelist.NAME_LAST) {
                        //删除原有的，重新插入
                        $scope.employeehislistvalue = JSON.parse(localStorage.getItem("usuaemploydb"));
                        $scope.employeehislistvalue.splice(i,1);
                        $scope.employeehislistvalue.unshift($scope.usuallyemployeelist);
                        localStorage['usuaemploydb'] = JSON.stringify( $scope.employeehislistvalue);
                        usuaemployhislistflag = false;
                    }
                };
                if(usuaemployhislistflag == true){
                    $scope.employeehislistvalue.unshift($scope.usuallyemployeelist);
                    localStorage['usuaemploydb'] = JSON.stringify( $scope.employeehislistvalue);
                }

            }else{
                $scope.employeehislistvalue.unshift($scope.usuallyemployeelist);
                localStorage['usuaemploydb'] = JSON.stringify( $scope.employeehislistvalue);
            };




            employeeService.set_employeeListvalue(value);
            $state.go('userDetail');
        }
    }])
    .controller('userDetailCtrl',['$scope','$state','$rootScope','$ionicHistory','Prompter','HttpAppService','$cordovaInAppBrowser','$ionicLoading','$cordovaToast','$cordovaClipboard','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','employeeService','$window','$ionicActionSheet',
        function($scope,$state,$rootScope,$ionicHistory,Prompter,HttpAppService,$cordovaInAppBrowser,$ionicLoading,$cordovaToast,$cordovaClipboard,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,employeeService,$window,$ionicActionSheet){
        ////返回回退
        $scope.employgoBack = function() {
            console.log("返回成功")
            $rootScope.$broadcast('employeeBack','false');
            $rootScope.$broadcast('employeedeatillist');
            $ionicHistory.goBack();
        }


        Prompter.showLoading("数据加载中...");
        $scope.updateCustomer=function(){
            var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_DETAIL';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_EMPLOYEE": { "PARTNER": employeeService.get_employeeListvalue().PARTNER}
            };
            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG == 'S') {
                    if (response.ES_EMPLOYEE != "") {
                        $scope.userdetailval = response.ES_EMPLOYEE;
                    }
                    if (response.ET_RELATIONSHIP != '') {
                        $scope.userdetailcustomerlist = response.ET_RELATIONSHIP;
                    }
                    Prompter.hideLoading();
                }else if (response.ES_RESULT.ZFLAG == 'E') {
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }
            }).error(function(){
                Prompter.hideLoading();
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        $scope.updateCustomer();
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
                if(fromState && toState && fromState.name == 'customerList'){
                    $scope.updateCustomer();
                }
            });
        $scope.gocustomerList = function(){
            employeeService.set_employeecustomerlist($scope.userdetailcustomerlist);
            $state.go('customerList');
        };
        $scope.userdetailval = employeeService.get_employeeListvalue();

        //邮箱
        $scope.mailcopyvalue = function(valuecopy){
            if(valuecopy == undefined || valuecopy == ""){
                $cordovaToast.showShortBottom('没有数据');
            }else{
                Prompter.showpcopy(valuecopy)
            }
        }

    }])
    .controller('customerListCtrl',['Prompter','$scope','$rootScope','$state','$cordovaToast','$ionicModal','HttpAppService','saleActService','$ionicScrollDelegate','ionicMaterialInk','employeeService',
        function(Prompter,$scope,$rootScope,$state,$cordovaToast,$ionicModal,HttpAppService,saleActService,$ionicScrollDelegate,ionicMaterialInk,employeeService){
        ionicMaterialInk.displayEffect();
        console.log(employeeService.get_employeecustomerlist());
        $scope.employcustomerlist = new Array;
        if(employeeService.get_employeecustomerlist() == undefined){
            $scope.employcustomerlist = [];
            $cordovaToast.showShortBottom('没有负责客户');
        }else{
            $.each(employeeService.get_employeecustomerlist().item, function (n, value) {
                $scope.employcustomerlist.push(value);
            });
        }

        //增加客戶
        //选择客户

        var customerPage = 1;
        $scope.customerArr = [];
        $scope.customerSearch = false;
        $scope.getCustomerArr = function (search) {
            $scope.CustomerLoadMoreFlag = false;
            if (search) {
                $scope.customerSearch = false;
                customerPage = 1;
            } else {
                $scope.spinnerFlag = true;
            }
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_PAGE": {
                    "CURRPAGE": customerPage++,
                    "ITEMS": "10"
                },
                "IS_SEARCH": {"SEARCH": search},
                "IT_IN_ROLE": {}
            };
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                .success(function (response) {
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        if (response.ET_OUT_LIST.item.length < 10) {
                            $scope.CustomerLoadMoreFlag = false;
                        }
                        if (search) {
                            $scope.customerArr = response.ET_OUT_LIST.item;
                        } else {
                            $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                        }
                        $scope.spinnerFlag = false;
                        $scope.customerSearch = true;
                        $scope.CustomerLoadMoreFlag = true;
                        $ionicScrollDelegate.resize();
                        //saleActService.customerArr = $scope.customerArr;
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    }
                });
        };
        $scope.getCustomerArr();

        //选择客户
        $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function (modal) {
            $scope.selectCustomerModal = modal;
        });
        $scope.customerModalArr = saleActService.getCustomerTypes();
        $scope.selectCustomerText = '竞争对手';
        $scope.employeeselectCustomer = function () {
            $scope.isDropShow = true;
            $scope.customerSearch = true;
            $scope.selectCustomerModal.show();
        };
        $scope.closeSelectCustomer = function () {
            $scope.selectCustomerModal.hide();
        };
        $scope.selectPop = function (x) {
            $scope.selectCustomerText = x.text;
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.changeReferMoreflag = function () {
            $scope.referMoreflag = !$scope.referMoreflag;
        };
        $scope.showChancePop = function () {
            $scope.referMoreflag = true;
            $scope.isDropShow = true;
        };
        $scope.initCustomerSearch = function () {
            $scope.input.customer = '';
            //$scope.getCustomerArr();
            $timeout(function () {
                document.getElementById('selectCustomerId').focus();
            }, 1)
        };
        //更新客户列表
        $scope.updateCustomer=function(){
            var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_DETAIL';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_EMPLOYEE": { "PARTNER": employeeService.get_employeeListvalue().PARTNER}
            };
            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                } else if(response.ET_RELATIONSHIP != ''){
                    console.log(angular.toJson(response.ET_RELATIONSHIP));
                    $scope.employcustomerlist=response.ET_RELATIONSHIP.item;
                    }
                Prompter.hideLoading();
            }).error(function(){
                Prompter.hideLoading();
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        //添加客户
        $scope.selectCustomer = function (x) {
             console.log(x);
            var url=ROOTCONFIG.hempConfig.basePath + 'STAFF_EDIT';
            var data={
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_RELATIONSHIP": {
                    "RELNR": "",
                    "RELTYP": "BUR011",
                    "PARTNER1": x.PARTNER,
                    "PARTNER2": employeeService.get_employeeListvalue().PARTNER,
                    "XDFREL": "",
                    "DATE_FROM": "",
                    "DATE_TO": "",
                    "MODE": "A"
                }
            };
            console.log(x.PARTNER);
            console.log(employeeService.get_employeeListvalue().PARTNER);
            HttpAppService.post(url,data).success(function(response){
                if(response.ES_RESULT.ZFLAG=="E"){
                    console.log(response.ES_RESULT.ZRESULT);
                  $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }else{

                    $scope.employcustomerlist=new Array;
                    $scope.updateCustomer();
                    console.log("添加成功");
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT)
                }
            });
            //$scope.getCustomerArr();
            $scope.contactsLoadMoreFlag = true;
            //$scope.getContacts();
            $scope.selectCustomerModal.hide();
        };
        //删除客户信息
        $scope.deleteCustomer=function(customer){
            console.log(customer);
            var url=ROOTCONFIG.hempConfig.basePath + 'STAFF_EDIT';
            var data={
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_RELATIONSHIP": {
                    "RELNR": "",
                    "RELTYP": "BUR011",
                    "PARTNER1": customer.PARTNER,
                    "PARTNER2": employeeService.get_employeeListvalue().PARTNER,
                    "XDFREL": "",
                    "DATE_FROM": "",
                    "DATE_TO": "",
                    "MODE": "D"
                }
            };
            console.log(customer.PARTNER);
            console.log(customer.PARTNER);
            HttpAppService.post(url,data).success(function(response) {
                if (response.ES_RESULT.ZFLAG == "E") {
                    console.log(response.ES_RESULT.ZRESULT);
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }else {
                    $scope.employcustomerlist=new Array;
                    $scope.updateCustomer();
                    //$scope.employcustomerlist.splice(i,1);
                    console.log("删除成功");
                }
            })
        };
        $scope.$on('$destroy', function () {
            //$scope.createPop.remove();
            //$scope.createModal.remove();
            //$scope.selectPersonModal.remove();
            $scope.selectCustomerModal.remove();
        });
    }]);