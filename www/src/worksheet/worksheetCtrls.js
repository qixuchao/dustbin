worksheetModule.controller("WorksheetListCtrl",[
	"$scope", 
	"ionicMaterialInk", 
	"ionicMaterialMotion",
	"$ionicPopup", "$timeout", 
	"$ionicPosition","$state",
	function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition, $state){
	
	$timeout(function () { //pushDown  fadeSlideIn  fadeSlideInRight
        //ionicMaterialInk.displayEffect();
        /*ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });*/
    }, 550);
    
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


		searchPlaceholder: '请输入服务工单描述or车辆描述or服务工单编号',

		showListItemAnimate: false,


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
		if(i == 0){
			$state.go("worksheetDetail", {
				detailType: 'newCar'
			});
		}else if(i==1){
			$state.go("worksheetDetail",{
				detailType: 'siteRepair'
			});
		}else if(i==3){
			$state.go("worksheetDetail",{
				detailType: 'batchUpdate'
			});
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
			$scope.config.filterLocalService = !$scope.config.filterLocalService;
		}else if(filterName == 'batchUpdate'){
			$scope.config.filterBatchUpdate = !$scope.config.filterBatchUpdate;
		}else if(filterName == 'newcarOnline'){
			$scope.config.filterNewCarOnline = !$scope.config.filterNewCarOnline;
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
		'filterStatusAudited', 'filterStatusReturned', 'filterStatusCancled'];
		for(var i = 0; i < status.length; i++){
			$scope.config[status[i]] = false;
		}
	}

	$scope.init = function(){
		$scope.enterListMode();

		$timeout(function (){
			$scope.config.showListItemAnimate = true;
		}, 150);
		
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

}]);

worksheetModule.controller("WorksheetDetailCtrl",[
	"$scope", 
	"ionicMaterialInk",
	"$ionicScrollDelegate",
	"$timeout",
	function($scope, ionicMaterialInk, $ionicScrollDelegate, $timeout){

	$scope.config = {
		scrollDelegateHandler: null,
		contentDetegateHandler: null,

		headerScrollStart: false, //header未收缩
		headerScrolling: false,
		headerScrollEnd: false,		//header已经收缩至最小状态
		headerScrollCan: true,
		headerBarInitHeight: null,
		headerInfoInitHeight: null,
		headerBarTitleInitHeight: null
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
		
		initSwipeEvent();
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