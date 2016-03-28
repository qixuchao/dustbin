/**
 * Created by zhangren on 16/3/13.
 */
'use strict';
appModule
    .controller('AppCtrl',['$scope','$state','ionicMaterialInk','ionicMaterialMotion','$timeout',function($scope,$state,ionicMaterialInk,ionicMaterialMotion,$timeout){
        console.log('app')
        //ionicMaterialInk.displayEffect();

        $scope.imgs = [{
            url:'img/apps/partner.png'
        },{
            url:'img/apps/saleAct.png',
            go:"saleActList"
        },{
            url:'img/apps/acPlan.png',
            go:'saleActDetail'
        },{
            url:'img/apps/saleChance.png',
            go:'saleChanDetail'
        },{
            url:'img/apps/saleClue.png'
        },{
            url:'img/apps/saleQuote.png',
            go:'worksheetlist'
        },{
            url:'img/apps/sparePart.png',
            go:'spareList'
        },{
            url:'img/apps/empInfo.png',
            go:'userQuery'
        },{
            url:'img/apps/searchCar.png',
            go:'car'
        }];
        $timeout(function(){
            ionicMaterialMotion.fadeSlideInRight({
                selector: '.animate-fade-slide-in .col-33'
            });
        },50)

        $scope.returnToMain = function(){
            for(var i=0;i<$scope.tabs.length;i++){
                $scope.tabs[i].isActive = false;
            }
            $scope.tabs[0].isActive = true;
        };
        $scope.go = function(x){
            if(x.go){
                $state.go(x.go);
            }
        }
    }]);