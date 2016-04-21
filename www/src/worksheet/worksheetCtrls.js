/*
	TODO: 
		筛选：不点击“确定”按钮的时候，如果处理、		时间筛选、	工单类型筛选接口有问题
	
*/
worksheetModule.controller("WorksheetListCtrl",[
	"$scope",
	"$ionicScrollDelegate",
	"ionicMaterialInk", 
	"ionicMaterialMotion",
	"$ionicPopup", "$timeout", 
	"$ionicPosition","$state",
	"$cordovaDatePicker",
	"HttpAppService",
	"worksheetHttpService",
	"worksheetDataService",
	"customeService",
	"CarService",
	"$cordovaToast",
	function($scope, $ionicScrollDelegate,
		ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,
		$ionicPosition, $state, 
		$cordovaDatePicker,
		HttpAppService, worksheetHttpService, worksheetDataService, customeService, CarService, $cordovaToast){
	
	$timeout(function () { //pushDown  fadeSlideIn  fadeSlideInRight
        //ionicMaterialInk.displayEffect();
        /*ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });*/
    }, 550);

    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        if(fromState && toState && fromState.name == 'worksheetDetail' && toState.name == 'worksheetList'){
            if(worksheetDataService.wsDetailToList.needReload){
            	worksheetDataService.wsDetailToList.needReload = false;
            	$scope.reloadData();
            }            
        }
    });


    $scope.currentDate = new Date();
	$scope.minDate = new Date(2105, 6, 1);
	$scope.maxDate = new Date(2015, 6, 31);

	$scope.datePickerCallback = function (val) {
	    if (!val) { 
	        console.log('Date not selected');
	    } else {
	        console.log('Selected date is : ', val);
	    }
	};


    
	$scope.config = {
		titleText: "服务工单列表",
		//showXbrModel: false, //是否显示遮罩层
		// page mode
		isFilterMode: false,
		isSorteMode: false,
		isQueryMode: false,
		isListMode: false,
		queryModeNew: false,
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
		sortedTypeNone: true,    //不排序
		sortedTypeTimeDesc: false,  //时间 降序（不默认）
		sortedTypeTimeAes: false,	//时间 升序
		sortedTypeCompactDesc: false,
		//筛选 规则 ----> 工单类型
		filterLocalService: false,
		filterNewCarOnline: false,
		filterBatchUpdate: false,
		filterLocalServiceFWS: false,
		filterNewCarOnlineFWS: false,
		filterBatchUpdateFWS: false,
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
		filterStatusAudited: false,		// 内部已审核
		filterStatusAuditedOut: false,  // 外部已审核
		filterStatusReturned: false, 		//已打回
		filterStatusCancled: false, // 已经取消

		timeStart: '',
		timeStartDefault: '',
		timeEnd: '',
		timeEndDefault: '',


		searchPlaceholder: '请输入服务工单描述or车辆描述or服务工单编号',

		showListItemAnimate: false,


		ok: true,

		currentParams: {
	        IS_PAGE: {
	            CURRPAGE: 1,
	            ITEMS: 10
	        },
	        IS_SEARCH: {
	            SEARCH: "",
	            OBJECT_ID: "",
	            DESCRIPTION: "",
	            PARTNER: "",
	            PRODUCT_ID: "",
	            CAR_TEXT: "",
	            CREATED_FROM: "",
	            CREATED_TO: ""
	        }
	    },
	    //请求参数相关
	    searchText: '',
	    IS_SORT: '',
	    T_IN_IMPACT: {item:[]},
	    T_IN_PARTNER: {},
	    T_IN_PROCESS_TYPE: {item:[]},
	    T_IN_STAT: {item: []},
	    IS_SEARCH:{},
	    //网络请求状态相关
	    currentPage: 0,
	    isLoading: false,
	    isReloading: false,
	    hasMoreData: true,
	    loadingErrorMsg: null,

	    showHistoryLog: true,
	    searchInputHasText: false,

	    historyStrs: [{text:"测试1"},{text:'测试2'},{text:'测试3'}],


	    //从其他界面跳转到该界面的一些参数信息
	    isFromCustomer: false,
	    PARTNER: null,	   
	    isFromCarDetail: false,
	    carCodeFromCarDetail: null
	};
	$scope.oldFilters = null;
	function __remeberCurrentFilters(){ //打开筛选界面的时候执行
		if(!$scope.oldFilters){   //保存当前filters
			$scope.oldFilters = {
				//排序 规则
				sortedTypeNone: $scope.config.sortedTypeNone,
				sortedTypeTimeDesc: $scope.config.sortedTypeTimeDesc,
				sortedTypeTimeAes: $scope.config.sortedTypeTimeAes,
				sortedTypeCompactDesc: $scope.config.sortedTypeCompactDesc,
				//筛选 规则 ----> 工单类型
				filterLocalService: $scope.config.filterLocalService,
				filterNewCarOnline: $scope.config.filterNewCarOnline,
				filterBatchUpdate: $scope.config.filterBatchUpdate,
				filterLocalServiceFWS: $scope.config.filterLocalServiceFWS,
				filterNewCarOnlineFWS: $scope.config.filterNewCarOnlineFWS,
				filterBatchUpdateFWS: $scope.config.filterBatchUpdateFWS,
				//筛选 规则 ----> 影响：damage height middle low none
				filterImpactDamage: $scope.config.filterImpactDamage,
				filterImpactHeight: $scope.config.filterImpactHeight,
				filterImpactMiddle: $scope.config.filterImpactMiddle,
				filterImpactLow: $scope.config.filterImpactLow,
				filterImpactNone: $scope.config.filterImpactNone,
				filterImpactNoSelected: $scope.config.filterImpactNoSelected,
				//筛选 规则 ----> 状态
				filterStatusNew: $scope.config.filterStatusNew,
				filterStatusSendedWorker: $scope.config.filterStatusSendedWorker,
				filterStatusRefused: $scope.config.filterStatusRefused,
				filterStatusHandling: $scope.config.filterStatusHandling,
				filterStatusReported: $scope.config.filterStatusReported,
				filterStatusFinished: $scope.config.filterStatusFinished,
				filterStatusRevisited: $scope.config.filterStatusRevisited,
				filterStatusAudited: $scope.config.filterStatusAudited,
				filterStatusReturned: $scope.config.filterStatusReturned,
				filterStatusCancled: $scope.config.filterStatusCancled,

				timeStart: $scope.config.timeStart,
				timeEnd: $scope.config.timeEnd
			};
		}else{ //更新filters、oldFilters则保持不变
			angular.extend($scope.config, $scope.oldFilters);
		}
	};

	$scope.cancleQueryMode = function(){
		var eleContent = angular.element("#xbr-worksheet-list-content");
		eleContent.addClass("has-header");
		$scope.config.queryModeNew = false;
		if($scope.config.searchText && $scope.config.searchText!=""){
			var hasExist = false;
			for (var i = 0; i < $scope.config.historyStrs.length; i++) {
				if($scope.config.historyStrs[i].text == $scope.config.searchText){
					hasExist = true;
				}
			};
			if(!hasExist){
				$scope.config.historyStrs.push({text: $scope.config.searchText});
			}
		}
	};
	$scope.clickSearchInput = function(){
		var eleContent = angular.element("#xbr-worksheet-list-content");
		//eleContent.removeClass("has-header");
		$scope.config.queryModeNew = true;
		$scope.config.showHistoryLog = true;
	};
	$scope.selectOldSearch = function(text){
		$scope.config.searchText = text;
		$scope.config.showHistoryLog = false;
		$scope.config.searchInputHasText = true;
		$scope.reloadData();
	};
	$scope.onSearchTextChange = function($event){
		//console.log("onSearchTextChange");
		if($scope.config.searchText && $scope.config.searchText.trim()!=''){
			$scope.enterListMode();
			$scope.config.showHistoryLog = false;
			$scope.config.searchInputHasText = true;
			$scope.reloadData();
		}else{
			$scope.enterQueryMode();
			$scope.config.showHistoryLog = true;
			$scope.config.searchInputHasText = false;
		}
	};
	$scope.clearSearchText = function(){
		$scope.config.searchText = "";
		$scope.config.showHistoryLog = true;
		$scope.config.searchInputHasText = false;
		if(!$scope.config.queryModeNew){
			$scope.reloadData();
		}		
	};
	
	//依据所选 筛选条件 进行筛选操作
	$scope.filterConfirm = function(){
		delete $scope.oldFilters;
		$scope.oldFilters = null;
		__clearResponseDatasForReloading();

		//工单类型：   filterNewCarOnline: ZNCO 新车档案收集工单    filterLocalService:ZPRO 现场维修工单    filterBatchUpdate:ZPLO 批量改进工单
		//			  filterNewCarOnlineFWS: ZNCV                filterLocalServiceFWS: ZPRV		   filterBatchUpdateFWS: ZPLV
		$scope.config.T_IN_PROCESS_TYPE.item = [];
			if($scope.config.filterNewCarOnline){
				$scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX":"ZNCO"});
			}
			if($scope.config.filterLocalService){
				$scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX":"ZPRO"});
			}
			if($scope.config.filterBatchUpdate){
				$scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX":"ZPLO"});
			}
			if($scope.config.filterNewCarOnlineFWS){     
				$scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX":"ZNCV"});
			}
			if($scope.config.filterLocalServiceFWS){
				$scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX":"ZPRV"});
			}
			if($scope.config.filterBatchUpdateFWS){
				$scope.config.T_IN_PROCESS_TYPE.item.push({"PROCESS_TYPE_IX":"ZPLV"});
			}
		//影响  filterImpactDamage:01 灾难 ;    filterImpactHeight:25 高     filterImpactMiddle:50 中
		//			filterImpactLow:75 低	filterImpactNone: 99 无
		$scope.config.T_IN_IMPACT.item = [];
			if($scope.config.filterImpactDamage){
				$scope.config.T_IN_IMPACT.item.push({"ZZIMPACT":"01"});
			}
			if($scope.config.filterImpactHeight){
				$scope.config.T_IN_IMPACT.item.push({"ZZIMPACT":"25"});
			}
			if($scope.config.filterImpactMiddle){
				$scope.config.T_IN_IMPACT.item.push({"ZZIMPACT":"50"});
			}
			if($scope.config.filterImpactLow){
				$scope.config.T_IN_IMPACT.item.push({"ZZIMPACT":"75"});
			}
			if($scope.config.filterImpactNone){
				$scope.config.T_IN_IMPACT.item.push({"ZZIMPACT":"99"});
			}
		//筛选 规则 ----> 状态: 
		//			filterStatusNew: E0001 新建;    filterStatusSendedWorker:E0002 已派工;
		//			filterStatusRefused: E0003 已拒绝;    filterStatusHandling:E0004 处理中
		//			filterStatusReported:E0005 已报工;	 filterStatusFinished:E0006 已完工
		//			filterStatusRevisited: E0010 已回访;   filterStatusAudited:E0007 已审核
		//			filterStatusReturned:E0008 已打回;		filterStatusCancled:E0009 已取消
		
		if($scope.config.timeStart && $scope.config.timeStart!= ""){
			$scope.config.IS_SEARCH.CREATED_FROM = $scope.config.timeStart;
		}
		if($scope.config.timeEnd && $scope.config.timeEnd!= ""){
			$scope.config.IS_SEARCH.CREATED_TO = $scope.config.timeEnd;
		}

		$scope.config.T_IN_STAT.item = [];
			if($scope.config.filterStatusNew){ // E0001
				$scope.config.T_IN_STAT.item.push({"STAT": "NEW"});
			}
			if($scope.config.filterStatusSendedWorker){ // E0002 
				$scope.config.T_IN_STAT.item.push({"STAT":"DIST"});
			}
			if($scope.config.filterStatusRefused){  // E0003
				$scope.config.T_IN_STAT.item.push({"STAT":"REJC"});
			}
			if($scope.config.filterStatusHandling){  // E0004 
				$scope.config.T_IN_STAT.item.push({"STAT":"INPR"});
			}
			if($scope.config.filterStatusReported){ //报工 E0005
				$scope.config.T_IN_STAT.item.push({"STAT":"COMP"});
			}
			if($scope.config.filterStatusFinished){//E0006
				$scope.config.T_IN_STAT.item.push({"STAT":"FINI"});
			}
			if($scope.config.filterStatusRevisited){ //E0010 回访     E0011 外服已经审核
				$scope.config.T_IN_STAT.item.push({"STAT":"SUVY"});
			}
			if($scope.config.filterStatusAudited){ //E0007  内部已审核
				$scope.config.T_IN_STAT.item.push({"STAT":"CHEC"});
			}
			if($scope.config.filterStatusAuditedOut){ //E0010
				$scope.config.T_IN_STAT.item.push({"STAT":"ECHK"}); ///////外部已审核
			}
			if($scope.config.filterStatusReturned){  //E0008 已打回
				$scope.config.T_IN_STAT.item.push({"STAT":"REJT"});
			}
			if($scope.config.filterStatusCancled){ //E0009
				$scope.config.T_IN_STAT.item.push({"STAT":"CANC"});
			}
		
		$scope.enterListMode();
		$scope.reloadData();		
	};
	function __getStatusNewIdForQuery(statusId){
		var newStatusId = "";
		switch(statusId){
			case "E0001": 	 //NEW
				newStatusId = "NEW";
				break;
			case "E0002":
				newStatusId = "DIST";
				break;
			case "E0003":
				newStatusId = "REJC";
				break;
			case "E0004": 	 //INPR
				newStatusId = "INPR";  
				break;
			case "E0005":
				newStatusId = "COMP";
				break;
			case "E0006":    //FINI
				newStatusId = "FINI";
				break;
			case "E0007":    //CHEC
				newStatusId = "CHEC";
				break; 
			case "E0008":    //REJT
 				newStatusId = "REJT";
				break;
			case "E0009":    //CANC
				newStatusId = "CANC";
				break;
			case "E0010":    //ECHK *************
				newStatusId = "SUVY";
				break;
			case "E0011":     //已回访，仅服务商
				newStatusId = "SUVY";
				break;
		}
		return newStatusId;
	};
	//重置筛选条件
	$scope.resetFilters = function(){
		//筛选 规则 ----> 工单类型
		$scope.config.filterLocalService = false;
		$scope.config.filterNewCarOnline = false;
		$scope.config.filterBatchUpdate = false;
		$scope.config.filterLocalServiceFWS = false;
		$scope.config.filterNewCarOnlineFWS = false;
		$scope.config.filterBatchUpdateFWS = false;
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
		//筛选 日期
		$scope.config.timeStart = $scope.config.timeStartDefault;
		$scope.config.timeEnd = $scope.config.timeEndDefault;
		//
		__remeberCurrentFilters();

	};
	
	$scope.goDetailState = function(item, i){
		//工单类型：   filterNewCarOnline: ZNCO 新车档案收集工单    filterLocalService:ZPRO 现场维修工单    filterBatchUpdate:ZPLO 批量改进工单
		//			  filterNewCarOnlineFWS: ZNCV                filterLocalServiceFWS: ZPRV		   filterBatchUpdateFWS: ZPLV
		worksheetDataService.worksheetList.toDetail = {
			"IS_OBJECT_ID": item.OBJECT_ID,
    		"IS_PROCESS_TYPE": item.PROCESS_TYPE,
    		"ydWorksheetNum": item.SOLDTO_NAME,
    		'ydStatusNum': item.STAT
		};
		if(item.PROCESS_TYPE == "ZNCO" || item.PROCESS_TYPE == "ZNCV"){
			$state.go("worksheetDetail", {
				detailType: 'newCar'
			});
		}else if(item.PROCESS_TYPE == "ZPRO" || item.PROCESS_TYPE == "ZPRV"){
			$state.go("worksheetDetail",{
				detailType: 'siteRepair'
			});
		}else if(item.PROCESS_TYPE == "ZPLO" || item.PROCESS_TYPE == "ZPLV"){
			$state.go("worksheetDetail",{
				detailType: 'batchUpdate'
			});
		}
	};

	

	$scope.showXbrModel = function(){
		return $scope.config.isFilterMode || $scope.config.isSorteMode;
	};

	function __clearResponseDatasForReloading(){
		delete $scope.datas.serviceListDatas;
		$scope.datas.serviceListDatas = [];
		$scope.config.isLoading = true;
		$scope.config.isReloading = true;
	}
	$scope.datas = {
		serviceListDatas: [

		],
		testDates: [
			{
				"CAR_NO": "0000000000000000000000000000112016020201",
				"CAR_TEXT": "贵GU1229*15H647M-0001*112016020201",
				"CHANGED_AT": 20160408052245,
				"DESCRIPTION": 123456,
				"IMPACT_T": "",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5200000297,
				"PROCESS_TYPE": "ZPRO",
				"PROCESS_TYPE_T": "现场维修工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0001",
				"STAT_T": "新建",
				"ZZIMPACT": "00"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160409051909,
				"DESCRIPTION": "现场维修工单测试",
				"IMPACT_T": "灾难",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5200000253,
				"PROCESS_TYPE": "ZPRO",
				"PROCESS_TYPE_T": "现场维修工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0001",
				"STAT_T": "新建",
				"ZZIMPACT": "01"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160409070615,
				"DESCRIPTION": "现场维修工单服详情测试0409",
				"IMPACT_T": "高",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5200000316,
				"PROCESS_TYPE": "ZPRV",
				"PROCESS_TYPE_T": "现场维修工单（服务商）",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0010",
				"STAT_T": "已回访",
				"ZZIMPACT": 25
			},
			{
				"CAR_NO": "14190-0024",
				"CAR_TEXT": "φ30.0热缩套管-红色",
				"CHANGED_AT": 20160409032723,
				"DESCRIPTION": "新车上线工单详情测试0409",
				"IMPACT_T": "",
				"NAME1": 123,
				"OBJECT_ID": 5100000188,
				"PROCESS_TYPE": "ZNCO",
				"PROCESS_TYPE_T": "新车档案收集工单",
				"SOLDTO_NAME": "0000100409",
				"STAT": "E0001",
				"STAT_T": "新建",
				"ZZIMPACT": "00"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160409051335,
				"DESCRIPTION": "现场维修工单详情测试0409",
				"IMPACT_T": "灾难",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5200000315,
				"PROCESS_TYPE": "ZPRO",
				"PROCESS_TYPE_T": "现场维修工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0001",
				"STAT_T": "新建",
				"ZZIMPACT": "01"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160409060013,
				"DESCRIPTION": "批量改进工单服详情测试0409",
				"IMPACT_T": "",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5300000224,
				"PROCESS_TYPE": "ZPLV",
				"PROCESS_TYPE_T": "批量改进工单（服务商）",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0001",
				"STAT_T": "新建",
				"ZZIMPACT": "00"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160409053028,
				"DESCRIPTION": "批量改进工单详情测试0409",
				"IMPACT_T": "",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5300000223,
				"PROCESS_TYPE": "ZPLO",
				"PROCESS_TYPE_T": "批量改进工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0001",
				"STAT_T": "新建",
				"ZZIMPACT": "00"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160409065854,
				"DESCRIPTION": "批量改进工单更改测试0409",
				"IMPACT_T": "",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5300000225,
				"PROCESS_TYPE": "ZPLO",
				"PROCESS_TYPE_T": "批量改进工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0009",
				"STAT_T": "已取消",
				"ZZIMPACT": "00"
			},
			{
				"CAR_NO": "0000000000000000000000000000002016032404",
				"CAR_TEXT": "车牌*车工号*2016032404",
				"CHANGED_AT": 20160409070354,
				"DESCRIPTION": "现场维修工单",
				"IMPACT_T": "灾难",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5200000317,
				"PROCESS_TYPE": "ZPRO",
				"PROCESS_TYPE_T": "现场维修工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0004",
				"STAT_T": "正在处理",
				"ZZIMPACT": "01"
			},
			{
				"CAR_NO": "0000000000000000000000000000114442300070",
				"CAR_TEXT": "京AS9116*14H581P-0041*114442300070",
				"CHANGED_AT": 20160408062023,
				"DESCRIPTION": "Text 01 后续工单",
				"IMPACT_T": "中",
				"NAME1": "武夷山市公交巴士旅游有限公司2",
				"OBJECT_ID": 5200000302,
				"PROCESS_TYPE": "ZPRO",
				"PROCESS_TYPE_T": "现场维修工单",
				"SOLDTO_NAME": "0000100137",
				"STAT": "E0002",
				"STAT_T": "已派工",
				"ZZIMPACT": 50
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
		__remeberCurrentFilters(); //打开筛选界面的时候，先保存一份数据
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
		__clearResponseDatasForReloading();
		$scope.config.sortedTypeNone = false;
		$scope.config.sortedTypeCompactDesc = false;
		$scope.config.sortedTypeTimeAes = false;
		$scope.config.sortedTypeTimeDesc = true;
		$scope.enterListMode();
		$scope.reloadData();
	};
	$scope.sorteTimeAes = function(){
		__clearResponseDatasForReloading();
		$scope.config.sortedTypeNone = false;
		$scope.config.sortedTypeCompactDesc = false;
		$scope.config.sortedTypeTimeAes = true;
		$scope.config.sortedTypeTimeDesc = false;
		$scope.enterListMode();
		$scope.reloadData();
	};
	$scope.sorteNone = function(){
		__clearResponseDatasForReloading();
		$scope.config.sortedTypeNone = true;
		$scope.config.sortedTypeCompactDesc = false;
		$scope.config.sortedTypeTimeAes = false;
		$scope.config.sortedTypeTimeDesc = false;
		$scope.enterListMode();
		$scope.reloadData();
	};
	$scope.sorteCompactDesc = function(){
		__clearResponseDatasForReloading();
		$scope.config.sortedTypeNone = false;
		$scope.config.sortedTypeCompactDesc = true;
		$scope.config.sortedTypeTimeAes = false;
		$scope.config.sortedTypeTimeDesc = false;
		$scope.enterListMode();
		$scope.reloadData();
	};
	
	$scope.selectFilterType = function(filterName){ // localService、batchUpdate、newcarOnline
		if(filterName == 'localService'){
			$scope.config.filterLocalService = !$scope.config.filterLocalService;
		}else if(filterName == 'batchUpdate'){
			$scope.config.filterBatchUpdate = !$scope.config.filterBatchUpdate;
		}else if(filterName == 'newcarOnline'){
			$scope.config.filterNewCarOnline = !$scope.config.filterNewCarOnline;
		}if(filterName == 'localServiceFWS'){
			$scope.config.filterLocalServiceFWS = !$scope.config.filterLocalServiceFWS;
		}else if(filterName == 'batchUpdateFWS'){
			$scope.config.filterBatchUpdateFWS = !$scope.config.filterBatchUpdateFWS;
		}else if(filterName == 'newcarOnlineFWS'){
			$scope.config.filterNewCarOnlineFWS = !$scope.config.filterNewCarOnlineFWS;
		}else{
			$scope.config.filterNone = !$scope.config.filterNone;
		}
	};

	$scope.selectFilterImpact = function(impactName){   // damage height middle low none	
		if(impactName == 'damage'){
			$scope.config.filterImpactDamage = !$scope.config.filterImpactDamage;
		}else if(impactName == 'height'){
			$scope.config.filterImpactHeight = !$scope.config.filterImpactHeight;
		}else if(impactName == 'middle'){
			$scope.config.filterImpactMiddle = !$scope.config.filterImpactMiddle;
		}else if(impactName == 'low'){
			$scope.config.filterImpactLow = !$scope.config.filterImpactLow;
		}else if(impactName == 'none'){
			$scope.config.filterImpactNone = !$scope.config.filterImpactNone;
		}
	};
	
	$scope.selectFilterStatus = function(statusName){
		//__resetStatus();
		$scope.config[statusName] = !$scope.config[statusName];
	}
	function __resetStatus(){
		var status = ['filterStatusNew','filterStatusSendedWorker',
		'filterStatusRefused', 'filterStatusHandling',
		'filterStatusReported', 'filterStatusFinished', 'filterStatusRevisited',
		'filterStatusAudited', 'filterStatusReturned', 'filterStatusCancled','filterStatusAuditedOut'];
		for(var i = 0; i < status.length; i++){
			$scope.config[status[i]] = false;
		}
	}
	///////////////////////////////////////////// 接口相关 ///////////////////////////////////////////////////
	$scope.canReLoadData  = function(){
		return true;
	};

	$scope.reloadData = function(){
		$ionicScrollDelegate.$getByHandle().scrollTop(true);
		delete $scope.datas.serviceListDatas;
		$scope.datas.serviceListDatas = [];
		if(!$scope.$$phase) {
        	$scope.$apply();
        }
		if($scope.canReLoadData()){
			$scope.config.currentPage = 0;
			$scope.config.hasMoreData = true;
			$scope.config.isReloading = true;
			$scope.loadMoreDatas();
		}else{
			$scope.$broadcast('scroll.refreshComplete');
		}
	};

	$scope.loadMoreDatas = function(){
		// 默认:1 代表开始时间倒序:desc 	 2 是开始时间顺序:aes 	 3 是影响由高到低:
		var sortedInt = $scope.config.sortedTypeTimeAes ? "2" : (
				$scope.config.sortedTypeTimeDesc ? "1" : (
						$scope.config.sortedTypeCompactDesc ? "3" : "1" 
					)
			);
		

		var queryParams = {
			IS_PAGE: {CURRPAGE: ++$scope.config.currentPage, ITEMS: 10},
			IS_SEARCH:{ SEARCH: $scope.config.searchText },
			//IS_SORT: sortedInt,
			IV_SORT: sortedInt,
			//T_IN_IMPACT: $scope.config.T_IN_IMPACT,
			IT_IMPACT: $scope.config.T_IN_IMPACT,
			//T_IN_PROCESS_TYPE: $scope.config.T_IN_PROCESS_TYPE,
			IT_PROCESS_TYPE: $scope.config.T_IN_PROCESS_TYPE,
			//T_IN_STAT: $scope.config.T_IN_STAT
			IT_STAT: $scope.config.T_IN_STAT
		};
		/*if($scope.config.IS_SEARCH.CREATED_FROM && $scope.config.IS_SEARCH.CREATED_FROM!=""){
			queryParams.IS_SEARCH.CREATED_FROM = $scope.config.IS_SEARCH.CREATED_FROM;
		}*/
		if($scope.config.timeStart && $scope.config.timeStart!=""){
			queryParams.IS_SEARCH.CREATED_FROM = $scope.config.timeStart;
		}
		if($scope.config.timeEnd && $scope.config.timeEnd!=""){
			queryParams.IS_SEARCH.CREATED_TO = $scope.config.timeEnd;
		}

		if($scope.config.PARTNER){
			queryParams.IS_SEARCH.PARTNER = $scope.config.PARTNER;
		}
		if($scope.config.isFromCarDetail){
			queryParams.IS_SEARCH.PRODUCT_ID = $scope.config.carCodeFromCarDetail;
		}

		

		//console.log(queryParams);
		if($scope.config.hasMoreData){
			__requestServiceList(queryParams);
		}
	};

	$scope.init = function(){
		
		// = $scope.config.timeStart    = $scope.config.timeEnd
		//$scope.config.timeStartDefault  = new Date(new Date().getTime() - 7 * 24 * 3600 * 1000).format("yyyy-MM-dd");
		//$scope.config.timeEndDefault  = new Date().format("yyyy-MM-dd");

		$timeout(function () {
                ionicMaterialInk.displayEffect();
            }, 100);
		$scope.enterListMode();


		$timeout(function (){
			$scope.config.showListItemAnimate = true;
		}, 150);
		//__requestServiceList({IS_PAGE:{CURRPAGE: ++$scope.config.currentPage, ITEMS: 10}});
		
		// 从客户界面进入
		var temp = customeService.get_customerWorkordervalue();
		if(temp && temp.PARTNER){
			$scope.config.PARTNER = temp.PARTNER;
			$scope.config.isFromCustomer = true;
			$scope.config.titleText="客户历史工单列表";
		}
		customeService.set_customerWorkordervalue(null);
		// 从车辆详情界面进入
		var code = CarService.getData();
		if(code != null && code != ""){
			$scope.config.carCodeFromCarDetail = code;
			$scope.config.isFromCarDetail = true;
			$scope.config.titleText="维修记录";
		}
		CarService.setData(null);


		$scope.reloadData();
		/*$ionicPopup.alert({
			title: '你好',
			template: '你好不'
		});*/
		//justTest();
	};
	$scope.init();

	function justTest(){
		var header = document.getElementById("xbr-test-header");
		var headerJQ = angular.element(header);
		var obj1 = headerJQ.offset();
		var obj2 = headerJQ.position();

		var v1 = header.offsetHeight;
		alert(document.body.attributes['class'].value);
		alert(JSON.stringify(obj1)+"     "+JSON.stringify(obj2)+"     "+v1);
	}
	
	// {"ES_RESULT":{"ZFLAG":"E","ZRESULT":"无符合条件数据"},"T_OUT_LIST":""}
	function __requestServiceList(options){
        var postData = angular.copy(worksheetHttpService.serviceList.defaults);
        angular.extend(postData, options);
        //console.log(JSON.stringify(postData));
        var promise = HttpAppService.post(worksheetHttpService.serviceList.url,postData);
        $scope.config.isLoading = true;
        $scope.config.loadingErrorMsg = null;
        promise.success(function(response){
        	$scope.config.isLoading = false;
        	if($scope.config.isReloading){
        		$scope.config.isReloading = false;
        		$scope.$broadcast('scroll.refreshComplete');
        		$scope.datas.serviceListDatas = [];
        	}
        	if(response.ES_RESULT.ZFLAG == "E"){ // 未加载到数据
        		$scope.config.hasMoreData = false;
        		$cordovaToast.showShortBottom("无更多数据!");
        		return;
        	}
        	if(!$scope.datas.serviceListDatas){
        		$scope.datas.serviceListDatas = [];
        	}
        	if(response.ET_OUT_LIST){
        		response.T_OUT_LIST = angular.copy(response.ET_OUT_LIST);
        	}
        	if(response.T_OUT_LIST.item && response.T_OUT_LIST.item.length){
        		$scope.datas.serviceListDatas = $scope.datas.serviceListDatas.concat(response.T_OUT_LIST.item);
	        	if(response.T_OUT_LIST.item.length < 10){
	        		$scope.config.hasMoreData = false;
	        	}
        	}        	
        })
        .error(function(errorResponse){
        	$scope.config.isLoading = false;
        	if($scope.config.isReloading){
        		$scope.config.isReloading = false;
        		$scope.$broadcast('scroll.refreshComplete');
        		$scope.datas.serviceListDatas = [];
        		$scope.config.hasMoreData = false;
        	}
        	$scope.config.loadingErrorMsg = "数据加载失败,请检查网络!";
        });
	}

	
	//选择时间		timeType: datetime  、date
    $scope.selectCreateTimeOld = function (type, title, timeType) { // type: start、end
        var date;	
        if(type == 'start'){
            date = new Date($scope.config.timeStart.replace(/-/g, "/")).format('yyyy/MM/dd');
        }else if(type=='end'){
            date = new Date($scope.config.timeEnd.replace(/-/g, "/")).format('yyyy/MM/dd');
        }
        //alert(date);
        $cordovaDatePicker.show({
                date: date,
                mode: timeType,
                titleText: title,
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn'
            }).then(function (returnDate) {
                var time = returnDate.format("yyyy-MM-dd");
                //alert(time);
                switch (type) {
                    case 'start':
                        $scope.config.timeStart = time;
                        break;
                    case 'end':
                        $scope.config.timeEnd = time;
                        break;
                }
                if(!$scope.$scope.$$phase){
                	$scope.$apply();
                }
            });
    };
    //选择时间
    $scope.selectCreateTime = function (type, title) { // type: start、end
        if(ionic.Platform.isAndroid()){
            __selectCreateTimeAndroid(type, title);
        }else{
            __selectCreateTimeIOS(type,title);
        }
    };
    function __selectCreateTimeIOS(type, title){
        var date;
        if(type == 'start'){
        	if(!$scope.config.timeStart || $scope.config.timeStart==""){
        		date =  new Date().format('yyyy/MM/dd hh:mm:ss');
        	}else{
        		date =  new Date($scope.config.timeStart.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
        	}
            //date =  new Date($scope.config.timeStart.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
        }else if(type=='end'){
        	if(!$scope.config.timeEnd || $scope.config.timeEnd==""){
        		date = new Date().format('yyyy/MM/dd hh:mm:ss');
        	}else{
        		date = new Date($scope.config.timeEnd.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
        	}
        }
        __selectCreateTimeBasic(type, title, date);
    }
    function __selectCreateTimeAndroid(type, title){
    	var date;
        if(type == 'start'){
        	if(!$scope.config.timeStart || $scope.config.timeStart==""){
        		date = new Date().format('MM/dd/yyyy/hh/mm/ss');
        	}else{
        		date = new Date($scope.config.timeStart.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
        	}
        }else if(type=='end'){
        	if(!$scope.config.timeEnd || $scope.config.timeEnd==""){
        		date = new Date().format('MM/dd/yyyy/hh/mm/ss');
        	}else{
        		date = new Date($scope.config.timeEnd.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
        	}
        }
        __selectCreateTimeBasic(type, title, date);
    }
    function __selectCreateTimeBasic(type, title, date){
        console.log("Android selectCreateTime:     "+date);
        console.log("Android datePicker:     "+datePicker);
        $cordovaDatePicker.show({
            date: date,
            allowOldDates: true,
            allowFutureDates: true,
            mode: 'date',
            titleText: title,
            okText: '确定',               //android
            cancelText: '取消',           //android
            doneButtonLabel: '确认',      // ios
            cancelButtonLabel: '取消',    //ios
            todayText: '今天',            //android
            nowText: '现在',              //android
            is24Hour: true,              //android
            androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
            popoverArrowDirection: 'UP',
            locale: 'zh_cn'
            //locale: 'en_us'
        }).then(function(returnDate){
        	var time = returnDate.format("yyyy-MM-dd"); //__getFormatTime(returnDate);
	        console.log("selectTimeCallback : "+time);
	        switch (type) {
	            case 'start':
	            	if(__startTimeIsValid(time, $scope.config.timeEnd)){
	            		$scope.config.timeStart = time;
	            	}else{
	            		$cordovaToast.showShortBottom("最小时间不能大于最大时间!");
	            	}
	                break;
	            case 'end':
	            	if(__endTimeIsValid($scope.config.timeStart, time)){
	            		$scope.config.timeEnd = time;
	            	}else{
	            		$cordovaToast.showShortBottom("最大时间不能小于最小时间!");
	            	}
	                break;
	        }
	        if(!$scope.$$phrese){
	            $scope.$apply();
	        }
        });
    }

    function __startTimeIsValid(startTime, endTime){
    	if(!startTime || startTime==""){
    		return false;
    	}
    	if(!endTime || endTime==""){
    		return true;
    	}
    	var startTime2 = new Date(startTime.replace("-","/").replace("-","/")).getTime();
        var endTime2 = new Date(endTime.replace("-","/").replace("-","/")).getTime();
        return startTime2 <= endTime2;
    }
    function __endTimeIsValid(startTime, endTime){	
    	if(!endTime || endTime==""){
    		return false;
    	}
    	if(!startTime || startTime==""){
    		return true;
    	}
    	var startTime = new Date(startTime.replace("-","/").replace("-","/")).getTime();
        var endTime = new Date(endTime.replace("-","/").replace("-","/")).getTime();
        return startTime <= endTime;
    }



    function __getFormatTime(date) {
        var dateTemp, minutes, hour, time;
        dateTemp = date.format("yyyy-MM-dd");
        /*//分钟
        if (date.getMinutes().toString().length < 2) {
            minutes = "0" + date.getMinutes();
        } else {
            minutes = date.getMinutes();
        };
        //小时
        if (date.getHours().toString().length < 2) {
            hour = "0" + date.getHours();
            time = hour + ":" + minutes;
        } else {
            hour = date.getHours();
            time = hour + ":" + minutes;
        };*/
        return dateTemp;
    };



}]);

















worksheetModule.controller("WorksheetDetailCtrl",[
	"$scope", 
	"ionicMaterialInk",
	"$ionicScrollDelegate",
	"$timeout",
	"worksheetDataService",
	function($scope, ionicMaterialInk, $ionicScrollDelegate, $timeout, worksheetDataService){

	$scope.config = {
		scrollDelegateHandler: null,
		contentDetegateHandler: null,

		headerScrollStart: false, //header未收缩
		headerScrolling: false,
		headerScrollEnd: false,		//header已经收缩至最小状态
		headerScrollCan: true,
		headerBarInitHeight: null,
		headerInfoInitHeight: null,
		headerBarTitleInitHeight: null,

		// 网络请求相关
		requestParams: null
		/*{
			"IS_OBJECT_ID": "5200000297"
          "IS_PROCESS_TYPE": "ZPRO"
		}*/
	};

	$scope.datas = {
		header:{
			title: '车辆出现重大问题，需要维修',
			company: '郑州金龙客车股份有限公司福州分公司',
			customer: '张三',
			place: '福建省 福州市',
			category: '关系维护',
			status: '处理中'
		},
		temp: [
			{title: '标题---1', content: '内容--------1'},
			{title: '标题---2', content: '内容--------2'},
			{title: '标题---3', content: '内容--------3'},
			{title: '标题---4', content: '内容--------4'},
			{title: '标题---5', content: '内容--------5'},
			{title: '标题---6', content: '内容--------6'},
			{title: '标题---7', content: '内容--------7'},
			{title: '标题---8', content: '内容--------8'},
			{title: '标题---9', content: '内容--------9'},
			{title: '标题---10', content: '内容--------10'},
			{title: '标题---11', content: '内容--------11'},
		]
	};

	$scope.onContentScroll = function($event){
		var position = contentDetegateHandler.getScrollPosition();
		var top = position.top;
	};

	$scope.onContentScroll2 = function($event){
		var position = scrollDelegateHandler.getScrollPosition();
		var top = position.top;
		var directionDown = top < 0 ? true : false;
		var topOffset = top < 0 ? -top : top;
		var viewEle = document.getElementById('worksheetdetail-view');
		viewEleJQ = angular.element(viewEle);
		var eleHeaderBar = document.getElementsByClassName("detail-header")[0];
		var eles = viewEle.getElementsByClassName('detail-header-info');
		var ele = eles && eles.length > 0 ? eles[0] : null;
		if(ele == null){return;}
		if($scope.config.headerInfoInitHeight == null){
			$scope.config.headerInfoInitHeight = ele.offsetHeight;
		}
		if($scope.config.headerBarInitHeight == null){
			$scope.config.headerBarInitHeight = eleHeaderBar.offsetHeight;
		}

		// 计算此次滚动 background-size 的高度
		var imageHeight = $scope.config.headerBarInitHeight;
		imageHeight -= top/2;
		// 计算 此次滚动 header-bar 最终的高度
		var finalHeight = ($scope.config.headerBarInitHeight - top);

		if(!directionDown){ //上拉事件
			finalHeight = Math.max(finalHeight, ($scope.config.headerBarInitHeight-$scope.config.headerInfoInitHeight));
			imageHeight = Math.max(imageHeight, ($scope.config.headerBarInitHeight-$scope.config.headerInfoInitHeight)+($scope.config.headerInfoInitHeight/2));
		}else{  //下拉事件
			finalHeight = Math.min(finalHeight, $scope.config.headerBarInitHeight);
			imageHeight = Math.min(imageHeight, $scope.config.headerBarInitHeight);
		}

		
		ele.style.top = "-"+top+"px";
		eleHeaderBar.style.backgroundSize = "100% "+imageHeight+"px";
		eleHeaderBar.style.height = finalHeight+"px";
		console.log(eleHeaderBar.offsetHeight+"px");
	};

	$scope.freezeContentScroll = function(freeze, time){		
		$timeout(function(){
			$scope.config.contentDetegateHandler.freezeScroll(freeze);
		},time);	
	};
	$scope.freezeBottomScroll = function(freeze, time){
		$timeout(function(){
			$scope.config.scrollDelegateHandler.freezeScroll(freeze);
		},time);		
	};

	$scope.init = function(){
		ionicMaterialInk.displayEffect();
		$scope.config.scrollDelegateHandler = $ionicScrollDelegate.$getByHandle('xbrDelegateScroll');
		$scope.config.contentDetegateHandler = $ionicScrollDelegate.$getByHandle('xbrDelegateContent');
		
		//initSwipeEvent();

		$scope.config.requestParams = worksheetDataService.worksheetList.toDetail;

		__requestDetailDatas();
	};
	$scope.init();



	function initSwipeEvent() {
        var viewEle = document.getElementById('worksheetdetail-view');
        var eleHeaderBar = viewEle.getElementsByClassName("detail-header")[0];
        var eleHeaderInfo = viewEle.getElementsByClassName('detail-header-info')[0];
        var eleHeaderSubTitle = viewEle.getElementsByClassName("sub-title")[0];
        eleHeaderSubTitle.style.display = "block";

        if ($scope.config.headerInfoInitHeight == null) {
            $scope.config.headerInfoInitHeight = eleHeaderInfo.offsetHeight;
        }
        if ($scope.config.headerBarInitHeight == null) {
            $scope.config.headerBarInitHeight = eleHeaderBar.offsetHeight;
        }
        if ($scope.config.headerBarTitleInitHeight == null) {
            $scope.config.headerBarTitleInitHeight = $scope.config.headerBarInitHeight - $scope.config.headerInfoInitHeight;
        }

        // 给 view 添加 touch 相关事件
        if ('ontouchstart' in window) {
            viewEle.addEventListener("touchstart", __touchStart, false);
            viewEle.addEventListener("touchmove", __touchMove, false);
            viewEle.addEventListener("touchend", __touchEnd, false);
            viewEle.addEventListener("touchcancel", __touchEnd, false);
        } else if (window.navigator.pointerEnabled) {
            // Pointer Events
            viewEle.addEventListener("pointerdown", __touchStart, false);
            viewEle.addEventListener("pointermove", __touchMove, false);
            viewEle.addEventListener("pointerup", __touchEnd, false);
            viewEle.addEventListener("pointercancel", __touchEnd, false);
        } else if (window.navigator.msPointerEnabled) {
            // IE10, WP8 (Pointer Events)
            viewEle.addEventListener("MSPointerDown", __touchStart, false);
            viewEle.addEventListener("MSPointerMove", __touchMove, false);
            viewEle.addEventListener("MSPointerUp", __touchEnd, false);
            viewEle.addEventListener("MSPointerCancel", __touchEnd, false);
        } else {
            // Mouse Events
            viewEle.addEventListener("mousedown", __touchStart, false);
            viewEle.addEventListener("mousemove", __touchMove, false);
            viewEle.addEventListener("mouseup", __touchEnd, false);
        }
        ;

        //var startSingleTouch = false;
        var posTouchStart = null;
        var posLastMove = null;
        var posCurrentMove = null;
        var headerBarInfoTopLast = 0;
        var touchStartPointValid = false;

        function __touchStart(event) {
            var e = posTouchStart = __getSingleEventTouches(event);
            if (e == null) {
                return;
            }
            //startSingleTouch = true;
            //$scope.config.headerScrollStart = true;
            touchStartPointValid = true;
        }

        function __touchMove(event) {
            if (!touchStartPointValid) {
                return;
            }
            var e = __getSingleEventTouches(event);
            if (e == null) {
                return;
            }
            if ($scope.config.scrollDelegateHandler.getScrollPosition().top < 5) {
                $scope.config.headerScrollCan = true;
                //posTouchStart = e;
            }
            if (!$scope.config.headerScrollCan) {
                posLastMove = null;
                return;
            }
            ;
        }
    }
    }]);
			
			//console.log(e.x+"    "+e.y);