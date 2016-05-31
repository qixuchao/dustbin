signinModule.controller('signinListCtrl', [
	'$scope',
	"$timeout", 
	"signinService",
	"$state",
	"$ionicScrollDelegate",
	"HttpAppService",
	"$cordovaToast",
	"ionicMaterialInk",'$cordovaDatePicker','$ionicModal',
	function ($scope, $timeout, signinService, $state, 
			$ionicScrollDelegate, HttpAppService, 
			$cordovaToast, ionicMaterialInk,$cordovaDatePicker,$ionicModal) {

	$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        if(fromState && toState && fromState.name == 'signin.detail' && toState.name == 'signin.list'){
            if(signinService.signinListNeedRefresh){
            	signinService.signinListNeedRefresh = false;
            	$scope.reloadData();
            }
        }
    });
	
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
		hasMoreData: true,
		currentPage: 0,
		selectedPerson: null, //传person_code给后台

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
		selectPe : {
			PARTNER : "",
			NAME_LAST :""
		},//人员
		queryResultScrollDelegate: null
	};
	
	$scope.datas = {
		signinListDatas: null
	};

	$scope.init = function(){
		$scope.oldFilters = null;
		$scope.config.queryResultScrollDelegate = $ionicScrollDelegate.$getByHandle("signinListScrollDelegate");
		__initQueryHistory();

		if(ionic.Platform.isIOS){
			$timeout(function () {
	            ionicMaterialInk.displayEffect();
	        }, 100);
		}
	};
	$scope.init();

	$scope.goCreateSignin = function(event){
		$state.go("signin.create");
	};

	$scope.goDetailState = function(item, $index){
		signinService.currentSigninDetail = angular.copy(item);
		$state.go("signin.detail");
	};

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

		$scope.enterListMode();
		$scope.reloadData();		
	};
	$scope.resetFilters = function(){
		delete $scope.oldFilters;
		$scope.oldFilters = null;
		$scope.config.currentCustomer = null;
		$scope.config.timeStart = "";
		$scope.config.timeEnd = "";
		$scope.config.selectPe ={
			PARTNER : "",
				NAME_LAST :""
		}
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
	
	///////////////////////////////////////////// 接口相关 ///////////////////////////////////////////////////
	$scope.canReLoadData  = function(){
		return true;
	};

	$scope.reloadData = function(){
		//$ionicScrollDelegate.$getByHandle().scrollTop(true);
		$timeout(function(){
			$scope.config.queryResultScrollDelegate.scrollTop(true);
		}, 200);
		delete $scope.datas.signinListDatas;
		$scope.datas.signinListDatas = [];
		//console.log("reloadData  ---  start");
		if(!$scope.$$phase) {
        	$scope.$apply();
        }
        //console.log("reloadData  ---  end");
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
		if(!$scope.config.hasMoreData && $scope.config.isReloading){
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
		// 默认:1 代表开始时间倒序:desc 	 2 是开始时间顺序:aes 	 3 是影响由高到低:
		// var sortedInt = $scope.config.sortedTypeTimeAes ? "2" : (
		// 		$scope.config.sortedTypeTimeDesc ? "1" : (
		// 				$scope.config.sortedTypeCompactDesc ? "3" : "" 
		// 			)
		// 	);
		var startDate = !angular.isUndefined($scope.config.timeStart) && $scope.config.timeStart!=null && $scope.config.timeStart!="" ? $scope.config.timeStart.replace(/-/g,"") : '';
		var endDate = !angular.isUndefined($scope.config.timeEnd) && $scope.config.timeEnd!=null && $scope.config.timeEnd!="" ? $scope.config.timeEnd.replace(/-/g,"") : '';

		var queryParams = {
			"person_code":$scope.config.selectPe.PARTNER,
		    "start_date": startDate,
		    "end_date": endDate,
		    "page_count": String(++$scope.config.currentPage),
		    "page_size": String(10),
		    "sys_name": signinService.getStoredByKey("sysName"),
		    "iv_sort": $scope.config.sortedTypeTimeDesc ? '1' : ($scope.config.sortedTypeTimeAes ? "2" : "")
		};
		//console.log(queryParams);
		if($scope.config.hasMoreData){
			__requestSigninList(queryParams);
		}
	};

	// {"ES_RESULT":{"ZFLAG":"E","ZRESULT":"无符合条件数据"},"T_OUT_LIST":""}
	function __requestSigninList(options){
        var url = signinService.signin_list.url;
        var promise = HttpAppService.post(url,options);
        $scope.config.isLoading = true;
        $scope.config.loadingErrorMsg = null;
        promise.success(function(response, status, obj, config){
        	// if(config.data.IS_SEARCH && config.data.IS_SEARCH.SEARCH && config.data.IS_SEARCH.SEARCH != $scope.config.searchText){
        	// 	console.log("------  不是最新的HTTP响应，直接丢弃  --------");
        	// 	return;
        	// }
        	$scope.config.isLoading = false;
        	if($scope.config.isReloading){
        		$scope.config.isReloading = false;
        		$scope.$broadcast('scroll.refreshComplete');
        		$scope.datas.signinListDatas = [];
        	}else{
        		$scope.$broadcast('scroll.infiniteScrollComplete');
        	}
        	if(response.ES_RESULT.ZFLAG == "E"){ // 未加载到数据
        		$scope.config.hasMoreData = false;
        		$cordovaToast.showShortBottom("无更多数据!");
        		return;
        	}
        	if(!$scope.datas.signinListDatas){
        		$scope.datas.signinListDatas = [];
        	}

        	if(response.ES_ATTENDANCE_LIST && response.ES_ATTENDANCE_LIST!="" && !!response.ES_ATTENDANCE_LIST.length){
        		$scope.datas.signinListDatas = $scope.datas.signinListDatas.concat(response.ES_ATTENDANCE_LIST);
	        	if(response.ES_ATTENDANCE_LIST.length < 10){
	        		$scope.config.hasMoreData = false;
	        	}
        	}else if(response.ES_ATTENDANCE_LIST.length==0){
        		$scope.config.hasMoreData = false;
        	}
        	$scope.config.queryResultScrollDelegate.resize();
        })
        .error(function(errorResponse){
        	$scope.config.isLoading = false;
        	if($scope.config.isReloading){
        		$scope.config.isReloading = false;
        		$scope.$broadcast('scroll.refreshComplete');
        		$scope.datas.signinListDatas = [];
        		$scope.config.hasMoreData = false;
        	}
        	$scope.config.loadingErrorMsg = "数据加载失败,请检查网络!";
        });
	}




	//选择时间
    $scope.selectCreateTime = function (type, title) { // type: start、end
        if(ionic.Platform.isAndroid()){
            __selectCreateTimeAndroid(type, title);
        }else{
            __selectCreateTimeIOS(type,title);
        }
    };
    function __selectCreateTimeIOS(type, title){
    	console.log("__selectCreateTimeIOS");
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
        console.log("__selectCreateTimeIOS : "+type+"    "+type+"    "+date);
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
	        if(!$scope.$$phase){
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
		$scope.goEmployee=function(){
			$scope.openSelectCon();
		}
		//选择员工

		var conPage = 1;
		$scope.conArr = [];
		$scope.conSearch = false;
		$scope.getConArr = function (search) {
			$scope.ConLoadMoreFlag = false;
			if (search) {
				$scope.conSearch = false;
				conPage = 1;
			} else {
				$scope.spinnerFlag = true;
			}
			var data = {
				"I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
				"IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
				"IS_PAGE": {
					"CURRPAGE": conPage++,
					"ITEMS": "10"
				},
				"IS_EMPLOYEE": {"NAME":search}
			};
			var startTime = new Date().getTime();
			HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST', data)
				.success(function (response) {
					if (response.ES_RESULT.ZFLAG === 'S') {
						if (response.ET_EMPLOYEE.item.length < 10) {
							$scope.ConLoadMoreFlag = false;
						}
						if (search) {
							$scope.conArr = response.ET_EMPLOYEE.item;
						} else {
							$scope.conArr = $scope.conArr.concat(response.ET_EMPLOYEE.item);
						}
						$scope.spinnerFlag = false;
						$scope.conSearch = true;
						$scope.ConLoadMoreFlag = true;
						$ionicScrollDelegate.resize();
						//$rootScope.$broadcast('scroll.infiniteScrollComplete');
					}
				}).error(function (response, status, header, config) {
					var respTime = new Date().getTime() - startTime;
					//超时之后返回的方法
					if(respTime >= config.timeout){
						if(ionic.Platform.isWebView()){
							//$cordovaDialogs.alert('请求超时');
						}
					}else{
						$cordovaDialogs.alert('访问接口失败，请检查设备网络');
					}
					$ionicLoading.hide();
				});;
		};

		$ionicModal.fromTemplateUrl('src/signin/list/selectEmployee_Modal.html', {
			scope: $scope,
			animation: 'slide-in-up',
			focusFirstInput: true
		}).then(function (modal) {
			$scope.selectContactModal = modal;
		});
		$scope.selectContactText = '员工';
		$scope.openSelectCon = function () {
			$scope.isDropShow = true;
			$scope.conSearch = true;
			$scope.selectContactModal.show();
		};
		$scope.closeSelectCon = function () {
			$scope.selectContactModal.hide();
		};
		$scope.selectPop = function (x) {
			$scope.selectContactText = x.text;
			$scope.referMoreflag = !$scope.referMoreflag;
		};
		$scope.showChancePop = function () {
			$scope.referMoreflag = true;
			$scope.isDropShow = true;
		};
		$scope.initConSearch = function () {
			$scope.input.con = '';
			$timeout(function () {
				document.getElementById('selectConId').focus();
			}, 1)
		};
		$scope.selectCon = function (x) {
			console.log(x);
			$scope.config.selectPe= x;
			$scope.selectContactModal.hide();
		};
}]);