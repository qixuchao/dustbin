/**
 * Created by zhangren on 16/3/13.
 */

'use strict';
tabsModule
    .controller('TabsCtrl',['$scope','$rootScope','$state','$ionicHistory','ionicMaterialInk',function($scope,$rootScope,$state,$ionicHistory,ionicMaterialInk){
        ionicMaterialInk.displayEffect();
        $rootScope.goBack = function(){
            $ionicHistory.goBack();
        }
    }]);