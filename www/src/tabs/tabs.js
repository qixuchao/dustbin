/**
 * Created by zhangren on 16/3/13.
 */

'use strict';
tabsModule
    .controller('TabsCtrl', ['$scope', '$rootScope', '$state', '$ionicConfig', '$ionicHistory', '$templateCache',
        '$ionicSlideBoxDelegate','$ionicPlatform', '$cordovaAppVersion','ionicMaterialInk','Prompter','LoginService',
        function ($scope, $rootScope, $state, $ionicConfig, $ionicHistory, $templateCache, $ionicSlideBoxDelegate,
                  $ionicPlatform,$cordovaAppVersion,ionicMaterialInk,Prompter,LoginService) {
            if(Prompter.isATL()){
                $rootScope.isATL = true;
            }
            //判断版本信息
            $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
                if(fromState && toState && fromState.name == 'login' && toState.name == 'tabs'){
                    /*$ionicConfig.views.swipeBackEnabled(true);
                    alert("set ok");*/
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $scope.clickTab($scope.tabs[0]);
                }
            });

            //ionicMaterialInk.displayEffect();
            $rootScope.goBack = function () {
                console.log('goback')
                $ionicHistory.goBack();
            };
            $scope.tabs = [{
                name: '主页',
                isActive: true,
                  onClass: 'main-on',
                offClass: 'main-off'
            }, {
                name: '应用',
                isActive: false,
                onClass: 'app-on',
                offClass: 'app-off'
            }, {
                name: '客户联系人',
                isActive: false,
                onClass: 'contacts-on',
                offClass: 'contacts-off'
            }, {
                name: '我的',
                isActive: false,
                onClass: 'my-on',
                offClass: 'my-off'
            }];
            $scope.clickTab = function (tab) {
                //$ionicSlideBoxDelegate.update();
                for (var i = 0; i < $scope.tabs.length; i++) {
                    $scope.tabs[i].isActive = false;
                }
                tab.isActive = true;
            }
        }]);