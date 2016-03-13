/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
loginModule
    .controller('LoginCtrl',['$scope','$state','ionicMaterialInk',function($scope,$state,ionicMaterialInk){
    console.log('login');
        $scope.goMain = function(){
            $state.go('main')
        }
    ionicMaterialInk.displayEffect();
}]);