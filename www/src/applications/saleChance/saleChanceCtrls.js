/**
 * Created by zhangren on 16/3/23.
 */
'use strict';
salesModule
    .controller('saleChanListCtrl', ['$scope',

        '$state',
        '$timeout',
        '$ionicLoading',
        '$ionicPopover',
        '$ionicModal',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        'Prompter',
        'HttpAppService',
        'saleChanService',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $ionicScrollDelegate, ionicMaterialInk,
                  ionicMaterialMotion, saleActService, Prompter, HttpAppService, saleChanService) {
            ionicMaterialInk.displayEffect();
            //ionicMaterialMotion.fadeSlideInRight();
            console.log('销售机会列表');
            $scope.saleTitleText = '销售机会';
            $scope.sysName = ROOTCONFIG.hempConfig.baseEnvironment;
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100);
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.searchFlag = false;
            $scope.input = {search: '',list:''};
            $scope.filters = saleChanService.filters;
            var pageNum = 1;
            $scope.loadMoreFlag = true;
            $scope.saleListArr = [];
            var tempHisPostData;
            $scope.getList = function (type) {
                switch (type) {
                    case 'searchPage':
                        if (!$scope.input.list) {
                            return
                        }
                        angular.element('#saleActListSearchPageId').addClass('active');
                        break;
                    case 'refresh':
                        pageNum = 1;
                        var arr = document.getElementsByClassName('flipInX');
                        for (var i = 0; i < arr.length; i++) {
                            angular.element(arr[i]).removeClass('animated');
                        }
                        $scope.saleListArr = [];
                        break;
                    case 'search':
                        $scope.loadMoreFlag = true;
                        angular.element('#saleActListSearchPageId').addClass('active');
                        pageNum = 1;
                        var arr = document.getElementsByClassName('flipInX');
                        for (var i = 0; i < arr.length; i++) {
                            angular.element(arr[i]).removeClass('animated');
                        }
                        $scope.saleListArr = [];
                        break
                }
                var data = {
                    "IS_SYSTEM": {"SysName": $scope.sysName},
                    "IS_USER": {"BNAME": window.localStorage.crmUserName},
                    "IS_PAGE": {
                        "CURRPAGE": pageNum++,
                        "ITEMS": "10"
                    },
                    "IS_SEARCH": {
                        "ZSRTING": $scope.input.list,
                        "PARTNER_NO": "",
                        "OBJECT_ID": "",
                        "PHASE": "",
                        "STARTDATE": "",
                        "STATUS": getFilterStatus(),
                        "PROCESS_TYPE": getFilerType()
                    }
                };
                tempHisPostData = data;
                $scope.statusArr = saleChanService.listStatusArr;
                var getStatusObj = function (status) {
                    for (var i = 0; i < $scope.statusArr.length; i++) {
                        if ($scope.statusArr[i].value == status) {
                            return $scope.statusArr[i];
                        }
                    }
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.ZSRTING != $scope.input.list) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            saleChanService.listPage = pageNum;
                            if (type === 'refresh') {
                                var arr = document.getElementsByClassName('flipInX');
                                for (var i = 0; i < arr.length; i++) {
                                    angular.element(arr[i]).removeClass('animated');
                                }
                                $scope.saleListArr = response.ET_OPPORT.item;
                                angular.forEach($scope.saleListArr, function (data) {
                                    data.status = getStatusObj(data.STATUS);
                                });
                                $ionicScrollDelegate.resize();
                                return
                            }
                            if (response.ET_OPPORT.item.length < 10) {
                                $scope.loadMoreFlag = false;
                            }
                            angular.forEach(response.ET_OPPORT.item, function (data) {
                                data.status = getStatusObj(data.STATUS);
                            });
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $scope.saleListArr = $scope.saleListArr.concat(response.ET_OPPORT.item);
                            $ionicScrollDelegate.resize();
                        } else {
                            $scope.loadMoreFlag = false;
                            Prompter.alert('没有更多数据了');
                        }
                    }).finally(function () {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            //列表搜索
            $scope.initListSearch = function () {
                $scope.input.list = '';
                $scope.getList();
                $timeout(function () {
                    document.getElementById('saleChanListSearchId').focus();
                }, 1)
            };
            if (storedb('saleChanListHisArr').find().arrUniq() != undefined || storedb('saleChanListHisArr').find().arrUniq() != null) {
                $scope.hisArr = (storedb('saleChanListHisArr').find().arrUniq());
            }
            var tempFilterArr = angular.copy($scope.filters);
            var onceCilck = true;
            $scope.filterSelect = function (x, type) {
                if ($scope.filterFlag && onceCilck) {
                    tempFilterArr = angular.copy($scope.filters);
                    onceCilck = false;
                }
                var flag = x.flag;
                if (type == 'type') {
                    angular.forEach($scope.filters.types, function (data) {
                        data.flag = false;
                    })
                } else {
                    angular.forEach($scope.filters.statusFirst, function (data) {
                        data.flag = false;
                    });
                    angular.forEach($scope.filters.statusSecond, function (data) {
                        data.flag = false;
                    })
                }
                x.flag = !flag;
            };
            $scope.filterReset = function () {
                $.each($scope.filters, function (i, arr) {
                    angular.forEach(arr, function (data) {
                        data.flag = false;
                    })
                });
            };
            var getFilerType = function () {
                for (var i = 0; i < $scope.filters.types.length; i++) {
                    if ($scope.filters.types[i].flag) {
                        return $scope.filters.types[i].value;
                    }
                }
            };
            var getFilterStatus = function () {
                for (var i = 0; i < $scope.filters.statusFirst.length; i++) {
                    if ($scope.filters.statusFirst[i].flag) {
                        return $scope.filters.statusFirst[i].value;
                    }
                }
                for (var j = 0; j < $scope.filters.statusSecond.length; j++) {
                    if ($scope.filters.statusSecond[j].flag) {
                        return $scope.filters.statusSecond[j].value;
                    }
                }
            };
            $scope.filterSure = function () {
                $scope.filterFlag = !$scope.filterFlag;
                tempFilterArr = $scope.filters;
            };
            $scope.filterPrevent = function (e) {
                e.stopPropagation();
            };
            $scope.changeSearch = function () {
                if ($scope.filterFlag) {
                    $scope.filterFlag = false;
                }
                $scope.searchFlag = !$scope.searchFlag;

                //$('#searchTitle').removeClass('animated');
                if ($scope.searchFlag) {
                    $timeout(function () {
                        //document.getElementById('saleListSearchId').focus();
                        angular.element('#saleListSearchId').focus();
                    }, 2000)
                }
            };
            $scope.search = function (x, e) {
                $scope.input.list = x.text;
                $scope.getList('search');
                e.stopPropagation();
            };
            $scope.initSearch = function () {
                $scope.input.search = '';
                $timeout(function () {
                    document.getElementById('saleListSearchId').focus();
                }, 1)
            };

            //筛选
            $scope.filterFlag = false;
            //$scope.isDropShow = true;
            $scope.changeFilterFlag = function (e) {
                tempFilterArr = '';
                $scope.filterFlag = !$scope.filterFlag;
                if ($scope.filterFlag) {
                    onceCilck = true;
                } else {
                    angular.element('#saleActListFilterId').attr('ng-if', 'ng-show');
                }

                e.stopPropagation();
            };
            $scope.goDetail = function (x, e) {
                saleChanService.obj_id = x.OBJECT_ID;
                var isStored = false;
                angular.forEach($scope.hisArr, function (data) {
                    if(data.text == $scope.input.list){
                        isStored = true;
                    }
                });
                if(!isStored){
                    storedb('saleChanListHisArr').insert({
                        text: $scope.input.list,
                        data: tempHisPostData
                    }, function (err) {
                        if (!err) {
                            console.log('历史记录保存成功')
                        } else {
                            Prompter.alert('历史记录保存失败');
                        }
                    });
                    $scope.hisArr = (storedb('saleChanListHisArr').find().arrUniq());
                }
                $state.go('saleChanDetail');
                e.stopPropagation();
            };
            /*-------------------------------Pop 新建-------------------------------------*/
            $scope.pop = {
                type: {}
            };
            $scope.createPopData = saleChanService.createPop;
            $ionicPopover.fromTemplateUrl('src/applications/saleChance/modal/create_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.createPop = popover;
            });
            $scope.openCreatePop = function () {
                $scope.salesGroup = [];
                $scope.creaeSpinnerFlag = true;
                var data = {
                    "I_SYSTEM": {"SysName": $scope.sysName},
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ORGMAN', data)
                    .success(function (response) {
                        $scope.creaeSpinnerFlag = false;
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            for (var i = 0; i < response.ET_ORGMAN.item.length; i++) {
                                response.ET_ORGMAN.item[i].text = response.ET_ORGMAN.item[i].SALES_OFF_TXT.split(' ')[1];
                                if (response.ET_ORGMAN.item[i].SALES_GROUP && $scope.salesGroup.indexOf(response.ET_ORGMAN.item[i]) == -1) {
                                    $scope.salesGroup.push(response.ET_ORGMAN.item[i]);
                                }
                            }
                            if ($scope.salesGroup.length > 1) {
                                $scope.creaeSpinnerFlag = false;
                                $scope.pop.saleOffice = $scope.salesGroup[0];
                                $scope.createPop.show();
                            } else {
                                $scope.pop.saleOffice = $scope.salesGroup[0];
                                $scope.showCreateModal();
                            }
                        } else {
                            Prompter.showShortToastBotton('无法创建');
                        }
                    });
            };
            $scope.showCreateModal = function () {
                console.log($scope.pop);
                $scope.createPop.hide();
                $scope.CustomerLoadMoreFlag = true;
                $scope.createModal.show();
                $scope.getCustomerArr();
                var tempArr = document.getElementsByClassName('modal-wrapper');
                for (var i = 0; i < tempArr.length; i++) {
                    tempArr[i].style.pointerEvents = 'auto';
                }
            };
            /*-------------------------------Pop 新建 end-------------------------------------*/
            /*-------------------------------Modal 新建-------------------------------------*/
            $scope.saleStages = saleChanService.saleStages;
            $scope.create = {
                description: '',
                place: '',
                customer: '',
                contact: '',
                stage: $scope.saleStages[0],
                de_startTime: new Date().format('yyyy-MM-dd'),
                de_endTime: '',
                annotate: '测试'
            };
            $scope.selectPersonflag = false;
            //选择时间
            $scope.selectCreateTime = function (type) {
                if (type == 'start') {
                    Prompter.selectTime($scope, 'actCreateStart',
                        $scope.create.de_startTime.replace(/-/g, "/"), 'date', '开始时间');
                } else {
                    Prompter.selectTime($scope, 'actCreateEnd', $scope.create.de_endTime.replace(/-/g, "/"), 'date', '结束时间');
                }
            };
            $ionicModal.fromTemplateUrl('src/applications/saleChance/modal/create_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.createModal = modal;
            });
            var getProcessType = function () {
                for (var i = 0; i < $scope.filters.types.length; i++) {
                    if ($scope.pop.saleOffice.text.substring(0, 2) == $scope.filters.types[i].text.substring(0, 2)) {
                        return $scope.filters.types[i].value;
                    }
                }
            };
            $scope.saveCreateModal = function () {
                if (!$scope.create.title) {
                    Prompter.alert('请填写描述');
                    return
                } else if (!$scope.create.customer) {
                    Prompter.alert('请选择客户');
                    return
                }
                Prompter.showLoading('正在保存');
                var data = {
                    "I_SYSNAME": {
                        "SysName": $scope.sysName
                    },
                    "IS_OPPORT_H": {
                        "DESCRIPTION": $scope.create.title,
                        "PROCESS_TYPE": getProcessType(),
                        "STARTDATE": $scope.create.de_startTime,
                        "EXPECT_END": $scope.create.de_endTime,
                        "PHASE": $scope.create.stage.value,
                        "PROBABILITY": "",
                        "STATUS": "E0001",
                        "ZZXMBH": $scope.create.proNum,
                        "EXP_REVENUE": "",
                        "CURRENCY": "",
                        "ZZXSYXL": "",
                        "ZZYQXSLDW": "",
                        "ZZMBCP": "",
                        "ZZFLD00002E": ""
                    },
                    "IS_ORGMAN": {
                        "SALES_ORG": $scope.pop.saleOffice.SALES_ORG,
                        "DIS_CHANNEL": "",
                        "DIVISION": "",
                        "SALES_OFFICE": $scope.pop.saleOffice.SALES_OFFICE,
                        "SALES_GROUP": $scope.pop.saleOffice.SALES_GROUP,
                        "SALES_ORG_RESP": $scope.pop.saleOffice.SALES_GROUP
                    },
                    "IS_USER": {
                        "BNAME": window.localStorage.crmUserName
                    },
                    "IT_LINES": {
                        "item": {
                            "TDFORMAT": "*",
                            "TDLINE": $scope.create.annotation
                        }
                    },
                    "IT_PARTNER": {
                        "item": [{
                            "PARTNER_NO": $scope.create.customer.PARTNER,
                            "PARTNER_FCT": "00000021",//客户
                            "NAME": "",
                            "MAINPARTNER": "",
                            "ZMODE": ""
                        }, {
                            "PARTNER_NO": $scope.create.contact.PARTNER,
                            "PARTNER_FCT": "00000015",//联系人
                            "NAME": "",
                            "MAINPARTNER": "",
                            "ZMODE": ""
                        }]
                    }
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_CREAT', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            $scope.createModal.hide();
                            Prompter.showShortToastBotton('创建成功');
                            saleChanService.obj_id = response.ES_RESULT.ZRESULT;
                            $state.go('saleChanDetail');
                            Prompter.hideLoading();
                        } else {
                            Prompter.showShortToastBotton('创建失败');
                            Prompter.hideLoading();
                            $scope.createModal.hide();
                        }
                    });
            };

            //选择人
            var addContactsModal = function () {
                $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectPerson_Modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.selectPersonModal = modal;
                });
            };
            addContactsModal();
            //$scope.contacts = saleActService.getContact();
            $scope.openSelectPerson = function () {
                if (isNoContacts || !$scope.create.customer) {
                    Prompter.alert('当前客户无联系人');
                    return
                }
                $scope.selectPersonflag = true;
                $scope.selectPersonModal.show();
            };
            $scope.closeSelectPerson = function () {
                $scope.selectPersonflag = false;
                $scope.selectPersonModal.hide();
            };
            $scope.selectContact = function (x) {
                $scope.create.contact = x;
                $scope.selectPersonModal.hide();
            };

            //选择客户
            var customerPage = 1;
            $scope.customerArr = [];
            $scope.customerSearch = false;
            $scope.input = {customer:''};
            $scope.getCustomerArr = function (search) {
                $scope.CustomerLoadMoreFlag = false;
                if (search) {
                    $scope.customerSearch = false;
                    customerPage = 1;
                } else {
                    $scope.spinnerFlag = true;
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_PAGE": {
                        "CURRPAGE": customerPage++,
                        "ITEMS": "10"
                    },
                    "IS_SEARCH": {"SEARCH": $scope.input.customer},
                    "IT_IN_ROLE": {}
                };
                console.log(data);
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.SEARCH != $scope.input.customer) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.CustomerLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.customerArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                            }
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = true;
                            $scope.CustomerLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    });
            };
            //选择联系人
            $scope.contacts = [];
            var contactPage = 1;
            $scope.contactsLoadMoreFlag = false;
            var isNoContacts = false;
            $scope.getContacts = function () {
                isNoContacts = false;
                $scope.contactsLoadMoreFlag = false;
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_AUTHORITY": {"BNAME": "HANDLCX02"},
                    "IS_PAGE": {
                        "CURRPAGE": contactPage++,
                        "ITEMS": "10"
                    },
                    "IS_PARTNER": {"PARTNER": $scope.create.customer.PARTNER},
                    "IS_SEARCH": {"SEARCH": ""}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            $scope.contactsLoadMoreFlag = true;
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.contactsLoadMoreFlag = false;
                            }
                            $scope.contacts = $scope.contacts.concat(response.ET_OUT_LIST.item);
                            if ($scope.contacts.length == 0) {
                                isNoContacts = true;
                            }
                            $scope.contactSpinnerFLag = false;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            if ($scope.contacts.length == 0) {
                                isNoContacts = true;
                            }
                            $scope.contactSpinnerFLag = false;
                            $scope.contactsLoadMoreFlag = false;
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                        }
                    });
            };
            //选择客户Modal
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                $scope.selectCustomerModal = modal;
            });
            $scope.customerModalArr = saleActService.getCustomerTypes();
            $scope.selectCustomerText = '竞争对手';
            $scope.openSelectCustomer = function () {
                $scope.isDropShow = true;
                $scope.customerSearch = true;
                $scope.selectCustomerModal.show();
            };
            $scope.closeSelectCustomer = function () {
                $scope.selectCustomerModal.hide();
            };
            $scope.selectPop = function (x) {
                $scope.selectCustomerText = x.text;
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.changeReferMoreflag = function () {
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.showChancePop = function () {
                $scope.referMoreflag = true;
                $scope.isDropShow = true;
            };
            $scope.initCustomerSearch = function () {
                $scope.input.customer = '';
                //$scope.getCustomerArr();
                $timeout(function () {
                    document.getElementById('selectCustomerId').focus();
                }, 1)
            };
            $scope.selectCustomer = function (x) {
                $scope.create.customer = x;
                $scope.create.contact = '';
                contactPage = 1;
                $scope.contacts = [];
                $scope.contactSpinnerFLag = true;
                $scope.contactsLoadMoreFlag = true;
                //$scope.getContacts();
                $scope.selectCustomerModal.hide();
            };

            $scope.$on('$destroy', function () {
                $scope.createPop.remove();
                $scope.createModal.remove();
                $scope.selectPersonModal.remove();
            });
            /*-------------------------------Modal 新建 end-------------------------------------*/
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
            console.log('chanceDetail');
            ionicMaterialInk.displayEffect();

            $scope.statusArr = saleChanService.listStatusArr;
            $scope.relationsTypes = saleChanService.relationsTypes;
            console.log($scope.relationsTypes);
            $scope.chanceDetails = {
                preMount: '0.00',
                CURRENCY: 'CNY',
                preMoney: '0.00',
                preMoneyType: 'AH'
            };
            var getInitStatus = function () {
                for (var i = 0; i < $scope.statusArr.length; i++) {
                    if ($scope.statusArr[i].value == $scope.chanceDetails.STATUS) {
                        $scope.mySelect = {
                            status: $scope.statusArr[i]
                        };
                        return
                    }
                }
            };
            var getRelationsType = function (code) {
                for (var i = 0; i < $scope.relationsTypes.length; i++) {
                    if ($scope.relationsTypes[i].code == code) {
                        return $scope.relationsTypes[i].text;
                    }
                }
                return "";
            };
            var getSaleStage = function (data) {
                for (var i = 0; i < $scope.saleStages.length; i++) {
                    if ($scope.saleStages[i].value == data) {
                        return $scope.saleStages[i];
                    }
                }
                return {};
            };
            var detailResponse;
            var getDetails = function () {
                Prompter.showLoading();
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_USER": {"BNAME": ""},
                    "IS_ID": {"OBJECT_ID": saleChanService.obj_id}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_DETAIL', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            detailResponse = response;
                            $scope.chanceDetails = response.ES_OPPORT_H;
                            $scope.relationArr = response.ET_RELEATION.item;
                            relationService.chanceDetailPartner = $scope.chanceDetails;
                            angular.forEach($scope.relationArr, function (x) {
                                x.position = getRelationsType(x.PARTNER_FCT);
                                x.PARTNER = x.PARTNER_NO;
                            });
                            $scope.chanceDetails.PHASE = getSaleStage($scope.chanceDetails.PHASE);
                            getOldCustomer();
                            Prompter.hideLoading();
                            getInitStatus();
                        }
                    });
            };
            getDetails();
            $scope.isEdit = false;
            $scope.editText = "编辑";
            $scope.edit = function () {
                if ($scope.editText == '编辑') {
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
                        "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                        "IS_OPPORT_H": {
                            "OBJECT_ID": $scope.chanceDetails.OBJECT_ID,
                            "DESCRIPTION": $scope.chanceDetails.DESCRIPTION,
                            "STARTDATE": $scope.chanceDetails.STARTDATE,
                            "EXPECT_END": $scope.chanceDetails.EXPECT_END,
                            "PHASE": $scope.chanceDetails.PHASE.value,
                            "PROBABILITY": $scope.chanceDetails.PROBABILITY,
                            "STATUS": $scope.mySelect.status.value,
                            "ZZXMBH": $scope.chanceDetails.ZZXMBH,
                            "EXP_REVENUE": $scope.chanceDetails.EXP_REVENUE,
                            "CURRENCY": $scope.chanceDetails.CURRENCY,
                            "ZZXSYXL": $scope.chanceDetails.ZZXSYXL,
                            "ZZYQXSLDW": $scope.chanceDetails.ZZYQXSLDW,
                            "ZZMBCP": "",
                            "ZZFLD00002E": "",
                            "ZTEXT": $scope.chanceDetails.CRM_ORDERH_T
                        },
                        "IS_USER": {"BNAME": window.localStorage.crmUserName},
                        "IT_COMPETITOR": {
                            "item": {
                                "PARTNER_NO": "",
                                "ADVANTAGE": "",
                                "DISADVANTAGE": ""
                            }
                        },
                        "IT_CONTACT": {
                            "item": {
                                "PARTNER_NO": "",
                                "INFLUENCE": "",
                                "NEED": "",
                                "OUR_OPINION": ""
                            }
                        },
                        "IT_PARTNER": {
                            "item": getModifyRelationsArr()
                        }
                    };
                    HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_CHANGE', data)
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
                    $scope.showTitleStatus = false;
                }
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.returnScroll = function () {
                $scope.onScroll();
            };
            /*------------------------------------选择时间------------------------------------*/

            $scope.selectTime = function (type) {
                if (!$scope.isEdit) {
                    return;
                }
                //iOS平台
                if (type == 'start') {
                    Prompter.selectTime($scope, 'chanDetailStart',
                        new Date($scope.chanceDetails.STARTDATE.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '开始时间');
                } else {
                    Prompter.selectTime($scope, 'chanDetailEnd',
                        new Date($scope.chanceDetails.EXPECT_END.replace(/-/g, "/")).format('yyyy/MM/dd'), 'date', '结束时间');
                }
            };
            /*----------------------------------选择时间  end------------------------------------*/

            $scope.submit = function () {

            };
            /*---------------------------------选择弹窗-------------------------------------*/
            $scope.saleStages = saleChanService.saleStages;
            $scope.pop = {
                stage: '',
                feel: '',
                proNum: ''
            };
            var getInitStage = function () {
                for (var i = 0; i < $scope.saleStages.length; i++) {
                    if ($scope.saleStages[i].text == $scope.chanceDetails.PHASE.text) {
                        $scope.pop.stage = $scope.saleStages[i];
                        return
                    }
                }
            };
            $ionicPopover.fromTemplateUrl('src/applications/saleChance/modal/saleDetailSelect_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.openPopover = function ($event) {
                getInitStage();
                $scope.pop.feel = $scope.chanceDetails.PROBABILITY;
                $scope.pop.proNum = $scope.chanceDetails.ZZXMBH;
                $scope.popover.show($event);
            };
            $scope.savePop = function () {
                if ($scope.saleStages.indexOf($scope.pop.stage) >= 3) {
                    if (!$scope.pop.proNum) {
                        Prompter.alert('请输入项目编号');
                        return
                    }
                }
                $scope.chanceDetails.PHASE = $scope.pop.stage;
                //getInitStatus();
                $scope.chanceDetails.PROBABILITY = $scope.pop.feel;
                $scope.chanceDetails.ZZXMBH = $scope.pop.proNum;
                $scope.popover.hide();
            };
            $scope.closePop = function () {
                $scope.popover.hide();
            };
            /*-------------------------------选择弹窗 end-----------------------------------*/
            /*-------------------------------后续-----------------------------------*/
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/followUp.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.followUpModal = modal;
            });
            $scope.openFollow = function () {
                $scope.followUpModal.show();
            };
            /*-------------------------------后续 end-----------------------------------*/
            /*-------------------------------币种-----------------------------------*/
            $ionicModal.fromTemplateUrl('src/applications/saleChance/modal/moneyTypes.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.moneyTypesModal = modal;
            });

            $scope.openMoneyModal = function (type) {
                if (!$scope.isEdit) {
                    return
                }
                if (type == 'money') {
                    $scope.unitTitle = '币种';
                    $scope.moneyTypesArr = saleChanService.getMoneyTypesArr();
                } else {
                    $scope.unitTitle = '销量单位';
                    $scope.moneyTypesArr = saleChanService.saleUnits;
                }
                $scope.moneyTypesModal.show();
            };
            $scope.selectMoneyType = function (x) {
                if ($scope.unitTitle == '币种') {
                    $scope.chanceDetails.CURRENCY = x.value;
                } else {
                    $scope.chanceDetails.ZZYQXSLDW = x.value;
                }

                $scope.moneyTypesModal.hide();
            };
            /*-------------------------------币种 end-----------------------------------*/
            //选择客户
            var customerPage = 1;
            $scope.customerArr = [];
            $scope.customerSearch = false;
            $scope.input={customer:''}
            $scope.getCustomerArr = function (search) {
                $scope.CustomerLoadMoreFlag = false;
                if (search) {
                    $scope.customerSearch = false;
                    customerPage = 1;
                } else {
                    $scope.spinnerFlag = true;
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_PAGE": {
                        "CURRPAGE": customerPage++,
                        "ITEMS": "10"
                    },
                    "IS_SEARCH": {"SEARCH": $scope.input.customer},
                    "IT_IN_ROLE": {}
                };
                console.log(data);
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.SEARCH != $scope.input.customer) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.CustomerLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.customerArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                            }
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = true;
                            $scope.CustomerLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    });
            };
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                $scope.selectCustomerModal = modal;
            });
            $scope.customerModalArr = saleActService.getCustomerTypes();
            $scope.selectCustomerText = '竞争对手';
            $scope.openSelectCustomer = function () {
                if (!$scope.isEdit) {
                    return;
                }
                $scope.getCustomerArr();
                $scope.isDropShow = true;
                $scope.customerSearch = true;
                $scope.selectCustomerModal.show();
            };
            $scope.closeSelectCustomer = function () {
                $scope.selectCustomerModal.hide();
            };
            $scope.selectPop = function (x) {
                $scope.selectCustomerText = x.text;
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.changeReferMoreflag = function () {
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.showChancePop = function () {
                $scope.referMoreflag = true;
                $scope.isDropShow = true;
            };
            $scope.initCustomerSearch = function () {
                $scope.input.customer = '';
                //$scope.getCustomerArr();
                $timeout(function () {
                    document.getElementById('selectCustomerId').focus();
                }, 1)
            };
            var oldCustomer;
            var getOldCustomer = function () {
                angular.forEach($scope.relationArr, function (data) {
                    if (data.PARTNER_FCT == "00000021") {
                        oldCustomer = data;
                    }
                });
            };
            $scope.selectCustomer = function (x) {
                $scope.create = {
                    customer: x
                };
                x.NAME = x.NAME_ORG1;
                x.position = '客户';
                $scope.chanceDetails.PARTNER_TXT = x.NAME_ORG1;
                $scope.chanceDetails.PARTNER = x.PARTNER;
                var isAlreadyHaveCustomer = false;
                //判断修改相关方数组中是否已经有修改客户的数据,如果有,删除重新push
                //for(var i=0;i<modifyRelationsArr.length;i++){
                //    if(modifyRelationsArr[i].PARTNER_FCT=='00000021'){
                //        modifyRelationsArr.splice(i,1);
                //        break
                //    }
                //}
                for (var j = 0; j < $scope.relationArr.length; j++) {
                    if ($scope.relationArr[j].position == '客户') {
                        isAlreadyHaveCustomer = true;
                        $scope.relationArr[j] = x;
                    }
                }
                if (isAlreadyHaveCustomer) {
                    //if(oldCustomer.NAME!=x.NAME_ORG1){
                    //    modifyRelationsArr.push({
                    //        "MODE": "U",
                    //        "PARTNER_FCT": "00000021",
                    //        "PARTNER": x.PARTNER,
                    //        "MAINPARTNER": "",
                    //        "OLD_FCT": oldCustomer.PARTNER_FCT,
                    //        "OLD_PARTNER": oldCustomer.PARTNER_NO,
                    //        "RELATION_PARTNER": ""
                    //    });
                    //}
                } else {
                    $scope.relationArr.push(x);
                    //modifyRelationsArr.push({
                    //    "MODE": "I",
                    //    "PARTNER_FCT": "00000021",
                    //    "PARTNER": x.PARTNER,
                    //    "MAINPARTNER": "",
                    //    "OLD_FCT": "",
                    //    "OLD_PARTNER": "",
                    //    "RELATION_PARTNER": ""
                    //});
                }
                console.log($scope.relationArr);
                $scope.selectCustomerModal.hide();
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
                                "OLD_PARTNER": data.old.PARTNER_NO,
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
                    if (data.PARTNER_FCT == "00000021") {
                        relationService.relationCustomer = data;
                    }
                });
                relationService.isReplace = false;
                relationService.myRelations = $scope.relationArr;
                relationService.saleActSelections = angular.copy(saleChanService.relationsTypesForAdd);
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
                repTempIndex = $scope.relationArr.indexOf(x);
                $ionicActionSheet.show({
                    buttons: [
                        {text: '删除'},
                        {text: '替换'}
                    ],
                    titleText: '请选择操作',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                        console.log(index);
                        switch (index) {
                            case 0:
                                if (x.position == '客户') {
                                    $scope.chanceDetails.PARTNER_TXT = '';
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
                                relationService.myRelations = $scope.relationArr;
                                relationService.replaceMan = x;
                                relationService.saleActSelections = angular.copy(saleChanService.relationsTypesForAdd);
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

            $scope.goRelationDetail = function (x) {
                switch (x.position) {
                    case '客户':
                        x.PARTNER_ROLE = 'CRM000';
                        customeService.set_customerListvalue(x);
                        $state.go('customerDetail');
                        break;
                    case '竞争对手':
                        x.PARTNER_ROLE = 'Z00002';
                        customeService.set_customerListvalue(x);
                        $state.go('customerDetail');
                        break;
                    case 'CATL销售':
                        employeeService.set_employeeListvalue(x);
                        $state.go('userDetail');
                        break;
                    case 'CATL销售2':
                        employeeService.set_employeeListvalue(x);
                        $state.go('userDetail');
                        break;
                    case '联系人':
                        contactService.set_ContactsListvalue(x.PARTNER);
                        $state.go('ContactDetail');
                        break;
                }
            };

            $scope.$on('$destroy', function () {
                $scope.popover.remove();
                $scope.followUpModal.remove();
                $scope.moneyTypesModal.remove();
                $scope.selectCustomerModal.remove();
            });
        }]);
