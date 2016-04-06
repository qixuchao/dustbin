/**
 * Created by zhangren on 16/3/23.
 */
'use strict';
salesModule
    .controller('saleChanSearchCtrl', [
        '$scope',
        '$state',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        function ($scope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout) {
            ionicMaterialInk.displayEffect();
            //ionicMaterialMotion.fadeSlideInRight();

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
        'saleChanService',
        'Prompter',
        function ($scope, $rootScope, $state, ionicMaterialInk, ionicMaterialMotion, $timeout, $ionicScrollDelegate,
                  $ionicPopover, $ionicModal,$cordovaDialogs, $cordovaToast,saleChanService,Prompter) {
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
<<<<<<< HEAD
                feelNum: 80,
                startTime: '2016/3/1 12:00',
                endTime: '2016/3/1 12:00',
                preMount:'0.00',
                preMountType:'CNY',
                preMoney:'0.00',
                preMoneyType:'AH',
                proNum:'9999001'
            };
=======
                feelNum: 80
            }
>>>>>>> f026a93ca8ed81031b117c72e565914b6bb26d25
            var getInitStatus = function () {
                for (var i = 0; i < $scope.statusArr.length; i++) {
                    if ($scope.statusArr[i].value == $scope.chanceDetails.status) {
                        $scope.mySelect = {
                            status: $scope.statusArr[i]
                        }
                        return
                    }
                }
            }
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
                    $cordovaDialogs.confirm('请先保存当前的更改', '提示', ['保存', '不保存'])
                        .then(function (buttonIndex) {
                            // no button = 0, 'OK' = 1, 'Cancel' = 2
                            var btnIndex = buttonIndex;
                            if(btnIndex==1){
                                Prompter.showLoading('正在保存');
                                $timeout(function () {
                                    Prompter.hideLoading();
                                    $cordovaToast.showShortBottom('保存成功');
                                    $rootScope.goBack();
                                }, 500);
                            }else{
                                $rootScope.goBack();
                            }
                        });
                }else{
                    $rootScope.goBack();
                }
            }
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
                if (!$scope.$digest()) {
                    $scope.$apply();
                }
<<<<<<< HEAD
            };
            $scope.returnScroll = function () {
                console.log('blur');
                $scope.customerFlag = false;
                $scope.placeFlag = false;
                $scope.statusFlag = false;
                $scope.showTitle = false;
                $scope.TitleFlag = false;
                $scope.showTitleStatus = false;
                $scope.$apply();
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
=======
>>>>>>> f026a93ca8ed81031b117c72e565914b6bb26d25

            };
            $scope.submit = function () {

            };
            /*---------------------------------选择弹窗-------------------------------------*/
            $scope.saleStages = saleChanService.getStagesArr();
            $scope.pop = {
                stage:'',
                feel:'',
                proNum:''
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
<<<<<<< HEAD
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
            $scope.moneyTypesArr = saleChanService.getMoneyTypesArr();
            $scope.openMoneyModal = function () {
                $scope.moneyTypesModal.show();
            };
            $scope.selectMoneyType = function (x) {
              $scope.chanceDetails.preMountType = x.value;
                $scope.moneyTypesModal.hide();
            };
            /*-------------------------------币种 end-----------------------------------*/
            $scope.$on('$destroy', function() {
                $scope.popover.remove();
                $scope.followUpModal.remove();
                $scope.moneyTypesModal.remove();
            });
        }]);
=======
        }])
>>>>>>> f026a93ca8ed81031b117c72e565914b6bb26d25
