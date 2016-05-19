/**
 * Created by zhangren on 16/4/25.
 */
'use strict';
salesModule
    .controller('saleChanCreateModalCtrl', ['$scope',
        '$state',
        '$timeout',
        '$ionicLoading',
        '$ionicPopover',
        '$ionicModal',
        '$ionicScrollDelegate',
        '$ionicHistory',
        '$cordovaDialogs',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        'Prompter',
        'HttpAppService',
        'saleChanService',
        'customeService',
        'LoginService',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $ionicScrollDelegate, $ionicHistory, $cordovaDialogs, ionicMaterialInk,
                  ionicMaterialMotion, saleActService, Prompter, HttpAppService, saleChanService, customeService, LoginService) {
            $scope.role = LoginService.getProfileType();
            $scope.filters = saleChanService.filters;
            $scope.CustomerLoadMoreFlag = true;
            if (Prompter.isATL()) {
                $scope.saleStages = saleChanService.saleStages.ATL;
            } else {
                $scope.saleStages = saleChanService.saleStages2;
            }
            //机会类型
            $scope.chanceTypes = saleChanService.chanceTypes;
            $scope.create = {
                title: '',
                place: '',
                customer: '',
                contact: '',
                stage: $scope.saleStages[0],
                de_startTime: new Date().format('yyyy-MM-dd'),
                de_endTime: '',
                annotate: '测试',
                chanceType: $scope.chanceTypes[0],
                object_id: ''
            };
            $scope.$watch('create.chanceType', function () {
                //console.log($scope.create.chanceType);
                switch (angular.isUndefined($scope.create.chanceType) && $scope.create.chanceType.code) {
                    case 'ZO02':
                        $scope.saleStages = saleChanService.saleStages.CATL.EBUS;
                        break;
                    case 'ZO03':
                        $scope.saleStages = saleChanService.saleStages.CATL.ECAR;
                        break;
                    case 'ZO04':
                        $scope.saleStages = saleChanService.saleStages.CATL.ESS;
                        break;
                }
            });
            //判断是否来自销售线索,如果是,赋予默认值
            if (saleChanService.isFromClue) {
                $scope.create = {
                    title: saleChanService.description,
                    de_startTime: new Date(saleChanService.startTime).format('yyyy-MM-dd'),
                    de_endTime: new Date(saleChanService.endTime).format('yyyy-MM-dd'),
                    object_id: saleChanService.objectId
                };
                if (isNaN($scope.create.de_endTime)) {
                    $scope.create.de_endTime = "";
                }
                if(isNaN($scope.create.de_startTime)) {
                    $scope.create.de_startTime = new Date().format('yyyy-MM-dd');
                }
            }
            $scope.selectPersonflag = false;
            //选择时间
            $scope.selectCreateTime = function (type) {
                if (type == 'start') {
                    Prompter.selectTime($scope, 'actCreateStart',
                        $scope.create.de_startTime.replace(/-/g, "/"), 'date', '开始时间');
                } else {
                    Prompter.selectTime($scope, 'actCreateEnd',
                        $scope.create.de_endTime.replace(/-/g, "/"), 'date', '结束时间');
                }
            };

            var getProcessType = function () {
                if (Prompter.isATL()) {
                    return 'ZO01'
                }
                //for (var i = 0; i < $scope.filters.types.length; i++) {
                //    if ($scope.chancePop.saleOffice.SALES_OFF_SHORT.substring(0, 2) == $scope.filters.types[i].text.substring(0, 2)) {
                //        return $scope.filters.types[i].value;
                //    }
                //}
                return $scope.create.chanceType.code;
            };
            $scope.saveCreateModal = function () {
                if (angular.isUndefined($scope.create.chanceType) && !Prompter.isATL()) {
                    Prompter.alert('请选择机会类型');
                    return
                }
                if (Number($scope.create.stage.value.substring(1, 3)) >= 4 && !Prompter.isATL()) {
                    if (!$scope.create.proNum) {
                        Prompter.alert('请输入项目编号');
                        return
                    }
                }
                if (!$scope.create.title) {
                    Prompter.alert('请填写描述');
                    return
                } else if (!$scope.create.customer) {
                    Prompter.alert('请选择客户');
                    return
                }

                var data = {
                    "I_SYSNAME": {
                        "SysName": ROOTCONFIG.hempConfig.baseEnvironment
                    },
                    "IS_OPPORT_H": {
                        "DESCRIPTION": $scope.create.title,
                        "PROCESS_TYPE": getProcessType(),
                        "STARTDATE": $scope.create.de_startTime,
                        "EXPECT_END": $scope.create.de_endTime,
                        "PHASE": $scope.create.stage.value,
                        "PROBABILITY": $scope.create.stage.confidence,
                        "STATUS": "E0001",
                        "ZZXMBH": $scope.create.proNum,
                        "EXP_REVENUE": "",
                        "CURRENCY": "",
                        "ZZXSYXL": "",
                        "ZZYQXSLDW": "",
                        "ZZMBCP": "",
                        "ZZFLD00002E": "",
                        "ZOBJECT_ID": $scope.create.object_id
                    },
                    "IS_ORGMAN": {
                        "SALES_ORG": $scope.chancePop.saleOffice.SALES_ORG,
                        "DIS_CHANNEL": "",
                        "DIVISION": "",
                        "SALES_OFFICE": $scope.chancePop.saleOffice.SALES_OFFICE,
                        "SALES_GROUP": $scope.chancePop.saleOffice.SALES_GROUP,
                        "SALES_ORG_RESP": $scope.chancePop.saleOffice.SALES_GROUP
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
                $cordovaDialogs.confirm('是否确认提交', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        if (buttonIndex == 1) {
                            Prompter.showLoading('正在提交');
                            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_CREAT', data)
                                .success(function (response) {
                                    try {
                                        if (response.ES_RESULT.ZFLAG === 'S') {
                                            $scope.createChanceModal.remove();
                                            Prompter.showShortToastBotton('创建成功');
                                            saleChanService.obj_id = response.ES_RESULT.ZRESULT;
                                            $state.go('saleChanDetail');
                                            Prompter.hideLoading();
                                        } else if (response.ES_RESULT.ZFLAG === 'E') {
                                            Prompter.showShortToastBotton('创建失败');
                                            Prompter.hideLoading();
                                            $scope.createChanceModal.remove();
                                        }
                                    } catch (e) {
                                        Prompter.showShortToastBotton('创建失败');
                                        Prompter.hideLoading();
                                        $scope.createChanceModal.remove();
                                    }
                                }).error(function (error) {
                                    Prompter.showShortToastBotton('创建失败');
                                    Prompter.hideLoading();
                                    $scope.createChanceModal.remove();
                                });
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
            $scope.input = {customer: ''};
            var customerType;
            if (Prompter.isATL()) {
                customerType = 'ZATL01';
            } else {
                customerType = 'Z00001';
            }
            $scope.getCustomerArr = function (search) {
                $scope.isError = false;
                if (search) {
                    $scope.customerArr = [];
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
                    "IT_IN_ROLE": {
                        "item1": {"RLTYP": customerType}
                    },
                    "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_SEARCH.SEARCH != $scope.input.customer) {
                            return;
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (search) {
                                $scope.customerArr = response.ET_OUT_LIST.item;
                            } else {
                                $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                            }
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = true;
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.spinnerFlag = false;
                                $scope.customerSearch = false;
                            }
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else if (response.ES_RESULT.ZFLAG === 'E') {
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = false;
                            $scope.isError = true;
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
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
                    "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
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

                            $scope.contacts = $scope.contacts.concat(response.ET_OUT_LIST.item);
                            if ($scope.contacts.length == 0) {
                                isNoContacts = true;
                            }
                            $scope.contactSpinnerFLag = false;
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.contactSpinnerFLag = false;
                                $scope.contactsLoadMoreFlag = false;
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else if (response.ES_RESULT.ZFLAG === 'E') {
                            if ($scope.contacts.length == 0) {
                                isNoContacts = true;
                            }
                            $scope.contactSpinnerFLag = false;
                            $scope.contactsLoadMoreFlag = false;
                            //Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
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
            if ($scope.role == 'APP_SALE') {
                $scope.customerModalArr = saleActService.getCustomerTypes();
                $scope.selectCustomerText = '潜在客户';
            } else {
                $scope.customerModalArr = saleActService.customerTypeArr_server;
                $scope.selectCustomerText = '正式客户';
                customerType = 'CRM000';
            }
            $scope.openSelectCustomer = function () {
                $scope.isDropShow = true;
                $scope.customerSearch = true;
                $scope.getCustomerArr('search');
                $scope.selectCustomerModal.show();
            };
            $scope.closeSelectCustomer = function () {
                $scope.selectCustomerModal.hide();
            };
            $scope.selectPop = function (x) {
                $scope.selectCustomerText = x.text;
                customerType = x.code;
                $scope.getCustomerArr('search');
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
                $scope.getCustomerArr('search');
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
            //销毁
            $scope.$on('$destroy', function () {
                saleChanService.isFromClue = false;
                $scope.createChanceModal.remove();
                $scope.selectPersonModal.remove();
                $scope.selectCustomerModal.remove();
            });
            //初始化
            //$scope.getCustomerArr('search');

        }]);