/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerkeyModule
    .controller('customerKeyQueryCtrl',['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){

        $ionicPopover.fromTemplateUrl('src/customer/customerKey/model/customerKey_selec.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.customerKeypopover = popover;
        });
        $scope.customerKeyPopoveropen = function() {
            $scope.customerKeypopover.show();
        };
        $scope.customerKeyPopoverhide = function() {
            $scope.customerKeypopover.hide();
        };
        $scope.customerkey_types = ["状态","状态"];
        $scope.CustomerKeyqueryType = function(types){

        }
    }])

