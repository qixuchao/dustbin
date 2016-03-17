/**
 * Created by zhangren on 16/3/13.
 */
'use strict';
appModule
    .controller('AppCtrl',['$scope','$state','ionicMaterialInk',function($scope,$state,ionicMaterialInk){
        console.log('app')
        ionicMaterialInk.displayEffect();

        $scope.imgs = [{
            url:'../../img/apps/partner.png'
        },{
            url:'../../img/apps/saleAct.png'
        },{
            url:'../../img/apps/acPlan.png'
        },{
            url:'../../img/apps/saleChance.png'
        },{
            url:'../../img/apps/saleClue.png'
        },{
            url:'../../img/apps/saleQuote.png'
        },{
            url:'../../img/apps/sparePart.png'
        },{
            url:'../../img/apps/empInfo.png'
        },{
            url:'../../img/apps/searchCar.png'
        }]
    }]);