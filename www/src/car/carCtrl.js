/**
 * Created by Administrator on 2016/3/14 0014.
 */
carModule.controller('CarCtrl',['$ionicHistory','worksheetDataService','$rootScope','$ionicScrollDelegate','$http','$cordovaToast','HttpAppService','$scope','CarService','$timeout','$state','Prompter',
    function($ionicHistory,worksheetDataService,$rootScope,$ionicScrollDelegate,$http,$cordovaToast,HttpAppService,$scope,CarService,$timeout,$state,Prompter){
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

    //车辆列表接口
        $scope.initLoad=function(){
            page=0;
            $scope.cars = new Array;
            $scope.carLoadMore1Im();
        };

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
                    "ITEMS": "20"
                },
                "IS_VEHICL_INPUT": {"SHORT_TEXT": $scope.carInfo}
            };
            //console.log(ROOTCONFIG.hempConfig.baseEnvironment);
            //console.log($scope.carInfo);
            HttpAppService.post(url, data).success(function (response) {
                console.log(page);
                if (response.ES_RESULT.ZFLAG == 'S') {
                    //console.log("第4步");
                    Prompter.hideLoading();
                    $scope.carimisshow = false;
                    if (response.ET_VEHICL_OUTPUT.item.length == 0) {
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
                                $scope.cars=new Array;
                            }else{
                                $scope.cars.push(value);
                            }
                            //console.log("第5步");
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                    }
                    if (response.ET_VEHICL_OUTPUT.item.length < 10) {
                        $scope.carimisshow = false;
                        if (page > 1) {
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                    } else {
                        if($scope.carList.length===0){
                            $scope.carimisshow=false;
                        }else{
                            $scope.carimisshow = true;
                        }
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else {
                    //console.log("第3步");
                    $scope.carimisshow = false;
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
                $scope.carimisshow = false;
            });
        };
    //
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
.controller('CarDetailCtrl',['$rootScope','HttpAppService','$timeout','$scope','$state','CarService','$ionicHistory','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter',
        function ($rootScope,HttpAppService,$timeout,$scope,$state,CarService,$ionicHistory,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter){
        ionicMaterialInk.displayEffect();
        //$scope.select = true;
        $scope.showTitle = false;
        $scope.titleStatus=false;

        var position;
        var maxPosition;
            $scope.back=function(){
            $rootScope.$broadcast('carCreatevalue1','false');
            $ionicHistory.goBack();
        };
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
        var codeId=CarService.getData().ZBAR_CODE;
        //console.log(codeId);
            var Date2=function(date){
                if(date[0]==='0'){
                    date="";
                }
                return date;
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
        var carDetail=function(){
            var url=ROOTCONFIG.hempConfig.basePath+'CAR_DETAIL';
            var data =
            {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IT_VEHICLID": { "ZZ0010": codeId }
            };

            HttpAppService.post(url,data).success(function(response){
                Prompter.hideLoading();
                if(response.ES_VEHICL_OUTPUT!=undefined) {
                    var carInfoData = response.ES_VEHICL_OUTPUT;
                    //console.log(carInfoData);
                    //console.log(carInfoData.ZZ0011);
                    var carInfo = {
                        describe: "",
                        carNumber: "",
                        projectName: "",
                        productionDate1: "",
                        productionDate: "",
                        endDate: "",
                        buyDate: "",
                        newDate: "",
                        operationDate: "",
                        point: "",
                        code: "",
                        code1: "",
                        barCode: "",
                        carCode: "",
                        driver: "",
                        phoneNum: "",
                        BMU_V1: "",
                        BMU_V2: "",
                        CSC_V1: "",
                        SCS_V2: "",
                        directCustomer: "",
                        directCustomerId: "",
                        terminal: "",
                        terminalId: "",
                        version: "",
                        quality: ""
                    };
                    //console.log(carInfoData.IBASE.length);
                    for (var i = 0; i < carInfoData.IBASE.length; i++) {
                        if (carInfoData.IBASE[i] !== "0") {
                            //console.log(i);
                            var point = carInfoData.IBASE.substr(i, carInfoData.IBASE.length - i);
                            break;
                        }
                    }
                    for (var a = 0; a < carInfoData.PRODUCT_ID.length; a++) {
                        if (carInfoData.PRODUCT_ID[a] !== "0") {
                            //console.log(a);
                            var code = carInfoData.PRODUCT_ID.substr(a, carInfoData.PRODUCT_ID.length - a);
                            break;
                        }
                    }
                    carInfo.describe = carInfoData.SHORT_TEXT;
                    carInfo.carNumber = carInfoData.ZZ0012;
                    carInfo.projectName = carInfoData.ZZ0017;
                    carInfo.productionDate1 = (carInfoData.ZZ0018[0] !== '0' && carInfoData.END_DATE !== '0') ? Date1(carInfoData.ZZ0019) + "-" + Date1(carInfoData.END_DATE) : "";
                    carInfo.productionDate = Date2(carInfoData.ZZ0018);
                    carInfo.endDate = Date2(carInfoData.END_DATE);
                    carInfo.buyDate = Date2(carInfoData.ZZ0019);
                    carInfo.operationDate = Date2(carInfoData.ZZ0020);
                    carInfo.newDate = carInfoData.ZZ0021;
                    carInfo.point = point;
                    carInfo.code = code;
                    carInfo.code1 = carInfoData.PRODUCT_ID;
                    carInfo.barCode = carInfoData.ZZ0010;
                    carInfo.carCode = carInfoData.ZZ0011;
                    carInfo.driver = carInfoData.ZZ0015;
                    carInfo.phoneNum = carInfoData.ZZ0016;
                    carInfo.BMU_V1 = carInfoData.ZZ0022;
                    carInfo.BMU_V2 = carInfoData.ZZ0023;
                    carInfo.CSC_V1 = carInfoData.ZZ0024;
                    carInfo.SCS_V2 = carInfoData.ZZ0025;
                    carInfo.version = carInfoData.ZZ0013;
                    carInfo.directCustomer = carInfoData.ZDIR_PARTN_NAME;
                    carInfo.directCustomerId = carInfoData.ZDIR_PARTNER;
                    carInfo.terminal = carInfoData.ZSRV_REP_TEXT;
                    carInfo.terminalId = carInfoData.ZSRV_REPRENT;
                    carInfo.quality = carInfoData.Z_SHORT_TEXT;

                    //console.log(carInfo.describe);

                    $scope.carInfo1 = carInfo;
                    //console.log($scope.carInfo1.describe);
                }else{
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
        };


        Prompter.showLoading('正在加载');
            carDetail();
        $scope.carDetailval = employeeService.get_employeeListvalue();
        //console.log($scope.cars.describe)
        $scope.projectName="CATL项目名称:";

        $scope.goPage=function(data1){
            CarService.setSpare1(data1);
            $state.go("spare");
        };
        $scope.goDetail=function(data){
            console.log(data);
            CarService.setSpare(data);
            //$state.go("maintenance");
            $state.go("worksheetList");
        };
        //电话
        $scope.carshowphone =function(types){
            Prompter.showphone(types);
        };
        //文本框自适应换行
        var autoTextarea = function (elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    }
                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };
        var text = document.getElementById("textarea");
        autoTextarea(text);// 调用

        }
])

.controller('MaintenanceCtrl',['worksheetDataService','$cordovaToast','Prompter',"HttpAppService","$scope","ionicMaterialInk","ionicMaterialMotion", "$ionicPopup", "$timeout", "$ionicPosition","$state","CarService",
        function(worksheetDataService,$cordovaToast,Prompter,HttpAppService,$scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition,$state,CarService) {
            var sortedInt=1;
            var page=0;
            $scope.searchFlag=false;
            $scope.config = {
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
                filterLocalService1: false,
                filterNewCarOnline1: false,
                filterBatchUpdate1: false,
                filterNone: true,
                //筛选 规则 ----> 影响：damage height middle low none
                filterImpactDamage: false,
                filterImpactHeight: false,
                filterImpactMiddle: false,
                filterImpactLow: false,
                filterImpactNone: false,
                filterImpactNoSelected: true,
                //筛选 规则 ----> 状态
                ok: true,

                //请求参数相关
                searchText: '',
                IS_SORT: '',
                T_IN_IMPACT: {item:[]},
                T_IN_PARTNER: {},
                T_IN_PROCESS_TYPE: {item:[]},
                T_IN_STAT: {item: []},
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


            //$scope.goDetailState = function(i){
            //    console.log("goDetailState");
            //    if(i == 0){
            //        $state.go("worksheetdetailnewcar");
            //    }else{
            //        $state.go("worksheetdetailsiterepair");
            //    }
            //};

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

            function __clearResponseDatasForReloading(){
                delete $scope.maintenanceInfo;
                $scope.maintenanceInfo = [];
                $scope.config.isLoading = true;
                $scope.config.isReloading = true;
            }
            $scope.sorteTimeDesc = function(){
                __clearResponseDatasForReloading();
                $scope.config.sortedTypeNone = false;
                $scope.config.sortedTypeCompactDesc = false;
                $scope.config.sortedTypeTimeAes = false;
                $scope.config.sortedTypeTimeDesc = true;
                $scope.enterListMode();
                sortedInt=1;
                page=0;
                $scope.maintenanceLoad();

            };
            $scope.sorteTimeAes = function(){
                $scope.config.sortedTypeNone = false;
                $scope.config.sortedTypeCompactDesc = false;
                $scope.config.sortedTypeTimeAes = true;
                $scope.config.sortedTypeTimeDesc = false;
                $scope.enterListMode();
                sortedInt=2;
                page=0;
                $scope.maintenanceLoad();
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
                sortedInt=1;
                page=0;
                $scope.maintenanceLoad();
            };

            $scope.selectFilterType = function(filterName){ // localService、batchUpdate、newcarOnline

                if(filterName === 'localService'){
                    if(!$scope.config.filterLocalService){
                        $scope.config.filterLocalService = true;
                        return;
                    }
                    $scope.config.filterLocalService=!$scope.config.filterLocalService;
                }else if(filterName ==='batchUpdate'){
                    if(!$scope.config.filterBatchUpdate){
                        $scope.config.filterBatchUpdate = true;
                          return;
                    }
                    $scope.config.filterBatchUpdate=!$scope.config.filterBatchUpdate

                }else if(filterName === 'newcarOnline') {
                    if (!$scope.config.filterNewCarOnline) {
                        $scope.config.filterNewCarOnline = true;
                        return;
                    }
                    $scope.config.filterNewCarOnline = !$scope.config.filterNewCarOnline;
                }else if(filterName === 'localService1'){
                        if(!$scope.config.filterLocalService1){
                            $scope.config.filterLocalService1 = true;
                            return;
                        }
                        $scope.config.filterLocalService1=!$scope.config.filterLocalService1;
                    }else if(filterName === 'batchUpdate1'){
                        if(!$scope.config.filterBatchUpdate1){
                            $scope.config.filterBatchUpdate1 = true;
                            return;
                        }
                        $scope.config.filterBatchUpdate1=!$scope.config.filterBatchUpdate1;

                    }else if(filterName === 'newcarOnline1') {
                    if (!$scope.config.filterNewCarOnline1) {
                        $scope.config.filterNewCarOnline1 = true;
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
            $scope.maintenanceInfo = [];
            var code = CarService.getData();
            $timeout(function () { //pushDown  fadeSlideIn  fadeSlideInRight
                //ionicMaterialInk.displayEffect();
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 100);
            //var sortedInt = $scope.config.sortedTypeTimeAes ? "2" : (
            //    $scope.config.sortedTypeTimeDesc ? "1" : (
            //        $scope.config.sortedTypeCompactDesc ? "3" : "1"
            //    )
            //);
            $scope.confirm = function() {
                delete $scope.oldFilters;
                $scope.oldFilters = null;
                __clearResponseDatasForReloading();

                //工单类型：   filterNewCarOnline: ZNCO 新车档案收集工单    filterLocalService:ZPRO 现场维修工单    filterBatchUpdate:ZPLO 批量改进工单
                //			  filterNewCarOnlineFWS: ZNCV                filterLocalServiceFWS: ZPRV		   filterBatchUpdateFWS: ZPLV
                $scope.config.T_IN_PROCESS_TYPE.item = [];
                    if ($scope.config.filterNewCarOnline) {
                        $scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX": "ZNCO"});
                    }
                    if ($scope.config.filterLocalService) {
                        $scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX": "ZPRO"});
                    }
                    if ($scope.config.filterBatchUpdate) {
                        $scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX": "ZPLO"});
                    }
                    if ($scope.config.filterNewCarOnline1) {
                        $scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX": "ZNCV"});
                    }
                    if ($scope.config.filterLocalService1) {
                        $scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX": "ZPRV"});
                    }
                    if ($scope.config.filterBatchUpdate1) {
                        $scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX": "ZPLV"});
                    }
                $scope.maintenanceLoad();
                $scope.init();
            };
            $scope.showButton=false;
            $scope.showButton1=false;
            $scope.maintenanceLoad = function() {
                //$scope.spareimisshow = true;
                page+=1;
                var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_LIST';
                var data = {
                    I_SYSNAME: { SysName: ROOTCONFIG.hempConfig.baseEnvironment},
                    IS_AUTHORITY: { BNAME:  window.localStorage.crmUserName },
                    IS_PAGE: {
                        CURRPAGE: page,
                        ITEMS: 10
                    },
                    IS_SEARCH: {
                        SEARCH: "",
                        OBJECT_ID: "",
                        DESCRIPTION: "",
                        PARTNER: "",
                        PRODUCT_ID:code,
                        CAR_TEXT: "",
                        CREATED_FROM: "",
                        CREATED_TO: ""
                    },
                    IS_SORT: sortedInt,
                    T_IN_IMPACT: {},
                    T_IN_PARTNER: {},
                    T_IN_PROCESS_TYPE: $scope.config.T_IN_PROCESS_TYPE,
                    T_IN_STAT: {}
                };
                HttpAppService.post(url, data).success(function (response) {
                    console.log(page);
                    console.log(code);
                    //console.log(response.T_OUT_LIST);
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        if (response.ES_RESULT.ZFLAG == 'S') {
                            Prompter.hideLoading();
                            if (response.T_OUT_LIST.item.length == 0) {
                                if (page == 1) {
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                                $.each(response.T_OUT_LIST.item, function (n, value) {
                                    $scope.maintenanceInfo.push(value);
                                    //$scope.maintenanceInfo.CHANGED_AT[n]=getDate(value.CHANGED_AT);

                                });
                            }
                            if (response.T_OUT_LIST.item.length < 10) {
                                if (page > 1) {
                                    $scope.showButton1=true;
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                            }else{
                                $scope.showButton=true;
                                $scope.showButton1=false;
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        }
                    }
                }).error(function (response, status) {
                    $cordovaToast.showShortBottom('请检查你的网络设备');
                });
            };
            Prompter.showLoading("正在加载");
            $scope.maintenanceLoad();

            $scope.changePage=function(){
                $scope.searchFlag=true;
            };
            $scope.initSearch = function () {
                $scope.maintenanceName = '';
            };
            $scope.cancelSearch=function(){
                $scope.searchFlag=false;
                $scope.maintenanceName = '';
                $scope.maintenanceInfo1=new Array;
            };
            $scope.initLoad=function(){
                page=0;
                $scope.maintenanceInfo1 = new Array;
                $scope.maintenanceLoad1();
            };

            $scope.init = function(){
                $scope.enterListMode();

            };
            $scope.init();
            //$scope.goDetailState = function(record,i) {
            //    worksheetDataService.worksheetList.toDetail = {
            //        "IS_OBJECT_ID": record.OBJECT_ID,
            //        "IS_PROCESS_TYPE": record.PROCESS_TYPE,
            //        "ydWorksheetNum": record.SOLDTO_NAME,
            //        'ydStatusNum': record.STAT
            //    };
            //    if (record.PROCESS_TYPE == "ZNCO" || record.PROCESS_TYPE == "ZNCV") {
            //        $state.go("worksheetDetail", {
            //            detailType: 'newCar'
            //        });
            //    } else if (record.PROCESS_TYPE == "ZPRO" || record.PROCESS_TYPE == "ZPRV") {
            //        $state.go("worksheetDetail", {
            //            detailType: 'siteRepair'
            //        });
            //    } else if (record.PROCESS_TYPE == "ZPLO" || record.PROCESS_TYPE == "ZPLV") {
            //        $state.go("worksheetDetail", {
            //            detailType: 'batchUpdate'
            //        });
            //    }
            //}

        }])

.controller('SpareCtrl',['$ionicScrollDelegate','$cordovaToast','HttpAppService','$scope','CarService','Prompter','$timeout',
        function($ionicScrollDelegate,$cordovaToast,HttpAppService,$scope,CarService,Prompter,$timeout){
        $scope.spareList=[];
        $scope.searchFlag=false;
        $scope.spareDesc="";
        $scope.buttonShow=false;
        var sparelist=[];
        $scope.cancelSearch=function(){
            $scope.searchFlag=false;
            $scope.spareDesc="";
            $scope.spareList1=new Array;
        };
        //显示搜索页面
        $scope.changePage=function(){
            $scope.searchFlag=true;
            //$timeout(function () {
            //    document.getElementById('searchSpareId').focus();
            //}, 1)
        };
        //清除输入框内的内容
        $scope.initSearch = function () {
            $scope.spareDesc = '';
            //$timeout(function () {
            //    document.getElementById('searchSpareId').focus();
            //}, 1)
        };
        var code= CarService.getSpare1();

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
        var page=0;
        $scope.spare=function(){

            page+=1;
            var url=ROOTCONFIG.hempConfig.basePath+'ATTACHMENT_LIST';
            var data = {
                "I_SYSTEM": { "SysName":ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": page,
                    "ITEMS": "10"
                },
                "IS_VEHICLID": {
                    "PRODUCT_ID": code,
                    "PRODUCT_TEXT": ""
                }
            };
            HttpAppService.post(url,data).success(function(response) {
                //console.log(code+'spare');
                //console.log(page+"spare");
                //console.log(response.ET_COMM_LIST);
                if (response.ES_RESULT.ZFLAG == 'S') {
                    Prompter.hideLoading();
                    if (response.ET_COMM_LIST.Item.length == 0) {
                        if (page == 1) {
                            //Prompter.showPopupAlert("加载失败","暂无数据")
                        } else {
                            //Prompter.showPopupAlert("加载失败","没有更多数据");
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                        $.each(response.ET_COMM_LIST.Item, function (n, value) {

                            console.log(sparelist.length);
                            var spare = {
                                spareName: "",
                                spareNum: "",
                                count: "",
                                qualityTime: "",
                                qualityDate: ""
                            };
                            spare.spareName = value.SHORT_TEXT;
                            spare.spareNum = value.PRODUCT_ID;
                            spare.count = value.AMOUNT;
                            spare.qualityTime =value.Z_SHORT_TEXT;
                            spare.qualityDate =(value.START_DATE[0]!=="0"||value.END_DATE[0]!=="0")? (Date1(value.START_DATE) + "-" + Date1(value.END_DATE)):"";
                            console.log(value.START_DATE[0]);
                            $scope.spareList.push(spare);

                        });
                    }
                    if (response.ET_COMM_LIST.Item.length < 10) {
                        if (page > 1) {
                            $scope.buttonShow1=false;
                        }
                    }else{
                        $scope.buttonShow1=true;
                    }
                }else {
                    //Prompter.showPopupAlert("加载失败","没有更多数据");
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                $scope.config.queryResultScrollDelegate.resize();
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };


        $scope.spare1=function(){
            page+=1;
            //console.log(page);
            Prompter.showLoading("正在加载");
            var url=ROOTCONFIG.hempConfig.basePath+'ATTACHMENT_LIST';
            var data = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": "1",
                    "ITEMS": "10"
                },
                "IS_VEHICLID": {
                    "PRODUCT_ID": code,
                    "PRODUCT_TEXT": $scope.spareDesc
                }
            };
            HttpAppService.post(url,data).success(function(response) {
                //console.log(code+'spare1');
                //console.log(response.ET_COMM_LIST.Item.length);
                if (response.ES_RESULT.ZFLAG == 'S') {
                    Prompter.hideLoading();
                    if (response.ET_COMM_LIST.Item.length == 0) {
                        if (page == 1) {
                            //Prompter.showPopupAlert("加载失败","暂无数据")
                        } else {
                            //Prompter.showPopupAlert("加载失败","没有更多数据");
                            $cordovaToast.showShortBottom('没有更多数据了');
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                        $.each(response.ET_COMM_LIST.Item, function (n, value) {

                            var spare = {
                                spareName: "",
                                spareNum: "",
                                count: "",
                                qualityTime: "",
                                qualityDate: ""
                            };
                            spare.spareName = value.SHORT_TEXT;
                            spare.spareNum = value.PRODUCT_ID;
                            spare.count = value.AMOUNT;
                            spare.qualityTime =value.Z_SHORT_TEXT;
                            spare.qualityDate =(value.START_DATE[1]!=='0'|| value.END_DATE[1]!=='0')? Date1(value.START_DATE) + "-" + Date1(value.END_DATE):"";
                            if($scope.spareDesc===''){
                                $scope.spareList1=new Array;
                            }else{
                                $scope.spareList1.push(spare);

                            }
                        });
                    }
                    if (response.ET_COMM_LIST.Item.length < 10) {
                        if (page >= 1) {
                            $scope.buttonShow=false;
                        }
                    }else{
                        $scope.buttonShow=true;
                    }
                } else {
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            }).error(function (response, status) {
                $cordovaToast.showShortBottom('请检查你的网络设备');
            });
        };
        Prompter.showLoading("正在加载");
        $scope.config={
            queryResultScrollDelegate:null
        };
        $scope.config.queryResultScrollDelegate = $ionicScrollDelegate.$getByHandle("spareListResult");
        $scope.spare();
        $scope.initLoad=function(){
            page=0;
            $scope.spareList1 = new Array;
            $scope.buttonShow=false;
            $scope.spare1();
        };

}]);