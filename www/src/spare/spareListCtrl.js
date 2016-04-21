/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['$ionicScrollDelegate','$rootScope','$cordovaToast','worksheetDataService','HttpAppService','$http','SpareListService','$state','$scope','Prompter','$timeout',
    function ($ionicScrollDelegate,$rootScope,$cordovaToast,worksheetDataService,HttpAppService,$http,SpareListService,$state,$scope,Prompter,$timeout){
    var page=0;
    $scope.spareList=[];
    $scope.spareList1=[];
    $scope.data=[];
    $scope.spareInfo="";
    $scope.spareimisshow=false;
    $scope.searchFlag=false;
    $scope.isSearch=false;


    $scope.spareListHistoryval = function(){

        if(storedb('sparedb').find().arrUniq() != undefined || storedb('sparedb').find().arrUniq() != null){
            $scope.data = (storedb('sparedb').find().arrUniq());
            if ($scope.data.length > 5) {
                $scope.data = $scope.data.slice(0, 5);
            }
        }

        //if(storedb('sparedb1').find().arrUniq() != undefined || storedb('sparedb1').find().arrUniq() != null){
        //    $scope.spareList1 = (storedb('sparedb1').find().arrUniq());
        //    if ($scope.spareList1.length > 15) {
        //        $scope.spareList1 = $scope.spareList1.slice(0,15);
        //    }
        //}
        if (JSON.parse(localStorage.getItem("oftenSparedb")) != null || JSON.parse(localStorage.getItem("oftenSparedb")) != undefined) {
            $scope.spareList1 = JSON.parse(localStorage.getItem("oftenSparedb"));
            //console.log($scope.spareList1.SHORT_TEXT);
            if ($scope.spareList1.length > 15) {
                $scope.spareList1 = $scope.spareList1.slice(0, 15);
            }
        } else {
            $scope.spareList1 = [];
        }
    };
    $scope.spareListHistoryval();

    //广播修改界面显示flag
    $rootScope.$on('customercontactCreatevalue', function(event, data) {
        console.log("接收成功"+data);
        $scope.searchFlag =data;
        $scope.spareInfo ="";
        $scope.cancelSearch();

        //$scope.spareListHistoryval();
    });
        //$rootScope.$on('sparelist', function(event, data) {
        //    console.log("接收成功1");
        //
        //    $scope.spareListHistoryval();
        //
        //});
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState && toState && fromState.name == 'worksheetEdit'){
                worksheetDataService.selectedProduct="";
            }
        });
    $scope.changePage=function(){
        $scope.searchFlag=true;
        //$timeout(function () {
        //    document.getElementById('spareId').focus();
        //}, 1)
    };
    $scope.changeSearch=function(){
        $scope.isSearch=true;
    };
    $scope.initSearch = function () {
        $scope.spareInfo = '';
        //$timeout(function () {
        //    document.getElementById('spareId').focus();
        //}, 1)
    };
    $scope.cancelSearch=function(){
        $scope.searchFlag=false;
        $scope.spareInfo = '';
        $scope.spareList=new Array;
        $scope.spareListHistoryval();
        page=0;
    };
    $scope.search = function (x, e) {
        Prompter.showLoading('正在搜索');
        $scope.searchFlag=true;
        $scope.spareInfo = x;
        $scope.spareLoadmoreIm();
    };
    $scope.spareLoadmoreIm = function() {
        //$scope.spareimisshow = false;
        //console.log("第1步");
        page+=1;
        var url = ROOTCONFIG.hempConfig.basePath + 'PRODUCT_LIST';
        var data = {
            "I_SYSNAME": {"SysName": "CATL"},
            "IS_PAGE": {
                "CURRPAGE": page,
                "ITEMS": "10"
            },
            "IS_PRODMAS_INPUT": {"SHORT_TEXT": $scope.spareInfo}
        };
        HttpAppService.post(url, data).success(function (response) {
            console.log(page);
            if (response.ES_RESULT.ZFLAG == 'E') {
                //console.log("第3步");
                $scope.spareimisshow = false;
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
                if (response.ES_RESULT.ZFLAG == 'S') {
                    //console.log("第4步");
                    Prompter.hideLoading();
                    $scope.spareimisshow = false;
                    if (response.ET_PRODMAS_OUTPUT.item.length == 0) {
                        if (page == 1) {
                            $cordovaToast.showShortBottom('数据为空');
                        } else {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                        $.each(response.ET_PRODMAS_OUTPUT.item, function (n, value) {
                            if($scope.spareInfo===""){
                                $scope.spareList=new Array;
                            }else{
                                $scope.spareList.push(value);
                            }
                            //console.log("第5步");
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                    }
                    if (response.ET_PRODMAS_OUTPUT.item.length < 10) {
                        $scope.spareimisshow = false;
                        if (page > 1) {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                    } else {
                        if($scope.spareList.length===0){
                            $scope.spareimisshow=false;
                        }else{
                            $scope.spareimisshow = true;
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }
        }).error(function (response, status) {
            $cordovaToast.showShortBottom('请检查你的网络设备');
            $scope.spareimisshow = false;
        });
    };
    //初始化本地数据库
    if (JSON.parse(localStorage.getItem("oftenSparedb")) != null || JSON.parse(localStorage.getItem("oftenSparedb")) != undefined) {
        $scope.oftenSpareList = JSON.parse(localStorage.getItem("oftenSparedb"));
    }else{
        $scope.oftenSpareList=new Array;
    }
    //进入详细界面传递标识
    $scope.goDetail = function(value){
        //存储历史记录
        var spareIs=false;
        if($scope.spareInfo!==""){
            if(storedb('sparedb').find()!==null || storedb('sparedb').find()!==undefined){
                var list=storedb('sparedb').find();
                for(var i=0;i<list.length;i++){
                    if(storedb('sparedb').find($scope.spareInfo)){
                        storedb('sparedb').remove($scope.spareInfo);
                        storedb('sparedb').insert({'name':$scope.spareInfo},function(err){
                            if(!err){
                                console.log('历史记录保存成功')
                            }else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                        spareIs=true;
                    }
                }
                if(spareIs===false){
                    storedb('sparedb').insert({'name':$scope.spareInfo},function(err){
                        if(!err){
                            console.log('历史记录保存成功')
                        }else {
                            $cordovaToast.showShortBottom('历史记录保存失败');
                        }
                    });
                }
            }
        }

        //存储常用产品
        if (JSON.parse(localStorage.getItem("oftenSparedb")) != null || JSON.parse(localStorage.getItem("oftenSparedb")) != undefined) {
            //判断是否有相同的值
            for (var i = 0; i < $scope.oftenSpareList.length; i++) {
                var spareIsIn=true;
                if ($scope.oftenSpareList[i].PRODUCT_ID == value.PRODUCT_ID) {
                    //删除原有的，重新插入
                    $scope.oftenSpareList = JSON.parse(localStorage.getItem("oftenSparedb"));
                    $scope.oftenSpareList.splice(i, 1);
                    $scope.oftenSpareList.unshift(value);
                    localStorage['oftenSparedb'] = JSON.stringify($scope.oftenSpareList);
                    console.log("产品保存成功");
                    spareIsIn=false;
                }
            }
            if(spareIsIn){
                $scope.oftenSpareList.unshift(value);
                localStorage['oftenSparedb'] = JSON.stringify( $scope.oftenSpareList);
                console.log("产品1保存成功");
            }
        }else{
            $scope.oftenSpareList.unshift(value);
            localStorage['oftenSparedb'] = JSON.stringify( $scope.oftenSpareList);
        }
        SpareListService.set(value);
        if(worksheetDataService.selectedProduct==true) {
            worksheetDataService.backObjectProduct = value;
            worksheetDataService.selectedProduct = false;
            $ionicHistory.goBack();
        }else{
            $state.go('spareDetail');
        }

    };
        $scope.initLoad=function(){
            page=0;
            $scope.spareList = new Array;
            $scope.spareLoadmoreIm();
        };
        //var sparetimer;
        //setTimeout(function(){
        //    //document.getElementById('employeequeryinput').style.display = "none";
        //    document.getElementById('spareId').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
        //        if(!$scope.$$phase) {
        //            $scope.$apply();
        //        }
        //        $scope.spareimisshow = false;
        //        clearTimeout(sparetimer);
        //        sparetimer = setTimeout(function() {
        //            if (document.getElementById('spareId').value.length > 0) {
        //                //document.getElementById('employeequeryinput').style.display = "inline-block";
        //                $scope.$apply(function(){
        //                    $scope.spareimisshow = false;
        //                    //删除请求
        //                    $http['delete'](ROOTCONFIG.hempConfig.basePath + 'PRODUCT_LIST');
        //                    $scope.spareList = [];
        //                    $scope.spareList = new Array;
        //                    page = 0;
        //                });
        //                $ionicScrollDelegate.resize();
        //                $scope.spareimisshow = true;
        //                if(!$scope.$$phase) {
        //                    $scope.$apply();
        //                };
        //            } else {
        //                //删除请求
        //                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'PRODUCT_LIST');
        //                $scope.spareimisshow = false;
        //                $scope.spareList = [];
        //                page = 0;
        //                if(!$scope.$$phase) {
        //                    $scope.$apply();
        //                };
        //                $ionicScrollDelegate.resize();
        //                //document.getElementById('employeequeryinput').style.display = "none";
        //            }
        //        }, 500);
        //    });
        //
}
])
.controller('SpareDetailCtrl',['$ionicHistory','$rootScope','$scope','SpareListService',function($ionicHistory,$rootScope,$scope,SpareListService){
        $scope.spareList=SpareListService.get();
        $scope.back=function(){
            $rootScope.$broadcast('customercontactCreatevalue','false');
            $ionicHistory.goBack();
        };

    }]);