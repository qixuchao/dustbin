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

                Prompter.showLoading('正在保存');
                var data = {
                    "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                    "IS_IN_DETAIL": {
                        "OBJECT_ID": $scope.details.OBJECT_ID,
                        "DESCRIPTION": $scope.details.OBJECT_ID,
                        "SOURCE": "aaa",
                        "DATE_START": "",
                        "DATE_END": "",
                        "STATUS": "aaaaa",
                        "QUAL_LEVEL_MAN": $scope.details.QUAL_LEVEL_MAN,
                        "ZZKHMC": $scope.details.ZZKHMC,
                        "ZZLXR": $scope.details.ZZLXR,
                        "ZZLXDH": $scope.details.ZZLXDH,
                        "ZZMBJG": $scope.details.ZZMBJG,
                        "ZZFLD000059": $scope.details.ZZFLD000059,
                        "ZZKHNDXQZL": $scope.details.ZZKHNDXQZL,
                        "ZZFLD00005H": $scope.details.ZZFLD00005H,
                        "ZZKHYDXQL": $scope.details.ZZKHYDXQL,
                        "ZZFLD00005I": $scope.details.ZZFLD00005I,
                        "ZZYPXQL": $scope.details.ZZYPXQL,
                        "ZZFLD00005K": $scope.details.ZZFLD00005K,
                        "ZZFLD00004T": $scope.details.ZZFLD00004T,
                        "ZZXQLDW": $scope.details.ZZXQLDW,
                        "ZZFLD000051": $scope.details.ZZFLD000051,
                        "ZZFLD000052": $scope.details.ZZFLD000052,
                        "ZZZQDW": $scope.details.ZZZQDW,
                        "ZZFLD000054": $scope.details.ZZFLD000054,
                        "ZZFLD000055": $scope.details.ZZFLD000055,
                        "ZZZQDW1": $scope.details.ZZZQDW1
                    },
                    "IS_IN_PROD": {
                        "ZZFLD00004O": $scope.productInfo.ZZFLD00004O,
                        "ZZFLD00004Q": $scope.productInfo.ZZFLD00004Q,
                        "ZZFLD00004R": $scope.productInfo.ZZFLD00004R,
                        "ZZFLD00004S": $scope.productInfo.ZZFLD00004S,
                        "ZZCPZNL": "aaaaaaaaaa",
                        "ZZRL": "aaaaaaaaaa",
                        "ZZFLD00005A": "aaaaaaaaaa",
                        "ZZJZDSSZHY": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "ZZCC": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        "ZZFLD00004W": "1234567891.123",
                        "ZZZLDW": "aaaaaaaaaa",
                        "ZZFLD000050": "aaaaaaaaaa",
                        "IMPORTANCE": "a",
                        "LEAD_TYPE": "aaaa",
                        "ZZDYGG": "aaaaaaaaaa",
                        "ZZGDWYQ": "aaaaaaaaaa",
                        "ZZLONG": "1234567891.123",
                        "ZZFLD000040": "aaa",
                        "ZZWIDE": "1234567891.123",
                        "ZZFLD00003Z": "aaa",
                        "ZZTHICK": "1234567891.123",
                        "ZZFLD00003Y": "aaa"
                    },
                    "IT_LINES": {
                        "item_in": {
                            "TDFORMAT": "",
                            "TDLINE": ""
                        }
                    },
                    "IT_PARTNER": {
                        "item_in": getModifyRelationsArr()
                    }
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'LEAD_CHANGE', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            Prompter.showShortToastBotton('修改成功');
                            $scope.isEdit = false;
                            $scope.editText = "编辑";
                            Prompter.hideLoading();
                        } else {
                            Prompter.hideLoading();
                        }
                    });

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