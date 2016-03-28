/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
ContactsModule
    .controller('contactQueryCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','contactService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,contactService,$ionicLoading){
        $ionicPopover.fromTemplateUrl('../src/contacts/model/contact_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.Contactspopover = popover;
        });
        $scope.Contactsopenpopv = function($event) {
            $scope.Contactspopover.show($event);
            document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.ContactsPopoverhide = function() {
            $scope.Contactspopover.hide();
            document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
        };
        $scope.contact_types = ["扫描名片创建联系人","手动创建新联系人"]
        $scope.contact_query_list = [{
            name: '王雨薇',
            sex:'女',
            keuhuname:'金龙客车',
            dizhiname:'福建省福州市芙蓉大道20号',
            xioshouyung:'张俊华',
            phonenumber:'021-88223765',
            mobilenumber:'123765892773',
            customermail:'yuwei.wang@hand-china.com',
            postion:'采购部',
            atend:'采购助理',
            customercontrary:'中国',
            customerregion:'河南省',
            youbina:'555876',
            birthday:'2016.08.21',
            'customerzhushi':'in the feahennmkk in the feahennmkk in the feahennmkk in the feahennmkk'
        }];
        $scope.Contacts_godetails = function(x){
            contactService.set_ContactsListvalue(x);
            $state.go('ContactDetail');
        }
    }])
    .controller('contactDetailCtrl',['$scope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.customer_detailstypes = [{
            typemane:'活动',
            imgurl:'img/customer/customerhuod.png',
        },{
            typemane:'机会',
            imgurl:'img/customer/customerjihui@2x.png',
        },{
            typemane:'角色',
            imgurl:'img/contact/role@2x.png',
        },{
            typemane:'关系',
            imgurl:'img/contact/relationship@2x.png',
        }];

        $scope.Contacts_showTitle = false;
        $scope.Contacts_showTitleStatus = false;
        $scope.Contacts_TitleFlag=false;

        var Contacts_position;
        $scope.customerContacts_onScroll = function () {
            Contacts_position = $ionicScrollDelegate.getScrollPosition().top;
            if (Contacts_position > 16) {
                $scope.Contacts_TitleFlag = true;
                $scope.Contacts_showTitle = true;

                if (Contacts_position > 20) {
                    $scope.Contacts_customerFlag = true;
                } else {
                    $scope.Contacts_customerFlag = false;
                }
                if (Contacts_position > 28) {
                    $scope.Contacts_placeFlag = true;
                } else {
                    $scope.Contacts_placeFlag = false;
                }
                if (Contacts_position > 44) {
                    $scope.Contacts_addressFlag = true;
                } else {
                    $scope.Contacts_addressFlag = false;
                }
                if (Contacts_position > 68) {
                    $scope.Contacts_empolFlag = true;
                } else {
                    $scope.Contacts_empolFlag = false;
                }
                if (Contacts_position > 80) {
                    $scope.Contacts_phoneFlag = true;
                } else {
                    $scope.Contacts_phoneFlag = false;
                }
                if (Contacts_position > 95) {
                    $scope.Contacts_mobileFlag = true;
                } else {
                    $scope.Contacts_mobileFlag = false;
                }
            } else {
                $scope.Contacts_customerFlag = false;
                $scope.Contacts_placeFlag = false;
                $scope.Contacts_typeFlag = false;
                $scope.Contacts_addressFlag = false;
                $scope.Contacts_empolFlag = false;
                $scope.Contacts_TitleFlag = false;
            }
            $scope.$apply();
        }

        //电话
        $scope.contactshowphone =function(types){
            Prompter.showphone(types)
        }
        //邮箱
        $scope.contactmailcopyvalue = function(valuecopy){
            Prompter.showpcopy(valuecopy)
        };

        $scope.customerdetails = contactService.get_ContactsListvalue();
    }])
    .controller('contactCreateCtrl',['$scope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','customeService','$window','$ionicActionSheet',function($scope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,customeService,$window,$ionicActionSheet){

    }])
    .controller('contactEditCtrl',['$scope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','customeService','$window','$ionicActionSheet',function($scope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,customeService,$window,$ionicActionSheet){

    }])

