/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerChanceModule
    .controller('customerChanceQueryCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){

        $ionicPopover.fromTemplateUrl('../src/customer/customerChance/model/customerChance_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerChancepopover = popover;
        });
        $scope.customerChancePopover = function($event) {
            $scope.customerChancepopover.show($event);
        };
        $scope.customerChancePopoverhide = function() {
            $scope.customerChancepopover.hide();
        };


        $scope.customerchance_types = ["状态","机会"];
        $scope.CustomerChancequeryType = function(){

        }
    }])

