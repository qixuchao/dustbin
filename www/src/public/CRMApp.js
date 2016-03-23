var loginModule = angular.module('loginModule', []);
var mainModule = angular.module('mainModule', []);
var tabsModule = angular.module('tabsModule', []);
var appModule = angular.module('appModule', []);
<<<<<<< HEAD
var carModule = angular.module('carModule',[]);
var salesModule = angular.module('salesModule', []);
var spareModule = angular.module('spareModule',[]);
var CRMApp = angular.module('CRMApp', ['ionic',
=======
var worksheetModule = angular.module('worksheetModule', []); // 宸ュ崟妯″潡
var salesModule = angular.module('salesModule', []);

var CRMApp = angular.module('CRMApp', ['ngAnimate','ionic',
>>>>>>> 635da8fa72c4d9700a780bb9439ecd95c2923378
    'ionic-material',
    'ionMdInput',
    'loginModule',
    'mainModule',
    'tabsModule',
    'appModule',
<<<<<<< HEAD
    'carModule',
    'spareModule',
    'salesModule'
]);
=======
    'salesModule',
    'worksheetModule'
]);

>>>>>>> 635da8fa72c4d9700a780bb9439ecd95c2923378
CRMApp.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
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
<<<<<<< HEAD
            //汽车列表
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
            //备件列表
            .state('spare',{
                url:'/spare',
                templateUrl:'src/car/spare.html',
                controller:'SpareCtrl'
            })
            //维修记录
            .state('maintenance',{
                url:'/maintenance',
                templateUrl:'src/car/maintenance.html',
                controller:'MaintenanceCtrl'
            })
           //备件列表
            .state('spareList',{
                url:'apps/spareList',
                templateUrl:'src/spare/spareList.html',
                controller:'SpareListCtrl'
            })
            .state('spareDetail',{
                url:'/spareDetail',
                templateUrl:'src/spare/spareDetail.html',
                controller:'SpareDetailCtrl'
=======

            // 宸ュ崟妯″潡鐩稿叧
            .state('worksheetlist', {
                url: '/worksheetlist',
                templateUrl: 'src/worksheet/worksheet_list.html',
                controller: 'WorksheetListCtrl'
            })
            .state('worksheetdetail', {
                url: '/worksheetdetail',
                templateUrl: 'src/worksheet/worksheet_detail.html',
                controller: 'WorksheetDetailCtrl'
>>>>>>> 635da8fa72c4d9700a780bb9439ecd95c2923378
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tabs');
    });










