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
    'saleClueService',
    function ($scope, $rootScope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicScrollDelegate,
              $ionicPopover, $ionicModal, $cordovaDialogs, $cordovaToast, $cordovaDatePicker, $ionicActionSheet,
              saleChanService, Prompter, HttpAppService, saleActService, relationService, customeService, contactService,
              employeeService,saleClueService) {
        console.log('线索详情');
        $scope.listInfo = saleActService.actDetail;
        var getDetails = function () {
            Prompter.showLoading('正在查询');
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_OBJECTID": {"PARTNER":$scope.listInfo.OBJECT_ID}
            };
            var promise = HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'LEAD_GET_DETAIL', data)
                .success(function (response) {
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        Prompter.hideLoading();
                        $scope.details = response.ES_OUT_DETAIL;
                        $scope.productInfo = response.ES_OUT_PROD;
                        $scope.relationArr = response.ET_OUT_REAL.item_out;
                        angular.forEach($scope.relationArr, function (data) {
                            data.NAME = data.NAME_LAST;
                            data.position = data.DESCRIPTION;
                        })
                    }
                });
            return promise;
        };
        if (saleActService.actDetail) {
            getDetails();
        }
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

        //相关方
        var modifyRelationsArr = [];//修改相关方
        var deleteArr = []; //存储被删除的相关方
        var getModifyRelationsArr = function () {
            angular.forEach($scope.relationArr, function (data) {
                switch (data.mode) {
                    case "U":
                        modifyRelationsArr.push({
                            "MODE": "U",
                            "PARTNER_FCT": data.PARTNER_FCT,
                            "PARTNER": data.PARTNER,
                            "MAINPARTNER": "",
                            "OLD_FCT": data.old.PARTNER_FCT,
                            "OLD_PARTNER": data.old.PARTNER,
                            "RELATION_PARTNER": ""
                        });
                        break;
                    case "I":
                        modifyRelationsArr.push({
                            "MODE": "I",
                            "PARTNER_FCT": data.PARTNER_FCT,
                            "PARTNER": data.PARTNER,
                            "MAINPARTNER": "",
                            "OLD_FCT": "",
                            "OLD_PARTNER": "",
                            "RELATION_PARTNER": ""
                        });
                        break
                }
            });
            modifyRelationsArr = deleteArr.concat(modifyRelationsArr);
            return modifyRelationsArr;
        };
        $scope.openRelations = function () {
            //获取相关方列表中的客户
            angular.forEach($scope.relationArr, function (data) {
                if (data.PARTNER_FCT == "00000009") {
                    relationService.relationCustomer = data;
                }
            });
            relationService.isReplace = false;
            relationService.myRelations = $scope.relationArr;
            relationService.saleActSelections = angular.copy(saleActService.relationPositionForAdd);
            $ionicModal.fromTemplateUrl('src/applications/addRelations/addRelations.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.addReleModal = modal;
                modal.show();
            });
        };
        var repTempIndex;
        $scope.showActionSheet = function (x) {
            if (!$scope.isEdit) {
                return
            }
            if (!$scope.isCanEditRelation) {
                Prompter.alert('此类型相关方无法修改!');
                return
            }
            if (x.PARTNER_FCT == "Z0000003" && angular.isUndefined(x.mode)) {
                Prompter.alert(x.position + '不能删除或替换!');
                return
            }
            repTempIndex = $scope.relationArr.indexOf(x);
            $ionicActionSheet.show({
                buttons: [
                    {text: '删除'},
                    {text: '替换'}
                ],
                titleText: '请选择操作',
                cancelText: '取消',
                buttonClicked: function (index) {
                    switch (index) {
                        case 0:
                            if (x.PARTNER_FCT == '00000009') {
                                $scope.details.customerName = '';
                                relationService.relationCustomer = {};
                            }
                            if (angular.isUndefined(x.mode)) {
                                deleteArr.push({
                                    "MODE": "D",
                                    "PARTNER_FCT": "",
                                    "PARTNER": "",
                                    "MAINPARTNER": "",
                                    "OLD_FCT": x.PARTNER_FCT,
                                    "OLD_PARTNER": x.PARTNER_NO,
                                    "RELATION_PARTNER": ""
                                });
                            }
                            $scope.relationArr.splice(repTempIndex, 1);
                            break;
                        case 1:
                            relationService.isReplace = true;
                            relationService.saleActSelections = angular.copy(saleActService.relationPositionForAdd);
                            relationService.myRelations = $scope.relationArr;
                            relationService.replaceMan = x;
                            relationService.repTempIndex = repTempIndex;
                            relationService.position = x.position;
                            $ionicModal.fromTemplateUrl('src/applications/addRelations/addRelations.html', {
                                scope: $scope,
                                animation: 'slide-in-up'
                            }).then(function (modal) {
                                $scope.addReleModal = modal;
                                modal.show();
                            });
                            break;
                    }
                    return true;
                }
            });
        };
        //跳转详情界面
        $scope.goRelationDetail = function (x) {
            switch (x.PARTNER_FCT) {
                case '00000009':
                    x.PARTNER_ROLE = 'CRM000';
                    customeService.set_customerListvalue(x);
                    saleActService.isFromRelation = true;
                    $state.go('customerDetail');
                    break;
                case 'Z0000003':
                    employeeService.set_employeeListvalue(x);
                    $state.go('userDetail');
                    break;
                case '00000015':
                    contactService.set_ContactsListvalue(x.PARTNER);
                    $state.go('ContactDetail');
                    break;
            }
        };
    }]);