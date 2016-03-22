var loginModule = angular.module('loginModule', []);
var mainModule = angular.module('mainModule', []);
var tabsModule = angular.module('tabsModule', []);
var appModule = angular.module('appModule', []);
var worksheetModule = angular.module('worksheetModule', []); // 工单模块

var CRMApp = angular.module('CRMApp', ['ngAnimate','ionic',
    'ionic-material',
    'ionMdInput',
    'loginModule',
    'mainModule',
    'tabsModule',
    'appModule',
    'worksheetModule'
]);

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
            .state('test', {
                url: '/test',
                templateUrl: 'src/test.html'
                //controller: 'TabsCtrl'
            })

            // 工单模块相关
            .state('worksheetlist', {
                url: '/worksheetlist',
                templateUrl: 'src/worksheet/worksheet_list.html',
                controller: 'WorksheetListCtrl'
            })
            .state('worksheetdetail', {
                url: '/worksheetdetail',
                templateUrl: 'src/worksheet/worksheet_detail.html',
                controller: 'WorksheetDetailCtrl'
            })

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });










