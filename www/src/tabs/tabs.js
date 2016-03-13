/**
 * Created by zhangren on 16/3/13.
 */

'use strict';
tabsModule
    .controller('TabsCtrl',['$scope','$state','ionicMaterialInk',function($scope,$state,ionicMaterialInk){
        ionicMaterialInk.displayEffect();
    }]);