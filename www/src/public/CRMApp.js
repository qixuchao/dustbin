var utilsModule = angular.module('utilsModule', []);
var loginModule = angular.module('loginModule', []);
var mainModule = angular.module('mainModule', []);
var tabsModule = angular.module('tabsModule', []); 
var appModule = angular.module('appModule', []);
var carModule = angular.module('carModule', []);
var salesModule = angular.module('salesModule', []);
var employeeModule = angular.module('employeeModule', []);
var employeeModuleServive = angular.module('employeeModuleServive', []);
var customerModule = angular.module('customerModule', []);
var ContactsModule = angular.module('ContactsModule', []);
var ContactsRelationModule = angular.module('ContactsRelationModule', []);
var contactModuleServive = angular.module('contactModuleServive', []);
var customerVehicleModule = angular.module('customerVehicleModule', []);
var customerChanceModule = angular.module('customerChanceModule', []);
var customerActivityModule = angular.module('customerActivityModule', []);
var customerkeyModule = angular.module('customerkeyModule', []);
var customerWorkorderModule = angular.module('customerWorkorderModule', []);
var customerContactsModule = angular.module('customerContactsModule', []);
var customerModuleServive = angular.module('customerModuleServive', []);
var spareModule = angular.module('spareModule', []);
var worksheetModule = angular.module('worksheetModule', ['ion-gallery']); // 工单模块
var visitModule = angular.module('visitModule',[]); //拜访模块
var signinModule = angular.module('signinModule',[]); //签到模块
var worksheetReportModule = angular.module('worksheetReportModule', []);
var settingsModule = angular.module('settingsModule', []);  //我的模块
var activityPlanModule = angular.module('activityPlanModule', []);  //活动计划模块
var myMapModule = angular.module('myMapModule', []);//服务地图模块
var saleQuoteModule = angular.module('saleQuoteModule', []);  //销售报价模块
 
