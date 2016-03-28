worksheetModule.controller("WorksheetListCtrl",[
	"$scope", 
	"ionicMaterialInk", 
	"ionicMaterialMotion",
	"$ionicPopup", "$timeout", 
	function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout){
	
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
		timeStart: '20150101',
		timeEnd: '20150609',


		searchPlaceholder: '输入服务订单描述模糊搜索',




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
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
			},
			{
				category: '现场维修工单---end',
				timeStart: '2016.01.01 10:00:01',
				timeEnd: '2012.12.31 12:00:00',
				desc: '车辆电池出现重大问题'
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
				var attr2 = attrs2[i];
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
		if($scope.config.isFilterMode){
			$scope.enterListMode();
			return;
		}
		$scope.config.isFilterMode = true;
		$scope.config.isSorteMode = false;
		$scope.config.isQueryMode = false;
		$scope.config.isListMode = false;
		//ionicMaterialMotion.pushDown(".tab-filter-content ,tab-filter-content-inner");
	};
	$scope.enterSorteMode = function(){
		if($scope.config.isSorteMode){
			$scope.enterListMode();
			return;
		}
		$scope.config.isFilterMode = false;
		$scope.config.isSorteMode = true;
		$scope.config.isQueryMode = false;
		$scope.config.isListMode = false;
	};
	$scope.enterQueryMode = function(){
		$scope.config.isFilterMode = false;
		$scope.config.isSorteMode = false;
		$scope.config.isQueryMode = true;
		$scope.config.isListMode = false;
	};
	$scope.enterListMode = function(){
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

	$scope.init = function(){
		$scope.enterListMode();
		
		/*$ionicPopup.alert({
			title: '你好',
			template: '你好不'
		});*/
	};
	$scope.init();

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

	function initSwipeEvent(){
		var viewEle = document.getElementById('worksheetdetail-view');
		var eleHeaderBar = viewEle.getElementsByClassName("detail-header")[0];
		var eleHeaderInfo = viewEle.getElementsByClassName('detail-header-info')[0];
		var eleHeaderSubTitle = viewEle.getElementsByClassName("sub-title")[0];
			eleHeaderSubTitle.style.display = "block";

		if($scope.config.headerInfoInitHeight == null){
			$scope.config.headerInfoInitHeight = eleHeaderInfo.offsetHeight;
		}
		if($scope.config.headerBarInitHeight == null){
			$scope.config.headerBarInitHeight = eleHeaderBar.offsetHeight;
		}
		if($scope.config.headerBarTitleInitHeight == null){
			$scope.config.headerBarTitleInitHeight = $scope.config.headerBarInitHeight - $scope.config.headerInfoInitHeight;
		}

		// 给 view 添加 touch 相关事件
		if('ontouchstart' in window){ 
			viewEle.addEventListener("touchstart", __touchStart, false);
			viewEle.addEventListener("touchmove", __touchMove, false);
			viewEle.addEventListener("touchend", __touchEnd, false);
			viewEle.addEventListener("touchcancel", __touchEnd, false);
		}else if(window.navigator.pointerEnabled){ 
			// Pointer Events
			viewEle.addEventListener("pointerdown", __touchStart, false);
			viewEle.addEventListener("pointermove", __touchMove, false);
			viewEle.addEventListener("pointerup", __touchEnd, false);
			viewEle.addEventListener("pointercancel", __touchEnd, false);
		}else if(window.navigator.msPointerEnabled){
			// IE10, WP8 (Pointer Events)
			viewEle.addEventListener("MSPointerDown", __touchStart, false);
			viewEle.addEventListener("MSPointerMove", __touchMove, false);
			viewEle.addEventListener("MSPointerUp", __touchEnd, false);
			viewEle.addEventListener("MSPointerCancel", __touchEnd, false);
		}else{ 
			// Mouse Events
			viewEle.addEventListener("mousedown", __touchStart, false);
			viewEle.addEventListener("mousemove", __touchMove, false);
			viewEle.addEventListener("mouseup", __touchEnd, false);
		};

		//var startSingleTouch = false;
		var posTouchStart = null;
		var posLastMove = null;
		var posCurrentMove = null;
		var headerBarInfoTopLast = 0;
		var touchStartPointValid = false;
		function __touchStart(event){
			var e = posTouchStart = __getSingleEventTouches(event);
			if(e == null ){ return; }
			//startSingleTouch = true;
			//$scope.config.headerScrollStart = true;
			touchStartPointValid = true;
		}
		function __touchMove(event){
			if(!touchStartPointValid){ return; }
			var e = __getSingleEventTouches(event);
			if(e == null ){ return; }
			if($scope.config.scrollDelegateHandler.getScrollPosition().top<5){
				$scope.config.headerScrollCan = true;
				//posTouchStart = e;
			}
			if(!$scope.config.headerScrollCan){
				posLastMove = null;
				return;
			}
			
			//console.log(e.x+"    "+e.y);

			var directionDown = null,directionDownLast = null;  //手指滑动的方向
			//判断 directionDown 相关代码 
			posLastMove = posCurrentMove;
			posCurrentMove = e;
			posLastMove = posLastMove || posTouchStart || e;
			offsetY = posCurrentMove.y - posTouchStart.y;
			var offsetYlast = posCurrentMove.y - posLastMove.y;
			var offsetYlastForTop = offsetYlast * ($scope.config.headerBarInitHeight / $scope.config.headerInfoInitHeight); //每次偏移量 != top与height改变量 ： 要把headerbar中的最上方title行考虑进行
			directionDown = offsetY > 0 ? true : false;
			directionDownLast = offsetYlast > 0 ? true : false;

			if(directionDown){
				if($scope.config.headerScrollStart){
					$scope.freezeBottomScroll(false, 0);
					return;
				}else{
					$scope.freezeBottomScroll(true, 0);
				}
			}else{
				if($scope.config.headerScrollEnd){
					$scope.freezeBottomScroll(false, 0);
					return;
				}else{
					$scope.freezeBottomScroll(true, 0);
				}
			}
			//console.log(eleHeaderBar.offsetHeight + "     " + offsetYlast);
			var headerBarHeight, headerBarBgImageWidth, headerBarBgImageHeight,headerBarInfoTop; //headerBarInfoHeight
			//计算 headerBarHeight、headerBarInfoHeight 高度及 headerBarInfo的top偏移量: 单位全部为 px
			if(directionDown){
				//headerBarInfoHeight = $scope.config.headerInfoInitHeight+ offsetY;
				//headerBarHeight = $scope.config.headerBarTitleInitHeight + headerBarInfoHeight;
				headerBarHeight = eleHeaderBar.offsetHeight + offsetYlast;
				//headerBarInfoTop =  headerBarInfoTopLast+offsetYlastForTop;
				if(headerBarInfoTopLast+offsetYlastForTop > 0){
					headerBarInfoTop = headerBarInfoTopLast+offsetYlastForTop/3;
				}else{
					headerBarInfoTop = headerBarInfoTopLast+offsetYlastForTop;
				}
				//headerBarInfoTop = Math.min(headerBarInfoTop, 0);
				//headerBarInfoTop = headerBarInfoTop > 0 ? 0 : headerBarInfoTop;
			}else{
				//headerBarInfoHeight = $scope.config.headerInfoInitHeight + offsetY;
				//headerBarHeight = $scope.config.headerBarTitleInitHeight + headerBarInfoHeight;
				headerBarHeight = eleHeaderBar.offsetHeight + offsetYlast;
				//headerBarInfoTop =  headerBarInfoTopLast+offsetYlastForTop;
				if(headerBarInfoTopLast+offsetYlastForTop > 0){
					headerBarInfoTop = headerBarInfoTopLast+offsetYlastForTop/3;
				}else{
					headerBarInfoTop = headerBarInfoTopLast+offsetYlastForTop;
				}
			}

			headerBarHeight = Math.min(headerBarHeight, $scope.config.headerBarInitHeight+90); //最多可多往下拉50px，会在__touchEnd中恢复过来的
			//headerBarHeight = Math.max(headerBarHeight, $scope.config.headerBarTitleInitHeight);
			if(headerBarHeight <= $scope.config.headerBarTitleInitHeight){ // headerbar 缩小为最小状态时，将scroll设置为可以滚动
				headerBarHeight = $scope.config.headerBarTitleInitHeight;
				$scope.config.headerScrollEnd = true;
				$scope.config.headerScrolling = false;
				$scope.config.headerScrollStart = false;
			}else if(headerBarHeight == $scope.config.headerBarInitHeight+45){ //hearderbar 为最初高度时执行
				$scope.config.headerScrollEnd = false;
				$scope.config.headerScrolling = false;
				$scope.config.headerScrollStart = true;
			}else{
				$scope.config.headerScrollEnd = false;
				$scope.config.headerScrolling = false;
				$scope.config.headerScrollStart = false;
			}
			if(headerBarHeight <= $scope.config.headerBarTitleInitHeight+5 && $scope.config.scrollDelegateHandler.getScrollPosition().top>0){ // headerbar 缩小为最小状态，且scroll未滚动到最上面时则，设置scroll可以滚动，并且禁止headerbar状态改变
				/*$scope.config.headerScrollEnd = false;
				$scope.config.headerScrolling = false;
				$scope.config.headerScrollStart = false;*/
				$scope.config.headerScrollCan = false;
				$scope.freezeBottomScroll(false, 0);
				return;
			}
			headerBarInfoTop = Math.min(headerBarInfoTop, 45);
			headerBarInfoTop = Math.max(-$scope.config.headerBarInitHeight, headerBarInfoTop);
			if(headerBarHeight - $scope.config.headerBarInitHeight > 0){
				headerBarBgImageHeight = $scope.config.headerBarInitHeight +(headerBarHeight - $scope.config.headerBarInitHeight)*4/3;
				//headerBarBgImageHeight = $scope.config.headerBarInitHeight +(eleHeaderInfo.offsetHeight - $scope.config.headerInfoInitHeight)*4/3;
				headerBarBgImageWidth = eleHeaderBar.offsetWidth + (headerBarHeight - $scope.config.headerBarInitHeight)*4/3;				
			}else{
				headerBarBgImageHeight = $scope.config.headerBarInitHeight +(headerBarHeight - $scope.config.headerBarInitHeight)/3;
				//headerBarBgImageHeight = $scope.config.headerBarInitHeight +(eleHeaderInfo.offsetHeight - $scope.config.headerInfoInitHeight)/3;
				headerBarBgImageWidth = eleHeaderBar.offsetWidth + (headerBarHeight - $scope.config.headerBarInitHeight)/3;
			}
			headerBarBgImageWidth = Math.max(headerBarBgImageWidth, eleHeaderBar.offsetWidth);

			var headerBarInfoTopOld = headerBarInfoTop;
			if(headerBarInfoTop > 0){ // 往下多拉的情况 
				//headerBarInfoTop = headerBarInfoTop - Math.abs((headerBarHeight - $scope.config.headerBarInitHeight)*3/4);
				//headerBarHeight =  headerBarHeight - Math.abs((headerBarHeight - $scope.config.headerBarInitHeight)/2);;
			}
			//console.log(headerBarInfoTopOld+"     "+headerBarInfoTop);

			
			//判断并设置子项的透明动画
			var barInfoChilds = eleHeaderInfo.children;
			var childsTop = barInfoChilds[0].offsetHeight/2;
			if(!directionDown){
				//for(var i = barInfoChilds.length-1; i >= 0; i--,childsTop = barInfoChilds[0].offsetHeight/2){
				for(var i = 0; i < barInfoChilds.length; i++){
					if(-headerBarInfoTop >= childsTop){
						childsTop += barInfoChilds[i].offsetHeight;
						var eleChildJQ = angular.element(barInfoChilds[i]);
						if(angular.element(barInfoChilds[i]).hasClass("fadeIn")){
							angular.element(barInfoChilds[i]).removeClass("fadeIn");
						}
						if(!angular.element(barInfoChilds[i]).hasClass("fadeOut")){
							angular.element(barInfoChilds[i]).addClass("fadeOut");
						}
						continue;
					}
				}				
			}else{
				var childsTop2 = $scope.config.headerInfoInitHeight - barInfoChilds[0].offsetHeight/2;
				for(var i = barInfoChilds.length-1; i >= 0; i--){
					if(-headerBarInfoTop < childsTop2){
						childsTop2 -= barInfoChilds[0].offsetHeight;
						var eleChildJQ = angular.element(barInfoChilds[i]);
						if(eleChildJQ.hasClass("fadeOut")){
							eleChildJQ.removeClass("fadeOut");
						}
						if(!eleChildJQ.hasClass("fadeIn")){
							eleChildJQ.addClass("fadeIn");
						}
						continue;
					}
				}
				
			}
			if(directionDownLast){
				if(headerBarInfoTop <= eleHeaderInfo.offsetHeight/2){
					eleHeaderSubTitleJQ = angular.element(eleHeaderSubTitle);
					if(eleHeaderSubTitleJQ.hasClass("fadeIn")){
						eleHeaderSubTitleJQ.removeClass("fadeIn");
					}
					if(!eleHeaderSubTitleJQ.hasClass("fadeOut")){
						eleHeaderSubTitleJQ.addClass("fadeOut");
					}					
				}
			}else{
				if(-headerBarInfoTop <= eleHeaderInfo.offsetHeight/2){
					eleHeaderSubTitleJQ = angular.element(eleHeaderSubTitle);
					if(eleHeaderSubTitleJQ.hasClass("fadeOut")){
						eleHeaderSubTitleJQ.removeClass("fadeOut");
					}
					if(!eleHeaderSubTitleJQ.hasClass("fadeIn")){
						eleHeaderSubTitleJQ.addClass("fadeIn");
					}
				}
			}

			// 设置计算出来的高度、top偏移量，使其生效
			eleHeaderBar.style.height = headerBarHeight+"px";
			eleHeaderBar.style.backgroundSize = headerBarBgImageWidth+"px "+headerBarBgImageHeight+"px";
			eleHeaderInfo.style.top = headerBarInfoTop+"px";
			
			headerBarInfoTopLast = headerBarInfoTop;
			//console.log(" __touchMove :   "+offsetY+"     "+offsetYlast+"     "+headerBarInfoTop+"     "+eleHeaderInfo.style.top);
			//console.log("__touchMove over :   "+eleHeaderBar.offsetHeight+"     "+eleHeaderInfo.style.top);
		}
		function __touchEnd(event){
			//startSingleTouch = false;	
			//console.log("__touchEnd ");
			posTouchStart = null;
			var e = __getSingleEventTouches(event);
			//if(e == null){ return; }
			

			//判断 headerBarHeight 是否大于初始化高度,若大于则还原
			var currentHeaderBarHeight = eleHeaderBar.offsetHeight;
			if(currentHeaderBarHeight > $scope.config.headerBarInitHeight){
				eleHeaderBar.style.transition = "height .2s linear 0s,background-size .2s linear 0s";
				eleHeaderInfo.style.transition = "top .2s linear 0s";
				currentHeaderBarHeight = $scope.config.headerBarInitHeight;				
				$timeout(function (){
					eleHeaderBar.style.transition = "";
					eleHeaderInfo.style.transition = "";
					headerBarInfoTopLast = 0;
				}, 200);
				eleHeaderBar.style.height = currentHeaderBarHeight+"px";
				eleHeaderBar.style.backgroundSize = "100% 100%";
				eleHeaderInfo.style.top = "0px";
			}
			

			posTouchStart = null;
			posLastMove = null;
			posCurrentMove = null;
			//headerBarInfoTopLast = 0;

		}

		function __getSingleEventTouches(e){
			return e.touches && e.touches.length && e.touches.length > 0 ? {
				x: e.touches[0].pageX,
				y: e.touches[0].pageY
			} : null;
		}
	}

	
	
}]);
/*
$swipe.bind(viewEleJQ, {
	start: function(pos, event){
		console.log('start....   '+pos.x+"     "+pos.y);
	},
	move: function(pos, event){
		console.log('move....');
		alert("move ... ");
	},
	cacel: function(pos, event){
		console.log("cacel .... ");
	},
	end: function(pos, event){
		console.log("end ... ");
	}
});
*/