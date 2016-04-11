/**
 * Created by zhangren on 16/3/13.
 */

'use strict';
tabsModule
    .controller('TabsCtrl',['$scope','$rootScope','$state','$ionicHistory','ionicMaterialInk',function($scope,$rootScope,$state,$ionicHistory,ionicMaterialInk){
        //ionicMaterialInk.displayEffect();
        $rootScope.goBack = function(){
            console.log('goback')
            $ionicHistory.goBack();
        };
        $scope.tabs = [{
            name:'主页',
            isActive:true,
            onClass:'main-on',
            offClass:'main-off'
        },{
            name:'应用',
            isActive:false,
            onClass:'app-on',
            offClass:'app-off'
        },{
            name:'客户联系人',
            isActive:false,
            onClass:'contacts-on',
            offClass:'contacts-off'
        },{
            name:'我的',
            isActive:false,
            onClass:'my-on',
            offClass:'my-off'
        }];
        $scope.clickTab = function(tab){
            for(var i=0;i<$scope.tabs.length;i++){
                $scope.tabs[i].isActive = false;
            }
            tab.isActive=true;
        }
    }]);