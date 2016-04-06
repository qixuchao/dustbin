/**
 * Created by Administrator on 2016/3/14 0014.
 */
carModule.controller('CarCtrl',['$scope','CarService','$timeout','$state','Prompter',function($scope,CarService,$timeout,$state,Prompter){
    $scope.cars=CarService.all();
    $scope.searchFlag=false;
    $scope.isSearch=false;
    $scope.carInfo="";
    $scope.data=[
        '贵GU1230',
        '京AS9116',
        '贵GU1229'
    ];

    $scope.goSkip=function(pageName){
        $state.go(pageName);
    };
    $scope.goDetail=function(car){
        CarService.setData(car);
        $scope.goSkip('carDetail');
    };
    $scope.cancelSearch=function(){
       $scope.searchFlag=false;
    };
    $scope.changePage=function(){
        $scope.searchFlag=true;
        $timeout(function () {
            document.getElementById('searchId').focus();
        }, 1)
    };
    $scope.initSearch = function () {
        $scope.carInfo = '';
        $timeout(function () {
            document.getElementById('searchId').focus();
        }, 1)
    };
    $scope.search = function (x, e) {
        Prompter.showLoading('正在搜索');
        $timeout(function () {
            Prompter.hideLoading();
            $scope.carInfo = x;
        }, 800)

        e.stopPropagation();
    };
}
])
.controller('CarDetailCtrl',['$scope','$state','CarService','$ionicHistory','$ionicScrollDelegate','ionicMaterialInk','employeeService','Prompter',
        function($scope,$state,CarService,$ionicHistory,$ionicScrollDelegate,ionicMaterialInk,employeeService,Prompter){
        ionicMaterialInk.displayEffect();
        //$scope.select = true;
        $scope.showTitle = false;
        $scope.titleStatus=false;
        //$scope.changeStatus = function(flag){
        //    $scope.select=flag;
        //};

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
                if(position>104){
                    if(maxPosition===null){
                        maxPosition=$ionicScrollDelegate.getScrollView().__maxScrollTop;
                    }
                    console.log(position);
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
            $scope.$apply();
        };
        $scope.carInfo=CarService.getData();
        $scope.carDetailval = employeeService.get_employeeListvalue();
        //console.log($scope.cars.describe)
        $scope.projectName="CATL项目名称:";

        $scope.goSkip=function(pageName){
            $state.go(pageName);
        };
        //电话
        $scope.carshowphone =function(types){
            Prompter.showphone(types)
        }
}
])

.controller('MaintenanceCtrl',["$scope","ionicMaterialInk","ionicMaterialMotion", "$ionicPopup", "$timeout", "$ionicPosition","$state","CarService",
        function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition,$state,CarService) {
        $scope.carInfo = CarService.getData().maintenance;
            $timeout(function () { //pushDown  fadeSlideIn  fadeSlideInRight
                //ionicMaterialInk.displayEffect();
                ionicMaterialMotion.fadeSlideIn({
                    selector: '.animate-fade-slide-in .item'
                });
            }, 100);

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
            var i=0;
            $scope.loadMore=function(){
                var spareInfo1={
                    listType:'现场维修工单',
                    maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
                    maintenanceDescribe:'车辆电池出现重大问题'+i
                };
                i+=1;
                $scope.carInfo.push(spareInfo1);
            };

        }])

.controller('SpareCtrl',['$scope','CarService','Prompter','$timeout',function($scope,CarService,Prompter,$timeout){
        $scope.spareList=CarService.getData().spare;
        var i=0;
        $scope.loadMore=function(){
            var spareInfo1={
                spareName:'高压箱-BD3'+i,
                spareNum:'17240-0026',
                count:'7',
                qualityTime:'CATL两年质保',
                qualityDate:'2016.01.01-2018.01.01'
            };
            i+=1;
            $scope.spareList.push(spareInfo1);
        };
}]);