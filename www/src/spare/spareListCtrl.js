/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['$cordovaToast','HttpAppService','$http','SpareListService','$state','$scope','Prompter','$timeout',function ($cordovaToast,HttpAppService,$http,SpareListService,$state,$scope,Prompter,$timeout){
    var page=0;
    $scope.spareList=[];

    $scope.goDetail=function(spare){
      SpareListService.set(spare);
      $state.go('spareDetail');
    };
    $scope.searchFlag=false;
    $scope.isSearch=false;
    $scope.spareInfo="";

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
            //console.log("data"+angular.toJson(data));
            //console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
            //console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
            HttpAppService.post(url, data).success(function (response) {
                //console.log(angular.toJson(response.ET_PRODMAS_OUTPUT.item.length));
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
    $scope.spareLoadMore1();

    $scope.spareLoadmoreIm = function() {
        //$scope.empitemImPage = 0;
        //$scope.employimisshow = true;
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
        //console.log("data"+angular.toJson(data));
        //console.log("name"+angular.toJson(data.IS_EMPLOYEE.NAME));
        //console.log("number"+angular.toJson(data.IS_PAGE.CURRPAGE));
        HttpAppService.post(url, data).success(function (response) {
            //console.log(angular.toJson(response.ET_PRODMAS_OUTPUT.item));
            console.log(page);

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
                            $scope.spareList.push(value);
                        });
                    }
                    if (response.ET_EMPLOYEE.item.length < 10) {
                        $scope.spareimisshow = false;
                        if (page > 1) {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                    } else {
                        $scope.carimisshow = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');

                }
            }
        }).error(function (response, status) {
            $cordovaToast.showShortBottom('请检查你的网络设备');
            $scope.spareimisshow = false;
        });
    };
    //var page=1;
    //var sparelist=function(){
    //    //var url="http://192.168.191.1:8080/battery/api/CRMAPP/PRODUCT_LIST";
    //    var url="http://117.28.248.23:9388/test/api/CRMAPP/PRODUCT_LIST";
    //    var data = {
    //        "I_SYSNAME": { "SysName": "ATL" },
    //        "IS_PAGE": {
    //            "CURRPAGE": page,
    //            "ITEMS": "10"
    //        },
    //        "IS_PRODMAS_INPUT": { "SHORT_TEXT": "" }
    //    };
    //    HttpAppService.post(url,data).success(function(response){
    //        var num=response.ET_PRODMAS_OUTPUT.item.length;
    //        console.log(num);
    //        for(var i=0;i<num;i++){
    //            var spare={
    //                spareId:"",
    //                spareName:""
    //            };
    //            spare.spareId=response.ET_PRODMAS_OUTPUT.item[i].PRODUCT_ID;
    //            spare.spareName=response.ET_PRODMAS_OUTPUT.item[i].SHORT_TEXT;
    //            $scope.spareList.push(spare);
    //        }
    //    });
    //};
    //Prompter.showLoading('正在加载');
    //$timeout(function () {
    //    Prompter.hideLoading();
    //}, 1000);
    //下拉刷新
    //$scope.doRefresh=function(){
    //    page+=1;
    //    sparelist();
    //    $timeout(function(){
    //        $scope.$broadcast('scroll.refreshComplete');
    //    },1000)
    //};
    //$scope.search = function (x, e) {
    //    Prompter.showLoading('正在搜索');
    //    $timeout(function () {
    //        Prompter.hideLoading();
    //        $scope.spareInfo = x;
    //    }, 800);
    //
    //    e.stopPropagation();
    //};
}
])
.controller('SpareDetailCtrl',['$scope','SpareListService',function($scope,SpareListService){
        $scope.spareList=SpareListService.get();
    }]);