/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerContactsModule
    .controller('customerContactQueryCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){

        $ionicPopover.fromTemplateUrl('../src/customer/model/customercontact_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerContactspopover = popover;
        });
        $scope.customerContactsopenpopv = function($event) {
            $scope.customerContactspopover.show($event);
            document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.customerContactsPopoverhide = function() {
            $scope.customerContactspopover.hide();
            document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
        };
        $scope.customercontact_types = ["扫描名片创建联系人","手动创建新联系人"]
        $scope.customerContacts_query_list = [{
            name: '王雨薇',
            sex:'女',
            keuhuname:'金龙客车',
            dizhiname:'福建省福州市芙蓉大道20号',
            xioshouyung:'张俊华',
            phonenumber:'021-88223765',
            customermail:'yuwei.wang@hand-china.com',
            postion:'采购部',
            atend:'采购助理',
            customercontrary:'中国',
            customerregion:'河南省',
            youbina:'555876',
            birthday:'2016.08.21',
            'customerzhushi':'in the feahennmkk in the feahennmkk in the feahennmkk in the feahennmkk'
        }];

        $scope.customerContacts_godetails = function(x){
            customeService.set_customerContactsListvalue(x);
            $state.go('customerContactDetail');
        }

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