var CRMApp = angular.module('CRMApp', ['ngAnimate', 'ionic','ionic.ui.superSlideBox', 'ngCordova',
    'ionic-material',
    'utilsModule',
    'loginModule',
    'mainModule',
    'tabsModule',
    'appModule',
    'salesModule',
    'employeeModule',
    'employeeModuleServive',
    'carModule',
    'spareModule',
    'salesModule',
    'worksheetModule',
    'visitModule',
    'signinModule',
    'ContactsModule',
    'ContactsRelationModule',
    'contactModuleServive',
    'customerModule',
    'customerVehicleModule',
    'customerContactsModule',
    'customerModuleServive',
    'customerChanceModule',
    'customerkeyModule',
    'customerActivityModule',
    'customerWorkorderModule',
    "worksheetReportModule",
    "settingsModule",
    'activityPlanModule',
    'myMapModule',
    'ngBaiduMap',
    'ng-mfb',
    'saleQuoteModule'
]);
CRMApp.run(function ($ionicPlatform, $rootScope, $ionicHistory, $cordovaToast) {

        function __onHardwareBackButton(e) {
            //判断处于哪个页面时双击退出
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 1500);
            }
            e.preventDefault();
            return false;
        };

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.overlaysWebView(true);
            }

            $ionicPlatform.registerBackButtonAction(__onHardwareBackButton, 101);


        });
        $rootScope.goState = function (state) {
            $state.go(state);
        };
        $rootScope.goBack = function () {
            $ionicHistory.goBack();
        };
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam) {
            var ele = $("ion-view[nav-view=entering]");
            for (var i = 0; i < ele.length; i++) {
                var eleTemp = angular.element(ele[i]);
                eleTemp.attr("nav-view", "active");
            }
            var eleLeave = $("ion-view[nav-view=leaving]");
            for (var i2 = 0; i2 < eleLeave.length; i2++) {
                var eleTemp = angular.element(eleLeave[i2]);
                eleTemp.attr("nav-view", "cached");
            }
        });
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParam) {
            alert("rootScope: $stateChangeError :       to:" + toState.name + "     from:" + fromState.name);
        });
        $rootScope.$on("$stateNotFound", function (event, toState, toParams, fromState, fromParam) {
            alert("rootScope: $stateNotFound :       to:" + toState.name + "     from:" + fromState.name);
        });
})
.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionGalleryConfigProvider, baiduMapApiProvider) {
    ionGalleryConfigProvider.setGalleryConfig({
                          action_label: '关闭',
                          toggle: false,
                          row_size: 2,
                          fixed_row_size: true
    });
    baiduMapApiProvider.version('2.0').accessKey(ROOTCONFIG.baiduMap.apiKey);
    // Turn off caching for demo simplicity's sake
    //$ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.swipeBackEnabled(true);
    /*
     // Turn off back button text
     $ionicConfigProvider.backButton.previousTitleText(false);
    */
    
    $stateProvider

        //服务地图 start------
        .state('myMapService', {
            url: 'myMapService',
            templateUrl: 'src/myMap/myMap.html',
            controller: 'myBaiduMapCtrl'
        })
        //服务地图 end------
        
        .state('login', {
          url: '/login',
          //abstract: true,
          templateUrl: 'src/login/login.html',
          controller: 'LoginCtrl'
        })
        
         // .state('login', {
         //     url: '/login',
         //     templateUrl: 'src/loginSecond/loginSecond.html',
         //     controller: 'LoginCtrl'
         // })
        
        .state('tabs', {
            url: '/tabs',
            templateUrl: 'src/tabs/tabs.html',
            controller: 'TabsCtrl'
        })
        //.state('tabs.main', {
        //    url: '/main',
        //    templateUrl: 'src/main/main.html',
        //    controller: 'MainCtrl'
        //})
        //.state('tabs.apps', {
        //    url: '/apps',
        //    templateUrl: 'src/applications/applications.html',
        //    controller: 'AppCtrl'
        //})
        .state('saleActList', {
            url: 'apps/saleActList',
            templateUrl: 'src/applications/saleActivities/saleAct_List.html',
            controller: 'saleActListCtrl'
        })
        .state('saleActDetail', {
            url: 'apps/saleActList/detail',
            templateUrl: 'src/applications/saleActivities/saleAct_detail.html',
            controller: 'saleActDetailCtrl'
        })
        //员工信息
        .state('userQuery', {
            url: '/userQuery',
            templateUrl: 'src/employee/userQuery.html',
            controller: 'userQueryCtrl'
        })
        .state('userDetail', {
            url: '/userDetail',
            templateUrl: 'src/employee/userDetail.html',
            controller: 'userDetailCtrl'
        })
        .state('customerList', {
            url: '/customerList',
            templateUrl: 'src/employee/customerList.html',
            controller: 'customerListCtrl'
        })
        .state('saleChanList', {
            url: 'apps/saleChanList',
            templateUrl: 'src/applications/saleChance/saleChanList.html',
            controller: 'saleChanListCtrl'
        })
        .state('saleChanDetail', {
            url: 'apps/saleChanList/detail',
            templateUrl: 'src/applications/saleChance/chanceDetail.html',
            controller: 'saleChanDetailCtrl'
        })
        //联系人
        .state('ContactQuery', {
            //cache:false,
            url: '/contactQuery',
            templateUrl: 'src/contacts/contactQuery.html',
            controller: 'contactQueryCtrl'
        })
        .state('ContactDetail', {
            // cache:false,
            url: '/contactDetail',
            templateUrl: 'src/contacts/contactDetail.html',
            controller: 'contactDetailCtrl'
        })
        //联系人-联系人创建+客户联系人创建界面
        .state('ContactCreate', {
            //cache:false,
            url: '/contactsCreate',
            templateUrl: 'src/contacts/contactCreate.html',
            controller: 'contactCreateCtrl'
        })
        
        .state('ContactsEdit', {
            url: '/contactEdit',
            templateUrl: 'src/contacts/contactEdit.html',
            controller: 'contactEditCtrl'
        })
        .state('ContactsRelationship', {
            url: '/contactsRelationship',
            templateUrl: 'src/contacts/relationship/Relationship.html',
            controller: 'contactRelationshipCtrl'
        })
        
        //客户
        .state('customerQuery', {
            //cache:false,
            url: '/customerQuery',
            templateUrl: 'src/customer/customerinfo/customerQuery.html',
            controller: 'customerQueryCtrl'
        })
        .state('customerDetail', { 
            url: '/customerDetail',
            templateUrl: 'src/customer/customerinfo/customerDetail.html',
            controller: 'customerDetailCtrl'
        })
        .state('customerEdit', {
            url: '/customerEdit',
            templateUrl: 'src/customer/customerinfo/customerEdit.html',
            controller: 'customerEditlCtrl'
        })
        //客户-联系人
        .state('customerContactQuery', {
            url: '/customerContactQuery',
            //templateUrl: 'src/customer/customerContacts/customerContactsQuery.html',
            templateUrl: 'src/customer/customerContacts/customer_con.html',
            controller: 'customerContactCtrl'
        })
        /*.state('customerContactDetail', {
            url: '/customerContactDetail',
            templateUrl: 'src/customer/customerContacts/customerContactsDetail.html',
            controller: 'customerContactDetailCtrl'
        })*/
        //客户-车辆
        .state('customerVehicleQuery', {
            url: '/customerVehicleQuery',
            templateUrl: 'src/customer/customerVehicle/customerVehicleQuery.html',
            controller: 'customerVehicleQueryCtrl'
        })
        //客户-机会
        .state('customerChanceQuery', {
            url: '/customerChanceQuery',
            templateUrl: 'src/customer/customerChance/customerChanceQuery.html',
            controller: 'customerChanceQueryCtrl'
        })
        //客户-活动
        .state('customerActivityQuery', {
            url: '/customerActivityQuery',
            templateUrl: 'src/customer/customerActivity/customerActivityQuery.html',
            controller: 'customerActivityQueryCtrl'
        })
        //客户-线索
        .state('customerKeyQuery', {
            url: '/customerKeyQuery',
            templateUrl: 'src/customer/customerKey/customerKeyQuery.html',
            controller: 'customerKeyQueryCtrl'
        })
        //客户-历史工单
        .state('customerWorkorderQuery', {
            url: '/customerWorkorderQuery',
            templateUrl: 'src/customer/customerWorkorder/customerWorkorderQuery.html',
            controller: 'customerWorkorderQueryCtrl'
        })
        //客户-负责人
        .state('customerFuZe',{
            url:'/customerFuZe',
            templateUrl: 'src/customer/customerFuZe/customer_fuze.html',
            controller:'customerFuZeCtrl'
        })
        //车辆查询
        .state('car',{
            url:'apps/car',
            templateUrl:'src/car/car.html',
            controller:'CarCtrl'
        })
        .state('carDetail',{
            url:'/carDetail',
            templateUrl:'src/car/carDetail.html',
            controller:'CarDetailCtrl'
        })
        //车辆备件列表
        .state('spare',{
            url:'/spare',
            templateUrl:'src/car/spare.html',
            controller:'SpareCtrl'
        })
        .state('maintenance',{
            url:'/maintenance',
            templateUrl:'src/car/maintenance.html',
            controller:'MaintenanceCtrl'
        })
       //备件信息
        .state('spareList',{
            url:'apps/spareList',
            templateUrl:'src/spare/spareList.html',
            controller:'SpareListCtrl'
        })
        .state('spareDetail', {
            url: '/spareDetail',
            templateUrl: 'src/spare/spareDetail.html',
            controller: 'SpareDetailCtrl'
        })
        // 工单模块相关： start ------------------------
        .state('worksheetList', {
            url: '/worksheetList',
            templateUrl: 'src/worksheet/worksheetList.html',
            controller: 'WorksheetListCtrl'
        })
        
        .state('worksheetDetail', { // detailType取值: newCar、siteRepair、batchUpdate
            url: '/worksheetDetail/{detailType}',
            templateUrl: 'src/worksheet/detailAll/detailAll.html',
            controller: 'worksheetDetailAllCtrl'
        })
        .state('worksheetEdit', { // detailType取值: newCar、siteRepair、batchUpdate
            url: '/worksheetEdit/{detailType}',
            templateUrl: 'src/worksheet/detailEdit/detailAllEdit.html',
            controller: 'worksheetEditAllCtrl'
        })

        .state('worksheetBaoGonglist', {   //报工信息列表界面
            url: '/worksheetBaoGonglist',
            templateUrl: 'src/worksheet/baoGong/baoGongList.html',
            controller: 'WorksheetBaoGongListCtrl'
        })
        .state('worksheetDetailHistoryList', {   //交易历史列表界面
            url: '/worksheetDetailHistoryList',
            templateUrl: 'src/worksheet/dealHistoryList/dealHistoryList.html',
            controller: 'dealHistoryListCtrl'
        })

        .state('worksheetCarMileage', {
            url: '/worksheetCarMileage',
            templateUrl: 'src/worksheet/carMileage/worksheet_carMileage.html',
            controller: 'WorksheetCarMileageCtrl'
        })
        .state('worksheetFaultInfos', {
            url: '/worksheetFaultInfos',
            templateUrl: 'src/worksheet/faultInfos/worksheet_faultInfo.html',
            controller: 'WorksheetFaultInfoCtrl'
        })
        .state('worksheetCarMileageEdit', {
            url: '/worksheetCarMileageEdit',
            templateUrl: 'src/worksheet/carMileage/worksheet_carMileage_edit.html',
            controller: 'WorksheetCarMileageEditCtrl'
        })
        .state('worksheetFaultInfosEdit', {
            url: '/worksheetFaultInfosEdit',
            templateUrl: 'src/worksheet/faultInfos/worksheet_faultInfo_edit.html',
            controller: 'WorksheetFaultInfoEditCtrl'
        })
        .state('worksheetSparepart', {
            url: '/worksheetSparepart',
            templateUrl: 'src/worksheet/sparePart/worksheet_sparePart.html',
            controller: 'WorksheetSparepartCtrl'
        })
        .state('worksheetSelect', {
            url: '/worksheetSelect',
            templateUrl: 'src/worksheet/sparePart/worksheet_spareSelect.html',
            controller: 'WorksheetPareSelectCtrl'
        })
        .state('worksheetSelectPro', {
            url: '/worksheetSelectPro',
            templateUrl: 'src/worksheet/sparePart/worksheet_pro.html',
            controller: 'worksheetSpareListCtrl'
        })
        .state('worksheetRelatedPart', {
            url: '/worksheetRelatedPart',
            templateUrl: 'src/worksheet/relatedPart/worksheet_relatedPart.html',
            controller: 'WorksheetRelatedCtrl'
        })
        .state('worksheetRelatedPartContact', {
            url: '/worksheetRelatedPartContact',
            templateUrl: 'src/worksheet/relatedPart/worksheet_relatePartContact.html',
            controller: 'WorksheetRelatedContactCtrl'
        })
        .state('worksheetRelatedPartCust', {
            url: '/worksheetRelatedPartCust',
            templateUrl: 'src/worksheet/relatedPart/worksheet_relatePartCust.html',
            controller: 'WorksheetRelatedCustCtrl'
        })
        .state('worksheetRelatedPartDelete', {
            url: '/worksheetRelatedPartDelete',
            templateUrl: 'src/worksheet/relatedPart/worksheet_relatedPartDelete.html',
            controller: 'WorksheetRelatedDeleteCtrl'
        })
        .state('worksheetTakePicture', {
            url: '/worksheetTakePicture',
            templateUrl: 'src/worksheet/takePicture/takePicture.html',
            controller: 'worksheetTakePictureCtrl'
        })
        .state('staffSelect', {
            url: '/staffSelect',
            templateUrl: 'src/worksheet/selectStaff/selectStaff.html',
            controller: 'selectStaffCtrl'
        })
        // 工单模块相关： end ------------------------
        .state('changePass', {
            url: '/changePass',
            templateUrl: 'src/settings/changePass/changePass.html',
            controller: 'ChangePassCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'src/settings/about.html',
            controller: 'AboutCtrl'
        })
        .state('aboutapp', {
            url: '/aboutapp',
            templateUrl: 'src/settings/aboutApp.html',
            controller: 'AboutAppCtrl'
        })
        // 报工单模块相关： start ------------------------
        .state('baoGongCreate', {
            url: '/baoGongCreate',
            templateUrl: 'src/worksheet/baoGong/create/create.html',
            controller: 'baoGongCreateCtrl'
        })
        .state('baoGongDetail', {
            url: '/baoGongDetail',
            templateUrl: 'src/worksheet/baoGong/detailAll/detailAll.html',
            controller: 'baoGongDetailAllCtrl'
        })
        .state('baoGongInfosList', {
            url: '/baoGongInfosList',
            templateUrl: 'src/worksheet/baoGong/infos/infoList.html',
            controller: 'baoGongInfoListCtrl'
        })
        .state('baoGongEdit', {
            url: '/baoGongEdit',
            templateUrl: 'src/worksheet/baoGong/edit/edit.html',
            controller: 'baoGongDetailEditCtrl'
        })
        //销售线索
        .state('saleClueDetail', {
            url: '/saleClueList/saleClueDetail',
            templateUrl: 'src/applications/saleClue/detail/saleClueDetail.html',
            controller: 'saleClueDetailCtrl'
        })
        .state('saleClueList', {
            url: '/saleClueList',
            templateUrl: 'src/applications/saleClue/list/saleClueList.html',
            controller: 'saleClueListCtrl'
        })
        //活动计划模块 start-------
        .state('activityPlanList', {
            url: '/activityPlanList',
            templateUrl: 'src/activityPlan/activityPlan_List.html',
            controller: 'activityPlanListCtrl'
        })
        .state('activityPlanDetail', {
            url: '/activityPlanDetail',
            templateUrl: 'src/activityPlan/activityPlan_Detail.html',
            controller: 'activityPlanDetailCtrl'
        })
        .state('activityPlanCreateHead', {
            url: '/activityPlanCreateHead',
            templateUrl: 'src/activityPlan/activityPlan_Head.html',
            controller: 'activityPlanCreateHeadCtrl'
        })
        .state('activityPlanCreate', {
            url: '/activityPlanCreate',
            templateUrl: 'src/activityPlan/activityPlan_create.html',
            controller: 'activityPlanCreateCtrl'
        })
        //活动计划模块 end-------
        //选择销售或服务 start-------
        .state('changeChar', {
            url: '/changeChar',
            templateUrl: 'src/settings/selectChar/changeChar.html',
            controller: 'ChangeCharCtrl'
        })
        //选择销售或服务 end-------
        //拜访模块 start ---------
        .state('visit', {
            url: '/visit',
            abstract: true,
            templateUrl: 'src/visit/absVisit.html',
            controller: 'absVisitCtrl'
        })
        .state('visit.list', {
            url: '/list',
            views: {
                'visitContent': {
                    templateUrl: 'src/visit/list/visitList.html',
                    controller: 'visitListCtrl'
                }
            }
        })
        .state('visit.detail', {
            url: '/detail',
            views: {
                'visitContent': {
                    templateUrl: 'src/visit/detail/visitDetail.html',
                    controller: 'visitDetailCtrl'
                }
            }
        })
        .state('visit.create', {
            url: '/create',
            views: {
                'visitContent': {
                    templateUrl: 'src/visit/create/visitCreate.html',
                    controller: 'visitCreateCtrl'
                }
            }
        })
        .state('visit.edit', {
            url: '/visitedit',
            views: {
                'visitContent': {
                    templateUrl: 'src/visit/edit/visitDetailEdit.html',
                    controller: 'visitEditCtrl'
                }
            }
        })
        .state('visit.contact', {
            url: '/visitContact',
            views: {
                'visitContent': {
                    templateUrl: 'src/visit/edit/visitDetailContact.html',
                    controller: 'visitContactCtrl'
                }
            }
        })
        //拜访模块 end ---------
        //签到模块 start ---------
        .state('signin', {
            url: '/signin',
            abstract: true,
            templateUrl: 'src/signin/absSignin.html',
            controller: 'absSigninCtrl'
        })
        .state('signin.list', {
            url: '/list',
            views: {
                'signinContent': {
                    templateUrl: 'src/signin/list/signinList.html',
                    controller: 'signinListCtrl'
                }
            }
        })
        .state('signin.detail', {
            url: '/detail',
            views: {
                'signinContent': {
                    templateUrl: 'src/signin/detail/signinDetail.html',
                    controller: 'signinDetailCtrl'
                }
            }
        })
        .state('signin.create', {
            url: '/create',
            views: {
                'signinContent': {
                    templateUrl: 'src/signin/create/signinCreate.html',
                    controller: 'signinCreateCtrl'
                }
            }
        })
        //签到模块 end ---------
        //销售报价 start-------
        .state('saleQuoteList', {
            url: '/saleQuoteList',
            templateUrl: 'src/salequote/saleQuoteList.html',
            controller: 'saleQuoteListCtrl'
        })
        .state('saleQuoteDetail', {
            url: '/saleQuoteDetail',
            templateUrl: 'src/salequote/saleQuoteDetail.html',
            controller: 'saleQuoteDetailCtrl'
        })
        .state('saleQuoteProject', {
            url: '/saleQuoteProject',
            templateUrl: 'src/salequote/saleQuoteProject.html',
            controller: 'saleQuoteProjectCtrl'
        })
        .state('saleQuoteProjectList', {
            url: '/saleQuoteProjectList',
            templateUrl: 'src/salequote/saleQuoteProjectList.html',
            controller: 'saleQuoteProjectListCtrl'
        })
        .state('saleQuoteRelated', {
            url: '/saleQuoteRelated',
            templateUrl: 'src/salequote/saleQuoteRelated.html',
            controller: 'saleQuoteRelatedCtrl'
        })
        .state('saleQuoteRemark', {
            url: '/saleQuoteRemark',
            templateUrl: 'src/salequote/saleQuoteRemark.html',
            controller: 'saleQuoteRemarkCtrl'
        })
        //销售报价 end-------
        //忘记密码start
        .state('forgetPass', {
            url: '/forgetPass',
            templateUrl: 'src/settings/forgetPass/forgetPass.html',
            controller: 'forgetPassCtrl'
        })
        //忘记密码end
        ////销售机会补充
        //.state('saleChanContact', {
        //    url: 'apps/saleChanList/detail/salechanceContact',
        //    templateUrl: 'src/applications/saleChance/salechanceContact.html',
        //    controller: 'saleChanContactCtrl'
        //})
        //.state('saleChanCompetition', {
        //    url: 'apps/saleChanList/detail/salechanceCompetition',
        //    templateUrl: 'src/applications/saleChance/salechanceCompetition.html',
        //    controller: 'saleChanCompetitionCtrl'
        //})
        ////销售机会补充
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider  // /home/login
        .when('','/login')
        .otherwise('/tabs');
});