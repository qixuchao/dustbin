/**
 * Created by zhangren on 16/4/29.
 */
'use strict';
salesModule
    .controller('saleClueListCtrl', ['$scope', '$rootScope',
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
        'customeService',
        'LoginService',
        function ($scope, $rootScope, $state, $timeout, $ionicLoading, $ionicPopover, $ionicModal, $cordovaToast, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, saleActService, Prompter, HttpAppService, saleChanService, customeService, LoginService) {
            $scope.saleTitleText = '销售线索';
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
            var PARTNER_NO;
            $scope.isCanCreate = true;
            if (angular.isObject(customeService.get_customerWorkordervalue())) {
                PARTNER_NO = customeService.get_customerWorkordervalue().PARTNER;
                $scope.isCanCreate = false;
            } else {
                PARTNER_NO = "";
            }
            $scope.goBack = function () {
                customeService.set_customerWorkordervalue("");
                $rootScope.goBack();
            };
            $scope.getList = function (type) {
                if (!$scope.saleListArr.length) {
                    $scope.isloading = false;
                }
                switch (type) {
                    case 'searchPage':
                        if (!$scope.input.list) {
                            return
                        }
                        angular.element('#saleClueListSearchPageId').addClass('active');
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
                        angular.element('#saleClueListSearchPageId').addClass('active');
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
                        "CUSTOMER": PARTNER_NO,
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
                var startTime = new Date().getTime();
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
                            $timeout(function () {
                                ionicMaterialInk.displayEffect();
                            }, 100);
                            //saleActService.saleListArr = $scope.saleListArr;
                        } else if(response.ES_RESULT.ZFLAG === 'E'){
                            $scope.loadMoreFlag = false;
                            $scope.saleListNoMoreInfoFLag = true;
                            Prompter.showShortToastBotton(response.ES_RESULT.ZRESULT);
                        }
                    }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        console.log('HTTP timeout');
                        if (ionic.Platform.isWebView()) {
                            $scope.loadMoreFlag = false;
                            $scope.saleListNoMoreInfoFLag = true;
                            //Prompter.alert('请求超时');
                        }
                    }
                    $ionicLoading.hide();
                }).finally(function () {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
            if (storedb('saleClueListHisArr').find().arrUniq() != undefined || storedb('saleClueListHisArr').find().arrUniq() != null) {
                $scope.hisArr = (storedb('saleClueListHisArr').find().arrUniq());
            }
            $scope.filters = saleActService.filters;
            if (Prompter.isATL()) {
                $scope.filters.type = saleActService.filterType_ATL;
            }
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
                $scope.serachButton = true;
                $scope.filterFlag = !$scope.filterFlag;
                tempFilterArr = $scope.filters;
                var ele = angular.element('#saleClueListFilterId');
                if (Prompter.isAndroid()) {
                    ele.css('display', 'none')
                } else {
                    ele.css('display', 'block').removeClass('fadeInDown');
                    ele.css('display', 'block').addClass('slideOutUp');
                }
                $scope.getList('search');
            };
            $scope.filterPrevent = function (e) {
                e.stopPropagation();
            };
            $scope.filterFlag = false;
            $scope.changeSearch = function () {
                $scope.serachButton = false;
                angular.element('#saleClueListFilterId').css('display', 'none');
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
                    angular.element('#saleClueListSearchId').focus();
                }, 1)
            };
            //筛选
            $scope.filterFlag = false;
            //$scope.isDropShow = true;
            $scope.changeFilterFlag = function (e) {
                var ele = angular.element('#saleClueListFilterId');
                //angular.element('#saleClueListFilterId').addClass('display','block');
                tempFilterArr = '';
                $scope.filterFlag = !$scope.filterFlag;
                if ($scope.filterFlag) {
                    if (Prompter.isAndroid()) {
                        ele.css('display', 'block');
                    } else {
                        ele.css('display', 'block').removeClass('slideOutUp');
                        ele.css('display', 'block').addClass('fadeInDown');
                    }
                    onceCilck = true;
                } else {
                    if (Prompter.isAndroid()) {
                        ele.css('display', 'none');
                    } else {
                        ele.css('display', 'block').removeClass('fadeInDown');
                        ele.css('display', 'block').addClass('slideOutUp');
                    }
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
                    storedb('saleClueListHisArr').insert({
                        text: $scope.input.list,
                        data: tempHisPostData
                    }, function (err) {
                        if (!err) {
                        } else {
                            Prompter.alert('历史记录保存失败');
                        }
                    });
                    $scope.hisArr = (storedb('saleClueListHisArr').find().arrUniq());
                }
                $state.go('saleClueDetail');
                e.stopPropagation();
            };
        }]);