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
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        'Prompter',
        function ($scope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, ionicMaterialInk,
                  ionicMaterialMotion, saleActService, Prompter) {
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
            $scope.saleListArr = saleActService.getSaleListArr();
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
                }, 800)

                e.stopPropagation();
            };
            $scope.initSearch = function () {
                $scope.input.search = '';
                $timeout(function () {
                    document.getElementById('saleListSearchId').focus();
                }, 1)
            };
            $scope.goDetail = function (x, e) {
                $state.go('saleChanDetail');
                e.stopPropagation();
            };
            /*-------------------------------Pop 新建-------------------------------------*/
            $scope.createPopTypes = saleActService.getCreatePopTypes();
            $scope.createPopOrgs = saleActService.getCreatePopOrgs();
            $scope.pop = {
                type: {}, org: {}
            };
            $ionicPopover.fromTemplateUrl('src/applications/saleActivities/modal/createSaleAct_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.createPop = popover;
            });
            $scope.openCreatePop = function () {
                $scope.pop.type = $scope.createPopTypes[0];
                $scope.pop.org = $scope.createPopOrgs[0];
                $scope.createPop.show();
            };
            $scope.showCreateModal = function () {
                console.log($scope.pop);
                $scope.createPop.hide();
                $scope.createModal.show();
                var tempArr = document.getElementsByClassName('modal-wrapper');
                for(var i=0;i<tempArr.length;i++){
                    tempArr[i].style.pointerEvents = 'auto';
                };
            };
            /*-------------------------------Pop 新建 end-------------------------------------*/
            /*-------------------------------Modal 新建-------------------------------------*/
            $scope.create = {
                description: '',
                place: '',
                customer: '',
                contact: '',
                startTime: '2016-4-1 15:00',
                endTime: '2016-4-5 10:00',
                annotate: '测试'
            };
            $scope.selectPersonflag = false;
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/createSaleAct_Modal.html', {
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
            $scope.$on('$destroy', function() {
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
        'saleActService',
        function ($scope, $rootScope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicScrollDelegate, $ionicPopover, $ionicModal,$cordovaDialogs, saleActService) {
            console.log('chanceDetail')
            ionicMaterialInk.displayEffect();
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.statusArr = saleActService.getStatusArr();
            $scope.chanceDetails = {
                title: 'APP 120KWh PHEV Pack需求',
                hideCustomer: 'BYD',
                saleStage: 'SOP阶段',
                status: '处理中',
                saleNum: '100036',
                feelNum: 80,
                startTime: '2016/3/1 12:00',
                endTime: '2016/3/1 12:00'
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
            getInitStatus();
            $scope.isEdit = false;
            $scope.editText = "编辑";
            $scope.edit = function () {
                if ($scope.editText == '编辑') {
                    $scope.isEdit = true;
                    $scope.editText = "保存";
                    $cordovaDialogs.alert('你已进入编辑模式', '提示', '确定')
                        .then(function() {
                            // callback success
                        });
                } else {
                    //执行保存操作
                    $scope.isEdit = false;
                    $scope.editText = "编辑";
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
                if (!$scope.$digest()) {
                    $scope.$apply();
                }
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
                };
                //小时
                if (date.getHours().toString().length < 2) {
                    hour = "0" + date.getHours();
                    time = hour + ":" + minutes;
                } else {
                    hour = date.getHours();
                    time = hour + ":" + minutes;
                };
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
                //iOS平台
                if (type == 'start') {
                    var options = getOptions(new Date($scope.chanceDetails.startTime).format('yyyy/MM/dd hh:ss'), 'datetime', '开始');
                    document.addEventListener("deviceready", function () {
                        $cordovaDatePicker.show(options).then(function (iosDate) {
                            $scope.chanceDetails.startTime = getFormatTime(iosDate);
                        });
                    }, false);
                } else {
                    var options = getOptions(new Date($scope.chanceDetails.endTime).format('yyyy/MM/dd hh:ss'), 'datetime', '结束');
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
            $scope.saleStages = saleActService.getStagesArr();
            $scope.pop = {
                stage:'',
                feel:'',
                saleNum:''
            };
            var getInitStage = function () {
                for (var i = 0; i < $scope.saleStages.length; i++) {
                    if ($scope.saleStages[i].value == $scope.chanceDetails.saleStage) {
                        $scope.pop.stage = $scope.saleStages[i]
                        return
                    }
                }
            };
            $ionicPopover.fromTemplateUrl('saleDetailSelect-popover.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.openPopover = function ($event) {
                getInitStage();
                $scope.pop.feel = $scope.chanceDetails.feelNum;
                $scope.pop.saleNum = $scope.chanceDetails.saleNum;
                $scope.popover.show($event);
            };
            $scope.savePop = function () {
                console.log($scope.pop.stage.value)
                $scope.chanceDetails.saleStage = $scope.pop.stage.value;
                //getInitStatus();
                $scope.chanceDetails.feelNum = $scope.pop.feel;
                $scope.chanceDetails.saleNum = $scope.pop.saleNum;
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

        }]);