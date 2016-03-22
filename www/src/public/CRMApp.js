var loginModule = angular.module('loginModule', []);
var mainModule = angular.module('mainModule', []);
var tabsModule = angular.module('tabsModule', []);
var appModule = angular.module('appModule', []);
var carModule = angular.module('carModule',[]);
var CRMApp = angular.module('CRMApp', ['ionic',
    'ionic-material',
    'ionMdInput',
    'loginModule',
    'mainModule',
    'tabsModule',
    'appModule',
    'carModule'
])

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
            //汽车列表
            .state('car',{
                url:'/car',
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
            .state('search',{
                url:'/search',
                templateUrl:'src/car/search.html',
                controller:'SearchCtrl'
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
