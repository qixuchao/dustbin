/**
 * Created by zhangren on 16/3/13.
 */
'use strict';
appModule
    .controller('AppCtrl',['$scope','$state','ionicMaterialInk',function($scope,$state,ionicMaterialInk){
        console.log('app')
        ionicMaterialInk.displayEffect();
    }]);