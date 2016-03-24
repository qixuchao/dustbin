/**
 * Created by zhangren on 16/3/19.
 */
'use strict';
salesModule
    .controller('saleActListCtrl', ['$scope', '$state', 'ionicMaterialInk', 'ionicMaterialMotion', '$timeout', function ($scope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout) {
        console.log('销售活动列表')
        ionicMaterialInk.displayEffect();
        //ionicMaterialMotion.fadeSlideInRight();
    
    }])
    .controller('saleActDetailCtrl', ['$scope', '$state', '$ionicHistory', '$ionicScrollDelegate', 'ionicMaterialInk', 'ionicMaterialMotion', '$timeout', function ($scope, $state, $ionicHistory, $ionicScrollDelegate, ionicMaterialInk, ionicMaterialMotion, $timeout) {
        ionicMaterialInk.displayEffect();
        $timeout(function () {
            console.log('fade')
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000,
                selector: '.animate-fade-slide-in-right .item'
            });
        }, 100);
        $scope.select = true;
        $scope.showTitle = false;
        $scope.showTitleStatus = false;
        $timeout(function () {
            $('#relativeId').css('height', window.screen.height-112+'px');
        },100)
        $scope.changeStatus = function (flag) {
            $scope.select = flag;
            $ionicScrollDelegate.resize();
        };
        $scope.progressArr = [{
            content: '与客户进行了初次交涉,效果良好',
            time: '2016-3-6  18:33'
        }, {
            content: '第二次交涉,效果一般,还需要继续跟进',
            time: '2016-3-7  17:33'
        }, {
            content: '最后谈了一次,应该可以成交,主要联系客户李经理进行跟进',
            time: '2016-3-8  12:11'
        }];
        var position;
        $scope.onScroll = function () {
            position = $ionicScrollDelegate.getScrollPosition().top;
            $('#relativeId').css('height', window.screen.height-112+'px');
            if (position > 10) {
                $scope.TitleFlag = true;
                $scope.showTitle = true;
                if (position > 26) {
                    $scope.customerFlag = true;
                } else {
                    $scope.customerFlag = false;
                }
                if (position > 54) {
                    $scope.placeFlag = true;
                } else {
                    $scope.placeFlag = false;
                }
                if (position > 80) {
                    $scope.typeFlag = true;
                } else {
                    $scope.typeFlag = false;
                }
                if (position > 109) {
                    $scope.statusFlag = true;
                } else {
                    $scope.statusFlag = false;

                }
                if (position > 143) {
                    $scope.showTitleStatus = true;
                } else {
                    $scope.showTitleStatus = false;
                }
            } else {
                $scope.customerFlag = false;
                $scope.placeFlag = false;
                $scope.typeFlag = false;
                $scope.statusFlag = false;
                $scope.showTitle = false;
                $scope.TitleFlag = false;
            }
            $scope.$apply();
        }
    }])
;