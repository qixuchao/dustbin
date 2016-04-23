/**
 * Created by zhangren on 16/3/19.
 */
'use strict';
salesModule
    .controller('saleActListCtrl', ['$scope', '$rootScope',
        '$state',
        '$timeout',
        '$ionicLoading',
        '$ionicPopover',
        '$ionicModal',
        '$cordovaToast',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        'Prompter',
        'HttpAppService',
        'saleChanService',
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService, saleChanService) {
            console.log('销售活动列表');
            $scope.saleTitleText = '销售活动';
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100);
            $scope.searchFlag = false;
            $scope.input = {search: '', customer: '', list: ''};
            $scope.isloading = true;
            //var pageNum = saleActService.listPage;
            var pageNum = 1;
            $scope.loadMoreFlag = true;
            //$scope.saleListArr = saleActService.saleListArr;
            $scope.saleListArr = [];
            $scope.urgentDegreeArr = saleActService.urgentDegreeArr;
            var tempHisPostData = {};
            //没有 更多数据
            $scope.saleListNoMoreInfoFLag = false;
            $scope.getList = function (type) {
                if (!$scope.saleListArr.length) {
                    $scope.isloading = false;
                }
                switch (type) {
                    case 'searchPage':
                        if (!$scope.input.list) {
                            return
                        }
                        angular.element('#saleChanListSearchPageId').addClass('active');
                        break;
                    case 'refresh':
                        pageNum = 1;
                        var arr = document.getElementsByClassName('flipInX');
                        for (var i = 0; i < arr.length; i++) {
                            angular.element(arr[i]).removeClass('animated');
                        }
                        $scope.saleListArr = [];
                        $scope.isloading = true;
                        break;
                    case 'search':
                        $scope.loadMoreFlag = true;
                        angular.element('#saleChanListSearchPageId').addClass('active');
                        pageNum = 1;
                        var arr = document.getElementsByClassName('flipInX');
                        for (var i = 0; i < arr.length; i++) {
                            angular.element(arr[i]).removeClass('animated');
                        }
                        $scope.saleListArr = [];
                        break
                }
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_ACTIVITY": {
                        "OBJECT_ID": "",
                        "DESCSEARCH": $scope.input.list,
                        "PROCESS_TYPE": getFilterType(),
                        "ZZHDJJD": getFilterUrgent(),
                        "CUSTOMER": "",
                        "DATE_FROM": "",
                        "DATE_TO": "",
                        "ESTAT": getFilterStatus(),
                        "SALESNO": ""
                    },
                    "IS_PAGE": {
                        "CURRPAGE": pageNum++,
                        "ITEMS": "10"
                    },
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                tempHisPostData = data;
                saleActService.listPage = pageNum;
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_ACTIVITY.DESCSEARCH != $scope.input.list) {
                            return;
                        }
                        $scope.isloading = false;
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (type == 'refresh') {
                                $scope.saleListArr = response.ET_LIST.item;
                                //saleActService.saleListArr = $scope.saleListArr;
                                $ionicScrollDelegate.resize();
                                return
                            }
                            if (response.ET_LIST.item.length < 10) {
                                $scope.loadMoreFlag = false;
                            }
                            $scope.saleListArr = $scope.saleListArr.concat(response.ET_LIST.item);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.resize();
                            //saleActService.saleListArr = $scope.saleListArr;
                        } else {
                            $scope.loadMoreFlag = false;
                            $scope.saleListNoMoreInfoFLag = true;
                        }
                    }).finally(function () {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            if (storedb('saleActListHisArr').find().arrUniq() != undefined || storedb('saleActListHisArr').find().arrUniq() != null) {
                $scope.hisArr = (storedb('saleActListHisArr').find().arrUniq());
            }
            $scope.filters = saleActService.filters;
            var tempFilterArr = angular.copy($scope.filters);
            var onceCilck = true;
            $scope.filterSelect = function (x, arr) {
                if ($scope.filterFlag && onceCilck) {
                    tempFilterArr = angular.copy($scope.filters);
                    onceCilck = false;
                }
                var flag = x.flag;
                angular.forEach(arr, function (data) {
                    data.flag = false;
                });
                x.flag = !flag;
            };
            $scope.filterReset = function () {
                $.each($scope.filters, function (i, arr) {
                    angular.forEach(arr, function (data) {
                        data.flag = false;
                    })
                });
            };
            var getFilterType = function () {
                for (var i = 0; i < $scope.filters.type.length; i++) {
                    if ($scope.filters.type[i].flag) {
                        return $scope.filters.type[i].value;
                    }
                }
                return "";
            };
            var getFilterStatus = function () {
                for (var i = 0; i < $scope.filters.status.length; i++) {
                    if ($scope.filters.status[i].flag) {
                        return $scope.filters.status[i].value;
                    }
                }
                return "";
            };
            var getFilterUrgent = function () {
                for (var i = 0; i < $scope.filters.urgentDegree.length; i++) {
                    if ($scope.filters.urgentDegree[i].flag) {
                        return $scope.filters.urgentDegree[i].value;
                    }
                }
                return "";
            };
            $scope.filterSure = function () {
                $scope.filterFlag = !$scope.filterFlag;
                tempFilterArr = $scope.filters;
                var ele = angular.element('#saleChanListFilterId');
                ele.css('display', 'block').removeClass('fadeInDown');
                ele.css('display', 'block').addClass('slideOutUp');
                $scope.getList('search');
            };
            $scope.filterPrevent = function (e) {
                e.stopPropagation();
            };
            $scope.filterFlag = false;
            $scope.changeSearch = function () {
                angular.element('#saleChanListFilterId').css('display', 'none');
                if ($scope.filterFlag) {
                    $scope.filterFlag = false;
                }
                $scope.searchFlag = !$scope.searchFlag;
            };
            $scope.search = function (x, e) {
                $scope.input.list = x.text;
                $scope.getList('search');
                e.stopPropagation();
            };
            $scope.initSearch = function () {
                $scope.input.list = '';
                $scope.getList('search');
                $timeout(function () {
                    angular.element('#saleActListSearchId').focus();
                }, 1)
            };
            //筛选
            $scope.filterFlag = false;
            //$scope.isDropShow = true;
            $scope.changeFilterFlag = function (e) {
                var ele = angular.element('#saleChanListFilterId');
                //angular.element('#saleChanListFilterId').addClass('display','block');
                tempFilterArr = '';
                $scope.filterFlag = !$scope.filterFlag;
                if ($scope.filterFlag) {
                    ele.css('display', 'block').removeClass('slideOutUp');
                    ele.css('display', 'block').addClass('fadeInDown');
                    onceCilck = true;
                } else {
                    ele.css('display', 'block').removeClass('fadeInDown');
                    ele.css('display', 'block').addClass('slideOutUp');
                }
                e.stopPropagation();
            };
            $scope.goDetail = function (x, e) {
                saleActService.actDetail = x;
                var isStored = false;
                angular.forEach($scope.hisArr, function (data) {
                    if (data.text == $scope.input.list) {
                        isStored = true;
                    }
                });
                if (!isStored) {
                    storedb('saleActListHisArr').insert({
                        text: $scope.input.list,
                        data: tempHisPostData
                    }, function (err) {
                        if (!err) {
                            console.log('历史记录保存成功')
                        } else {
                            Prompter.alert('历史记录保存失败');
                        }
                    });
                    $scope.hisArr = (storedb('saleActListHisArr').find().arrUniq());
                }
                $state.go('saleActDetail');
                e.stopPropagation();
            };
            /*-------------------------------Pop 新建-------------------------------------*/
            $scope.createPopTypes = saleActService.getCreatePopTypes();
            $scope.createPopOrgs = saleActService.getCreatePopOrgs();
            $scope.pop = {
                type: {}
            };
            $ionicPopover.fromTemplateUrl('src/applications/saleActivities/modal/createSaleAct_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.createPop = popover;
            });
            $scope.openCreatePop = function (e) {
                $scope.creaeSpinnerFlag = true;
                $timeout(function () {
                    $scope.creaeSpinnerFlag = false;
                    $scope.pop.type = $scope.createPopTypes[0];
                    $scope.createPop.show();
                }, 1000);
            };

            $scope.showCreateModal = function () {
                customerPage = 1;
                console.log($scope.pop);
                $scope.createPop.hide();
                $scope.create = {
                    de_startTime: new Date().format('yyyy-MM-dd hh:mm'),
                    de_endTime: getDefultStartTime()
                };
                $scope.CustomerLoadMoreFlag = true;
                $scope.createModal.show();
                $scope.getCustomerArr();
                //console.log(document.getElementsByClassName('modal-wrapper'));
                var tempArr = document.getElementsByClassName('modal-wrapper');
                for (var i = 0; i < tempArr.length; i++) {
                    tempArr[i].style.pointerEvents = 'auto';
                }
            };
            var customerPage = 1;
            $scope.customerArr = [];
            $scope.customerSearch = false;
            var customerType = 'CRM000';
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
                    "IT_IN_ROLE": {
                        "item1": { "RLTYP": customerType }
                    }
                };
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
                        }else{
                            $scope.CustomerLoadMoreFlag = false;
                            $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
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
                            $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                            $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        }
                    });
            };
            /*-------------------------------Pop 新建 end-------------------------------------*/
            /*-------------------------------Modal 新建-------------------------------------*/
            //$scope.create = {
            //    description: '',
            //    place: '',
            //    customer: '',
            //    contact: '',
            //    de_startTime: '2016-4-1 15:00',
            //    de_endTime: '2016-4-5 10:00',
            //    annotation: '测试'
            //};
            var getDefultStartTime = function () {
                var dateArr = new Date().format('hh:mm').split(':');
                return new Date().format('yyyy-MM-dd') + ' ' + (Number(dateArr[0]) + 2) + ':' + dateArr[1];
            };
            $scope.selectPersonflag = false;
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/createSaleAct_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.createModal = modal;
            });
            $scope.saveCreateModal = function () {
                if (!$scope.create.title) {
                    Prompter.alert('请填写描述');
                    return
                } else if (!$scope.create.urgent) {
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
                Prompter.showLoading('正在保存');
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
                        "SALES_ORG": "",
                        "DIS_CHANNEL": "",
                        "DIVISION": "",
                        "SALES_OFFICE": "",
                        "SALES_GROUP": "",
                        "SALES_ORG_RESP": ""
                    },
                    "IS_USER": {"BNAME": "HANDBLH"},
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
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_CREATE', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            $scope.createModal.hide();
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
                            $scope.createModal.hide();
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
                $scope.selectCustomerModal.remove();
            });

            /*-------------------------------Modal 新建 end-------------------------------------*/
        }
    ])
    .controller('saleActDetailCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$ionicHistory',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        '$cordovaDialogs',
        '$ionicModal',
        '$ionicPopover',
        '$cordovaToast',
        '$cordovaDatePicker',
        '$ionicActionSheet',
        'saleActService',
        'saleChanService',
        'Prompter',
        'HttpAppService',
        'relationService',
        'customeService',
        'contactService',
        'employeeService',
        function ($scope, $rootScope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $cordovaDatePicker, $ionicActionSheet, saleActService, saleChanService, Prompter
            , HttpAppService, relationService, customeService, contactService, employeeService) {
            $scope.formTest = function () {
                Prompter.alert('提交');
            };
            $scope.details = {relations: []};
            //相关方类型值列表
            $scope.relationPositionArr = saleActService.relationPositionArr;
            ionicMaterialInk.displayEffect();
            $scope.urgentDegreeArr = saleActService.urgentDegreeArr;
            var getRelationPosition = function (data) {
                for (var i = 0; i < $scope.relationPositionArr.length; i++) {
                    if ($scope.relationPositionArr[i].code == data) {
                        return $scope.relationPositionArr[i].text;
                    }
                }
                return '';
            };
            var getStatusIndex = function (data) {
                for (var i = 0; i < $scope.statusArr.length; i++) {
                    if ($scope.statusArr[i].code == data) {
                        return i;
                    }
                }
                return 0;
            };
            var getUrgentIndex = function (data) {
                for (var i = 0; i < $scope.urgentDegreeArr.length; i++) {
                    if ($scope.urgentDegreeArr[i].value == data) {
                        return i;
                    }
                }
                return 0;
            };
            var actTypes = saleActService.createPopTypes;
            var getActType = function (typeCode) {
                for (var i = 0; i < actTypes.length; i++) {
                    if (actTypes[i].value == typeCode) {
                        return actTypes[i].text;
                    }
                }
                return '';
            };
            var getCustomerName = function () {
                var temp;
                for (var i = 0; i < $scope.relationArr.length; i++) {
                    //获取相关方对应的职能
                    $scope.relationArr[i].position = getRelationPosition($scope.relationArr[i].PARTNER_FCT);
                    if ($scope.relationArr[i].PARTNER_FCT == '00000009') {
                        temp = $scope.relationArr[i].NAME
                    }
                }
                return temp;
            };
            var returnArr = function (x) {
                if (x == "") {
                    return {item: []};
                }
                return x;
            };
            $scope.listInfo = saleActService.actDetail;
            var getDetails = function () {
                Prompter.showLoading('正在查询');
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_USER": {"BNAME": window.localStorage.crmUserName},
                    "I_OBJECT_ID": $scope.listInfo.OBJECT_ID
                };
                var promise = HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_DETAIL', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            $scope.details = response.ES_ACTIVITY;
                            relationService.chanceDetailPartner = $scope.details;
                            $scope.details.de_startTime = $scope.details.DATE_FROM + ' ' + $scope.details.TIME_FROM.substring(0, 5);
                            $scope.details.de_endTime = $scope.details.DATE_TO + ' ' + $scope.details.TIME_TO.substring(0, 5);
                            $scope.mySelect = {
                                status: $scope.statusArr[getStatusIndex($scope.details.STATUS_TXT)]
                            };
                            $scope.details.urgent = $scope.urgentDegreeArr[getUrgentIndex($scope.details.ZZHDJJD)];
                            $scope.details.actType = getActType($scope.details.PROCESS_TYPE);
                            $scope.relationArr = response.ET_PARTNERS.item;
                            $scope.details.customerName = getCustomerName();
                            //进展
                            makeConsensusModifyArr = [];
                            followUpMatterModifyArr = [];
                            policyDecodeModifyArr = [];
                            $scope.followUpMatter = returnArr(response.ET_SA0022);
                            //$scope.followUpMatterCopy = returnArr(angular.copy(response.ET_SA0022));
                            $scope.makeConsensus = returnArr(response.ET_SA0021);
                            //$scope.makeConsensusCopy = returnArr(angular.copy(response.ET_SA0021));
                            $scope.policyDecode = returnArr(response.ET_SA0023);
                            //$scope.policyDecodeCopy = returnArr(angular.copy(response.ET_SA0023));
                            Prompter.hideLoading();
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
                    if (angular.isUndefined(type)) {
                        Prompter.showLoading('正在保存');
                    }
                    var startDateArr = $scope.details.de_startTime.split(' ');
                    var endDateArr = $scope.details.de_endTime.split(' ');
                    var data = {
                        "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                        "IS_DATE": {
                            "DATE_FROM": startDateArr[0],
                            "TIME_FROM": startDateArr[1] + ":00",
                            "DATE_TO": endDateArr[0],
                            "TIME_TO": endDateArr[1] + ":00"
                        },
                        "IS_HEAD": {
                            "OBJECT_ID": $scope.details.OBJECT_ID,
                            "DESCRIPTION": $scope.details.DESCRIPTION,
                            "ZZHDJJD": $scope.details.urgent.value,
                            "ZZHDZLXSM": $scope.details.ZZHDZLXSM,
                            "ACT_LOCATION": $scope.details.ACT_LOCATION,
                            "ESTAT": $scope.mySelect.status.code,
                            "REF_DOC_NO": $scope.details.OPPORT_NO,
                            "BNAME": ""
                        },
                        "IS_USER": {"BNAME": window.localStorage.crmUserName},
                        "IT_LINES": {
                            "item": {
                                "TDFORMAT": "*",
                                "TDLINE": $scope.details.TEXT
                            }
                        },
                        "IT_PARTNER": {
                            "item": getModifyRelationsArr()
                        },
                        "IT_SA0021": {
                            "item": makeConsensusModifyArr
                        },
                        "IT_SA0022": {
                            "item": followUpMatterModifyArr
                        },
                        "IT_SA0023": {
                            "item": policyDecodeModifyArr
                        }
                        //"IT_SA0021": {
                        //    "item": makeConsensusModifyArr
                        //},
                        //"IT_SA0022": {
                        //    "item": getProcessModifyArr('followUpMatter')
                        //},
                        //"IT_SA0023": {
                        //    "item": getProcessModifyArr('policyDecode')
                        //}
                    };
                    var promise = HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_CHANGE', data)
                        .success(function (response) {
                            if (response.ES_RESULT.ZFLAG === 'S') {
                                makeConsensusModifyArr=[];
                                followUpMatterModifyArr=[];
                                policyDecodeModifyArr=[];
                                if (angular.isUndefined(type)) {
                                    //Prompter.showShortToastBotton('修改成功');
                                }
                                //$timeout(function () {
                                //    getDetails();
                                //}, 1);
                                $scope.editText = "编辑";
                                $scope.isEdit = false;
                                //Prompter.hideLoading();
                            } else {
                                Prompter.hideLoading();
                            }
                        });
                    return promise;
                }
            };
            $scope.select = true;
            $scope.showTitle = false;
            $scope.showTitleStatus = false;
            //$timeout(function () {
            //    $('#relativeId').css('height', window.screen.height-112+'px');
            //},100)
            $scope.changeStatus = function (flag) {
                $scope.select = flag;
                //$timeout(function () {
                //    $ionicScrollDelegate.resize();
                //},10)

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
            /*------------------------------------选择时间------------------------------------*/
            $scope.selectTime = function (type) {
                if (!$scope.isEdit) {
                    return;
                }
                //iOS平台
                if (type == 'start') {
                    Prompter.selectTime($scope, 'actDetailStart', new Date($scope.details.de_startTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm'), 'datetime', '开始时间');
                } else {
                    Prompter.selectTime($scope, 'actDetailEnd', new Date($scope.details.de_endTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm'), 'datetime', '结束时间');
                }
            };
            /*----------------------------------选择时间  end------------------------------------*/


            /*-------------------------------Modal 参考-------------------------------------*/
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/reference.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.referModal = modal;
            });
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/followUp.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.followUpModal = modal;
            });

            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/process_Modal.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.processModal = modal;
            });
            $scope.referArr = [{
                text: '郑州金龙销售机会'
            }, {
                text: '福州宇通销售机会'
            }, {
                text: '测试1'
            }, {
                text: '测试2'
            }];
            $scope.chancePopArr = [{
                text: '商机'
            }, {
                text: '线索'
            }, {
                text: '销售活动'
            }];
            $scope.selectPopText = '商机';
            $scope.referMoreflag = false;
            $scope.selectModal = function (x) {
                for (var i = 0; i < $scope.referArr.length; i++) {
                    $scope.referArr[i].flag = false;
                }
                $scope.details.refer = $scope.selectPopText + '-' + x.text;
                x.flag = true;
                $scope.referModal.hide();
            };
            $scope.selectPop = function (x) {
                $scope.selectPopText = x.text;
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.changeReferMoreflag = function () {
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.openRefer = function () {
                if (!$scope.isEdit) {
                    return
                }
                $scope.isDropShow = true;
                $scope.referModal.show();
            };
            $scope.showChancePop = function () {
                $scope.referMoreflag = true;
                $scope.isDropShow = true;
            };
            /*-------------------------------Modal end-------------------------------------*/

            $scope.openFollow = function () {
                $scope.followUpModal.show();
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
                switch (x.position) {
                    case '客户':
                        x.PARTNER_ROLE = 'CRM000';
                        customeService.set_customerListvalue(x);
                        $state.go('customerDetail');
                        break;
                    case 'CATL销售':
                        employeeService.set_employeeListvalue(x);
                        $state.go('userDetail');
                        break;
                    case '联系人':
                        contactService.set_ContactsListvalue(x.PARTNER);
                        $state.go('ContactDetail');
                        break;
                }
            };
            //发表进展
            $scope.processArr = saleActService.processArr;
            $scope.myProcess = $scope.processArr[1];
            $scope.positonArr = saleActService.positonArr;
            $scope.processTypesArr = saleActService.processTypesArr;
            var makeConsensusModifyArr = [], followUpMatterModifyArr = [], policyDecodeModifyArr = [];
            $scope.process = {
                department: '',
                chargeMan: '',
                time: '',
                affect: ''
            };
            $scope.input = {
                progress: ''
            };
            var getProcessModifyArr = function (type) {
                var tempArr = [];
                switch (type) {
                    case 'makeConsensus':
                        if ($scope.makeConsensusCopy.item.length == 0) {
                            $scope.makeConsensusCopy.item.push("");
                        }
                        //先找删除
                        angular.forEach($scope.makeConsensusCopy.item, function (x) {
                            var isDelete = true;
                            angular.forEach($scope.makeConsensus.item, function (y) {
                                if (!angular.isUndefined(x.RECORD_ID) && x.RECORD_ID == y.RECORD_ID) {
                                    console.log(y)
                                    isDelete = false;
                                    //是否修改
                                    if (!angular.isUndefined(y.MODE)) {
                                        tempArr.push({
                                            "RECORD_ID": y.RECORD_ID,
                                            "MODE": "U",
                                            "ZZSXNR": y.ZZSXNR,
                                            "ZZFLD0000BB": y.ZZFLD0000BB,
                                            "ZZFZBM": y.ZZFZBM,
                                            "ZZFZR": y.ZZFZR,
                                            "ZZSXSJ": y.ZZSXSJ,
                                            "ZZNOTE_1": y.ZZNOTE_1
                                        })
                                    }
                                }
                                //新建
                                if (!angular.isUndefined(y.MODE) && angular.isUndefined(y.RECORD_ID)) {
                                    tempArr.push({
                                        "MODE": "I",
                                        "ZZSXNR": y.ZZSXNR,
                                        "ZZFLD0000BB": y.ZZFLD0000BB,
                                        "ZZFZBM": y.ZZFZBM,
                                        "ZZFZR": y.ZZFZR,
                                        "ZZSXSJ": y.ZZSXSJ,
                                        "ZZNOTE_1": y.ZZNOTE_1
                                    })
                                }
                            });
                            if (isDelete) {
                                tempArr.push({
                                    "RECORD_ID": x.RECORD_ID,
                                    "MODE": "D",
                                    "ZZSXNR": "",
                                    "ZZFLD0000BB": "",
                                    "ZZFZBM": "",
                                    "ZZFZR": "",
                                    "ZZSXSJ": "",
                                    "ZZNOTE_1": ""
                                })
                            }
                        });
                        angular.forEach($scope.makeConsensus.item, function (x) {
                            //新建
                            if (x.MODE == 'I') {
                                tempArr.push({
                                    "MODE": "I",
                                    "ZZSXNR": x.ZZSXNR,
                                    "ZZFLD0000BB": x.ZZFLD0000BB,
                                    "ZZFZBM": x.ZZFZBM,
                                    "ZZFZR": x.ZZFZR,
                                    "ZZSXSJ": x.ZZSXSJ,
                                    "ZZNOTE_1": x.ZZNOTE_1
                                })
                            }
                        });
                        break;
                    case 'followUpMatter':
                        if ($scope.followUpMatterCopy.item.length == 0) {
                            $scope.followUpMatterCopy.item.push("");
                        }
                        angular.forEach($scope.followUpMatterCopy.item, function (x) {
                            var isDelete = true;
                            angular.forEach($scope.followUpMatter.item, function (y) {
                                if (!angular.isUndefined(x.RECORD_ID) && x.RECORD_ID == y.RECORD_ID) {
                                    isDelete = false;
                                    //是否修改
                                    if (!angular.isUndefined(y.MODE)) {
                                        tempArr.push({
                                            "RECORD_ID": y.RECORD_ID,
                                            "MODE": "U",
                                            "ZZSXNR_1": y.ZZSXNR_1,
                                            "ZZWSKH_1": y.ZZWSKH_1,
                                            "ZZFZBM_1": y.ZZFZBM_1,
                                            "ZZFZR_1": y.ZZFZR_1,
                                            "ZZGXSJ": y.ZZGXSJ,
                                            "ZZWCZK": y.ZZWCZK,
                                            "ZZNOTE_2": y.ZZNOTE_2
                                        })
                                    }
                                }
                                //新建
                                if (!angular.isUndefined(y.MODE) && angular.isUndefined(y.RECORD_ID)) {
                                    tempArr.push({
                                        "MODE": "I",
                                        "ZZSXNR_1": y.ZZSXNR_1,
                                        "ZZWSKH_1": y.ZZWSKH_1,
                                        "ZZFZBM_1": y.ZZFZBM_1,
                                        "ZZFZR_1": y.ZZFZR_1,
                                        "ZZGXSJ": y.ZZGXSJ,
                                        "ZZWCZK": y.ZZWCZK,
                                        "ZZNOTE_2": y.ZZNOTE_2
                                    })
                                }
                            });
                            if (isDelete) {
                                tempArr.push({
                                    "RECORD_ID": x.RECORD_ID,
                                    "MODE": "D",
                                    "ZZSXNR_1": "",
                                    "ZZWSKH_1": "",
                                    "ZZFZBM_1": "",
                                    "ZZFZR_1": "",
                                    "ZZGXSJ": "",
                                    "ZZWCZK": "",
                                    "ZZNOTE_2": ""
                                })
                            }
                        });
                        angular.forEach($scope.followUpMatter.item, function (x) {
                            //新建
                            if (x.MODE == 'I') {
                                tempArr.push({
                                    "MODE": "I",
                                    "ZZSXNR_1": x.ZZSXNR_1,
                                    "ZZWSKH_1": x.ZZWSKH_1,
                                    "ZZFZBM_1": x.ZZFZBM_1,
                                    "ZZFZR_1": x.ZZFZR_1,
                                    "ZZGXSJ": x.ZZGXSJ,
                                    "ZZWCZK": x.ZZWCZK,
                                    "ZZNOTE_2": x.ZZNOTE_2
                                })
                            }
                        });
                        break;
                    case 'policyDecode':
                        if ($scope.policyDecodeCopy.item.length == 0) {
                            $scope.policyDecodeCopy.item.push("");
                        }
                        angular.forEach($scope.policyDecodeCopy.item, function (x) {
                            var isDelete = true;
                            angular.forEach($scope.policyDecode.item, function (y) {
                                if (!angular.isUndefined(x.RECORD_ID) && x.RECORD_ID == y.RECORD_ID) {
                                    isDelete = false;
                                    //是否修改
                                    if (!angular.isUndefined(y.MODE)) {
                                        tempArr.push({
                                            "RECORD_ID": y.RECORD_ID,
                                            "MODE": "U",
                                            "ZZSXNR_2": y.ZZSXNR_2,
                                            "ZZZCYX": y.ZZZCYX,
                                            "ZZNOTE_3": y.ZZNOTE_3
                                        })
                                    }
                                }
                            });
                            if (isDelete) {
                                tempArr.push({
                                    "RECORD_ID": x.RECORD_ID,
                                    "MODE": "D",
                                    "ZZSXNR_2": "",
                                    "ZZZCYX": "",
                                    "ZZNOTE_3": ""
                                })
                            }
                        });
                        angular.forEach($scope.policyDecode.item, function (x) {
                            //新建
                            if (x.MODE == 'I') {
                                tempArr.push({
                                    "MODE": "I",
                                    "ZZSXNR_2": x.ZZSXNR_2,
                                    "ZZZCYX": x.ZZZCYX,
                                    "ZZNOTE_3": x.ZZNOTE_3
                                })
                            }
                        });
                        break;
                }
                return tempArr;
            };
            //获取我司 客户
            var getProcessPosition = function () {
                for (var i = 0; i < $scope.positonArr.length; i++) {
                    if ($scope.positonArr[i].flag) {
                        return $scope.positonArr[i].code;
                    }
                }
                return "";
            };
            //获取完成状况
            var getProcessType = function () {
                for (var i = 0; i < $scope.processTypesArr.length; i++) {
                    if ($scope.processTypesArr[i].flag) {
                        return $scope.processTypesArr[i].code;
                    }
                }
                return ""
            };
            //是否为修改状态
            var isProcessModify = false;
            $scope.submit = function () {
                //$scope.isEdit = true;
                //$scope.editText = '保存';
                var data;
                var mode;
                $scope.tempArr=[];
                if (isProcessModify) {
                    mode = "U";
                    var arr = angular.element('.obj');
                    for (var i = 0; i < arr.length; i++) {
                        angular.element(arr[i]).removeClass('own-animated');
                    }
                } else {
                    mode = "I"
                }
                switch ($scope.myProcess.code) {
                    //达成共识
                    case 'IT_SA0021':
                        data = {
                            "MODE": mode,
                            "RECORD_ID":$scope.process.RECORD_ID,
                            "ZZSXNR": $scope.process.content,  //事项内容
                            "ZZFLD0000BB": getProcessPosition(), //我司'客户
                            "ZZFZBM": $scope.process.department,  //部门
                            "ZZFZR": $scope.process.chargeMan,  //负责人
                            "ZZSXSJ": $scope.process.time,  //生效时间
                            "ZZNOTE_1": ""
                        };
                        makeConsensusModifyArr.push(data);
                        $scope.tempArr = $scope.makeConsensus.item;
                        //if (isProcessModify) {
                        //    $scope.makeConsensus.item[processModifyIndex] = data;
                        //} else {
                        //    $scope.makeConsensus.item.push(data);
                        //}
                        break;
                    //跟进事项
                    case 'IT_SA0022':
                        data = {
                            "MODE": mode,
                            "RECORD_ID":$scope.process.RECORD_ID,
                            "ZZSXNR_1": $scope.process.content,
                            "ZZWSKH_1": getProcessPosition(),
                            "ZZFZBM_1": $scope.process.department,
                            "ZZFZR_1": $scope.process.chargeMan,
                            "ZZGXSJ": $scope.process.time,
                            "ZZWCZK": getProcessType(),
                            "ZZNOTE_2": ""
                        };
                        followUpMatterModifyArr.push(data);
                        $scope.tempArr = $scope.followUpMatter.item;
                        //if (isProcessModify) {
                        //    $scope.followUpMatter.item[processModifyIndex] = data;
                        //} else {
                        //    $scope.followUpMatter.item.push(data);
                        //}
                        break;
                    //政策解读
                    case 'IT_SA0023':
                        data = {
                            "MODE": mode,
                            "RECORD_ID":$scope.process.RECORD_ID,
                            "ZZSXNR_2": $scope.process.content,
                            "ZZZCYX": $scope.process.affect,
                            "ZZNOTE_3": ""
                        };
                        policyDecodeModifyArr.push(data);
                        $scope.tempArr = $scope.policyDecode.item;
                        //if (isProcessModify) {
                        //    $scope.policyDecode.item[processModifyIndex] = data;
                        //} else {
                        //    $scope.policyDecode.item.push(data);
                        //}
                        break;
                }
                $scope.process = {
                    content: '',
                    //position: '',
                    //status: '',
                    department: '',
                    chargeMan: '',
                    time: '',
                    affect: ''
                };
                Prompter.showLoading();
                $scope.edit('process').success(function (response) {
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        if(!isProcessModify){
                            $scope.tempArr.push(data);
                        }else{
                            switch ($scope.myProcess.code){
                                case 'IT_SA0021':
                                    $scope.tempArr[processModifyIndex].ZZSXNR = data.ZZSXNR;
                                    break;
                                case 'IT_SA0022':
                                    $scope.tempArr[processModifyIndex].ZZSXNR_1 = data.ZZSXNR_1;
                                    break;
                                case 'IT_SA0023':
                                    $scope.tempArr[processModifyIndex].ZZSXNR_2 = data.ZZSXNR_2;
                                    break;
                            }
                        }
                        $scope.changeProcessDropFlag();
                        $ionicScrollDelegate.resize();
                        $timeout(function () {
                            maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
                            $ionicScrollDelegate.scrollBottom(true);
                        }, 20)
                    }
                });
                //$scope.edit('process');

            };
            //删除
            $scope.deleteProcess = function (x, arr, index, type, e) {
                //if (!$scope.isEdit) {
                //    return;
                //}
                //$scope.isEdit = true;
                //$scope.editText = '保存';
                switch (type) {
                    case 'makeConsensus':
                        makeConsensusModifyArr.push({
                            "RECORD_ID": x.RECORD_ID,
                            "MODE": "D",
                            "ZZSXNR": "",
                            "ZZFLD0000BB": "",
                            "ZZFZBM": "",
                            "ZZFZR": "",
                            "ZZSXSJ": "",
                            "ZZNOTE_1": ""
                        });
                        break;
                    case 'followUpMatter':
                        followUpMatterModifyArr.push({
                            "RECORD_ID": x.RECORD_ID,
                            "MODE": "D",
                            "ZZSXNR_1": "",
                            "ZZWSKH_1": "",
                            "ZZFZBM_1": "",
                            "ZZFZR_1": "",
                            "ZZGXSJ": "",
                            "ZZWCZK": "",
                            "ZZNOTE_2": ""
                        });
                        break;
                    case 'policyDecode':
                        policyDecodeModifyArr.push({
                            "RECORD_ID": x.RECORD_ID,
                            "MODE": "D",
                            "ZZSXNR_2": "",
                            "ZZZCYX": "",
                            "ZZNOTE_3": ""
                        });
                        break
                }
                Prompter.showLoading();
                $scope.edit('process').success(function (response) {
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        x.class = 'zoomOutRight';
                        $timeout(function () {
                            arr.splice(index, 1);
                            //$scope.edit('process');
                        }, 10);
                    }
                });

                e.stopPropagation();
            };
            //
            var initProcessStatus = function () {
                angular.forEach($scope.processTypesArr, function (data) {
                    if (!angular.isUndefined(data.code) && data.code == $scope.process.status) {
                        data.flag = true;
                    } else {
                        data.flag = false;
                    }
                })
            };
            //我司 客户
            var initProcessPosition = function () {
                angular.forEach($scope.positonArr, function (data) {
                    if (!angular.isUndefined(data.code) && data.code == $scope.process.position) {
                        data.flag = true;
                    } else {
                        data.flag = false;
                    }
                })
            };
            //记录点击的index
            var processModifyIndex;
            $scope.openProcessModal = function (x, type, index) {
                //if (!$scope.isEdit) {
                //    return;
                //}
                if ($scope.processDropflag) {
                    $scope.processModal.show();
                    return
                }
                processModifyIndex = index;
                switch (type) {
                    case 'makeConsensus':
                        isProcessModify = true;
                        $scope.process = {
                            "RECORD_ID":x.RECORD_ID,
                            content: x.ZZSXNR,
                            position: x.ZZFLD0000BB,
                            status: '',
                            department: x.ZZFZBM,
                            chargeMan: x.ZZFZR,
                            time: x.ZZSXSJ,
                            affect: ''
                        };
                        $scope.myProcess = $scope.processArr[0];
                        break;
                    case 'followUpMatter':
                        $scope.process = {
                            "RECORD_ID":x.RECORD_ID,
                            content: x.ZZSXNR_1,
                            position: x.ZZWSKH_1,
                            status: x.ZZWCZK,
                            department: x.ZZFZBM_1,
                            chargeMan: x.ZZFZR_1,
                            time: x.ZZGXSJ,
                            affect: ''
                        };
                        isProcessModify = true;
                        $scope.myProcess = $scope.processArr[1];
                        break;
                    case 'policyDecode':
                        $scope.process = {
                            "RECORD_ID":x.RECORD_ID,
                            content: x.ZZSXNR_2,
                            position: '',
                            status: '',
                            department: x.ZZSXNR_2,
                            chargeMan: "",
                            time: "",
                            affect: x.ZZZCYX
                        };
                        isProcessModify = true;
                        $scope.myProcess = $scope.processArr[2];
                        break;
                    default:
                        isProcessModify = false;
                        break;
                }
                initProcessPosition();
                initProcessStatus();
                $scope.processDropflag = true;
                $scope.processModal.show();
                angular.element('.modal-backdrop-bg').css('background-color', 'transparent');
                $timeout(function () {
                    angular.element('.modal-backdrop').removeClass('active').css('height', '0');
                }, 50);
            };
            $scope.changeProcessDropFlag = function () {
                $scope.processDropflag = false;
                $scope.processModal.hide()
            };
            $scope.changeProcessSelectFlag = function (x, type) {
                var flag = x.flag;
                if (type == 'position') {
                    angular.forEach($scope.positonArr, function (data) {
                        data.flag = false;
                    })
                } else {
                    angular.forEach($scope.processTypesArr, function (data) {
                        data.flag = false;
                    })
                }
                x.flag = !flag;
            };
            $scope.$on('$destroy', function () {
                $scope.referModal.remove();
                $scope.followUpModal.remove();
                $scope.processModal.remove();
            });
        }])
    .filter("highlight", function ($sce) {

        var fn = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            text = text.toString();
            if (text.indexOf(search) == -1) {
                return text;
            }
            var regex = new RegExp(search, 'gi');
            var result = text.replace(regex, '<span style="color: red;">$&</span>');
            return $sce.trustAsHtml(result);
        };

        return fn;
    })
    .directive('focusMe', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                if (attrs.focusMeDisable === "true") {
                    return;
                }
                $timeout(function () {
                    element[0].focus();
                    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.show(); //open keyboard manually
                    }
                }, 350);
            }
        };
    });
;