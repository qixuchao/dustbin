/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerActivityModule
    .controller('customerActivityQueryCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){

        $ionicPopover.fromTemplateUrl('../src/customer/customerActivity/model/customerActivity_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerActivitypopover = popover;
        });
        $scope.customerActivityPopoveropen = function($event) {
            $scope.customerActivitypopover.show($event);
        };
        $scope.customerActivityPopoverhide = function() {
            $scope.customerActivitypopover.hide();
        };
        $scope.customeractivity_types = ["状态"];
        $scope.CustomerActivityqueryType = function(types){

        }
    }])

