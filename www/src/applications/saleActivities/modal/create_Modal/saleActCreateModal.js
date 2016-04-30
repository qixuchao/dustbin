/**
 * Created by zhangren on 16/4/23.
 */
salesModule
    .controller('saleActCreateModalCtrl', ['$scope', '$rootScope',
        '$state',
        '$timeout',
        '$ionicLoading',
        '$ionicPopover',
        '$ionicModal',
        '$cordovaToast',
        '$ionicScrollDelegate',
        '$cordovaDialogs',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        'Prompter',
        'HttpAppService',
        'relationService',
        'LoginService',
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  $cordovaDialogs, ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService, relationService, LoginService) {
            if (ROOTCONFIG.hempConfig.baseEnvironment == "ATL") {
                $scope.isHideUrgent = true;
            }
            if ($scope.pop.type.value == 'ZA04') {
                $scope.isHideCustomer = true;
            }
            $scope.role = LoginService.getProfileType();
            $scope.CustomerLoadMoreFlag = true;
            var customerPage = 1;
            $scope.customerArr = [];
            $scope.customerSearch = false;
            $scope.urgentDegreeArr = saleActService.urgentDegreeArr;
            var customerType = 'CRM000';
            $scope.input = {customer: ''};
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
                    }
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
                            $scope.CustomerLoadMoreFlag = true;
                            if (response.ET_OUT_LIST.item.length < 10) {
                                $scope.spinnerFlag = false;
                                $scope.customerSearch = false;
                            }
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = false;
                            $scope.isError = true;
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                        }
                    });
            };

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
                        } else {
                            if ($scope.contacts.length == 0) {
                                isNoContacts = true;
                            }
                            $scope.contactSpinnerFLag = false;
                            $scope.contactsLoadMoreFlag = false;
                            //Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                        }
                    });
            };
            var getDefultStartTime = function () {
                var dateArr = new Date().format('hh:mm').split(':');
                return new Date().format('yyyy-MM-dd') + ' ' + (Number(dateArr[0]) + 2) + ':' + dateArr[1];
            };
            $scope.selectPersonflag = false;
            $scope.saveCreateModal = function () {
                if (!$scope.create.title) {
                    Prompter.alert('请填写描述');
                    return
                } else if (!$scope.create.urgent && ROOTCONFIG.hempConfig.baseEnvironment == "CATL") {
                    Prompter.alert('请选择紧急程度');
                    return
                } else if (!$scope.create.de_startTime) {
                    Prompter.alert('请选择开始时间');
                    return
                }
                if ((new Date($scope.create.de_endTime).getTime() -
                    new Date($scope.create.de_startTime).getTime()) / (24 * 60 * 1000 * 2.5) < 2) {
                    Prompter.alert('结束时间过小');
                    return
                }
                if (angular.isUndefined($scope.create.customer)) {
                    $scope.create.customer = {PARTNER: ""}
                }
                if (angular.isUndefined($scope.create.contact)) {
                    $scope.create.contact = {PARTNER: ""}
                }
                if (angular.isUndefined($scope.create.urgent)) {
                    $scope.create.urgent = {value: ""};
                }

                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_DATE": {
                        "DATE_FROM": $scope.create.de_startTime.split(' ')[0],
                        "TIME_FROM": $scope.create.de_startTime.split(' ')[1] + ':00',
                        "DATE_TO": $scope.create.de_endTime.split(' ')[0],
                        "TIME_TO": $scope.create.de_endTime.split(' ')[1] + ':00'
                    },
                    "IS_HEAD": {
                        "PROCESS_TYPE": $scope.pop.type.value,
                        "DESCRIPTION": $scope.create.title,
                        "ZZHDJJD": $scope.create.urgent.value,
                        "ZZHDZLXSM": "",
                        "ACT_LOCATION": $scope.create.place,
                        "ESTAT": "E0001",
                        "REF_DOC_NO": ""
                    },
                    "IS_ORGMAN": {
                        "SALES_ORG": $scope.pop.saleOffice.SALES_ORG,
                        "DIS_CHANNEL": "",
                        "DIVISION": "",
                        "SALES_OFFICE": $scope.pop.saleOffice.SALES_OFFICE,
                        "SALES_GROUP": $scope.pop.saleOffice.SALES_GROUP,
                        "SALES_ORG_RESP": $scope.pop.saleOffice.SALES_GROUP
                    },
                    "IS_USER": {"BNAME": window.localStorage.crmUserName},
                    "IT_LINES": {
                        "item": {
                            "TDFORMAT": "*",
                            "TDLINE": $scope.create.annotation
                        }
                    },
                    "IT_PARTNER": {
                        "item": [{
                            "PARTNER_FCT": "00000009",//客户
                            "PARTNER": $scope.create.customer.PARTNER
                        }, {
                            "PARTNER_FCT": "00000015",//联系人
                            "PARTNER": $scope.create.contact.PARTNER
                        }]
                    }
                };
                $cordovaDialogs.confirm('是否确认提交', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        if (buttonIndex == 1) {
                            Prompter.showLoading('正在提交');
                            HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_CREATE', data)
                                .success(function (response) {
                                    if (response.ES_RESULT.ZFLAG === 'S') {
                                        $scope.createModal.remove();
                                        Prompter.showShortToastBotton('创建成功');
                                        saleActService.actDetail = {
                                            OBJECT_ID: response.EV_OBJECT_ID,
                                            CUSTNAME: $scope.create.customer.NAME_ORG1
                                        };
                                        $state.go('saleActDetail');
                                        Prompter.hideLoading();
                                    } else {
                                        Prompter.showShortToastBotton('创建失败');
                                        Prompter.hideLoading();
                                        $scope.createModal.remove();
                                    }
                                });
                        }
                    });
            };
            //选择时间
            $scope.selectCreateTime = function (type) {
                if (type == 'start') {
                    Prompter.selectTime($scope, 'actCreateStart', new Date($scope.create.de_startTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm'), 'datetime', '开始时间');
                } else {
                    Prompter.selectTime($scope, 'actCreateEnd', new Date($scope.create.de_endTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm'), 'datetime', '结束时间');
                }
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
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                $scope.selectCustomerModal = modal;
            });
            if ($scope.role == 'APP_SALE') {
                $scope.customerModalArr = saleActService.getCustomerTypes();
            } else {
                $scope.customerModalArr = saleActService.customerTypeArr_server;
            }
            if (Prompter.isATL()) {
                $scope.customerModalArr = saleActService.customerTypeArr_ATL;
            }
            $scope.selectCustomerText = '正式客户';
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
            //初始化

            $scope.create = {
                de_startTime: new Date().format('yyyy-MM-dd hh:mm'),
                de_endTime: getDefultStartTime()
            };
            $scope.$on('$destroy', function () {
                $scope.selectPersonModal.remove();
                $scope.selectCustomerModal.remove();
            });
        }]);