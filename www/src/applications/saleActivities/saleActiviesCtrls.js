/**
 * Created by zhangren on 16/3/19.
 */
'use strict';
salesModule 
    .controller('saleActListCtrl', ['$scope',
        '$state',
        '$timeout',
        '$ionicLoading',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'saleActService',
        function ($scope, $state, $timeout, $ionicLoading, ionicMaterialInk, ionicMaterialMotion, saleActService) {
            console.log('销售活动列表');
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100)
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.searchFlag = false;
            $scope.input = {search: ''};
            $scope.saleListArr = saleActService.getSaleListArr();
            $scope.hisArr = [
                '福州', '清明', '活动'
            ]
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
                $scope.g_busy.show('正在搜索');
                $timeout(function () {
                    $scope.g_busy.hide();
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
                $state.go('saleActDetail')
                e.stopPropagation();
            };

            //loading公共方法
            $scope.g_busy = {
                show: function (msg) {
                    $scope.g_busy.hide();
                    $timeout.cancel($scope.g_busyTimeout);
                    $scope.g_busyFlag = 'Y';
                    if (msg) {
                        $ionicLoading.show({
                            template: '<ion-spinner icon="lines" class="spinner-balanced"></ion-spinner><p>' + msg + '</p>'
                        })
                    } else {
                        $ionicLoading.show();
                    }

                    $scope.g_busyTimeout = $timeout(function () {
                        if ($scope.g_busyFlag == 'Y') {
                            $scope.g_busyFlag = 'N';
                            $scope.g_busy.hide();
                            //$scope.Toast.show('连接超时，请检查网络');
                        }
                    }, 60000);
                },
                hide: function () {
                    $ionicLoading.hide();
                    $timeout.cancel($scope.g_busyTimeout);
                    $scope.g_busyFlag = 'N';
                }
            };
        }])
    .controller('saleActDetailCtrl', [
        '$scope',
        '$state',
        '$ionicHistory',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        '$cordovaDialogs',
        '$ionicModal',
        '$ionicPopover',
        'saleActService',
        function ($scope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover, saleActService) {
            ionicMaterialInk.displayEffect();
            $scope.statusArr = saleActService.getStatusArr();
            $scope.mySelect = {
                status: $scope.statusArr[2]
            };
            $scope.details = {
                annotate: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
                startTime: '2016-3-1  12:00',
                endTime: '2016-3-1  12:00',
                refer: '商机-郑州客车销售机会'
            };
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
                    $scope.isEdit = false;
                    $scope.editText = "编辑";
                }
            }
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
            $scope.progressArr = [{
                content: '与客户进行了初次交涉,效果良好',
                time: '2016-3-6  18:33'
            }, {
                content: '第二次交涉,效果一般,还需要继续跟进',
                time: '2016-3-7  17:33'
            }, {
                content: '最后谈了一次,应该可以成交,主要联系客户李经理进行跟进',
                time: '2016-3-8  12:11'
            }];
            var position;
            var maxTop;
            $scope.onScroll = function () {
                position = $ionicScrollDelegate.getScrollPosition().top;
                //console.log(position)
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
                $scope.$apply();

            };
            $scope.input = {
                progress: ''
            };
            $scope.submit = function () {
                $scope.progressArr.push({
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

            /*-------------------------------参考类型-------------------------------------*/
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/reference.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.referModal = modal;
            });
            $ionicPopover.fromTemplateUrl('src/applications/saleActivities/modal/selectChance-pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.referPop = popover;
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
                text: '商机',
            }, {
                text: '线索',
            }, {
                text: '销售活动',
            }];
            $scope.selectPopText = '商机';
            $scope.selectModal = function (x) {
                for (var i = 0; i < $scope.referArr.length; i++) {
                    $scope.referArr[i].flag = false;
                }
                x.flag = true;
                $scope.referModal.hide();
            };
            $scope.selectPop = function (x) {
                $scope.selectPopText = x.text;
                $scope.referPop.hide();
            }
            $scope.openRefer = function () {
                $scope.referModal.show();
            };
            $scope.showChancePop = function () {
                $scope.referPop.show();
            };
            /*-------------------------------参考类型 end-------------------------------------*/
        }])
    .filter("highlight", function ($sce, $log) {

        var fn = function (text, search) {
            $log.info("text: " + text);
            $log.info("search: " + search);

            if (!search) {
                return $sce.trustAsHtml(text);
            }
            if (text.indexOf(search) == -1) {
                return text;
            }
            text = encodeURI(text);
            search = encodeURI(search);
            console.log(text.indexOf(search));
            var regex = new RegExp(search, 'gi');
            var result = text.replace(regex, '<span style="color: red;">$&</span>');
            result = decodeURI(result);
            console.log(result)
            $log.info("result: " + result);
            return $sce.trustAsHtml(result);
        };

        return fn;
    })
;