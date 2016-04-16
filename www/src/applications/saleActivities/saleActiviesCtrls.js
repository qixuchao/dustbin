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
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService) {
            console.log('销售活动列表');
            $scope.saleTitleText = '销售活动';
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100);
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.searchFlag = false;
            $scope.input = {search: '', customer: ''};
            //$scope.saleListArr = saleActService.getSaleListArr();
            $scope.isloading = true;
            var pageNum = saleActService.listPage;
            $scope.loadMoreFlag = true;
            $scope.saleListArr = saleActService.saleListArr;
            $scope.getList = function (type) {
                if (!$scope.saleListArr.length) {
                    $scope.isloading = false;
                }
                if (type === 'refresh') {
                    pageNum = 1;
                }
                console.log(pageNum);
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_ACTIVITY": {
                        "OBJECT_ID": "",
                        "DESCSEARCH": "",
                        "PROCESS_TYPE": "",
                        "ZZHDJJD": "",
                        "CUSTOMER": "",
                        "DATE_FROM": "",
                        "DATE_TO": "",
                        "ESTAT": "",
                        "SALESNO": ""
                    },
                    "IS_PAGE": {
                        "CURRPAGE": pageNum++,
                        "ITEMS": "10"
                    },
                    "IS_USER": {"BNAME": "HANDBLH"}
                };
                saleActService.listPage = pageNum;
                if (pageNum == 1) {
                    return
                }
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_LIST', data)
                    .success(function (response) {
                        $scope.isloading = true;
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (type === 'refresh') {
                                $scope.saleListArr = response.ET_LIST.item;
                                saleActService.saleListArr = $scope.saleListArr;
                                $ionicScrollDelegate.resize();
                                return
                            }
                            if (response.ET_LIST.item.length < 10) {
                                $scope.loadMoreFlag = false;
                            }
                            $scope.saleListArr = $scope.saleListArr.concat(response.ET_LIST.item);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.resize();
                            saleActService.saleListArr = $scope.saleListArr;
                        }
                    }).finally(function () {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            $scope.searchList = function () {

            };
            //getList();
            $scope.hisArr = [
                '福州', '清明', '活动'
            ];
            $scope.changeSearch = function () {
                $scope.searchFlag = !$scope.searchFlag;
                $('#searchTitle').removeClass('animated');
                if ($scope.searchFlag) {
                    $timeout(function () {
                        //document.getElementById('saleListSearchId').focus();
                        angular.element('#saleListSearchId').focus();
                    }, 2000)
                }
            };
            $scope.search = function (x, e) {
                Prompter.showLoading('正在搜索');
                $timeout(function () {
                    Prompter.hideLoading();
                    $scope.input.search = x;
                }, 800);

                e.stopPropagation();
            };
            $scope.initSearch = function () {
                $scope.input.search = '';
                $timeout(function () {
                    document.getElementById('saleListSearchId').focus();
                }, 1)
            };
            $scope.goDetail = function (x, e) {
                saleActService.actDetail = x;
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
                $scope.pop.type = $scope.createPopTypes[0];
                $scope.createPop.show();
                //e.stopPropagation();
            };

            $scope.showCreateModal = function () {
                customerPage = 1;
                console.log($scope.pop);
                $scope.createPop.hide();
                $scope.create = {de_startTime: new Date().format('yyyy-MM-dd hh:ss'), de_endTime: getDefultStartTime()};
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
                    "IS_SEARCH": {"SEARCH": search},
                    "IT_IN_ROLE": {}
                };
                console.log(data);
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
                    .success(function (response) {
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
                        "ZZHDJJD": "01",
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
                console.log(data)
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_CREATE', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            $scope.createModal.hide();
                            Prompter.showShortToastBotton('创建成功');
                            saleActService.actDetail = {
                                OBJECT_ID: response.EV_OBJECT_ID
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
                if (isNoContacts||!$scope.create.customer) {
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
        }])
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
        function ($scope, $rootScope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $cordovaDatePicker, $ionicActionSheet, saleActService, saleChanService, Prompter
            , HttpAppService) {
            ionicMaterialInk.displayEffect();
            var getStatusIndex = function (data) {
                for (var i = 0; i < $scope.statusArr.length; i++) {
                    if ($scope.statusArr[i].value == data) {
                        return i;
                    }
                }
                return 0;
            };
            var actTypes = saleActService.createPopTypes;
            var getActType = function (typeCode) {
                for (var i = 0; i < actTypes.length; i++) {
                    if(actTypes[i].value==typeCode){
                        return actTypes[i].text;
                    }
                }
                return '';
            };
            $scope.listInfo = saleActService.actDetail;
            var getDetails = function () {
                Prompter.showLoading('正在查询');
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_USER": {"BNAME": "HANDBLH"},
                    "I_OBJECT_ID": $scope.listInfo.OBJECT_ID
                };
                console.log(data)
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_DETAIL', data)
                    .success(function (response) {
                        console.log(response);
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            $scope.details = response.ES_ACTIVITY;
                            $scope.details.de_startTime = $scope.details.DATE_FROM + ' ' + $scope.details.TIME_FROM.substring(0, 5);
                            $scope.details.de_endTime = $scope.details.DATE_TO + ' ' + $scope.details.TIME_TO.substring(0, 5);
                            $scope.mySelect = {
                                status: $scope.statusArr[getStatusIndex($scope.details.STATUS_TXT)]
                            };
                            $scope.details.actType = getActType($scope.details.PROCESS_TYPE);
                            $scope.details.relations = response.ET_PARTNERS.item;
                            Prompter.hideLoading();
                        }
                    });
            };
            if (saleActService.actDetail) {
                getDetails();
            }
            //$scope.details = saleActService.actDetail;
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
                    $timeout(function () {
                        Prompter.hideLoading();
                        $cordovaToast.showShortBottom('保存成功');
                        $scope.isEdit = false;
                        $scope.editText = "编辑";
                    }, 500);

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


            $scope.input = {
                progress: ''
            };
            $scope.submit = function () {
                $scope.details.progressArr.push({
                    content: $scope.input.progress,
                    time: '2016-6-8  12:11'
                });
                $scope.input.progress = '';
                $ionicScrollDelegate.resize();
                $timeout(function () {
                    maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
                    console.log($ionicScrollDelegate.getScrollView());
                    console.log(maxTop);
                    $ionicScrollDelegate.scrollBottom(true);
                }, 20)
            };

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
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/addRelations.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.addReleModal = modal;
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
            $scope.initSearch = function () {
                $scope.input.search = '';
                $timeout(function () {
                    document.getElementById('referSearchId').focus();
                }, 1)
            };
            /*-------------------------------Modal end-------------------------------------*/
            $scope.relationsPopArr = saleActService.getRelationsPopArr();
            $scope.relationSelections = saleActService.getRelationSelections();
            $scope.openFollow = function () {
                $scope.followUpModal.show();
            };
            //添加相关方
            $scope.moreflag = false;
            $scope.isDropShow = false;
            $scope.isReplace = false;
            $scope.openRelations = function () {
                if ($scope.isDropShow) {
                    $scope.hideSelections();
                    return
                }
                $scope.isReplace = false;
                $scope.isDropShow = true;
                $scope.selectPopText = '正式客户';
                $scope.addReleModal.show();
            };
            $scope.hideRelations = function () {
                $scope.hideSelections();
                $scope.addReleModal.hide();
            };
            $scope.selectPop_rel = function (x) {
                $scope.selectPopText = x.text;
                $scope.changeMoreFlag();
            };
            $scope.addRelationModal = function () {
                angular.forEach($scope.relationSelections, function (data) {
                    if (data.flag && $scope.details.relations.indexOf(data) == -1) {
                        $scope.details.relations.push(data);
                    }
                });
                $scope.hideRelations();
            };
            $scope.replaceRelation = function (x) {
                angular.forEach($scope.relationSelections, function (data) {
                    data.flag = false;
                });
                x.flag = true;
                $scope.details.relations[repTempIndex] = x;
                $scope.hideRelations();
            };
            $scope.changeMoreFlag = function () {
                $scope.moreflag = !$scope.moreflag;
            };
            $scope.hideSelections = function () {
                $scope.moreflag = false;
                $scope.isDropShow = false;
            };
            var repTempIndex;
            $scope.showActionSheet = function (x) {
                if (!$scope.isEdit) {
                    return
                }
                repTempIndex = $scope.details.relations.indexOf(x);
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
                                console.log('删除');
                                $scope.details.relations.splice(repTempIndex, 1);
                                break;
                            case 1:
                                console.log('替换');
                                $scope.isReplace = true;
                                $scope.isDropShow = true;
                                $scope.selectPopText = '正式客户';
                                $scope.addReleModal.show();
                                break;
                        }
                        return true;
                    }
                });
            };


            $scope.$on('$destroy', function () {
                $scope.referModal.remove();
                $scope.followUpModal.remove();
                $scope.addReleModal.remove();
            });
        }])
    .filter("highlight", function ($sce) {

        var fn = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            text=text.toString();
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