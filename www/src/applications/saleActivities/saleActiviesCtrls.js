/**
 * Created by zhangren on 16/3/19.
 */
'use strict';
salesModule
    .controller('saleActListCtrl', ['$scope',
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
            console.log('销售活动列表');
            $scope.saleTitleText = '销售活动';
            $timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100);
            //ionicMaterialMotion.fadeSlideInRight();
            $scope.searchFlag = false;
            $scope.input = {search: '',customer:''};
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
                $state.go('saleActDetail');
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
                //console.log(document.getElementsByClassName('modal-wrapper'));
                var tempArr = document.getElementsByClassName('modal-wrapper');
                for (var i = 0; i < tempArr.length; i++) {
                    tempArr[i].style.pointerEvents = 'auto';
                }
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
            $scope.contacts = saleActService.getContact();
            $scope.openSelectPerson = function () {
                $scope.selectPersonflag = true;
                $scope.selectPersonModal.show();
            };
            $scope.closeSelectPerson = function () {
                $scope.selectPersonflag = false;
                $scope.selectPersonModal.hide();
            };
            $scope.selectContact = function (x) {
                $scope.create.contact = x.text;
                $scope.selectPersonModal.hide();
            };
            //选择客户
            $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectCustomerModal = modal;
            });
            $scope.customerModalArr = saleActService.getCustomerTypes();
            $scope.customerArr = saleActService.getCustomer();
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
            $scope.initSearch = function () {
                $scope.input.customer = '';
                $timeout(function () {
                    document.getElementById('selectCustomerId').focus();
                }, 1)
            };
            $scope.selectCustomer = function (x) {
                $scope.create.customer = x.text;
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
        'saleActService',
        'saleChanService',
        'Prompter',
        function ($scope, $rootScope,$state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $cordovaDatePicker, saleActService, saleChanService, Prompter) {
            ionicMaterialInk.displayEffect();
            $scope.statusArr = saleChanService.getStatusArr();
            $scope.mySelect = {
                status: $scope.statusArr[2]
            };
            $scope.details = {
                annotate: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
                startTime: '2016/3/1 12:00',
                endTime: '2016/3/1 12:00',
                refer: '商机-郑州客车销售机会'
            };
            $scope.isEdit = false;
            $scope.editText = "编辑";
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
            /*------------------------------------选择时间------------------------------------*/
            $scope.selectTime = function (type) {
                if(!$scope.isEdit){
                    return;
                }
                //iOS平台
                if (type == 'start') {
                    Prompter.selectTime($scope,'actDetailStart',new Date($scope.details.startTime).format('yyyy/MM/dd hh:ss'),'datetime','开始时间');
                } else {
                    Prompter.selectTime($scope,'actDetailEnd',new Date($scope.details.endTime).format('yyyy/MM/dd hh:ss'),'datetime','结束时间');
                }
            };
            /*----------------------------------选择时间  end------------------------------------*/


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
                text: '商机',
            }, {
                text: '线索',
            }, {
                text: '销售活动',
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
            $scope.relationsPopArr = [{
                text: 'CATL销售',
            }, {
                text: '联系人',
            }, {
                text: '正式客户',
            }, {
                text: '潜在客户',
            }, {
                text: '竞争对手',
            }, {
                text: '合作伙伴',
            }];
            $scope.openFollow = function () {
                $scope.followUpModal.show();
            };
            //添加相关方
            $scope.moreflag = false;
            $scope.isDropShow = false;
            $scope.openRelations = function () {
                if ($scope.isDropShow) {
                    $scope.hideSelections();
                    return
                }
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
            $scope.changeMoreFlag = function () {
                $scope.moreflag = !$scope.moreflag;
            };
            $scope.hideSelections = function () {
                $scope.moreflag = false;
                $scope.isDropShow = false;
            };
        }])
    .filter("highlight", function ($sce) {

        var fn = function (text, search) {
            if (!search) {
                return $sce.trustAsHtml(text);
            }
            if (text.indexOf(search) == -1) {
                return text;
            }
            //text = encodeURI(text);
            //search = encodeURI(search);
            var regex = new RegExp(search, 'gi');
            var result = text.replace(regex, '<span style="color: red;">$&</span>');
            return $sce.trustAsHtml(result);
        };

        return fn;
    })
;