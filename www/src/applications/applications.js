/**
 * Created by zhangren on 16/3/13.
 */
'use strict';
appModule
    .controller('AppCtrl',[
        'LoginService','$scope','$state','ionicMaterialInk','ionicMaterialMotion','$timeout',function(LoginService,$scope,$state,ionicMaterialInk,ionicMaterialMotion,$timeout){
        //ionicMaterialInk.displayEffect();
        var menuList=LoginService.getMenulist();
        $scope.imgs = [{
            name:'CUSTOMER',
            url:'img/apps/partner.png',
            go:'customerQuery'
        },{ 
            name:'ACTIVITY',
            url:'img/apps/saleAct.png',
            go:"saleActList"
        },{ 
            name:'ACTPLAN',
            url:'img/apps/acPlan.png',
            go : "activityPlanList"
            //go:'saleActDetail'
        },{ 
            name:'OPPORT',
            url:'img/apps/saleChance.png',
            go:'saleChanList'
        },{ 
            name:'SALECLUE',
            url:'img/apps/saleClue.png',
            go:'saleClueList'
        },{
            name:'SERVICE',
            url:'img/apps/service.png',
            go:'worksheetList'
        },{
            name:'PRODUCT',
            url:'img/apps/material.png',
            go:'spareList'
        },{
            name:'EMPLOYEE',
            url:'img/apps/empInfo.png',
            go:'userQuery'
        },{
            name:'CAR',
            url:'img/apps/searchCar.png',
            go:'car'
        },{
            name:'VISIT',
            url:'img/apps/visit.png',
            go:'visit.list'
        },{
            name:'SERVICEMAP',
            url:'img/apps/serviceMap.png',
            go:'myMapService'
        }, {
            name:'SALEQUOTE',
            url:'img/apps/saleQuote.png',
            go:'saleQuoteList'
        }];
        /**
           { 
                name:'SIGNIN', 
                url:'img/apps/signIn.png',
                go:'signin.list'
            }
         */
        var num=menuList.length;

        $scope.imgs1= new Array();
        for(var i=0;i<$scope.imgs.length;i++){
            for(var j=0;j<num;j++){
                if($scope.imgs[i].name===menuList[j]){
                    $scope.imgs1.push($scope.imgs[i]);
                }
            }
        }
        //$scope.imgs1.push($scope.imgs[2]);
        $timeout(function(){
            ionicMaterialMotion.fadeSlideInRight({
                selector: '.animate-fade-slide-in .col-33'
            });
        },50);

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