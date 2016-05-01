/**
 * Created by admin on 16/5/1.
 */
activityPlanModule.controller('activityPlanListCtrl',['$cordovaDialogs','$ionicLoading','$ionicHistory','worksheetDataService','$rootScope','$ionicScrollDelegate','$http','$cordovaToast','HttpAppService','$scope','CarService','$timeout','$state','Prompter',
    function($cordovaDialogs,$ionicLoading,$ionicHistory,worksheetDataService,$rootScope,$ionicScrollDelegate,$http,$cordovaToast,HttpAppService,$scope,CarService,$timeout,$state,Prompter){
        $scope.cars=[];
        $scope.searchFlag=false;
        $scope.isSearch=false;
        $scope.carimisshow = false;
        $scope.carInfo="";
        $scope.data=[];
        var page=0;
        $scope.config={
            changeData:false,
            backParameter:worksheetDataService.selectedCheLiang
        };
        $scope.search = function (x, e){
            Prompter.showLoading('正在搜索');
            $scope.searchFlag=true;
            page=0;
            $scope.carInfo = x;
            $scope.carLoadMore1Im();
        };
        $rootScope.$on('carCreatevalue1', function(event, data) {
            console.log("接收成功"+data);
            $scope.searchFlag =data;
            $scope.carInfo="";
            $scope.cancelSearch();
        });
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState && toState && fromState.name == 'worksheetDetail'){
                worksheetDataService.selectedCheLiang="";
            }
        });

        $scope.carListHistoryval = function(){
            if(storedb('cardb').find().arrUniq() != undefined || storedb('cardb').find().arrUniq() != null){
                $scope.data = (storedb('cardb').find().arrUniq());
                if ($scope.data.length > 5) {
                    $scope.data = $scope.data.slice(0, 5);
                }
            }

            if (JSON.parse(localStorage.getItem("oftenCardb")) != null || JSON.parse(localStorage.getItem("oftenCardb")) != undefined) {
                $scope.carList = JSON.parse(localStorage.getItem("oftenCardb"));
                //console.log($scope.spareList1.SHORT_TEXT);
                if ($scope.carList.length > 15) {
                    $scope.carList = $scope.carList.slice(0, 15);
                }
            } else {
                $scope.carList = [];
            }
        };
        $scope.carListHistoryval();


        $scope.carLoadMore1Im = function() {
            //$scope.spareimisshow = false;
            //console.log("第1步");
            page+=1;
            var url =ROOTCONFIG.hempConfig.basePath + 'CAR_LIST_BY_DCR';
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_USER": { "BNAME":window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": page,
                    "ITEMS": "10"
                },
                "IS_VEHICL_INPUT": {"SHORT_TEXT": $scope.carInfo}
            };
            //console.log(ROOTCONFIG.hempConfig.baseEnvironment);
            //console.log($scope.carInfo);
            HttpAppService.post(url, data).success(function (response) {
                console.log(page);
                if(response.ES_RESULT.ZFLAG == 'E'){
                    $scope.carimisshow = false;
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else if (response.ES_RESULT.ZFLAG == 'S') {
                    //console.log("第4步");
                    $ionicLoading.hide();
                    Prompter.hideLoading();
                    if(response.ET_VEHICL_OUTPUT != ''){
                        if (response.ET_VEHICL_OUTPUT.item.length == 0) {
                            $scope.carimisshow = false;
                            if (page == 1) {
                                $cordovaToast.showShortBottom('数据为空');
                            } else {
                                $cordovaToast.showShortBottom('没有更多数据了');
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        } else {
                            //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                            $.each(response.ET_VEHICL_OUTPUT.item, function (n, value) {
                                if ($scope.carInfo == "") {
                                    $scope.cars = new Array;
                                } else {
                                    $scope.cars.push(value);
                                }
                            });
                        }
                        if (response.ET_VEHICL_OUTPUT.item.length < 10) {
                            if (page > 1) {
                                $cordovaToast.showShortBottom('没有更多数据了');
                            }
                        } else {
                            $scope.carimisshow = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }
                $ionicScrollDelegate.resize();
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                Prompter.hideLoading();
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    //console.log('HTTP timeout');
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }
                $ionicLoading.hide();
            });
        };
        //车辆列表接口
        $scope.initLoad=function(){
            page=0;
            $scope.cars = new Array;
            $scope.carLoadMore1Im();
        };
        //页面跳转，并传递参数
        if (JSON.parse(localStorage.getItem("oftenCardb")) != null || JSON.parse(localStorage.getItem("oftenCardb")) != undefined) {
            $scope.oftenCarList = JSON.parse(localStorage.getItem("oftenCardb"));
        }else{
            $scope.oftenCarList=new Array;
        }
        $scope.goDetail=function(value){
            var carIs=false;
            if($scope.carInfo!==""){
                if(storedb('cardb').find()!==null || storedb('cardb').find()!==undefined){
                    var list=storedb('cardb').find();
                    for(var j=0;j<list.length;j++){
                        if(list[j].name==$scope.carInfo){
                            storedb('cardb').remove({'name':list[j].name},function (err) {
                                if (!err) {
                                } else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            storedb('cardb').insert({'name':$scope.carInfo},function(err){
                                if(!err){
                                    console.log('历史记录保存成功')
                                }else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            carIs=true;
                        }
                    }
                    if(carIs===false){
                        storedb('cardb').insert({'name':$scope.carInfo},function(err){
                            if(!err){
                                console.log('历史记录保存成功')
                            }else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }
            }
            //存储常用车辆
            if (JSON.parse(localStorage.getItem("oftenCardb")) != null || JSON.parse(localStorage.getItem("oftenCardb")) != undefined) {
                //判断是否有相同的值
                var carIsIn=true;
                for (var i = 0; i < $scope.oftenCarList.length; i++) {
                    console.log($scope.oftenCarList.length+'car');

                    if ($scope.oftenCarList[i].ZBAR_CODE == value.ZBAR_CODE) {
                        //删除原有的，重新插入
                        $scope.oftenCarList = JSON.parse(localStorage.getItem("oftenCardb"));
                        $scope.oftenCarList.splice(i, 1);
                        $scope.oftenCarList.unshift(value);
                        localStorage['oftenCardb'] = JSON.stringify($scope.oftenCarList);
                        carIsIn=false;
                    }
                }
                if(carIsIn==true){
                    $scope.oftenCarList.unshift(value);
                    localStorage['oftenCardb'] = JSON.stringify($scope.oftenCarList);
                }
            }else{
                $scope.oftenCarList.unshift(value);
                localStorage['oftenCardb'] = JSON.stringify($scope.oftenCarList);
            }
            CarService.setData(value);
            console.log(angular.toJson(value));
            if($scope.config.backParameter==true){
                worksheetDataService.backObject=value;
                worksheetDataService.selectedCheLiang=false;
                $ionicHistory.goBack();

            }else{

                $state.go('carDetail');
            }

        };
        //取消按钮
        $scope.cancelSearch=function(){
            $scope.searchFlag=false;
            $scope.carInfo = '';
            $scope.cars=new Array;
            $scope.carListHistoryval();
            page=0;
        };
        //显示搜索页面
        $scope.changePage=function(){
            $scope.searchFlag=true;

        };
        //清除输入框内的内容
        $scope.initSearch = function () {
            $scope.carInfo = '';
            //$timeout(function () {
            //    document.getElementById('searchId').focus();
            //}, 1)
        };
    }
])