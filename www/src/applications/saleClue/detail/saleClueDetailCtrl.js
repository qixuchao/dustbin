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
        $scope.statusArr = saleClueService.saleClueStatus.status;
        $scope.sourceArr = saleClueService.clueSource;
        $scope.relationArr = [];
        $scope.commentParams = { //注释参数
            item_out: []
        };

        var getStatusIndex = function (data) {
            for (var i = 0; i < $scope.statusArr.length; i++) {
                if ($scope.statusArr[i].value == data) {
                    return i;
                }
            }
            return "";
        };
        var getSourceIndex = function (data) {
            for (var i = 0; i < $scope.sourceArr.length; i++) {
                if ($scope.sourceArr[i].code == data) {
                    return i;
                }
            }
            return "";
        };
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
                        $scope.mySelect = {
                            status: $scope.statusArr[getStatusIndex($scope.details.STATUS)],
                            source: $scope.sourceArr[getSourceIndex($scope.details.SOURCE)]
                        };
                        $scope.commentText = {};
                        $scope.commentText.text = ""; //注释字段对应
                        var comment = response.ET_LINES.item_out;
                        $scope.commentParams.item_out = comment;
                        try {
                            for (var k = 0; k < comment.length; k++) {
                                if (k == 0) {
                                    $scope.commentText.text = comment[0].TDLINE;
                                }
                                if (k > 0) {
                                    if (comment[k].TDFORMAT == '*') {
                                        $scope.commentText.text += "\r" + comment[k].TDLINE;
                                    } else {
                                        $scope.commentText.text += comment[k].TDLINE;
                                    }
                                }
                                console.log($scope.commentText.text);
                            }
                            console.log($scope.commentText.text);
                        } catch (e) {
                            $scope.commentText.text = "";
                        }
                        $scope.productInfo = response.ES_OUT_PROD;
                        $scope.relationArr = response.ET_OUT_REAL.item_out;

                        angular.forEach($scope.relationArr, function (data) {
                            if (data.PARTNER_FCT == "00000023") { //竞争对手
                                data.NAME = data.NAME_ORG1;
                            } else {
                                data.NAME = data.NAME_LAST;
                            }
                            data.position = data.DESCRIPTION;
                        })
                    }
                });
            return promise;
        };
        if (saleActService.actDetail) {
            getDetails();
        }
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
        $scope.selectTime = function (type) {
            if (!$scope.isEdit) {
                return;
            }
            switch (type) {
                case 'statTime':
                    Prompter.selectTime($scope, 'clueDetailStart',
                        new Date($scope.details.DATE_START.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '开始时间');
                    break;
                case 'endTime':
                    Prompter.selectTime($scope, 'clueDetailEnd',
                        new Date($scope.details.DATE_END.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '结束时间');
                    break;
                case 'tempNeed'://样品需求开始时间
                    Prompter.selectTime($scope, 'clueDetailTempNeedStart',
                        new Date($scope.details.ZZFLD000051.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '开始时间');
                    break;
                case 'masProduced'://样品量产开始时间
                    Prompter.selectTime($scope, 'clueDetailMasProducedStart',
                        new Date($scope.details.ZZFLD000054.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '开始时间');
                    break;
            }

        };

        //注释--textarea方法
        $scope.blurComment = function () {
            $scope.commentParams.item_out = [];
            var content = $scope.commentText.text.replace(/[\n\r]/g, "　");//全角空格
            /**
             * 这里备用几个特殊字符：(ps:用于进行备用字符分割)
             * @1:朤 氺 曱 甴 囍 兀 々 〆 の ぁ 〡 〢 〣 〤 〥 〦 〧 〨 〩
             * @2:ぬねのはばぱひびぴふぶぷへべぺ
             * @3:╆╇╈╉╊╋ ┈┉┊┋┌┍┎┏┐┑┒┓└┕
             * */
            console.log("content " + content);
            var commentArray = content.split("　");//全角空格
            for (var i = 0; i < commentArray.length; i++) {
                var arrayParam = {
                    "TDFORMAT": "*", //标记列
                    "TDLINE": commentArray[i] //文本行
                };
                $scope.commentParams.item_out.push(arrayParam);
            }
            console.log("now the comment text is:" + angular.toJson($scope.commentParams));
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
                //console.error("9090 " + angular.isUndefined($scope.mySelect.source));
                if($scope.mySelect.status.value == 'E0005' && $scope.details.STATUS != 'E0005'){
                    $scope.details.DATE_END = new Date().format('yyyy-MM-dd');
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                    "IS_IN_DETAIL": {
                        "OBJECT_ID": $scope.details.OBJECT_ID,
                        "DESCRIPTION": $scope.details.DESCRIPTION,
                        "SOURCE": angular.isUndefined($scope.mySelect.source) ? "" : $scope.mySelect.source.code,
                        "DATE_START": $scope.details.DATE_START,
                        "DATE_END": $scope.details.DATE_END,
                        "STATUS": angular.isUndefined($scope.mySelect.status) ? "" : $scope.mySelect.status.value,
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
                        "ZZZQDW1": $scope.details.ZZZQDW1,
                        "ZZFLD00004P": $scope.details.ZZFLD00004P
                    },
                    "IS_IN_PROD": {
                        "ZZFLD00004O": $scope.productInfo.ZZFLD00004O,
                        "ZZFLD00004Q": $scope.productInfo.ZZFLD00004Q,
                        "ZZFLD00004R": $scope.productInfo.ZZFLD00004R,
                        "ZZFLD00004S": $scope.productInfo.ZZFLD00004S,
                        "ZZCPZNL": $scope.productInfo.ZZCPZNL,
                        "ZZRL": $scope.productInfo.ZZRL,
                        "ZZFLD00005A": $scope.productInfo.ZZFLD00005A,
                        "ZZJZDSSZHY": $scope.productInfo.ZZJZDSSZHY,
                        "ZZCC": $scope.productInfo.ZZCC,
                        "ZZFLD00004W": $scope.productInfo.ZZFLD00004W,
                        "ZZZLDW": $scope.productInfo.ZZZLDW,
                        "ZZFLD000050": $scope.productInfo.ZZFLD000050,
                        "IMPORTANCE": $scope.productInfo.IMPORTANCE,
                        "LEAD_TYPE": $scope.productInfo.LEAD_TYPE,
                        "ZZDYGG": $scope.productInfo.ZZDYGG,
                        "ZZGDWYQ": $scope.productInfo.ZZGDWYQ,
                        "ZZLONG": $scope.productInfo.ZZLONG,
                        "ZZFLD000040": $scope.productInfo.ZZFLD000040,
                        "ZZWIDE": $scope.productInfo.ZZWIDE,
                        "ZZFLD00003Z": $scope.productInfo.ZZFLD00003Z,
                        "ZZTHICK": $scope.productInfo.ZZTHICK,
                        "ZZFLD00003Y": $scope.productInfo.ZZFLD00003Y
                    },
                    "IT_LINES": {
                        "item_in": $scope.commentParams.item_out
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
        //需求总量
        $ionicModal.fromTemplateUrl('src/applications/saleClue/detail/modal/unitSelections.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.unitSelectionsModal = modal;
        });
        if (Prompter.isATL()) {
            $scope.unitsArr = saleChanService.saleChanceUnits_ATL;
        } else {
            $scope.unitsArr = saleChanService.saleUnits;
        }
        var unitType;
        $scope.openUnitSelections = function (type, text) {
            if (!$scope.isEdit) {
                return;
            }
            unitType = type;
            switch (type) {
                case 'yearNeed':
                    $scope.unitTitle = '客户年度需求总量';
                    break;
                case 'monthNeed':
                    $scope.unitTitle = '客户月度需求总量';
                    break;
                case 'sampleNeed':
                    $scope.unitTitle = '样品需求量';
                    break;
                case 'lifeCycle':
                    $scope.unitTitle = '生命周期需求量';
                    break;
            }
            $scope.unitText = text;
            $scope.unitSelectionsModal.show();
        };
        $scope.selectUnit = function (x) {
            switch (unitType) {
                case 'yearNeed':
                    $scope.details.ZZFLD00005H = x.value;
                    break;
                case 'monthNeed':
                    $scope.details.ZZFLD00005I = x.value;
                    break;
                case 'sampleNeed':
                    $scope.details.ZZFLD00005K = x.value;
                    break;
                case 'lifeCycle':
                    $scope.details.ZZXQLDW = x.value;
                    break;
            }
            $scope.unitSelectionsModal.hide();
        };

        //样品需求周期/需求量产
        $ionicModal.fromTemplateUrl('src/applications/saleClue/detail/modal/simpleRequire.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.unitRequerySelectionsModal = modal;
        });
        if (Prompter.isATL()) {
        } else {
            $scope.unitsRequeryArr = saleChanService.timeDate
        }
        var unitRequeryType;
        $scope.openUnitRequerySelections = function (type, text) {
            if (!$scope.isEdit) {
                return;
            }
            unitRequeryType = type;
            switch (type) {
                case 'simpleRequery':
                    $scope.unitRequeryTitle = '样品需求周期';
                    break;
                case 'requeryMP':
                    $scope.unitRequeryTitle = '需求量产周期';
                    break;
            }
            $scope.unitRequeryText = text;
            $scope.unitRequerySelectionsModal.show();
        };
        $scope.selectUnitRequery = function (x) {
            switch (unitRequeryType) {
                case 'simpleRequery':
                    $scope.details.ZZZQDW = x.value;
                    break;
                case 'requeryMP':
                    $scope.details.ZZZQDW1 = x.value;
                    break;
            }
            $scope.unitRequerySelectionsModal.hide();
        };

        //选择"值列表"
        $ionicModal.fromTemplateUrl('src/applications/saleClue/detail/modal/selections.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.selectionsModal = modal;
        });
        $scope.openSelectionsModal = function (type, text) {
            if (!$scope.isEdit) {
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
                case 'productType_atl':
                    $scope.unitTitle = "产品类型";
                    $scope.selectionArr = saleClueService.productType_atl;
                    break;
                case 'weight':
                    $scope.unitTitle = "重量";
                    $scope.selectionArr = saleClueService.weight;
                    break;
                case 'applyClass':
                    $scope.unitTitle = "应用类别";
                    $scope.selectionArr = saleClueService.applyClass;
                    break;
                case 'productApply':
                    $scope.unitTitle = "产品应用";
                    $scope.selectionArr = saleClueService.productApply;
                    break;
                case 'long':
                    $scope.unitTitle = "长";
                    $scope.selectionArr = saleClueService.linearMeasure;
                    break;
                case 'width':
                    $scope.unitTitle = "宽";
                    $scope.selectionArr = saleClueService.linearMeasure;
                    break;
                case 'deep':
                    $scope.unitTitle = "厚";
                    $scope.selectionArr = saleClueService.linearMeasure;
                    break;
                case 'customerType':
                    $scope.unitTitle = "客户类型";
                    $scope.selectionArr = saleClueService.customerType;
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
                case '应用类别':
                    $scope.productInfo.DESCRIPTION1 = x.text;
                    break;
                case '产品应用':
                    $scope.productInfo.DESCRIPTION2 = x.text;
                    break;
                case '长':
                    $scope.productInfo.MSEH2 = x.text;
                    $scope.productInfo.ZZFLD000040 = x.code;
                    break;
                case '宽':
                    $scope.productInfo.MSEH3 = x.text;
                    $scope.productInfo.ZZFLD00003Z = x.code;
                    break;
                case '厚':
                    $scope.productInfo.MSEH4 = x.text;
                    $scope.productInfo.ZZFLD00003Y = x.code;
                    break;
                case '客户类型':
                    $scope.details.QUAL_LEVEL_MAN = x.code;
                    $scope.details.DESCRIPTION3 = x.text;
                    console.log("fghjkl " + $scope.details.QUAL_LEVEL_MAN);
                    break;
            }
            $scope.selectionsModal.hide();
        };
        //后续
        $scope.chancePop = {
            type: {}
        };
        $scope.createChancePopData = saleChanService.createPop;
        $ionicPopover.fromTemplateUrl('src/applications/saleChance/modal/create_Pop.html', {
            scope: $scope
        }).then(function (popover) {
            $scope.createChancePop = popover;
        });
        $scope.openCreateChancePop = function () {
            Prompter.showLoading();
            $scope.salesChanceGroup = [];
            var data = {
                "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_USER": {"BNAME": window.localStorage.crmUserName}
            };
            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ORGMAN', data)
                .success(function (response) {
                    Prompter.hideLoading();
                    var tempOfficeArr = [];
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        for (var i = 0; i < response.ET_ORGMAN.item.length; i++) {
                            response.ET_ORGMAN.item[i].text = response.ET_ORGMAN.item[i].SALES_OFF_SHORT.split(' ')[1];
                            if (response.ET_ORGMAN.item[i].SALES_GROUP && tempOfficeArr.indexOf(response.ET_ORGMAN.item[i].SALES_OFFICE) == -1) {
                                $scope.salesChanceGroup.push(response.ET_ORGMAN.item[i]);
                                tempOfficeArr.push(response.ET_ORGMAN.item[i].SALES_OFFICE);
                            }
                        }
                        if ($scope.salesChanceGroup.length > 1) {
                            $scope.chancePop.saleOffice = $scope.salesChanceGroup[0];
                            $scope.createChancePop.show();
                        } else {
                            $scope.chancePop.saleOffice = $scope.salesChanceGroup[0];
                            $scope.showCreateChanceModal();
                        }
                    } else if (response.ES_RESULT.ZFLAG === 'E') {
                        Prompter.showShortToastBotton('无法创建');
                    }
                });
        };
        $scope.showCreateChanceModal = function () {
            saleChanService.isFromClue = true;
            saleChanService.description = $scope.details.DESCRIPTION;
            saleChanService.startTime = $scope.details.DATE_START;
            saleChanService.endTime = $scope.details.DATE_END; //增加结束时间字段的传输
            saleChanService.objectId = $scope.details.OBJECT_ID; //增加线索标识的传输
            $scope.createChancePop.hide();
            $ionicModal.fromTemplateUrl('src/applications/saleChance/modal/create_Modal/create_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.createChanceModal = modal;
                modal.show();
                var tempArr = document.getElementsByClassName('modal-wrapper');
                for (var i = 0; i < tempArr.length; i++) {
                    tempArr[i].style.pointerEvents = 'auto';
                }
            });
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
                saleClueService.flagClue = true;
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
            $scope.unitSelectionsModal.remove();
            $scope.unitRequerySelectionsModal.remove();
        });
    }]);