/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['$ionicScrollDelegate','$rootScope','$cordovaToast','HttpAppService','$http','SpareListService','$state','$scope','Prompter','$timeout',
    function ($ionicScrollDelegate,$rootScope,$cordovaToast,HttpAppService,$http,SpareListService,$state,$scope,Prompter,$timeout){
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
    };
    $scope.spareListHistoryval();

    //广播修改界面显示flag
    $rootScope.$on('customercontactCreatevalue', function(event, data) {
        console.log("接收成功"+data);
        $scope.searchFlag =data;
        $scope.cancelSearch();

        //$scope.spareListHistoryval();
    });
        $rootScope.$on('sparelist', function(event, data) {
            console.log("接收成功1");
        $scope.spareInfo ="";
        $scope.spareListHistoryval();

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
            "I_SYSNAME": {"SysName": "ATL"},
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
    //进入详细界面传递标识
    $scope.goDetail = function(value){
        //存储历史记录
        if(storedb('sparedb').find($scope.spareInfo)) {
            storedb('sparedb').remove($scope.spareInfo);
        }
        storedb('sparedb').insert({"name": $scope.spareInfo}, function (err) {
            if (!err) {
                console.log('历史记录保存成功')
            } else {
                $cordovaToast.showShortBottom('历史记录保存失败');
            }
        });
        SpareListService.set(value);
        $state.go('spareDetail');
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