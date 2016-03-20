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
    .controller('saleActDetailCtrl',['$scope','$state','$ionicHistory','$ionicScrollDelegate','ionicMaterialInk','ionicMaterialMotion','$timeout',function($scope,$state,$ionicHistory,$ionicScrollDelegate,ionicMaterialInk,ionicMaterialMotion,$timeout){
        ionicMaterialInk.displayEffect();
        $scope.select = true;
        $scope.showTitle = false;
        $scope.showTitleStatus = false;
        $scope.changeStatus = function(flag){
            $scope.select=flag;
        };

        var position,title;
        $scope.onScroll = function(){
            position = $ionicScrollDelegate.getScrollPosition().top;
            //title = document.getElementById('sdTitleId');
            console.log(position)
            if(position>0){
                $('#sdTitleId').removeClass('fadeOut');
                $('#sdTitleId').addClass('animated fadeIn');
                $scope.showTitle=true;
                if(position>137){
                    //$scope.showTitle = false;
                    $scope.showTitleStatus = true;
                }else{
                    //$scope.showTitle = false;
                    $scope.showTitleStatus = false;
                }
            }else{
                $('#sdTitleId').removeClass('fadeIn');
                $('#sdTitleId').addClass('fadeOut');
                $scope.showTitle=false;
            }
            $scope.$apply();
        }
    }])
;