signinModule.controller('signinListCtrl', [
	'$scope',
	"$timeout",
	"signinService",
	function ($scope, $timeout, signinService) {
	
	$scope.config = {

		//搜索相关
		historysLocalStorageKey: 'signinListQueryHistory',
		searchText: '',
		searchPlaceholder: '请输入关键字',
		searchInputHasText: false,
		showHistoryLog: false,
		historyStrs: [], 

		//http相关
		isReloading: false,
		isLoading: false,

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
		//筛选 规则
		timeStart: '',
		timeStartDefault: '',
		timeEnd: '',
		timeEndDefault: '',


		queryResultScrollDelegate: null

	};

	$scope.datas = {
		signinListDatas: null
	};

	$scope.init = function(){
		$scope.oldFilters = null;
		__initQueryHistory();
	};
	$scope.init();

	function __initQueryHistory(){
		var historys = signinService.getStoredByKey($scope.config.historysLocalStorageKey);
		if(historys){
			$scope.config.historyStrs = JSON.parse(historys);
		}else{
			$scope.config.historyStrs = [];
		}
	}

	//打开筛选界面的时候执行:保存或更新filters
	function __remeberCurrentFilters(){ 
		if(!$scope.oldFilters){   //保存当前filters
			$scope.oldFilters = {
				//排序 规则
				sortedTypeNone: $scope.config.sortedTypeNone,
				sortedTypeTimeDesc: $scope.config.sortedTypeTimeDesc,
				sortedTypeTimeAes: $scope.config.sortedTypeTimeAes
			};
		}else{ //更新filters、oldFilters则保持不变
			angular.extend($scope.config, $scope.oldFilters);
		}
	};
	//依据所选 筛选条件 进行筛选操作
	$scope.filterConfirm = function(){
		delete $scope.oldFilters;
		$scope.oldFilters = null;
		__clearResponseDatasForReloading();

		if($scope.config.timeStart && $scope.config.timeStart!= ""){
			$scope.config.IS_SEARCH.CREATED_FROM = $scope.config.timeStart;
		}
		if($scope.config.timeEnd && $scope.config.timeEnd!= ""){
			$scope.config.IS_SEARCH.CREATED_TO = $scope.config.timeEnd;
		}
		
		$scope.enterListMode();
		$scope.reloadData();		
	};

	$scope.reloadData = function(){
		console.log("==========   reloadData   ==============");
	};

	$scope.selectOldSearch = function(text){
		$scope.config.searchText = text;
		$scope.config.showHistoryLog = false;
		$scope.config.searchInputHasText = true;
		$scope.reloadData();
	};
	$scope.clearSearchHistorys = function(){
		signinService.setStored($scope.config.historysLocalStorageKey, "[]");
		$scope.config.historyStrs = [];
	};
	$scope.deleteThisSearchHistory = function(item){
		for(var i = 0; i < $scope.config.historyStrs.length; i++){
			if(item.text == $scope.config.historyStrs[i].text){
				if(i == $scope.config.historyStrs.length-1){
					$scope.config.historyStrs.pop();
				}else{
					$scope.config.historyStrs = $scope.config.historyStrs.slice(0, i).concat($scope.config.historyStrs.slice(i+1));
				}
				signinService.setStored($scope.config.historysLocalStorageKey, JSON.stringify($scope.config.historyStrs));
				return;
			}
		}
	};
	function __addHistoryStr(str){
		if(!str || str == ""){ return; }
		var hasExist = false;
		for (var i = 0; i < $scope.config.historyStrs.length; i++) {
			if($scope.config.historyStrs[i].text == $scope.config.searchText){
				hasExist = true;
			}
		};
		if(!hasExist){
			$scope.config.historyStrs.push({text: $scope.config.searchText});
			signinService.setStored($scope.config.historysLocalStorageKey, JSON.stringify($scope.config.historyStrs));
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

	function __clearResponseDatasForReloading(){
		delete $scope.datas.signinListDatas;
		$scope.datas.signinListDatas = [];
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

	
	$scope.searchInputOnKeyup = function(e){
		var keycode = window.event ? e.keyCode : e.which;
		//alert(keycode);
        if(keycode==13){
        	$scope.enterListMode();
			$scope.config.showHistoryLog = false;
			$scope.config.searchInputHasText = true;
            $scope.reloadData();
            return true;
        }
        return false;
	};

	$scope.clickSearchInput = function(){
		$scope.config.queryModeNew = true;
		$scope.config.showHistoryLog = true;
	};

	$scope.cancleQueryMode = function(){
		if($scope.config.searchText == ""){
			$scope.reloadData();
			__addHistoryStr("");
		}
		var eleContent = angular.element("#xbr-signin-list-content");
		eleContent.addClass("has-header");
		$scope.config.queryModeNew = false;
		if($scope.config.searchText && $scope.config.searchText!=""){
			__addHistoryStr($scope.config.searchText);
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
	$scope.showXbrModel = function(){
		return $scope.config.isFilterMode || $scope.config.isSorteMode;
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


}]);