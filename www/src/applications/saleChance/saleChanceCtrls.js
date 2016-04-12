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
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100);
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.searchFlag = false;
            $scope.input = {search: ''};
            $scope.filters = saleChanService.filters;
            //$scope.saleListArr = saleActService.getSaleListArr();
            var pageNum = saleChanService.listPage;
            $scope.loadMoreFlag = true;
            $scope.saleListArr = saleChanService.chanListArr;
            $scope.getList = function (type) {
                if (type === 'refresh') {
                    pageNum = 1;
                }
                var data = {
                    "IS_SYSTEM": {"SysName": "CATL"},
                    "IS_PAGE": {
                        "CURRPAGE": pageNum++,
                        "ITEMS": "10"
                    },
                    "IS_SEARCH": {
                        "ZSRTING": "报价单",
                        "PARTNER_NO": "",
                        "OBJECT_ID": "",
                        "PHASE": "",
                        "STARTDATE": ""
                    }
                };
                saleChanService.listPage = pageNum;
                //if (pageNum == 1) {
                //    return
                //}
                console.log('saleChanListPageNum---------' + pageNum);
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_LIST', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (type === 'refresh') {
                                $scope.saleListArr = response.ET_OPPORT.item;
                                saleChanService.chanListArr = $scope.saleListArr;
                                $ionicScrollDelegate.resize();
                                return
                            }
                            if (response.ET_OPPORT.item.length < 10) {
                                $scope.loadMoreFlag = false;
                            }
                            $scope.saleListArr = $scope.saleListArr.concat(response.ET_OPPORT.item);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.resize();
                            saleChanService.chanListArr = $scope.saleListArr;
                        }
                    }).finally(function () {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            $scope.hisArr = [
                '福州', '清明', '活动'
            ];
            $scope.filterSelect = function (x) {
                x.flag = !x.flag;
            };
            $scope.filterReset = function () {
                $.each($scope.filters, function (i, arr) {
                    angular.forEach(arr, function (data) {
                        data.flag = false;
                    })
                });
            };
            $scope.filterSure = function () {
                $scope.filterFlag = !$scope.filterFlag;
            };
            $scope.filterPrevent = function (e) {
                e.stopPropagation();
            };
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
            //筛选
            $scope.filterFlag = false;
            //$scope.isDropShow = true;
            $scope.changeFilterFlag = function () {
                $scope.filterFlag = !$scope.filterFlag;
            };
            $scope.goDetail = function (x, e) {
                saleChanService.obj_id = x.OBJECT_ID;
                $state.go('saleChanDetail');
                e.stopPropagation();
            };
            /*-------------------------------Pop 新建-------------------------------------*/
            $scope.pop = {
                type: {}, org: {}
            };
            $scope.createPopData = saleChanService.createPop;
            $ionicPopover.fromTemplateUrl('src/applications/saleChance/modal/create_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.createPop = popover;
            });
            $scope.openCreatePop = function () {
                console.log($scope.createPopData)
                $scope.pop.type = $scope.createPopData.types[0];
                $scope.pop.org = $scope.createPopData.channels[0];
                $scope.createPop.show();
            };
            $scope.showCreateModal = function () {
                console.log($scope.pop);
                $scope.createPop.hide();
                $scope.createModal.show();
                var tempArr = document.getElementsByClassName('modal-wrapper');
                for (var i = 0; i < tempArr.length; i++) {
                    tempArr[i].style.pointerEvents = 'auto';
                }
                ;
            };
            /*-------------------------------Pop 新建 end-------------------------------------*/
            /*-------------------------------Modal 新建-------------------------------------*/
            var getDefultStartTime = function () {
                var dateArr = new Date().format('hh:mm').split(':');
                return new Date().format('yyyy-MM-dd') + ' ' + (Number(dateArr[0]) + 2) + ':' + dateArr[1];
            };
            $scope.saleStages = saleChanService.saleStages;
            $scope.create = {
                description: '',
                place: '',
                customer: '',
                contact: '',
                stage: $scope.saleStages[0],
                de_startTime: new Date().format('yyyy-MM-dd hh:mm'),
                de_endTime: getDefultStartTime(),
                annotate: '测试'
            };
            $scope.selectPersonflag = false;
            //选择时间
            $scope.selectCreateTime = function (type) {
                if (type == 'start') {
                    Prompter.selectTime($scope, 'actCreateStart', new Date($scope.create.de_startTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm'), 'datetime', '开始时间');
                } else {
                    Prompter.selectTime($scope, 'actCreateEnd', new Date($scope.create.de_endTime.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm'), 'datetime', '结束时间');
                }
            };
            $ionicModal.fromTemplateUrl('src/applications/saleChance/modal/create_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.createModal = modal;
            });
            $scope.saveCreateModal = function () {
                console.log($scope.create);
                $scope.createModal.hide();
            };

            //选择人
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectPerson_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectPersonModal = modal;
            });
            $scope.openSelectPerson = function () {
                $scope.selectPersonflag = true;
                $scope.selectPersonModal.show();
            };
            $scope.closeSelectPerson = function () {
                $scope.selectPersonflag = false;
                $scope.selectPersonModal.hide();
                //arr[0].className = 'modal-backdrop hide';
            };

            //选择客户
            var customerPage = 1;
            $scope.customerArr = saleActService.customerArr;
            $scope.customerSearch = true;
            $scope.getCustomerArr = function (search) {
                if (search) {
                    $scope.customerSearch = false;
                    customerPage = 1;
                } else {
                    $scope.spinnerFlag = true;
                }
                console.log(customerPage);
                var data = {
                    "I_SYSNAME": {"SysName": "CATL"},
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
                            $ionicScrollDelegate.resize();
                            saleActService.customerArr = $scope.customerArr;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    });
            };
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectCustomerModal = modal;
            });
            $scope.customerModalArr = saleActService.getCustomerTypes();
            $scope.selectCustomerText = '竞争对手';
            $scope.openSelectCustomer = function () {
                $scope.isDropShow = true;
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
                $timeout(function () {
                    document.getElementById('selectCustomerId').focus();
                }, 1)
            };
            $scope.selectCustomer = function (x) {
                $scope.create.customer = x.NAME_ORG1;
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
        'saleChanService',
        'Prompter',
        function ($scope, $rootScope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicScrollDelegate,
                  $ionicPopover, $ionicModal, $cordovaDialogs, $cordovaToast, $cordovaDatePicker, saleChanService, Prompter) {
            console.log('chanceDetail')
            ionicMaterialInk.displayEffect();
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.statusArr = saleChanService.getStatusArr();
            $scope.chanceDetails = {
                title: 'APP 120KWh PHEV Pack需求',
                hideCustomer: 'BYD',
                saleStage: 'SOP阶段',
                status: '处理中',
                saleNum: '100036',
                feelNum: 80,
                startTime: '2016/3/1 12:00',
                endTime: '2016/3/1 12:00',
                preMount: '0.00',
                preMountType: 'CNY',
                preMoney: '0.00',
                preMoneyType: 'AH',
                proNum: '9999001'
            };
            var getInitStatus = function () {
                for (var i = 0; i < $scope.statusArr.length; i++) {
                    if ($scope.statusArr[i].value == $scope.chanceDetails.status) {
                        $scope.mySelect = {
                            status: $scope.statusArr[i]
                        };
                        return
                    }
                }
            };
            var getDetails = function () {
                var data = {
                    "I_SYSTEM": {"SysName": "CATL"},
                    "IS_USER": {"BNAME": ""},
                    "IS_ID": {"OBJECT_ID": saleChanService.obj_id}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'OPPORT_DETAIL', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (type === 'refresh') {
                                $scope.saleListArr = response.ET_OPPORT.item;
                                saleChanService.chanListArr = $scope.saleListArr;
                                $ionicScrollDelegate.resize();
                                return
                            }
                            if (response.ET_OPPORT.item.length < 10) {
                                $scope.loadMoreFlag = false;
                            }
                            $scope.saleListArr = $scope.saleListArr.concat(response.ET_OPPORT.item);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.resize();
                            saleChanService.chanListArr = $scope.saleListArr;
                        }
                    }).finally(function () {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            getInitStatus();
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
                    $timeout(function () {
                        Prompter.hideLoading();
                        $cordovaToast.showShortBottom('保存成功');
                        $scope.isEdit = false;
                        $scope.editText = "编辑";
                    }, 500);
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
                console.log(position)
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
            var getFormatTime = function (date) {
                var dateTemp, minutes, hour, time;
                dateTemp = date.format("yyyy/M/d");
                //分钟
                if (date.getMinutes().toString().length < 2) {
                    minutes = "0" + date.getMinutes();
                } else {
                    minutes = date.getMinutes();
                }
                ;
                //小时
                if (date.getHours().toString().length < 2) {
                    hour = "0" + date.getHours();
                    time = hour + ":" + minutes;
                } else {
                    hour = date.getHours();
                    time = hour + ":" + minutes;
                }
                ;
                return dateTemp + " " + time;
            };
            var getOptions = function (date, mode, text) {
                return {
                    date: new Date(date),
                    mode: mode,
                    titleText: text + '时间',
                    okText: '确定',
                    cancelText: '取消',
                    doneButtonLabel: '确认',
                    cancelButtonLabel: '取消',
                    locale: 'zh_cn'
                }
            };
            $scope.selectTime = function (type) {
                if (!$scope.isEdit) {
                    return;
                }
                //iOS平台
                if (type == 'start') {
                    var options = getOptions(new Date($scope.chanceDetails.startTime).format('yyyy/MM/dd hh:mm'), 'datetime', '开始');
                    document.addEventListener("deviceready", function () {
                        $cordovaDatePicker.show(options).then(function (iosDate) {
                            $scope.chanceDetails.startTime = getFormatTime(iosDate);
                        });
                    }, false);
                } else {
                    var options = getOptions(new Date($scope.chanceDetails.endTime).format('yyyy/MM/dd hh:mm'), 'datetime', '结束');
                    document.addEventListener("deviceready", function () {
                        $cordovaDatePicker.show(options).then(function (iosDate) {
                            $scope.chanceDetails.endTime = getFormatTime(iosDate);
                        });
                    }, false);
                }
            };
            /*----------------------------------选择时间  end------------------------------------*/

            $scope.submit = function () {

            };
            /*---------------------------------选择弹窗-------------------------------------*/
            $scope.saleStages = saleChanService.getStagesArr();
            $scope.pop = {
                stage: '',
                feel: '',
                proNum: ''
            };
            var getInitStage = function () {
                for (var i = 0; i < $scope.saleStages.length; i++) {
                    if ($scope.saleStages[i].value == $scope.chanceDetails.saleStage) {
                        $scope.pop.stage = $scope.saleStages[i]
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
                $scope.pop.feel = $scope.chanceDetails.feelNum;
                $scope.pop.proNum = $scope.chanceDetails.proNum;
                $scope.popover.show($event);
            };
            $scope.savePop = function () {
                console.log($scope.pop.stage.value)
                $scope.chanceDetails.saleStage = $scope.pop.stage.value;
                //getInitStatus();
                $scope.chanceDetails.feelNum = $scope.pop.feel;
                $scope.chanceDetails.proNum = $scope.pop.proNum;
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
                if(type=='money'){
                    $scope.unitTitle = '币种';
                    $scope.moneyTypesArr = saleChanService.getMoneyTypesArr();
                }else{
                    $scope.unitTitle = '销量单位';
                    $scope.moneyTypesArr = saleChanService.saleUnits;
                }
                $scope.moneyTypesModal.show();
            };
            $scope.selectMoneyType = function (x) {
                if($scope.unitTitle == '币种'){
                    $scope.chanceDetails.preMountType = x.value;
                }else{
                    $scope.chanceDetails.preMoneyType = x.value;
                }

                $scope.moneyTypesModal.hide();
            };
            /*-------------------------------币种 end-----------------------------------*/
            $scope.$on('$destroy', function () {
                $scope.popover.remove();
                $scope.followUpModal.remove();
                $scope.moneyTypesModal.remove();
            });
        }]);
