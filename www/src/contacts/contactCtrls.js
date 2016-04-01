/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
ContactsModule
    .controller('contactQueryCtrl',['$scope','$rootScope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','contactService','$ionicLoading',function($scope,$rootScope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,contactService,$ionicLoading){
        $ionicPopover.fromTemplateUrl('../src/contacts/model/contact_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.Contactspopover = popover;
        });
        $scope.Contactsopenpopv = function($event) {
            $scope.Contactspopover.show($event);
        };
        $scope.ContactsPopoverhide = function() {
            $scope.Contactspopover.hide();
        };
        $scope.contact_types = [
            {
                type:"扫描名片创建联系人",
                url:""
            },
            {
                type:"手动创建新联系人",
                url:'ContactCreate'
            }
        ];
        $scope.ContactsqueryType = function(type){
            if(type.url){
                $state.go(type.url);
            }
            $scope.Contactspopover.hide();
        }
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
            'customerzhushi':'in the feahennmkk in in the feahennmkk'
        }];
        $scope.Contacts_godetails = function(x){
            contactService.set_ContactsListvalue(x);
            $state.go('ContactDetail');
        };
        //广播添加联系人
        $rootScope.$on('contactCreatevalue', function(event, data) {
            $scope.contact_query_list.push(contactService.get_ContactCreatevalue());
            console.log($scope.contact_query_list)
        });

    }])
    .controller('contactDetailCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.customer_detailstypes = [{
            typemane:'活动',
            imgurl:'img/customer/customerhuod.png',
        },{
            typemane:'机会',
            imgurl:'img/customer/customerjihui@2x.png',
        },{
            typemane:'关系',
            imgurl:'img/contact/relationship@2x.png',
            url:'ContactsRelationship',
        }];
        $scope.GocontactLists = function(convalue){
            console.log(convalue)
            if(convalue.url){
                $state.go(convalue.url);
            }
        }
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
        //数据获取
        $scope.customerdetails = contactService.get_ContactsListvalue();
        //广播修改数据
        $rootScope.$on('contactEditvalue', function(event, data) {
            $scope.customerdetails = contactService.get_ContactsListvalue();
            console.log(contactService.get_ContactsListvalue())
        });

        $scope.contact_deatilgoedit = function(){
            $state.go("ContactsEdit");
        }
    }])
    .controller('contactCreateCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.contactcreat = {
            name:'',
            contacteditename:'',
            phonenumber:'',
            customermail:'',
            dizhiname:'',
            postion:'',
            atend:''
        };
        $scope.contactKeepCreatevalue = function(){
            contactService.set_ContactCreatevalue($scope.contactcreat);
            //广播修改详细信息界面的数据
            $rootScope.$broadcast('contactCreatevalue');
            $state.go('ContactQuery');

        }
    }])
    .controller('contactEditCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.edittitleType = [{
            name:'先生',
        },{
            name:'小姐'
        }];
        $scope.contactedit = {
            customerzhushi:contactService.get_ContactsListvalue().customerzhushi,
            keuhuname:contactService.get_ContactsListvalue().keuhuname,
            customermail:contactService.get_ContactsListvalue().customermail,
            postion:contactService.get_ContactsListvalue().postion,
            atend:contactService.get_ContactsListvalue().atend,
            //contactediteaddress:contactService.get_ContactsListvalue().customerzhushi,
            customercontrary:contactService.get_ContactsListvalue().customercontrary,
            customerregion:contactService.get_ContactsListvalue().customerregion,
            youbina:contactService.get_ContactsListvalue().youbina,
            birthday:contactService.get_ContactsListvalue().birthday,
            ///
            name:contactService.get_ContactsListvalue().name,
            dizhiname:contactService.get_ContactsListvalue().dizhiname,
            xioshouyung:contactService.get_ContactsListvalue().xioshouyung,
            phonenumber:contactService.get_ContactsListvalue().phonenumber,
            mobilenumber:contactService.get_ContactsListvalue().mobilenumber,
        };
        //保存
        //日期的选择
        $scope.setva_datetime = function (type) {
            var datepicker_time = '';
            var datepickerdate = '';
            var datepicker_hour = '';
            var datetime_Minutes = '';
            var optionsdatedate = {
                date: new Date($scope.contactedit.birthday),
                mode: 'date',
                titleText: '请选择时间',
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn',
                androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            }
            $cordovaDatePicker.show(optionsdatedate).then(function (datetime) {
                $scope.contactedit.birthday = datepickerdate;
            })
        }


        $scope.contactKeepEditvalue = function(){
            contactService.set_ContactsListvalue($scope.contactedit);
            //广播修改详细信息界面的数据
            $rootScope.$broadcast('contactEditvalue');
            $state.go('ContactDetail');

        }
    }])

    .controller('contactRelationshipCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.contact_relationship = [{
            name:'张浩吉',
            role:'责任人'
        },{
            name:'张浩吉',
            role:'是其下属'
        },{
            name:'张浩吉',
            role:'是其主管'
        },{
            name:'张浩吉',
            role:'控股公司'
        }];
    }])
