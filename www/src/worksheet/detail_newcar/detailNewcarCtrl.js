worksheetModule.controller("WorksheetDetailNewcarCtrl",[
	"$scope",
	"ionicMaterialInk",
	"$ionicScrollDelegate",
	"$timeout",
	"$ionicBackdrop",
	"$ionicPosition", 
	"$ionicGesture",
	"$ionicModal",
	function($scope, ionicMaterialInk, $ionicScrollDelegate, $timeout, $ionicBackdrop, $ionicPosition, $ionicGesture, $ionicModal){
	
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

		moreModal: null,
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
		basicInfo: {
			category: '新车档案收集工单',
			num: '3786',
			simpleDesc: '现成维修工单建单描述',
			desc: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
			terminalUser: '郑州宇通客车',
			linePro: 'FAW-PHEV运输木箱',
			status: '未处理',
			user: 'Susan',
			timeOnlineStart: '2016-3-1 12:00',
			timeOnlineEnd: '2016-3-1 12:00'
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
			{title: '标题---11', content: '内容--------11'}
		]
	};

	$scope.$on('$destroy', function() {
		if($scope.config.moreModal != null){
			$scope.config.moreModal.remove();
		}
	});


	$scope.showMoreModel = function($event){
	    if($scope.config.moreModal == null){
	    	$scope.config.moreModal = $ionicModal.fromTemplate("<div class='show-more-modal-content'>"+
                "<div class='top-line'></div>"+
                "<div class='content-lines'>"+
                    "<div class='content-line'>派工</div>"+
                    "<div class='content-line'>拒单</div>"+
                    "<div class='content-line'>接单</div>"+
                    "<div class='content-line'>服务拍照</div>"+
                    "<div class='content-line'>报工</div>"+
                    "<div class='content-line'>已取消</div>"+
                "</div>"+
            "</div>", {
                scope: $scope
            });
	    }
	    $scope.config.moreModal.show();
	    $scope.config.moreModal.$el.addClass("worksheet-detail-more-modal");
	    $scope.initMoreModal();
	};
	$scope.initMoreModal = function(){
			var eleJQ = angular.element('.show-more-modal-content-source');
			var elePos = $ionicPosition.position(eleJQ) || $ionicPosition.offset(eleJQ);		
			var left = elePos.left + elePos.width/2;
			var top = elePos.top + elePos.height*3/4;

			var modalJQ = angular.element('.show-more-modal-content');
			var modalPos = $ionicPosition.position(modalJQ) || $ionicPosition.offset(modalJQ);
			var modal = modalJQ[0];

			var arrowJQ = modalJQ.find('.top-line');
			var arrowPos = $ionicPosition.position(arrowJQ);// || $ionicPosition.offset(modalJQ);

			var modalFinalLeft = left-arrowPos.left;//left - arrowPos.left;
			var modalFinalTop = top;//-(elePos.top+elePos.height/4);

			var minModalLeft = $ionicPosition.offset( angular.element('body')).width - 5 - modalPos.width;
			modalFinalLeft = Math.min(modalFinalLeft, minModalLeft);

			modal.style.top = modalFinalTop+"px";
			modal.style.left = modalFinalLeft+"px";
			modal.style.zIndex = 12; // 12  -2

		//$ionicBackdrop.retain();
		//var backdropJQ = angular.element('.backdrop.visible.active');
	};

	$scope.onContentScroll = function($event){
		var position = $scope.config.contentDetegateHandler.getScrollPosition();
		var top = position.top;
	};

	$scope.onContentScroll2 = function($event){
		var position = $scope.config.scrollDelegateHandler.getScrollPosition();
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
		//justTest();
	};
	$scope.init();

	function justTest(){
		var header = document.getElementById("xbr-test-header-newcar");
		var headerJQ = angular.element(header);
		var obj1 = headerJQ.offset();
		var obj2 = headerJQ.position();

		var v1 = header.offsetHeight;
		alert(JSON.stringify(obj1)+"     "+JSON.stringify(obj2)+"     "+v1);

	}

	function __addTouchEventsListener(viewEle, __touchStart, __touchMove, __touchEnd){
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
	}

	function initSwipeEvent(){
		var viewEle = document.getElementById('worksheetdetail-newcar-view');
		var eleHeaderBar = viewEle.getElementsByClassName("detail-header")[0];
		var eleHeaderInfo = viewEle.getElementsByClassName('detail-header-info')[0];
		var eleHeaderSubTitle = viewEle.getElementsByClassName("sub-title")[0];
			//eleHeaderSubTitle.style.display = "block";
		var eleNotValidY = viewEle.getElementsByClassName("history-info-relation-line")[0];

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
		__addTouchEventsListener(viewEle, __touchStart, __touchMove, __touchEnd);
		

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
			var eleNotValidYJQ = angular.element(eleNotValidY);
			var topSize = eleNotValidYJQ.offset().top;
			var heightSize = eleNotValidY.offsetHeight;
			if(e.y >= topSize && e.y <= topSize+heightSize){
				touchStartPointValid = false;
			}else{
				touchStartPointValid = true;
			}
		}
		function __touchMove(event){
			//如果 touch 事件起始点为禁止上下滚动，则直接return;
			if(!touchStartPointValid){ return; }
			var e = __getSingleEventTouches(event);
			if(e == null ){ return; }
			//判断下方的scroll是否可以滚动
			if($scope.config.scrollDelegateHandler.getScrollPosition().top<5){
				$scope.config.headerScrollCan = true;
				//posTouchStart = e;
			}
			if(!$scope.config.headerScrollCan){
				posLastMove = null;
				return;
			}
			
			var directionDown = null,directionDownLast = null;  //手指滑动的方向
			//判断 directionDown 相关代码 
			posLastMove = posCurrentMove;
			posCurrentMove = e;
			posLastMove = posLastMove || posTouchStart || e;
			offsetY = posCurrentMove.y - posTouchStart.y;
			var offsetYlast = posCurrentMove.y - posLastMove.y;
			var offsetYlastForTop = offsetYlast;// * ($scope.config.headerBarInitHeight / $scope.config.headerInfoInitHeight); //每次偏移量 != top与height改变量 ： 要把headerbar中的最上方title行考虑进行
			directionDown = offsetY > 0 ? true : false;
			directionDownLast = offsetYlast > 0 ? true : false;
			// 依据滚动方向来判断是否需要禁用下方的scroll
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
					headerBarInfoTop = headerBarInfoTopLast;//+offsetYlastForTop/3;
				}else{
					headerBarInfoTop = headerBarInfoTopLast+offsetYlastForTop;
				}
			}
			// 
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

			
			//判断并设置子项的透明动画 fadeIn fadeOut
			var barInfoChilds = eleHeaderInfo.children;
			var eleInfo1 = barInfoChilds[0];
			var eleInfo2 = barInfoChilds[1];
			var eleInfo3 = barInfoChilds[2];
			var headerBarInfoTopABS = Math.abs(headerBarInfoTop);
			var boundEle1TopUP = -(eleInfo1.offsetHeight/2);
			var boundEle2TopUP = -(eleInfo1.offsetHeight+eleInfo2.offsetHeight/2);
			var boundEle3TopUP = -(eleInfo1.offsetHeight+eleInfo2.offsetHeight+eleInfo3.offsetHeight/2)
			var diff = Math.abs(offsetYlast+5);
			if(!directionDown && headerBarInfoTop < 0){ //向上滚动且 top < 0:
				if(headerBarInfoTop <= (boundEle1TopUP) ){ // -16: only hide ele1;
					xbrFadeHide(eleInfo1);
				}
				if(headerBarInfoTop <= (boundEle2TopUP)){ // -48
					xbrFadeHide(eleInfo1);
					xbrFadeHide(eleInfo2);
				}
				if(headerBarInfoTop <= (boundEle3TopUP)){ // -80
					xbrFadeHide(eleInfo1);
					xbrFadeHide(eleInfo2);
					xbrFadeHide(eleInfo3);
				}
			}else if(directionDown && headerBarInfoTop < 10){ // 向下滚动，且top < 0
				console.log("   -----  "+headerBarInfoTop);
				diff += 15;
				if(headerBarInfoTop >= (boundEle3TopUP-diff)){ //+diff
					xbrFadeShow(eleInfo3);
				}
				if(headerBarInfoTop >= (boundEle2TopUP-diff)){
					xbrFadeShow(eleInfo3);
					xbrFadeShow(eleInfo2);					
				}
				if(headerBarInfoTop >= (boundEle1TopUP-diff)){
					xbrFadeShow(eleInfo3);
					xbrFadeShow(eleInfo2);					
					xbrFadeShow(eleInfo1);
				}
			}

			function xbrFadeHide(ele){
				//ele.style.color = "red";
				var eleJQ = angular.element(ele);
				eleJQ.removeClass("animated fadeIn");
				eleJQ.addClass("animated fadeOut");
			}
			function xbrFadeShow(ele){
				//ele.style.color = "white";
				var eleJQ = angular.element(ele);
				eleJQ.removeClass("animated fadeOut");
				eleJQ.addClass("animated fadeIn");
			}

			// 设置计算出来的高度、top偏移量，使其生效
			eleHeaderBar.style.height = headerBarHeight+"px";
			eleHeaderBar.style.backgroundSize = headerBarBgImageWidth+"px "+headerBarBgImageHeight+"px";
			
			if(headerBarInfoTop > 0){
				eleHeaderInfo.style.top = headerBarInfoTop/2+"px";
				eleHeaderInfo.style.height = $scope.config.headerInfoInitHeight + headerBarInfoTop+"px";
			}else{
				eleHeaderInfo.style.top = headerBarInfoTop+"px";
			}
			
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
				eleHeaderBar.style.transition = "height .15s linear 0s,background-size .15s linear 0s";
				eleHeaderInfo.style.transition = "height .15s linear 0s, top .15s linear 0s";
				currentHeaderBarHeight = $scope.config.headerBarInitHeight;				
				$timeout(function (){
					eleHeaderBar.style.transition = "";
					eleHeaderInfo.style.transition = "";
					headerBarInfoTopLast = 0;
				}, 150);
				eleHeaderBar.style.height = currentHeaderBarHeight+"px";
				eleHeaderBar.style.backgroundSize = "100% 100%";
				eleHeaderInfo.style.top = "0px";
				eleHeaderInfo.style.height = $scope.config.headerInfoInitHeight+"px";
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