/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['$cordovaToast','HttpAppService','$http','SpareListService','$state','$scope','Prompter','$timeout',function ($cordovaToast,HttpAppService,$http,SpareListService,$state,$scope,Prompter,$timeout){
    var page=0;
    $scope.spareList=[];
    $scope.spareList1=[];
    $scope.spareInfo="";
    $scope.spareimisshow=false;
    $scope.searchFlag=false;
    $scope.isSearch=false;

    $scope.goDetail=function(spare){
      SpareListService.set(spare);
      $state.go('spareDetail');
    };


    $scope.changePage=function(){
        $scope.searchFlag=true;
        $timeout(function () {
            document.getElementById('spareId').focus();
        }, 1)
    };
    $scope.changeSearch=function(){
        $scope.isSearch=true;
    };
    $scope.initSearch = function () {
        $scope.spareInfo = '';
        $timeout(function () {
            document.getElementById('spareId').focus();
        }, 1)
    };
    $scope.cancelSearch=function(){
        $scope.searchFlag=false;
        $scope.spareInfo = '';
    };
    $scope.spareLoadMore1 = function(){
        $scope.spareimisshow = false;
        $scope.spareisshow = true;
        $scope.spareLoadMore = function() {
            page+= 1;
            var url = ROOTCONFIG.hempConfig.basePath + 'PRODUCT_LIST';
            var data = {
                "I_SYSNAME": {"SysName": "ATL"},
                "IS_PAGE": {
                    "CURRPAGE": page,
                    "ITEMS": "10"
                },
                "IS_PRODMAS_INPUT": { "SHORT_TEXT": "" }
            };
            HttpAppService.post(url, data).success(function (response) {
                //console.log(angular.toJson(response.ET_PRODMAS_OUTPUT.item.length));
                console.log(page);
                if (response.ES_RESULT.ZFLAG == 'E') {
                    $scope.spareisshow = false;
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    if(key != ""){
                        $scope.spareList = [];
                    }
                } else {
                    if (response.ES_RESULT.ZFLAG == 'S') {
                        if (response.ET_PRODMAS_OUTPUT.item.length == 0) {
                            $scope.spareisshow = false;
                            Prompter.hideLoading();
                            if (page == 1) {
                                $cordovaToast.showShortBottom('数据为空');
                            } else {
                                $cordovaToast.showShortBottom('没有更多数据了');
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                            $.each(response.ET_PRODMAS_OUTPUT.item, function (n, value) {
                                $scope.spareList.push(value);
                            });
                        }
                        if (response.ET_PRODMAS_OUTPUT.item.length < 10) {
                            $scope.spareisshow = false;
                            if (page > 1) {
                                //console.log("没有更多数据了");
                                $cordovaToast.showShortBottom('没有更多数据了');
                            }
                        } else {
                            $scope.spareisshow = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    }
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
                $scope.spareisshow = false;
            });
        }
    };

    $scope.spareLoadmoreIm = function() {
        page+=1;
        var url = ROOTCONFIG.hempConfig.basePath + 'PRODUCT_LIST';
        var data = {
            "I_SYSNAME": {"SysName": "ATL"},
            "IS_PAGE": {
                "CURRPAGE": page,
                "ITEMS": "10"
            },
            "IS_PRODMAS_INPUT": {"SHORT_TEXT": $scope.spareInfo}
        };
        HttpAppService.post(url, data).success(function (response) {
            console.log(page);
            $scope.spareimisshow=true;
            if (response.ES_RESULT.ZFLAG == 'E') {
                $scope.spareimisshow = false;
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                if (response.ES_RESULT.ZFLAG == 'S') {
                    Prompter.hideLoading();
                    if (response.ET_PRODMAS_OUTPUT.item.length == 0) {
                        $scope.spareimisshow = false;
                        if (page == 1) {
                            $cordovaToast.showShortBottom('数据为空');
                        } else {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                        $.each(response.ET_PRODMAS_OUTPUT.item, function (n, value) {
                            $scope.spareList1.push(value);
                            $scope.spareimisshow=true;
                        });
                    }
                    if (response.ET_PRODMAS_OUTPUT.item.length < 10) {
                        $scope.spareimisshow = false;
                        if (page > 1) {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                    } else {
                        $scope.spareimisshow = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }
            }
        }).error(function (response, status) {
            $cordovaToast.showShortBottom('请检查你的网络设备');
            $scope.spareimisshow = false;
        });
    };
}
])
.controller('SpareDetailCtrl',['$scope','SpareListService',function($scope,SpareListService){
        $scope.spareList=SpareListService.get();
    }]);