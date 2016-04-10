worksheetModule.controller("worksheetDetailAllCtrlOld",[
	"$scope",
	"ionicMaterialInk",
	"$ionicScrollDelegate",
	"$timeout",
	"$ionicBackdrop",
	"$ionicPosition", 
	"$ionicGesture",
	"$ionicModal",
	"$state", 
	function($scope, ionicMaterialInk, $ionicScrollDelegate, $timeout, $ionicBackdrop, $ionicPosition, $ionicGesture, $ionicModal, $state){
	
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

	$scope.$on("$destroy", function(){
		__destroyModal();
	});

	function __destroyModal(){
		if($scope.config.moreModal != null){
			if($scope.config.moreModal.isShown()){
				$scope.config.moreModal.hide();
			}
			$scope.config.moreModal.remove();
			$scope.config.moreModal = null;
		}
	}


	$scope.goState = function(stateName){
		__destroyModal();
		$timeout(function (){
			$state.go(stateName);
		}, 100);		
	};
	$scope.dibButtonClickHandler = function(type){
		switch(type){
			case 'xiangGuanFang':
				$scope.goState('worksheetRelatedPart');
				break;
			case 'jiaoYiLiShi':
				$scope.goState('worksheetDetailHistoryList');
				break;
			case 'baoGongXinXi':
				$scope.goState('worksheetBaoGonglist');
				break;
		}
	};
	$scope.moreModalClickHandler = function(type){
		$scope.config.moreModal.hide();		
		if(type == 'paigong'){ 
				
		}else if(type == 'judan'){

		}else if(type == 'jiedan'){

		}else if(type == 'beijianshengqing'){
			$scope.goState("worksheetSparepart");
		}else if(type == 'chelianglicheng'){
			$scope.goState("worksheetCarMileage");
		}else if(type == 'guzhangxinxi'){
			$scope.goState("worksheetFaultInfos");
		}else if(type == 'fuwupaizhao'){
			$scope.goState("worksheetTakePicture");
		}else if(type == 'baogong'){
			$scope.goState("worksheetbaogonglist");
		}else if(type == 'wangong'){

		}else if(type == 'yiquxiao'){

		}
	};

	$scope.showMoreModel = function($event){
	    if($scope.config.moreModal == null){
	    	$scope.config.moreModal = $ionicModal.fromTemplate("<div class='show-more-modal-content'>"+
                "<div class='top-line'></div>"+
                "<div class='content-lines'>"+
                    "<div class='content-line' ng-click='moreModalClickHandler(\"paigong\");'>派工</div>"+
                    "<div class='content-line' ng-click='moreModalClickHandler(\"judan\");'>拒单</div>"+
                    "<div class='content-line' ng-click='moreModalClickHandler(\"jiedan\");'>接单</div>"+
                    "<div class='content-line' ng-click='moreModalClickHandler(\"fuwupaizhao\");'>服务拍照</div>"+
                    "<div class='content-line' ng-click='moreModalClickHandler(\"baogong\");'>报工</div>"+
                    "<div class='content-line' ng-click='moreModalClickHandler(\"yiquxiao\");'>已取消</div>"+
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

worksheetModule.controller('worksheetDetailAllCtrl',[
        '$scope',
        '$state',
        '$ionicHistory',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        '$cordovaDialogs',
        '$ionicModal',
        '$ionicPopover',
        '$cordovaToast',
        '$stateParams',
        '$ionicPosition',
        function ($scope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $stateParams, $ionicPosition) {

        	$scope.$on('$destroy', function() {
				if($scope.config.moreModal != null){			
					$scope.config.moreModal.remove();
					$scope.config.moreModal = null;
				}
			});

			$scope.goState = function(stateName){
				$timeout(function (){
					$state.go(stateName);
				}, 100);		
			};
			$scope.dibButtonClickHandler = function(type){
				switch(type){
					case 'xiangGuanFang':
						$scope.goState('worksheetRelatedPart');
						break;
					case 'jiaoYiLiShi':
						$scope.goState('worksheetDetailHistoryList');
						break;
					case 'baoGongXinXi':
						$scope.goState('worksheetBaoGonglist');
						break;
				}
			};
			$scope.moreModalClickHandler = function(type){
				$scope.config.moreModal.hide();		
				if(type == 'paigong'){ 

				}else if(type == 'judan'){

				}else if(type == 'jiedan'){

				}else if(type == 'beijianshengqing'){
					$scope.goState("worksheetSparepart");
				}else if(type == 'chelianglicheng'){
					$scope.goState("worksheetCarMileage");
				}else if(type == 'guzhangxinxi'){
					$scope.goState("worksheetFaultInfos");
				}else if(type == 'fuwupaizhao'){
					$scope.goState("worksheetTakePicture");
				}else if(type == 'baogong'){
					$scope.goState("worksheetbaogonglist");
				}else if(type == 'wangong'){

				}else if(type == 'yiquxiao'){
					
				}
			};
			
			$scope.showMoreModel = function($event, sourceClassName){
			    if($scope.config.moreModal == null){
			    	$scope.config.moreModal = $ionicModal.fromTemplate("<div class='show-more-modal-content'>"+
		                "<div><div class='top-line'></div></div>"+
		                "<div class='content-lines'>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"paigong\");'>派工</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"judan\");'>拒单</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"jiedan\");'>接单</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"beijianshengqing\");'>备件申请</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"chelianglicheng\");'>车辆里程</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"guzhangxinxi\");'>故障信息</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"fuwupaizhao\");'>服务拍照</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"baogong\");'>报工</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"wangong\");'>完工</div>"+
		                    "<div class='content-line' ng-click='moreModalClickHandler(\"yiquxiao\");'>已取消</div>"+
		                "</div>"+
		            "</div>", {
		                scope: $scope
		            });
			    }
			    $scope.config.moreModal.show();
			    $scope.config.moreModal.$el.addClass("worksheet-detail-more-modal");			    
			    $scope.initMoreModal(sourceClassName);
			    var eleBgJQ = $scope.config.moreModal.$el.find('.modal-backdrop-bg');
			    eleBgJQ[0].style.opacity="0";
			};
			$scope.initMoreModal = function(sourceClassName){
					var eleJQ = angular.element('.'+sourceClassName);
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
			};

			$scope.editSiteRepair = function(){
				// TODO
			};
			$scope.editNewCar = function(){
				// TODO
			};
			
        	$scope.config = {
				scrollDelegateHandler: null,
				contentDetegateHandler: null,

				detailType: '',
				detailTypeNewCar: false,
				detailTypeSiteRepair: false,
				detailTypeBatchUpdate: false,
				
				moreModal: null
			};
			$scope.datas = {
				header: {

				},
				headerNewCar:{
					title: '车辆出现重大问题，需要维修',
					company: '郑州金龙客车股份有限公司福州分公司',
					customer: '张三',
					place: '福建省 福州市',
					category: '关系维护',
					status: '处理中'
				},
				basicInfoNewCar: {
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
				headerSiteRepair: {
					title: '车辆出现重大问题，需要维修',
					company: '郑州金龙客车股份有限公司福州分公司',
					customer: '张三',
					place: '福建省 福州市',
					category: '关系维护',
					status: '处理中'
				},
				basicInfoSiteRepair: {
					//基本信息
					category: '现场维修工单',
					num: '3786',
					simpleDesc: '现成维修工单建单描述',
					desc: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
					status: '未处理',
					impact: '灾难',
					user: '张薇',
					//服务对象
					car: '贵GU1230*15H647M-0002*112016013002',
					customer: '终端用户1',
					//日期
					timeRepairStart: '2016-3-1 12:00',
					timeRepairEnd: '2016-3-5 15:00',
					//服务合同和质保
					zhibaoNum: 'CATL_WTY_5Y+10WKM',
					zhibaoDesc: '质保5年10万公里',
					//故障信息
					gzfscj: '未装车',
					zerenfang: 'USER',
					guzhangCategory: '安全',
					bujianCategory: '高压盒',
					bujian: '主负继电器',
					guzhangReson: '工艺问题',
					zhushi: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
					handleResult: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
				},
				headerBatchUpdate: {
					title: '车辆出现重大问题，需要维修',
					company: '郑州金龙客车股份有限公司福州分公司',
					customer: '张三',
					place: '福建省 福州市',
					category: '关系维护',
					status: '处理中'
				},
				basicInfoBatchUpdate: {
					//基本信息
					category: '现场维修工单',
					num: '3786',
					simpleDesc: '现成维修工单建单描述',
					desc: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
					status: '未处理',
					impact: '灾难',
					user: '张薇',
					//服务对象
					car: '贵GU1230*15H647M-0002*112016013002',
					customer: '终端用户1',
					//日期
					timeRepairStart: '2016-3-1 12:00',
					timeRepairEnd: '2016-3-5 15:00',
					//服务合同和质保
					zhibaoNum: 'CATL_WTY_5Y+10WKM',
					zhibaoDesc: '质保5年10万公里',
					//故障信息
					gzfscj: '未装车',
					zerenfang: 'USER',
					guzhangCategory: '安全',
					bujianCategory: '高压盒',
					bujian: '主负继电器',
					guzhangReson: '工艺问题',
					zhushi: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
					handleResult: 'In the thmultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
				}
			};
			
            ionicMaterialInk.displayEffect();
            $scope.statusArr = [{
			        value: '未处理',
			        code: '',
			        color:'#e24976'
			    },{
			        value: '处理中',
			        code: '',
			        color:'#a0cb00'
			    },{
			        value: '已完成',
			        code: '',
			        color:'#a0cb00'
			    },{
			        value: '已取消',
			        code: '',
			        color:'#e24976'
		    }];
            
            $scope.details = {
                annotate: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
                startTime: '2016-3-1  12:00',
                endTime: '2016-3-1  12:00',
                refer: '商机-郑州客车销售机会'
            };
            
            $scope.select = true;
            $scope.showTitle = false;
            $scope.showTitleStatus = false;

            $scope.progressArr = [{
                content: '与客户进行了初次交涉,效果良好',
                time: '2016-3-6  18:33'
            }, {
                content: '第二次交涉,效果一般,还需要继续跟进',
                time: '2016-3-7  17:33'
            }, {
                content: '最后谈了一次,应该可以成交,主要联系客户李经理进行跟进',
                time: '2016-3-8  12:11'
            }];

            var position;
            var maxTop;
            $scope.onScroll = function () {
            	position = $ionicScrollDelegate.$getByHandle('xbrDelegateContent').getScrollPosition().top;
                //position = $ionicScrollDelegate.getScrollPosition().top;
                //console.log(position)
                if (position > 10) {
                    $scope.TitleFlag = true;
                    $scope.showTitle = true;
                    //console.log(position);
                    if (position > 26) {
                        $scope.customerFlag = true;
                    } else {
                        $scope.customerFlag = false;
                    }
                    if (position > 54) { // 54、80
                        $scope.statusFlag = true;
                    } else {
                        $scope.statusFlag = false;
                    }
                    if (position > 95) {
                        if (maxTop == undefined) {
                            maxTop = $ionicScrollDelegate.$getByHandle('xbrDelegateContent').getScrollView().__maxScrollTop;
                        }
                        $scope.showTitleStatus = true;
                    } else {
                        $scope.showTitleStatus = false;
                    }
                    if (position > maxTop) {
                        //$ionicScrollDelegate.scrollBottom(false)
                    }
                } else {
                    $scope.customerFlag = false;
                    $scope.placeFlag = false;
                    $scope.typeFlag = false;
                    $scope.statusFlag = false;
                    $scope.showTitle = false;
                    $scope.TitleFlag = false;
                    $scope.showTitleStatus = false;
                }
                if(!$scope.$$phase) {
                	$scope.$apply();
                }                
            };

            $scope.init = function(){
            	// newCar、siteRepair、batchUpdate
            	var type = $stateParams.detailType;
            	$scope.config.detailType = type;
            	if(type == "newCar"){
            		$scope.config.detailTypeNewCar = true;
            		$scope.datas.header = $scope.datas.headerNewCar;
            	}else if(type == "siteRepair" || type == "batchUpdate"){
            		$scope.config.detailTypeSiteRepair = true;
            		$scope.datas.header = $scope.datas.headerSiteRepair;
            	}else if(type == "batchUpdate"){
            		$scope.config.detailTypeBatchUpdate = true;
            		$scope.datas.header = $scope.datas.headerBatchUpdate;
            	}else{
            		throw "type 不在预期范围内!";
            	}
            };

            $scope.init();

            
        }]);