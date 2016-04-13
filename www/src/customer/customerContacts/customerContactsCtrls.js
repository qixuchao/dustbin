/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerContactsModule
    .controller('customerContactQueryCtrl',['$scope','$rootScope','$state','$http','HttpAppService','$cordovaToast','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','contactService','$ionicLoading',function($scope,$rootScope,$state,$http,HttpAppService,$cordovaToast,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,contactService,$ionicLoading){

        $ionicPopover.fromTemplateUrl('src/customer/model/customercontact_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerContactspopover = popover;
        });
        $scope.customerContactsopenpopv = function() {
            $scope.customerContactspopover.show();
        };
        $scope.customerContactsPopoverhide = function() {
            $scope.customerContactspopover.hide();
        };
        //alert(1)
        //调用接口数据
        //获取数据列表函数
        $scope.customercontactisshow = true;
        $scope.customerContacts_query_list = new Array();
        $scope.customerContacts_query_list = [];
        $scope.customercontactPage = 0;
        $scope.customercontactLoadmore = function(){
            $scope.customercontactisshow = true;
            $scope.customercontactPage = $scope.customercontactPage + 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST';
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": "handlcx02" },
                "IS_PAGE": {
                    "CURRPAGE": $scope.customercontactPage,
                    "ITEMS": "10"
                },
                "IS_PARTNER": { "PARTNER": "000008878A" },
                "IS_SEARCH": { "SEARCH": "" }
            };
            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.customercontactisshow = false;
                    $cordovaToast.showShortCenter('无符合条件数据');
                } else {
                    if (response.ES_RESULT.ZFLAG == 'S') {
                        if (response.ET_EMPLOYEE.item.length == 0) {
                            $scope.customercontactisshow = false;
                            Prompter.hideLoading();
                            if ($scope.customercontactPage == 1) {
                                $cordovaToast.showShortBottom('数据为空');
                            } else {
                                $cordovaToast.showShortBottom('没有更多数据');
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            $.each(response.ET_EMPLOYEE.item, function (n, value) {
                                $scope.customerContacts_query_list.push(value);
                            });
                        }
                        if (response.ET_EMPLOYEE.item.length < 10) {
                            $scope.customercontactisshow = false;
                            if ($scope.customercontactPage > 1) {
                                //console.log("没有更多数据了");
                                $cordovaToast.showShortBottom('没有更多数据');
                            }
                        } else {
                            $scope.customercontactisshow = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    }
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
                $scope.customercontactisshow = false;
            });
        }



        //$scope.customerContacts_query_list = [{
        //    name: '王雨薇',
        //    sex:'女',
        //    keuhuname:'金龙客车',
        //    dizhiname:'福建省福州市芙蓉大道20号',
        //    xioshouyung:'张俊华',
        //    phonenumber:'021-88223765',
        //    customermail:'yuwei.wang@hand-china.com',
        //    postion:'采购部',
        //    atend:'采购助理',
        //    customercontrary:'中国',
        //    customerregion:'河南省',
        //    youbina:'555876',
        //    birthday:'2016.08.21',
        //    'customerzhushi':'in the feahennmkk in the feahennmkk in the feahennmkk in the feahennmkk'
        //}];

        $scope.customerContacts_godetails = function(x){
            customeService.set_customerContactsListvalue(x);
            $state.go('customerContactDetail');
        };

        //创建联系人
        $scope.customercontact_types = [
            {
                type:"扫描名片创建联系人",
                url:""
            },
            {
                type:"手动创建新联系人",
                url:'ContactCreate'
            }
        ];
        $scope.customerContactsqueryType = function(types){
            console.log(types)
            if(types.url){
                $state.go(types.url);
                //从客户联系人进入创建联系人界面设置一个标记
                if(types.type == "手动创建新联系人"){
                    contactService.set_ContactCreateflagfalse();
                    alert(contactService.get_ContactCreateflag())
                }
            }
            $scope.customerContactsPopoverhide();
        };
        //接收广播创建取数据
        $rootScope.$on('customercontactCreatevalue', function(event, data) {
            console.log(contactService.get_ContactCreatevalue())
        });


    }])
    .controller('customerContactDetailCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){

        $scope.customer_detailstypes = [{
            typemane:'活动',
            imgurl:'img/customer/customerhuod.png',
        },{
            typemane:'机会',
            imgurl:'img/customer/customerjihui@2x.png',
        },{
            typemane:'角色',
            imgurl:'img/customer/customergongd@2x.png',
        },{
            typemane:'关系',
            imgurl:'img/customer/customerxians@2x.png',
        }];

        $scope.customerContacts_showTitle = false;
        $scope.customerContacts_showTitleStatus = false;
        $scope.customerContacts_TitleFlag=false;

        var customerContacts_position;
        $scope.customerContacts_onScroll = function () {
            customerContacts_position = $ionicScrollDelegate.getScrollPosition().top;
            console.log(customerContacts_position);
            if (customerContacts_position > 16) {
                $scope.customerContacts_TitleFlag = true;
                $scope.customerContacts_showTitle = true;

                if (customerContacts_position > 20) {
                    $scope.customerContacts_customerFlag = true;
                } else {
                    $scope.customer_customerFlag = false;
                }
                if (customerContacts_position > 28) {
                    $scope.customerContacts_placeFlag = true;
                } else {
                    $scope.customerContacts_placeFlag = false;
                }
                if (customerContacts_position > 44) {
                    $scope.customerContacts_addressFlag = true;
                } else {
                    $scope.customerContacts_addressFlag = false;
                }
                if (customerContacts_position > 68) {
                    $scope.customerContacts_empolFlag = true;
                } else {
                    $scope.customerContacts_empolFlag = false;
                }
                if (customerContacts_position > 80) {
                    $scope.customerContacts_typeFlag = true;
                } else {
                    $scope.customerContacts_typeFlag = false;
                }
            } else {
                $scope.customerContacts_customerFlag = false;
                $scope.customerContacts_placeFlag = false;
                $scope.customerContacts_typeFlag = false;
                $scope.customerContacts_addressFlag = false;
                $scope.customerContacts_empolFlag = false;
                $scope.customerContacts_TitleFlag = false;
            }
            $scope.$apply();
        }

        $scope.customerdetails = customeService.get_customerContactsListvalue();

    }])

