/**
 * Created by zhangren on 16/3/23.
 */
'use strict';
salesModule
    .controller('saleChanSearchCtrl', [
        '$scope',
        '$state',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        function ($scope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout) {
            ionicMaterialInk.displayEffect();
            //ionicMaterialMotion.fadeSlideInRight();

        }])
    .controller('saleChanDetailCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        '$ionicScrollDelegate',
        '$ionicPopover',
        '$ionicModal',
        '$cordovaDialogs',
        'saleActService',
        function ($scope, $rootScope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicScrollDelegate, $ionicPopover, $ionicModal,$cordovaDialogs, saleActService) {
            console.log('chanceDetail')
            ionicMaterialInk.displayEffect();
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.statusArr = saleActService.getStatusArr();
            $scope.chanceDetails = {
                title: 'APP 120KWh PHEV Pack需求',
                hideCustomer: 'BYD',
                saleStage: 'SOP阶段',
                status: '处理中',
                saleNum: '100036',
                feelNum: 80
            }
            var getInitStatus = function () {
                for (var i = 0; i < $scope.statusArr.length; i++) {
                    if ($scope.statusArr[i].value == $scope.chanceDetails.status) {
                        $scope.mySelect = {
                            status: $scope.statusArr[i]
                        }
                        return
                    }
                }
            }
            getInitStatus();
            $scope.isEdit = false;
            $scope.editText = "编辑";
            $scope.edit = function () {
                if ($scope.editText == '编辑') {
                    $scope.isEdit = true;
                    $scope.editText = "保存";
                    $cordovaDialogs.alert('你已进入编辑模式', '提示', '确定')
                        .then(function() {
                            // callback success
                        });
                } else {
                    //执行保存操作
                    $scope.isEdit = false;
                    $scope.editText = "编辑";
                }
            }
            $scope.select = true;
            $scope.showTitle = false;
            $scope.showTitleStatus = false;
            $scope.changeStatus = function (flag) {
                $scope.select = flag;
            };
            var position;
            $scope.onScroll = function () {
                position = $ionicScrollDelegate.getScrollPosition().top;
                if (position > 10) {
                    $scope.TitleFlag = true;
                    $scope.showTitle = true;
                    if (position > 30) {
                        $scope.customerFlag = true;
                    } else {
                        $scope.customerFlag = false;
                    }
                    if (position > 58) {
                        $scope.placeFlag = true;
                    } else {
                        $scope.placeFlag = false;
                    }
                    if (position > 84) {
                        $scope.statusFlag = true;
                    } else {
                        $scope.statusFlag = false;

                    }
                    if (position > 114) {
                        $scope.showTitleStatus = true;
                    } else {
                        $scope.showTitleStatus = false;
                    }
                } else {
                    $scope.customerFlag = false;
                    $scope.placeFlag = false;
                    $scope.statusFlag = false;
                    $scope.showTitle = false;
                    $scope.TitleFlag = false;
                }
                if (!$scope.$digest()) {
                    $scope.$apply();
                }

            };
            $scope.submit = function () {

            }
            /*---------------------------------选择弹窗-------------------------------------*/
            $scope.saleStages = saleActService.getStagesArr();
            $scope.pop = {
                stage:'',
                feel:'',
                saleNum:''
            }
            var getInitStage = function () {
                for (var i = 0; i < $scope.saleStages.length; i++) {
                    if ($scope.saleStages[i].value == $scope.chanceDetails.saleStage) {
                        $scope.pop.stage = $scope.saleStages[i]
                        return
                    }
                }
            }
            $ionicPopover.fromTemplateUrl('saleDetailSelect-popover.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.openPopover = function ($event) {
                getInitStage();
                $scope.pop.feel = $scope.chanceDetails.feelNum;
                $scope.pop.saleNum = $scope.chanceDetails.saleNum;
                $scope.popover.show($event);
            };
            $scope.savePop = function () {
                console.log($scope.pop.stage.value)
                $scope.chanceDetails.saleStage = $scope.pop.stage.value;
                //getInitStatus();
                $scope.chanceDetails.feelNum = $scope.pop.feel;
                $scope.chanceDetails.saleNum = $scope.pop.saleNum;
                $scope.popover.hide();
            };
            $scope.closePop = function () {
                $scope.popover.hide();
            };
            /*-------------------------------选择弹窗 end-----------------------------------*/
        }])