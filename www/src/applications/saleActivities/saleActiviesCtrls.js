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

        var position;
        $scope.onScroll = function(){
            position = $ionicScrollDelegate.getScrollPosition().top;
            console.log(position)
            if(position>10){
                $('#sdTitleId').removeClass('fadeOut');
                $('#sdTitleId').addClass('animated fadeIn');
                $scope.TitleFlag = true;
                $scope.showTitle=true;
                if(position>26){
                    $scope.customerFlag = true;
                }else{
                    $scope.customerFlag = false;
                }
                if(position>54){
                    $scope.placeFlag = true;
                }else{
                    $scope.placeFlag = false;
                }
                if(position>80){
                    $scope.typeFlag = true;
                }else{
                    $scope.typeFlag = false;
                    console.log($scope.typeFlag)
                }
                if(position>109){
                    $scope.statusFlag = true;
                }else{
                    $scope.statusFlag = false;

                }
                if(position>143){
                    $scope.showTitleStatus = true;
                }else{
                    $scope.showTitleStatus = false;
                }
            }else{
                $('#sdTitleId').removeClass('fadeIn');
                $('#sdTitleId').addClass('fadeOut');
                $scope.showTitle=false;
                $scope.TitleFlag = false;
            }
            $scope.$apply();
        }
    }])
;