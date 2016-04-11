/**
 * Created by Administrator on 2016/3/14 0014.
 */
carModule.controller('CarCtrl',['$ionicScrollDelegate','$http','$cordovaToast','HttpAppService','$scope','CarService','$timeout','$state','Prompter',function($ionicScrollDelegate,$http,$cordovaToast,HttpAppService,$scope,CarService,$timeout,$state,Prompter){
    $scope.cars=[];
    $scope.searchFlag=false;
    $scope.isSearch=false;
    $scope.carInfo="";
    $scope.data=[];

    $scope.search = function (x, e){
        Prompter.showLoading('正在搜索');
        $scope.searchFlag=true;
        $scope.carInfo = x;
        $scope.carLoadMore1Im();
    };
    $scope.carListHistoryval = function(){
        if(storedb('cardb').find().arrUniq() != undefined || storedb('cardb').find().arrUniq() != null){
            $scope.data = (storedb('cardb').find().arrUniq());
            if ($scope.data.length > 5) {
                $scope.data = $scope.data.slice(0, 5);
            }
        }
    };
    $scope.carListHistoryval();
    //车辆列表接口
    var page=0;
    $scope.carLoadMore1Im = function(){
        $scope.cars=[];
        page+= 1;
        var url = ROOTCONFIG.hempConfig.basePath + 'CAR_LIST_BY_DCR';
        var data = {
            "I_SYSNAME": {"SysName": "CATL"},
            "IS_PAGE": {
                "CURRPAGE": page,
                "ITEMS": "10"
            },
            "IS_VEHICL_INPUT": { "SHORT_TEXT": $scope.carInfo }
        };
        HttpAppService.post(url, data).success(function (response) {
            //console.log(angular.toJson(response.ET_PRODMAS_OUTPUT.item.length));
            if (response.ES_RESULT.ZFLAG == 'E') {
                Prompter.hideLoading();
                $scope.carimisshow = false;
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                if(key != ""){
                    $scope.cars = [];
                }
            } else {
                if (response.ES_RESULT.ZFLAG == 'S') {
                    Prompter.hideLoading();
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
                            if($scope.carInfo===""){
                                $scope.cars=[];
                                return;
                            }
                            $scope.cars.push(value);
                            //$scope.spareimisshow=false;
                            //$scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                    }
                    if (response.ET_VEHICL_OUTPUT.item.length < 10) {
                        $scope.carimisshow = false;
                        if (page > 1) {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                    } else {
                        $scope.carimisshow = true;
                    }
                    //$scope.$broadcast('scroll.infiniteScrollComplete');

                }
            }
        }).error(function (response, status) {
            $cordovaToast.showShortBottom('请检查你的网络设备');
            $scope.carimisshow = false;
        });
    };

    //var cartimer;
    //setTimeout(function(){
    //    //document.getElementById('employeequeryinput').style.display = "none";
    //    document.getElementById('searchId').addEventListener("keyup", function () {//监听密码输入框，如果有值显示一键清除按钮
    //        if(!$scope.$$phase) {
    //            $scope.$apply();
    //        }
    //        $scope.carimisshow = false;
    //        clearTimeout(cartimer);
    //        cartimer = setTimeout(function() {
    //            if (document.getElementById('searchId').value.length > 0) {
    //                //document.getElementById('employeequeryinput').style.display = "inline-block";
    //                $scope.$apply(function(){
    //                    $scope.carimisshow = false;
    //                    //删除请求
    //                    $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CAR_LIST_BY_DCR');
    //                    $scope.cars = [];
    //                    $scope.cars = new Array;
    //                    page = 0;
    //                });
    //                $ionicScrollDelegate.resize();
    //                $scope.carimisshow = true;
    //                if(!$scope.$$phase) {
    //                    $scope.$apply();
    //                };
    //            } else {
    //                //删除请求
    //                $http['delete'](ROOTCONFIG.hempConfig.basePath + 'CAR_LIST_BY_DCR');
    //                $scope.carimisshow = false;
    //                $scope.cars = [];
    //                page = 0;
    //                if(!$scope.$$phase) {
    //                    $scope.$apply();
    //                }
    //                $ionicScrollDelegate.resize();
    //                //document.getElementById('employeequeryinput').style.display = "none";
    //            }
    //        }, 500);
    //    });
    //},50);
    //页面跳转，并传递参数
    $scope.goDetail=function(car){
        storedb('cardb').insert({"name": $scope.carInfo}, function (err) {
            if (!err) {
                console.log('历史记录保存成功')
            } else {
                $cordovaToast.showShortBottom('历史记录保存失败');
            }
        });
        CarService.setData(car);
        $state.go('carDetail');
    };
    //取消按钮
    $scope.cancelSearch=function(){
       $scope.searchFlag=false;
       $scope.initSearch();
       $scope.carListHistoryval();
    };
    //显示搜索页面
    $scope.changePage=function(){
        $scope.searchFlag=true;
        $timeout(function () {
            document.getElementById('searchId').focus();
        }, 1);
    };
    //清除输入框内的内容
    $scope.initSearch = function () {
        $scope.carInfo = '';
        $timeout(function () {
            document.getElementById('searchId').focus();
        }, 1)
    };
    $scope.carListHistoryval = function(){
        if(storedb('cardb').find().arrUniq() != undefined || storedb('cardb').find().arrUniq() != null){
            $scope.data = (storedb('cardb').find().arrUniq());
            if ($scope.data.length > 5) {
                $scope.data = $scope.data.slice(0, 5);
            }
        }
    };
}
])
.controller('CarDetailCtrl',['HttpAppService','$timeout','$scope','$state','CarService','$ionicHistory','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter',
        function(HttpAppService,$timeout,$scope,$state,CarService,$ionicHistory,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter){
        ionicMaterialInk.displayEffect();
        //$scope.select = true;
        $scope.showTitle = false;
        $scope.titleStatus=false;

        var position;
        var maxPosition;
        $scope.onScroll = function(){
            position = $ionicScrollDelegate.getScrollPosition().top;
            if(position>5){
                $scope.TitleFlag = true;
                $scope.showTitle=true;
                if(position>10){
                    $scope.titleFlag = true;
                }else{
                    $scope.titleFlag = false;
                }
                if(position>42){
                    $scope.qualityFlag = true;
                }else{
                    $scope.qualityFlag = false;
                }
                if(position>70){
                    $scope.projectFlag = true;
                }else{
                    $scope.projectFlag = false;
                }
                if(position>100){
                    if(maxPosition===null){
                        maxPosition=$ionicScrollDelegate.getScrollView().__maxScrollTop;
                    }
                    //console.log(position);
                    $scope.titleStatus=true;
                }else{
                    $scope.titleStatus=false;
                }
            }else{
                $scope.showTitle=false;
                $scope.TitleFlag = false;
                $scope.titleFlag=false;
                $scope.qualityFlag=false;
                $scope.projectFlag=false;
                $scope.titleStatus=false;
            }

            if(!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.carInfo1={};
        var codeId=CarService.getData();
        console.log(codeId);
        var carDetail=function(){
            var url="http://117.28.248.23:9388/test/api/CRMAPP/CAR_DETAIL";
            var data =
            {
                "I_SYSNAME": { "SysName": "CATL" },
                "IT_VEHICLID": { "ZZ0010": codeId }
            };

            HttpAppService.post(url,data).success(function(response){
                Prompter.hideLoading();
                var carInfoData=response.ES_VEHICL_OUTPUT;
                //console.log(carInfoData.ZZ0011);

                var carInfo={
                    describe:"",
                    carNumber:"",
                    projectName:"",
                    productionDate1:"",
                    productionDate:"",
                    endDate:"",
                    buyDate:"",
                    newDate:"",
                    operationDate:"",
                    point:"",
                    code:"",
                    code1:"",
                    barCode:"",
                    carCode:"",
                    driver:"",
                    phoneNum:"",
                    BMU_V1:"",
                    BMU_V2:"",
                    CSC_V1:"",
                    SCS_V2:"",
                    directCustomer:"",
                    directCustomerId:"",
                    terminal:"",
                    terminalId:"",
                    version:"",
                    quality:""
                };
                //console.log(carInfoData.IBASE.length);
                for(var i=0;i<carInfoData.IBASE.length;i++){
                    if(carInfoData.IBASE[i]!=="0"){
                        //console.log(i);
                         var point=carInfoData.IBASE.substr(i,carInfoData.IBASE.length-i);
                         break;
                    }
                }
                for(var a=0;a<carInfoData.PRODUCT_ID.length;a++){
                    if(carInfoData.PRODUCT_ID[a]!=="0"){
                        //console.log(a);
                        var code=carInfoData.PRODUCT_ID.substr(a,carInfoData.PRODUCT_ID.length-a);
                        break;
                    }
                }
                var Date1=function(date){
                    for(var i=0;i<date.length;i++){
                        if(date[0]==='0'){
                            date="";
                        }else if(date[i]==='-'){
                            date = date.replace('-',':');
                        }
                    }
                    return date;
                };
                carInfo.describe=carInfoData.SHORT_TEXT;
                carInfo.carNumber=carInfoData.ZZ0012;
                carInfo.projectName=carInfoData.ZZ0017;
                carInfo.productionDate1=Date1(carInfoData.ZZ0018)+"-"+Date1(carInfoData.END_DATE);
                carInfo.productionDate=carInfoData.ZZ0018;
                carInfo.endDate=carInfoData.END_DATE;
                carInfo.buyDate=carInfoData.ZZ0019;
                carInfo.operationDate=carInfoData.ZZ0020;
                carInfo.newDate=carInfoData.ZZ0021;
                carInfo.point=point;
                carInfo.code=code;
                carInfo.code1=carInfoData.PRODUCT_ID;
                carInfo.barCode=carInfoData.ZZ0010;
                carInfo.carCode=carInfoData.ZZ0011;
                carInfo.driver=carInfoData.ZZ0015;
                carInfo.phoneNum=carInfoData.ZZ0016;
                carInfo.BMU_V1=carInfoData.ZZ0022;
                carInfo.BMU_V2=carInfoData.ZZ0023;
                carInfo.CSC_V1=carInfoData.ZZ0024;
                carInfo.SCS_V2=carInfoData.ZZ0025;
                carInfo.version=carInfoData.ZZ0013;
                carInfo.directCustomer=carInfoData.ZDIR_PARTN_NAME;
                carInfo.directCustomerId=carInfoData.ZDIR_PARTNER;
                carInfo.terminal=carInfoData.ZSRV_REP_TEXT;
                carInfo.terminalId=carInfoData.ZSRV_REPRENT;
                carInfo.quality=carInfoData.Z_SHORT_TEXT;

                console.log(carInfo.describe);

                $scope.carInfo1=carInfo;
                //console.log($scope.carInfo1.describe);

            });
        };
            Prompter.showLoading('正在加载');
            carDetail();
        $scope.carDetailval = employeeService.get_employeeListvalue();
        //console.log($scope.cars.describe)
        $scope.projectName="CATL项目名称:";

        $scope.goPage=function(data){
            CarService.setSpare(data);
            $state.go("spare");
        };
        $scope.goDetail=function(data){
            CarService.setSpare(data);
            $state.go("maintenance");
        };
        //电话
        $scope.carshowphone =function(types){
            Prompter.showphone(types);
        }
}
])

.controller('MaintenanceCtrl',['$cordovaToast','Prompter',"HttpAppService","$scope","ionicMaterialInk","ionicMaterialMotion", "$ionicPopup", "$timeout", "$ionicPosition","$state","CarService",
        function($cordovaToast,Prompter,HttpAppService,$scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition,$state,CarService) {
        $scope.maintenanceInfo = [];
            var code = CarService.getData();
            $timeout(function () { //pushDown  fadeSlideIn  fadeSlideInRight
                //ionicMaterialInk.displayEffect();
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 100);
            var page=0;
            $scope.maintenanceLoad = function() {
                //$scope.spareimisshow = true;
                page+=1;
                var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_LIST';
                var data = {
                    I_SYSNAME: { SysName: "CATL" },
                    IS_AUTHORITY: { BNAME: "" },
                    IS_PAGE: {
                        CURRPAGE: page,
                        ITEMS: 10
                    },
                    IS_SEARCH: {
                        SEARCH: "",
                        OBJECT_ID: "",
                        DESCRIPTION: "",
                        PARTNER: "",
                        PRODUCT_ID: code,
                        CAR_TEXT: "",
                        CREATED_FROM: "",
                        CREATED_TO: ""
                    },
                    IS_SORT: "1",
                    T_IN_IMPACT: {},
                    T_IN_PARTNER: {},
                    T_IN_PROCESS_TYPE: {},
                    T_IN_STAT: {}
                };
                HttpAppService.post(url, data).success(function (response) {
                    console.log(page);
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        Prompter.showPopupAlert("加载失败","没有更多数据");
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        if (response.ES_RESULT.ZFLAG == 'S') {
                            Prompter.hideLoading();
                            if (response.T_OUT_LIST.item.length == 0) {
                                if (page == 1) {
                                    Prompter.showPopupAlert("加载失败","....")
                                } else {
                                    Prompter.showPopupAlert("加载失败","没有更多数据");
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                                $.each(response.T_OUT_LIST.item, function (n, value) {
                                    $scope.maintenanceInfo.push(value);
                                    //$scope.spareimisshow=false;
                                    //$scope.$broadcast('scroll.infiniteScrollComplete');
                                });
                            }
                            if (response.T_OUT_LIST.item.length < 10) {
                                $scope.spareimisshow = false;
                                if (page > 1) {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                            }
                            //$scope.$broadcast('scroll.infiniteScrollComplete');

                        }
                    }
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            };
            $scope.maintenanceLoad();
            $scope.config = {
                searchText: '',
                //showXbrModel: false, //是否显示遮罩层
                // page mode
                isFilterMode: false,
                isSorteMode: false,
                isQueryMode: false,
                isListMode: false,
                //为动画而生
                sortModeFromFilterMode: false,
                sortModeFromClick: false,
                filterModeFromSortMode: false,
                filterModeFromClick: false,
                sorteGoneByClick: false,
                filterGoneByClick: false,
                filterGoneByModelClick: false,
                sorteGoneByModelClick: false,

                //排序 规则
                sortedTypeNone: true,    //不排序（默认）
                sortedTypeTimeDesc: false,  //时间 降序
                sortedTypeTimeAes: false,	//时间 升序
                sortedTypeCompactDesc: false,
                //筛选 规则 ----> 工单类型
                filterLocalService: false,
                filterNewCarOnline: false,
                filterBatchUpdate: false,
                filterNone: true,
                //筛选 规则 ----> 影响：damage height middle low none
                filterImpactDamage: false,
                filterImpactHeight: false,
                filterImpactMiddle: false,
                filterImpactLow: false,
                filterImpactNone: false,
                filterImpactNoSelected: true,
                //筛选 规则 ----> 状态
                filterStatusNew: false, //新建
                filterStatusSendedWorker: false,		//已派工
                filterStatusRefused: false,		//已拒绝
                filterStatusHandling: false,		//处理中
                filterStatusReported: false,		//已报工
                filterStatusFinished: false,		//已完工
                filterStatusRevisited: false,		//已回访
                filterStatusAudited: false,		//已审核
                filterStatusReturned: false, 		//已打回
                filterStatusCancled: false, // 已经取消

                timeStart: '20150101',
                timeEnd: '20150609',


                ok: true
            };

            //依据所选 筛选条件 进行筛选操作
            $scope.filterConfirm = function(){
                // TODO
            };
            //重置筛选条件
            $scope.resetFilters = function(){
                //筛选 规则 ----> 工单类型
                $scope.config.filterLocalService = false;
                $scope.config.filterNewCarOnline = false;
                $scope.config.filterBatchUpdate = false;
                $scope.config.filterLocalService1 = false;
                $scope.config.filterNewCarOnline1 = false;
                $scope.config.filterBatchUpdate1 = false;
                $scope.config.filterNone = true;
                //筛选 规则 ----> 影响
                $scope.config.filterImpactDamage = false;
                $scope.config.filterImpactHeight = false;
                $scope.config.filterImpactMiddle = false;
                $scope.config.filterImpactLow = false;
                $scope.config.filterImpactNone = false;
                $scope.config.filterImpactNoSelected = true;
                //筛选 规则 ----> 状态
                __resetStatus();
            };

            $scope.goDetailState = function(i){
                console.log("goDetailState");
                if(i == 0){
                    $state.go("worksheetdetailnewcar");
                }else{
                    $state.go("worksheetdetailsiterepair");
                }
            };

            $scope.onSearchTextChange = function($event){
                if($scope.config.searchText && $scope.config.searchText.trim()!=''){
                    $scope.enterListMode();
                }
            };

            $scope.showXbrModel = function(){
                return $scope.config.isFilterMode || $scope.config.isSorteMode;
            };

            $scope.clickHeadTopSearchIcon = function(){
                $scope.enterQueryMode();
            };
            $scope.onSearchTextChangeFromHeaderBar = function(){

            };

            $scope.clickEnterListMode = function($event){ //点击遮罩层，取消排序和筛选界面
                if(!$event){ return; }
                var $target = angular.element($event.target);
                var attrs = $target[0].attributes;
                // 如果该元素有 canNotClickEnterListMode 或 canClickEnterListMode标签
                for(var i = 0; i < attrs.length; i++){
                    var attr = attrs[i];
                    if(attr && attr.name!= null && attr.name.toLowerCase()=='canNotClickEnterListMode'.toLowerCase()){
                        return;
                    }
                    if(attr && attr.name!= null && attr.name.toLowerCase() == 'canClickEnterListMode'.toLowerCase()){
                        $scope.enterListMode();
                        return;
                    }
                }
                delete i;
                //身上查找你元素,直到body或html
                var parent;
                parent = $target[0].parentElement
                while(parent && parent.nodeName.toLowerCase()!= 'body' && parent.nodeName.toLowerCase()!= 'html'){
                    var attrs2 = parent.attributes;
                    for(var j = 0; j<attrs2.length; j++){
                        var attr2 = attrs2[j];
                        if(attr2 && attr2.name!= null && attr2.name.toLowerCase()=='canNotClickEnterListMode'.toLowerCase()){
                            return;
                        }
                        if(attr2 && attr2.name!= null && attr2.name.toLowerCase() == 'canClickEnterListMode'.toLowerCase()){
                            $scope.enterListMode();
                            return;
                        }
                    }
                    parent = parent.parentElement;
                }
            };

            $scope.enterFilterMode = function(){
                __setSoftFilterAnimationProAllFalse();
                if($scope.config.isFilterMode){
                    //__setSoftFilterAnimationProAllFalse();
                    $scope.config.filterGoneByClick = true;
                    $scope.enterListMode();
                    return;
                }
                $timeout(function (){
                    $scope.config.filterGoneByClick = false;
                }, 400);
                //$scope.config.sorteGoneByClick = false;
                if($scope.config.isSorteMode){
                    $scope.config.filterModeFromSortMode = true;
                    //$scope.config.filterModeFromClick = false;
                }else{
                    $scope.config.filterModeFromClick = true;
                    //$scope.config.filterModeFromSortMode = false;
                }
                $scope.config.isFilterMode = true;
                $scope.config.isSorteMode = false;
                $scope.config.isQueryMode = false;
                $scope.config.isListMode = false;
                //ionicMaterialMotion.pushDown(".tab-filter-content ,tab-filter-content-inner");
            };
            $scope.enterSorteMode = function(){
                __setSoftFilterAnimationProAllFalse();
                if($scope.config.isSorteMode){
                    //__setSoftFilterAnimationProAllFalse();
                    $scope.config.sorteGoneByClick = true;
                    $scope.enterListMode();
                    return;
                }
                $timeout(function (){
                    $scope.config.sorteGoneByClick = false;
                }, 400);
                //$scope.config.filterGoneByClick = false;
                if($scope.config.isFilterMode){
                    $scope.config.sortModeFromFilterMode = true;
                    //$scope.config.sortModeFromClick = false;
                }else{
                    //$scope.config.sortModeFromFilterMode = false;
                    $scope.config.sortModeFromClick = true;
                }
                $scope.config.isFilterMode = false;
                $scope.config.isSorteMode = true;
                $scope.config.isQueryMode = false;
                $scope.config.isListMode = false;
            };
            function __setSoftFilterAnimationProAllFalse(){
                $scope.config.filterGoneByClick = false;
                $scope.config.sorteGoneByClick = false;
                $scope.config.sortModeFromFilterMode = false;
                $scope.config.sortModeFromClick = false;
                $scope.config.filterModeFromSortMode = false;
                $scope.config.filterModeFromClick = false;
            }
            function __checkSoftAndFilterAnimation(){
                if($scope.config.isFilterMode){
                    $scope.config.filterGoneByModelClick = true;
                    $timeout(function() {
                        $scope.config.filterGoneByModelClick = false;
                    }, 300);
                }else if($scope.config.isSorteMode){
                    $scope.config.sorteGoneByModelClick = true;
                    $timeout(function() {
                        $scope.config.sorteGoneByModelClick = false;
                    }, 300);
                }
            }

            $scope.enterQueryMode = function(){
                $scope.config.isFilterMode = false;
                $scope.config.isSorteMode = false;
                $scope.config.isQueryMode = true;
                $scope.config.isListMode = false;
            };
            $scope.enterListMode = function(){
                __checkSoftAndFilterAnimation();
                $scope.config.isFilterMode = false;
                $scope.config.isSorteMode = false;
                $scope.config.isQueryMode = false;
                $scope.config.isListMode = true;
            };

            $scope.sorteTimeDesc = function(){
                $scope.config.sortedTypeNone = false;
                $scope.config.sortedTypeCompactDesc = false;
                $scope.config.sortedTypeTimeAes = false;
                $scope.config.sortedTypeTimeDesc = true;
                $scope.enterListMode();
            };
            $scope.sorteTimeAes = function(){
                $scope.config.sortedTypeNone = false;
                $scope.config.sortedTypeCompactDesc = false;
                $scope.config.sortedTypeTimeAes = true;
                $scope.config.sortedTypeTimeDesc = false;
                $scope.enterListMode();
            };
            $scope.sorteNone = function(){
                $scope.config.sortedTypeNone = true;
                $scope.config.sortedTypeCompactDesc = false;
                $scope.config.sortedTypeTimeAes = false;
                $scope.config.sortedTypeTimeDesc = false;
                $scope.enterListMode();
            };
            $scope.sorteCompactDesc = function(){
                $scope.config.sortedTypeNone = false;
                $scope.config.sortedTypeCompactDesc = true;
                $scope.config.sortedTypeTimeAes = false;
                $scope.config.sortedTypeTimeDesc = false;
                $scope.enterListMode();
            };

            $scope.selectFilterType = function(filterName){ // localService、batchUpdate、newcarOnline

                if(filterName === 'localService'){
                    if(!$scope.config.filterLocalService){
                        $scope.config.filterLocalService = true;
                        $scope.config.filterNone = false;
                        $scope.config.filterBatchUpdate = false;
                        $scope.config.filterNewCarOnline = false;
                        $scope.config.filterLocalService1 = false;
                        $scope.config.filterNewCarOnline1 = false;
                        $scope.config.filterBatchUpdate1 = false;
                        return;
                    }
                    $scope.config.filterLocalService=!$scope.config.filterLocalService;
                }else if(filterName ==='batchUpdate'){
                    if(!$scope.config.filterBatchUpdate){
                        $scope.config.filterLocalService = false;
                        $scope.config.filterNone = false;
                        $scope.config.filterBatchUpdate = true;
                        $scope.config.filterNewCarOnline = false;
                        $scope.config.filterLocalService1 = false;
                        $scope.config.filterNewCarOnline1 = false;
                        $scope.config.filterBatchUpdate1 = false;
                          return;
                    }
                    $scope.config.filterBatchUpdate=!$scope.config.filterBatchUpdate

                }else if(filterName === 'newcarOnline') {
                    if (!$scope.config.filterNewCarOnline) {
                        $scope.config.filterLocalService = false;
                        $scope.config.filterNone = false;
                        $scope.config.filterBatchUpdate = false;
                        $scope.config.filterNewCarOnline = true;
                        $scope.config.filterLocalService1 = false;
                        $scope.config.filterNewCarOnline1 = false;
                        $scope.config.filterBatchUpdate1 = false;
                        return;
                    }
                    $scope.config.filterNewCarOnline = !$scope.config.filterNewCarOnline;
                }else if(filterName === 'localService1'){
                        if(!$scope.config.filterLocalService1){
                            $scope.config.filterLocalService1 = true;
                            $scope.config.filterNone = false;
                            $scope.config.filterBatchUpdate = false;
                            $scope.config.filterNewCarOnline = false;
                            $scope.config.filterLocalService = false;
                            $scope.config.filterNewCarOnline1 = false;
                            $scope.config.filterBatchUpdate1 = false;
                            return;
                        }
                        $scope.config.filterLocalService1=!$scope.config.filterLocalService1;
                    }else if(filterName === 'batchUpdate1'){
                        if(!$scope.config.filterBatchUpdate1){
                            $scope.config.filterLocalService = false;
                            $scope.config.filterNone = false;
                            $scope.config.filterBatchUpdate1 = true;
                            $scope.config.filterNewCarOnline = false;
                            $scope.config.filterLocalService1 = false;
                            $scope.config.filterNewCarOnline1 = false;
                            $scope.config.filterBatchUpdate = false;
                            return;
                        }
                        $scope.config.filterBatchUpdate1=!$scope.config.filterBatchUpdate1;

                    }else if(filterName === 'newcarOnline1') {
                    if (!$scope.config.filterNewCarOnline1) {
                        $scope.config.filterLocalService = false;
                        $scope.config.filterNone = false;
                        $scope.config.filterBatchUpdate = false;
                        $scope.config.filterNewCarOnline1 = true;
                        $scope.config.filterLocalService1 = false;
                        $scope.config.filterNewCarOnline = false;
                        $scope.config.filterBatchUpdate1 = false;
                        return;
                    }
                    $scope.config.filterNewCarOnline1 = !$scope.config.filterNewCarOnline1;
                }else{
                    $scope.config.filterLocalService = false;
                    $scope.config.filterNone = true;
                    $scope.config.filterBatchUpdate = false;
                    $scope.config.filterNewCarOnline = false;
                    $scope.config.filterLocalService1 = false;
                    $scope.config.filterNewCarOnline1 = false;
                    $scope.config.filterBatchUpdate1 = false;
                }
            };
            $scope.selectFilterImpact = function(impactName){ // damage height middle low none
                if(!impactName){
                    $scope.config.filterImpactDamage =false;
                    $scope.config.filterImpactHeight = false;
                    $scope.config.filterImpactMiddle = false;
                    $scope.config.filterImpactLow = false;
                    $scope.config.filterImpactNone = false;
                    $scope.config.filterImpactNoSelected = true;
                }
                if(impactName == 'damage'){
                    if(!$scope.config.filterImpactDamage){
                        $scope.config.filterImpactDamage =true;
                        return;
                    }
                    $scope.config.filterImpactDamage=!$scope.config.filterImpactDamage;
                }else if(impactName == 'height'){
                    if(!$scope.config.filterImpactHeight){
                        $scope.config.filterImpactHeight = true;
                        return;
                    }
                    $scope.config.filterImpactHeight=!$scope.config.filterImpactHeight;
                }else if(impactName == 'middle'){
                    if(!$scope.config.filterImpactMiddle){
                        $scope.config.filterImpactMiddle = true;
                        return;
                    }
                    $scope.config.filterImpactMiddle=!$scope.config.filterImpactMiddle;
                }else if(impactName == 'low'){
                    if(!$scope.config.filterImpactLow){
                        $scope.config.filterImpactLow = true;
                        return;
                    }
                    $scope.config.filterImpactLow =!$scope.config.filterImpactLow ;
                }else if(impactName == 'none'){
                    if(!$scope.config.filterImpactNone){
                        $scope.config.filterImpactNone = true;
                        return;
                    }
                    $scope.config.filterImpactNone=!$scope.config.filterImpactNone;

                }
            };
            $scope.selectFilterStatus = function(statusName){
                __resetStatus();
                $scope.config[statusName] = true;
            };
            function __resetStatus(){
                var status = ['filterStatusNew','filterStatusSendedWorker',
                    'filterStatusRefused', 'filterStatusHandling',
                    'filterStatusReported', 'filterStatusFinished', 'filterStatusRevisited',
                    'filterStatusAudited', 'filterStatusReturned', 'filterStatusCancled'];
                for(var i = 0; i < status.length; i++){
                    $scope.config[status[i]] = false;
                }
            }

            $scope.init = function(){
                $scope.enterListMode();

            };
            $scope.init();

        }])

.controller('SpareCtrl',['HttpAppService','$scope','CarService','Prompter','$timeout',function(HttpAppService,$scope,CarService,Prompter,$timeout){
        $scope.spareList=[];
        $scope.searchFlag=false;
        $scope.data=[
            'B50 NCM',
            'YT-3P2s',
            '模组'
        ];
        $scope.cancelSearch=function(){
            $scope.searchFlag=false;
            $scope.initSearch();
        };
        //显示搜索页面
        $scope.changePage=function(){
            $scope.searchFlag=true;
            $timeout(function () {
                document.getElementById('searchSpareId').focus();
            }, 1)
        };
        //清除输入框内的内容
        $scope.initSearch = function () {
            $scope.spareDesc = '';
            $timeout(function () {
                document.getElementById('searchSpareId').focus();
            }, 1)
        };
        //
        //$scope.search = function (x, e) {
        //    Prompter.showLoading('正在搜索');
        //    $timeout(function () {
        //        Prompter.hideLoading();
        //        $scope.spareDesc = x;
        //    }, 800);
        //
        //    e.stopPropagation();
        //};
        var code= CarService.getSpare();
        console.log(code);

        var page=1;
        var spare=function(){
            var url=ROOTCONFIG.hempConfig.basePath+'ATTACHMENT_LIST';
            var data = {
                "IS_SYSTEM": { "SysName": "CATL" },
                "IS_PAGE": {
                    "CURRPAGE": page,
                    "ITEMS": "10"
                },
                "IS_VEHICLID": { "PRODUCT_ID": code }
            };
            HttpAppService.post(url,data).success(function(response) {
                console.log(response.ET_COMM_LIST);
                if(response.ET_COMM_LIST !==""&&response.ET_COMM_LIST !==null) {
                    var sparelist = response.ET_COMM_LIST.Item;
                    var num = response.ET_COMM_LIST.Item.length;
                    for (var i = 0; i < num; i++) {
                        var spare = {
                            spareName: "",
                            spareNum: "",
                            count: "",
                            qualityTime: "",
                            qualityDate: ""
                        };
                        var Date1=function(date){
                            for(var i=0;i<date.length;i++){
                                if(date[0]==='0'){
                                    date="";
                                }else if(date[i]==='-'){
                                    date = date.replace('-',':');
                                }
                            }
                            return date;
                        };
                        spare.spareName = sparelist[i].SHORT_TEXT;
                        spare.spareNum = sparelist[i].PRODUCT_ID;
                        spare.count = sparelist[i].AMOUNT;
                        spare.qualityTime = sparelist[i].Z_SHORT_TEXT;
                        spare.qualityDate = Date1(sparelist[i].START_DATE) + "-" + Date1(sparelist[i].END_DATE);

                        $scope.spareList.push(spare);
                    }
                }else{
                    Prompter.showPopup("加载失败","没有更多数据")
                }
            });

        };
        $scope.loadMore=function(){
            page+=1;
            Prompter.showLoading("拼命加载中...")
            $timeout(function(){
                spare();
               Prompter.hideLoading();
            });
        };

        spare();
}])
.filter('DateFilter',function(){

    })