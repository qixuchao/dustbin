/**
 * Created by zhangren on 16/4/29.
 */
'use strict';
salesModule.controller('saleClueDetailCtrl', [
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
    '$cordovaToast',
    '$cordovaDatePicker',
    '$ionicActionSheet',
    'saleChanService',
    'Prompter',
    'HttpAppService',
    'saleActService',
    'relationService',
    'customeService',
    'contactService',
    'employeeService',
    function ($scope, $rootScope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicScrollDelegate,
              $ionicPopover, $ionicModal, $cordovaDialogs, $cordovaToast, $cordovaDatePicker, $ionicActionSheet,
              saleChanService, Prompter, HttpAppService, saleActService, relationService, customeService, contactService,
              employeeService) {
        console.log('线索详情');
        $scope.statusArr = saleChanService.getStatusArr();
        $scope.isEdit = false;
        $scope.editText = "编辑";
        $scope.goBack = function () {
            if ($scope.isEdit) {
                $cordovaDialogs.confirm('请先保存当前的更改', '提示', ['保存', '放弃'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            Prompter.showLoading('正在保存');
                            $timeout(function () {
                                Prompter.hideLoading();
                                $cordovaToast.showShortBottom('保存成功');
                                $rootScope.goBack();
                            }, 500);
                        } else {
                            $rootScope.goBack();
                        }
                    });
            } else {
                $rootScope.goBack();
            }
        };
        $scope.edit = function (type) {
            if ($scope.editText == '编辑' && angular.isUndefined(type)) {
                $scope.isEdit = true;
                $scope.editText = "保存";
                $cordovaDialogs.alert('你已进入编辑模式', '提示', '确定')
                    .then(function () {
                        // callback success
                    });
            } else {
                //执行保存操作

            }
        };
        $scope.selects = [true, false, false];
        $scope.showTitle = false;
        $scope.showTitleStatus = false;
        //$timeout(function () {
        //    $('#relativeId').css('height', window.screen.height-112+'px');
        //},100)
        $scope.changeStatus = function (index) {
            for (var i = 0; i < 3; i++) {
                $scope.selects[i] = false;
            }
            $scope.selects[index] = true;
            $ionicScrollDelegate.scrollTop(true);
            $timeout(function () {
                $scope.customerFlag = false;
                $scope.placeFlag = false;
                $scope.typeFlag = false;
                $scope.statusFlag = false;
                $scope.showTitle = false;
                $scope.TitleFlag = false;
                $scope.showTitleStatus = false;
            }, 20)

        };
        var position;
        var maxTop;
        $scope.onScroll = function () {
            position = $ionicScrollDelegate.getScrollPosition().top;
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
                    if (maxTop == undefined) {
                        maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
                    }
                    $scope.showTitleStatus = true;
                } else {
                    $scope.showTitleStatus = false;
                }
                if (position > maxTop) {
                    //$ionicScrollDelegate.scrollBottom(false)
                }
            } else {
                $scope.customerFlag = false;
                $scope.placeFlag = false;
                $scope.typeFlag = false;
                $scope.statusFlag = false;
                $scope.showTitle = false;
                $scope.TitleFlag = false;
                $scope.showTitleStatus = false;
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }

        };
    }]);