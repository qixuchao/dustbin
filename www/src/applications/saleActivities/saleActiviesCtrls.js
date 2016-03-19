/**
 * Created by zhangren on 16/3/19.
 */
'use strict';
salesModule
    .controller('saleActListCtrl',['$scope','$state','ionicMaterialInk','ionicMaterialMotion','$timeout',function($scope,$state,ionicMaterialInk,ionicMaterialMotion,$timeout){
        console.log('销售活动列表')
        ionicMaterialInk.displayEffect();
        //ionicMaterialMotion.fadeSlideInRight();

    }])
    .controller('saleActDetailCtrl',['$scope','$state','$ionicHistory','ionicMaterialInk','ionicMaterialMotion','$timeout',function($scope,$state,$ionicHistory,ionicMaterialInk,ionicMaterialMotion,$timeout){
        ionicMaterialInk.displayEffect();
        //$scope.goBack = function(){
        //    console.log('goback')
        //    $ionicHistory.goBack();
        //}
    }])
;