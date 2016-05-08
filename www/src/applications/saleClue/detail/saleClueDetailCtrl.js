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
              employeeService, saleClueService) {
        console.log('线索详情');
        $scope.listInfo = saleActService.actDetail;
        $scope.relationArr = [];
        var getDetails = function () {
            Prompter.showLoading('正在查询');
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                "IS_OBJECTID": {"PARTNER": $scope.listInfo.OBJECT_ID}
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
        //选择时间
        $scope.selectTime = function () {
            if (!$scope.isEdit) {
                return;
            }
            Prompter.selectTime($scope, 'clueDetailStart',
                new Date($scope.details.DATE_START.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '开始时间');
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
                            "TDFORMAT": "aa",
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
        //选择"值列表"
        $ionicModal.fromTemplateUrl('src/applications/saleClue/detail/modal/selections.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectionsModal = modal;
        });
        $scope.openSelectionsModal = function (type, text) {
            if(!$scope.isEdit){
                return
            }
            switch (type) {
                case 'productLine':
                    $scope.unitTitle = "产品线";
                    $scope.selectionArr = saleClueService.productLine;
                    break;
                case 'applyField':
                    $scope.unitTitle = "应用领域";
                    $scope.selectionArr = saleClueService.applyField;
                    break;
                case 'applyType':
                    $scope.unitTitle = "应用类型";
                    $scope.selectionArr = saleClueService.applyType;
                    break;
                case 'productType':
                    $scope.unitTitle = "产品类型";
                    $scope.selectionArr = saleClueService.productType;
                    break;
                case 'weight':
                    $scope.unitTitle = "重量";
                    $scope.selectionArr = saleClueService.weight;
                    break;
            }
            $scope.selectText = text;
            $scope.selectionsModal.show();
        };
        $scope.selectType = function (x) {
            switch ($scope.unitTitle) {
                case '产品线':
                    $scope.productInfo.ZZFLD00004O = x.text;
                    break;
                case '应用领域':
                    $scope.productInfo.ZZFLD00004Q = x.text;
                    break;
                case '应用类型':
                    $scope.productInfo.ZZFLD00004R = x.text;
                    break;
                case '产品类型':
                    $scope.productInfo.ZZFLD00004S = x.text;
                    break;
                case '重量':
                    $scope.productInfo.ZZZLDW = x.text;
                    break;
            }
            $scope.selectionsModal.hide();
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
            relationService.isReplace = false;
            relationService.myRelations = $scope.relationArr;
            if (Prompter.isATL()) {
                relationService.position = 'ATL销售';
                relationService.saleActSelections = angular.copy(saleClueService.relationPositionArr.ATL);
            } else {
                relationService.position = 'CATL销售';
                relationService.saleActSelections = angular.copy(saleClueService.relationPositionArr.CATL);
            }
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
            //编辑模式下才可修改
            if (!$scope.isEdit) {
                return
            }
            //市场部官员不允许修改
            if (x.PARTNER_FCT == "Z0000001" && angular.isUndefined(x.mode)) {
                Prompter.alert(x.position + '不能修改!');
                return
            }
            //记录index,方便删除
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
                            if (Prompter.isATL()) {
                                relationService.saleActSelections = angular.copy(saleClueService.relationPositionArr.ATL);
                            } else {
                                relationService.saleActSelections = angular.copy(saleClueService.relationPositionArr.CATL);
                            }
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
                case "00000023":
                    x.PARTNER_ROLE = 'Z00002';
                    customeService.set_customerListvalue(x);
                    saleActService.isFromRelation = true;
                    $state.go('customerDetail');
                    break;
                case 'Z0000003':
                    employeeService.set_employeeListvalue(x);
                    $state.go('userDetail');
                    break;
                case "Z0000002":
                    employeeService.set_employeeListvalue(x);
                    $state.go('userDetail');
                    break;
                case "Z0000001":
                    employeeService.set_employeeListvalue(x);
                    $state.go('userDetail');
                    break;
                case "Z0000006":
                    employeeService.set_employeeListvalue(x);
                    $state.go('userDetail');
                    break;
            }
        };
        $scope.$on('$destroy', function () {
            $scope.selectionsModal.remove();
        });
    }]);