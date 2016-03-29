var utilsModule = angular.module('utilsModule', []);
var loginModule = angular.module('loginModule', []);
var mainModule = angular.module('mainModule', []);
var tabsModule = angular.module('tabsModule', []);
var appModule = angular.module('appModule', []);
var carModule = angular.module('carModule',[]);
var salesModule = angular.module('salesModule', []);
var employeeModule = angular.module('employeeModule', []);
var employeeModuleServive = angular.module('employeeModuleServive', []);
var customerModule = angular.module('customerModule', []);
var ContactsModule = angular.module('ContactsModule', []);
var contactModuleServive = angular.module('contactModuleServive', []);
var customerVehicleModule = angular.module('customerVehicleModule', []);
var customerContactsModule = angular.module('customerContactsModule', []);
var customerModuleServive = angular.module('customerModuleServive', []);
//var directiveModule = angular.module('directiveModule', []);
var spareModule = angular.module('spareModule',[]);
var worksheetModule = angular.module('worksheetModule', []); // 工单模块

var CRMApp = angular.module('CRMApp', ['ngAnimate', 'ionic','ngCordova',
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
    'ContactsModule',
    'contactModuleServive',
    'customerModule',
    'customerVehicleModule',
    'customerContactsModule',
    'customerModuleServive'
])
CRMApp.run(function ($ionicPlatform,$rootScope) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
        $rootScope.goState = function(state){
            $state.go(state);
        };
    })
    
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        // Turn off caching for demo simplicity's sake
        //$ionicConfigProvider.views.maxCache(0);

        /*
         // Turn off back button text
         $ionicConfigProvider.backButton.previousTitleText(false);
         */

        $stateProvider
            .state('login', {
                url: '/login',
                //abstract: true,
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl'
            })
            .state('tabs', {
                url: '/tabs',
                templateUrl: 'src/tabs/tabs.html',
                controller: 'TabsCtrl'
            })
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
            .state('saleChanDetail', {
                url: 'apps/saleChanSearch/detail',
                templateUrl: 'src/applications/saleChance/chanceDetail.html',
                controller: 'saleChanDetailCtrl'
            })
            //联系人
            .state('ContactQuery', {
                url: '/contactQuery',
                templateUrl: 'src/contacts/contactQuery.html',
                controller: 'contactQueryCtrl'
            })
            .state('ContactDetail', {
                url: '/contactDetail',
                templateUrl: 'src/contacts/contactDetail.html',
                controller: 'contactDetailCtrl'
            })
            .state('ContactCreate', {
                url: '/contactsCreate',
                templateUrl: 'src/contacts/contactCreate.html',
                controller: 'contactCreateCtrl'
            })
            .state('ContactsEdit', {
                url: '/contactEdit',
                templateUrl: 'src/contacts/contactEdit.html',
                controller: 'contactEditCtrl'
            })

            //客户
            .state('customerQuery', {
                url: '/customerQuery',
                templateUrl: 'src/customer/customerinfo/customerQuery.html',
                controller: 'customerQueryCtrl'
            })
            .state('customerDetail', {
                url: '/customerDetail',
                templateUrl: 'src/customer/customerinfo/customerDetail.html',
                controller: 'customerDetailCtrl'
            })
            //客户-联系人
            .state('customerContactQuery', {
                url: '/customerContactQuery',
                templateUrl: 'src/customer/customerContacts/customerContactsQuery.html',
                controller: 'customerContactQueryCtrl'
            })
            .state('customerContactDetail', {
                url: '/customerContactDetail',
                templateUrl: 'src/customer/customerContacts/customerContactsDetail.html',
                controller: 'customerContactDetailCtrl'
            })
            //客户-车辆
            .state('customerVehicleQuery', {
                url: '/customerVehicleQuery',
                templateUrl: 'src/customer/customerVehicle/customerVehicleQuery.html',
                controller: 'customerVehicleQueryCtrl'
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
            // 工单模块相关：
            .state('worksheetlist', {
                url: '/worksheetlist',
                templateUrl: 'src/worksheet/worksheet_list.html',
                controller: 'WorksheetListCtrl'
            })
            .state('worksheetdetailnewcar', {
                url: '/worksheetdetailnewcar',
                templateUrl: 'src/worksheet/detail_newcar/worksheet_detail_newcar.html',
                controller: 'WorksheetDetailNewcarCtrl'
            })
            .state('worksheetdetailsiterepair', {
                url: '/worksheetdetailsiterepair',
                templateUrl: 'src/worksheet/detail_siterepair/worksheet_detail_siterepair.html',
                controller: 'WorksheetDetailSiterepairCtrl'
            })
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tabs');
    });










