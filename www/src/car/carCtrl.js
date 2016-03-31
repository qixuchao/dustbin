/**
 * Created by Administrator on 2016/3/14 0014.
 */
carModule.controller('CarCtrl',['$scope','CarService','$timeout','$state',function($scope,CarService,$timeout,$state){
    $scope.cars=CarService.all();
    $scope.searchFlag=false;
    $scope.carInfo="";
    $scope.data=[
        '贵GU1230',
        '京AS9116',
        '贵GU1229'
    ];
    //$scope.doRefresh=function(){
    //    $timeout(function(){
    //        $scope.cars.push(data);
    //        $scope.$broadcast('scroll.refreshComplete');
    //    },1000)
    //};
    $scope.goSkip=function(pageName){
        $state.go(pageName);
    };
    $scope.goDetail=function(car){
        CarService.setData(car);
        $scope.goSkip('carDetail');
    };
    $scope.changePage=function(){
        $scope.searchFlag=true;
    };
    $scope.search=function(){

    }
}
])
.controller('CarDetailCtrl',['$scope','$state','CarService','$ionicHistory','$ionicScrollDelegate','ionicMaterialInk',
        function($scope,$state,CarService,$ionicHistory,$ionicScrollDelegate,ionicMaterialInk){
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
                if(position>95){
                    if(maxPosition===null){
                        maxPosition=$ionicScrollDelegate.getScrollView().__maxScrollTop;
                    }
                    $scope.titleStatus=true;
                }else{
                    $scope.titleStatus=false;
                }
            }else{
                $scope.showTitle=false;
                $scope.TitleFlag = false;
                $scope.titleStatus=false;
            }
            $scope.$apply();
        };
        $scope.carInfo=CarService.getData();
        //console.log($scope.cars.describe)
        $scope.projectName="CATL项目名称:";
        $scope.goSkip=function(pageName){
            $state.go(pageName);
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


                searchPlaceholder: '请输入服务订单描述',




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

            $scope.datas = {
                testDates: [
                    {
                        costomer: '金龙客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '新建',
                        statusType: 'NEW',
                    },
                    {
                        costomer: '郑州宇通客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '处理中',
                        statusType: 'HANDLING',
                    },
                    {
                        costomer: '金龙客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '新建',
                        statusType: 'NEW',
                    },
                    {
                        costomer: '郑州宇通客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '处理中',
                        statusType: 'HANDLING',
                    },
                    {
                        costomer: '金龙客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '新建',
                        statusType: 'NEW',
                    },
                    {
                        costomer: '郑州宇通客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '处理中',
                        statusType: 'HANDLING',
                    },
                    {
                        costomer: '金龙客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '新建',
                        statusType: 'NEW',
                    },
                    {
                        costomer: '郑州宇通客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '处理中',
                        statusType: 'HANDLING',
                    },
                    {
                        costomer: '金龙客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '新建',
                        statusType: 'NEW',
                    },
                    {
                        costomer: '郑州宇通客车',
                        desc: '现场维修工单',
                        lastModifyTime: '2016.01.01 10:00:01',
                        status: '处理中',
                        statusType: 'HANDLING',
                    }
                ]
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
                if(filterName == 'localService'){
                    $scope.config.filterLocalService = true;
                    $scope.config.filterNone = false;
                    $scope.config.filterBatchUpdate = false;
                    $scope.config.filterNewCarOnline = false;
                }else if(filterName == 'batchUpdate'){
                    $scope.config.filterLocalService = false;
                    $scope.config.filterNone = false;
                    $scope.config.filterBatchUpdate = true;
                    $scope.config.filterNewCarOnline = false;
                }else if(filterName == 'newcarOnline'){
                    $scope.config.filterLocalService = false;
                    $scope.config.filterNone = false;
                    $scope.config.filterBatchUpdate = false;
                    $scope.config.filterNewCarOnline = true;
                }else{
                    $scope.config.filterLocalService = false;
                    $scope.config.filterNone = true;
                    $scope.config.filterBatchUpdate = false;
                    $scope.config.filterNewCarOnline = false;
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
                    $scope.config.filterImpactDamage =true;
                    $scope.config.filterImpactHeight = false;
                    $scope.config.filterImpactMiddle = false;
                    $scope.config.filterImpactLow = false;
                    $scope.config.filterImpactNone = false;
                    $scope.config.filterImpactNoSelected = false;
                }else if(impactName == 'height'){
                    $scope.config.filterImpactDamage =false;
                    $scope.config.filterImpactHeight = true;
                    $scope.config.filterImpactMiddle = false;
                    $scope.config.filterImpactLow = false;
                    $scope.config.filterImpactNone = false;
                    $scope.config.filterImpactNoSelected = false;
                }else if(impactName == 'middle'){
                    $scope.config.filterImpactDamage =false;
                    $scope.config.filterImpactHeight = false;
                    $scope.config.filterImpactMiddle = true;
                    $scope.config.filterImpactLow = false;
                    $scope.config.filterImpactNone = false;
                    $scope.config.filterImpactNoSelected = false;
                }else if(impactName == 'low'){
                    $scope.config.filterImpactDamage =false;
                    $scope.config.filterImpactHeight = false;
                    $scope.config.filterImpactMiddle = false;
                    $scope.config.filterImpactLow = true;
                    $scope.config.filterImpactNone = false;
                    $scope.config.filterImpactNoSelected = false;
                }else if(impactName == 'none'){
                    $scope.config.filterImpactDamage =false;
                    $scope.config.filterImpactHeight = false;
                    $scope.config.filterImpactMiddle = false;
                    $scope.config.filterImpactLow = false;
                    $scope.config.filterImpactNone = true;
                    $scope.config.filterImpactNoSelected = false;
                }
            };
            $scope.selectFilterStatus = function(statusName){
                __resetStatus();
                $scope.config[statusName] = true;
            }
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

                /*$ionicPopup.alert({
                 title: '你好',
                 template: '你好不'
                 });*/
            };
            $scope.init();

        }])

.controller('SpareCtrl',['$scope','CarService',function($scope,CarService){
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
}])
.filter("highlight", ['$sce','$log',function($sce, $log){

    var fn = function(text, search){
        $log.info("text: " + text);
        $log.info("search: " + search);

        if (!search) {
            return $sce.trustAsHtml(text);
        }
        text = encodeURI(text);
        search = encodeURI(search);

        var regex = new RegExp(search, 'gi')
        var result = text.replace(regex, '<span class="highlightedText">$&</span>');
        result = decodeURI(result);
        $log.info("result: " + result );
        return $sce.trustAsHtml(result);
    };

    return fn;
}]);