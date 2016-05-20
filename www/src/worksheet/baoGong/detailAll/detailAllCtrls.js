
worksheetModule.controller('baoGongDetailAllCtrl',[
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
    'HttpAppService',
    'worksheetHttpService',
    "worksheetDataService",
    "Prompter",
    "saleActService",
    "$rootScope",
    "$filter", 
    "CarService",
    "$ionicActionSheet",
    "baoGongService",
    function ($scope, $state, $ionicHistory, $ionicScrollDelegate,
              ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
              $cordovaToast, $stateParams, $ionicPosition, HttpAppService, worksheetHttpService, worksheetDataService, Prompter
              , saleActService, $rootScope, $filter,CarService, $ionicActionSheet, baoGongService) {

    	$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState && toState && toState.name == 'baoGongDetail'){
            	// fromState.name=="baoGongCreate"
            	if(fromState.name == 'baoGongEdit' || fromState.name == 'worksheetBaoGonglist'){
            		if(baoGongService.wsBaoDetailData.needReload){
	                	baoGongService.wsBaoDetailData.needReload = false;
	                	__reloadBaoDetailDatas();
	                }
            	}
            }
        });

    	$scope.$on('$destroy', function() {
    		console.log("baoGongDetailAllCtrl  $destroy");
			__destroyMoreModal();
		});

		$scope.goBack = function(){
			__destroyMoreModal();
			if($scope.config.editMode){
				Prompter.wsConfirm("提示","放弃本次编辑?","确定", "取消");
			}else{
				$ionicHistory.goBack();
			}
		};

		function __destroyMoreModal(){
			if($scope.config.moreModal != null){			
				$scope.config.moreModal.remove();
				$scope.config.moreModal = null;
			}
		}

		$scope.goState = function(stateName){
			__destroyMoreModal();
			$timeout(function (){
				$state.go(stateName);
			}, 100);
		};
		$scope.dibButtonClickHandler = function(type){
			switch(type){
				case 'baoGongXinXi':
					worksheetDataService.wsBaoDetailToFYJS = true;
					worksheetDataService.wsBaoDetailData = $scope.datas.detail;
					var wanGongListDatas = $scope.datas.detail.ET_DETAIL;
					if(!angular.isUndefined(wanGongListDatas) && !!wanGongListDatas && wanGongListDatas.item && !!wanGongListDatas.item.length){
						worksheetDataService.wsBaoDetailBaoGXXIsImpty = false;
					}else{
						worksheetDataService.wsBaoDetailBaoGXXIsImpty = true;
					}
					$scope.goState('worksheetBaoGonglist');
					break;
			}
		};
		$scope.moreModalClickHandler = function(type){
			console.log(type);
			$scope.config.moreModal.hide();
			if(type == 'baogong'){
				requestChangeStatus("E0002", "已报工", "正在报工", "报工完成", "报工失败，请检查网络");
			}else if(type == 'yiquxiao'){
				requestChangeStatus("E0006", "已取消", "正在取消", "取消成功", "取消失败，请检查网络");
			}
		};
		
		$scope.showRequestModel = function(){
			if($scope.cofnig.requestModal == null){
				$scope.config.requestModal = $ionicModal.fromTemplate("<div class='show-request-modal-content worksheet-bao-detail'>"+
					+"<div ng-bind='config.requestModalStr'></div>"+
					+"</div>", {
					scope: $scope
				});
			}
		};
		$scope.canShowMoreBtn = function(){
			//if($scope.config.canEdit){
			//return !$scope.config.editMode;
			return !$scope.config.editMode && $scope.config.canEdit && $scope.config.statusStr =="E0001";
		};
		$scope.showMoreModel = function($event, sourceClassName){
		    if($scope.config.moreModal == null){
		    	$scope.config.moreModal = $ionicModal.fromTemplate("<div class='show-more-modal-content'>"+
	                "<div><div class='top-line'></div></div>"+
	                "<div class='content-lines'>"+
	                    "<div class='content-line baogong' ng-click='moreModalClickHandler(\"baogong\");' style='display:block;'>报工</div>"+
	                    "<div class='content-line yiquxiao' ng-click='moreModalClickHandler(\"yiquxiao\");' style='display:block;'>取消</div>"+
	                "</div>"+
	            "</div>", {
	                scope: $scope
	            });
		    }
		    $scope.config.moreModal.show();
		    $scope.config.moreModal.$el.addClass("worksheet-detail-more-modal");
		    $scope.initMoreModal(sourceClassName);
		    var eleBgJQ = $scope.config.moreModal.$el.find('.modal-backdrop-bg');
		    eleBgJQ[0].style.opacity="0.35";
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
				var modalFinalTop = top+10;//-(elePos.top+elePos.height/4);

				var minModalLeft = $ionicPosition.offset( angular.element('body')).width - 5 - modalPos.width;
				modalFinalLeft = Math.min(modalFinalLeft, minModalLeft);

				modal.style.top = modalFinalTop+"px";
				modal.style.left = modalFinalLeft+"px";
				modal.style.zIndex = 12; // 12  -2
		};
		
		$scope.canShowEditBtn = function(){
			//return true;
			return $scope.config.canEdit && $scope.config.statusStr =="E0001";
			//return $scope.config.statusStr =="E0001";
		};
		$scope.editDetail = function(){
			//$scope.config.editMode = !$scope.config.editMode;
			$state.go("baoGongEdit");
		};
		$scope.saveChange = function(){
			var oldDesc = $scope.datas.detail.ES_OUT_LIST.DESCRIPTION;
			var newDesc = $scope.datas.detail.ES_OUT_LIST.DESCRIPTION_EDIT;
			if(oldDesc == newDesc && ($scope.config.BAO_BEIZHU=="" || ($scope.config.BAO_BEIZHU.trim && $scope.config.BAO_BEIZHU.trim()=="")) ){
				Prompter.showLoadingAutoHidden("报工单未修改!", false, 800);
				$timeout(function(){
					$scope.config.editMode = !$scope.config.editMode;
				}, 800);
				return;
			}
			var header = {
				DESCRIPTION: $scope.datas.detail.ES_OUT_LIST.DESCRIPTION_EDIT,
				STATUS: $scope.datas.detail.ES_OUT_LIST.STATU
			};
			var params = angular.copy(baoGongService.BAOWS_EDIT.defaults);
			params.IS_HEAD_DATA = header;
			params.IV_PROCESS_TYPE = $scope.config.PROCESS_TYPE;
			params.IV_OBJECT_ID = $scope.config.OBJECT_ID;
			if($scope.config.BAO_BEIZHU && $scope.config.BAO_BEIZHU != "" && $scope.config.BAO_BEIZHU.trim && $scope.config.BAO_BEIZHU.trim()!=""){
				params.IT_TEXT = {
					item_in: {
						TDID: 'Z002',
						TEXT: $scope.config.BAO_BEIZHU
					}
				};
			}
			__requestChangeBaoWS(baoGongService.BAOWS_EDIT.url, params);
		};
		
    	$scope.config = {
    		typeStr: '',
    		statusStr:'',

    		IS_FROM_WS_HISTORY: false,

    		PROCESS_TYPE: '',
        	OBJECT_ID: '',
        	WS_DETAIL: '',
        	editMode: false, //编辑模式
        	BAO_BEIZHU: '',

			scrollDelegateHandler: null,
			contentDetegateHandler: null,

			detailType: '',
			detailTypeNewCar: false,
			detailTypeSiteRepair: false,
			detailTypeBatchUpdate: false,
			detailTypeNewCarFWS: false,
			detailTypeSiteRepairFWS: false,
			detailTypeBatchUpdateFWS: false,

			canEdit: false,

			moreModal: null,
			requestModal: null,
			requestModalStr: '正在加载',

			selectYuanGongModal: null,
			selectedEmp: null,
			empSearchStr: '',
			empPage: 0
		};
		$scope.datas = {
			detail: null
		};
		
        ionicMaterialInk.displayEffect();
        
        $scope.init = function(){ //区分从哪个界面来的：工单交易历史列表界面、报工单创建界面
        	$scope.config.PROCESS_TYPE = baoGongService.detailFromWSHistory.PROCESS_TYPE;
        	$scope.config.OBJECT_ID = baoGongService.detailFromWSHistory.OBJECT_ID;
        	$scope.config.WS_DETAIL = baoGongService.detailFromWSHistory.WS_DETAIL;
        	$scope.config.IS_FROM_WS_HISTORY = baoGongService.detailFromWSHistory.isFromWSHistory;

        	__reloadBaoDetailDatas();
        };
        
        $scope.init();
        
        function __changeStatus(newStatus, newStatusDesc){
        	worksheetDataService.baoWsToWsHistory.needReload = true;
        	$scope.config.statusStr = $scope.config.ydStatusNum = newStatus;
        	$scope.datas.detail.ES_OUT_LIST.STATU_DESC = newStatusDesc;
        	$scope.datas.detail.ES_OUT_LIST.STATU = newStatus;

        	worksheetDataService.wsDetailData.ES_OUT_LIST.STATU = $scope.datas.detail.ES_OUT_LIST.STATU;
        	worksheetDataService.wsDetailData.ES_OUT_LIST.STATU_DESC = $scope.datas.detail.ES_OUT_LIST.STATU_DESC;

        	__destroyMoreModal();            	
        	if(!$scope.$$phase){
        		$scope.$apply();
        	}
        }
        
        function __requestChangeBaoWS(url, params){
			Prompter.showLoading("正在修改报工单");
	        var promise = HttpAppService.post(url,params);
	        promise.success(function(response){
	        	$scope.config.BAO_BEIZHU = "";
	        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG == "S"){
	        		Prompter.showLoadingAutoHidden("修改成功", false, 1000);
	        		$timeout(function(){
	        			$scope.config.editMode = !$scope.config.editMode;
	        			__requestBaoDetailDatas("正在刷新数据", {
			        		IS_OBJECT_ID: $scope.config.OBJECT_ID,
			        		IS_PROCESS_TYPE: $scope.config.PROCESS_TYPE
			        	});
	        		},1000);
	        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT != ""){
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        	}else{
	        		Prompter.showLoadingAutoHidden(response, false, 2000);
	        	}
	        })
	        .error(function(errorResponse){
	        	Prompter.showLoadingAutoHidden("修改失败,请检查网络!", false, 2000);
	        });
        }

        function __reloadBaoDetailDatas(){
        	__requestBaoDetailDatas("正在加载", {
        		IS_OBJECT_ID: $scope.config.OBJECT_ID,
        		IS_PROCESS_TYPE: $scope.config.PROCESS_TYPE
        	});
        }

        function __requestBaoDetailDatas(loadStr, params){
        	var loadingStr = loadStr ? loadStr : "正在加载" ;
	        var queryParams = { 
			    "I_SYSNAME": { "SysName": worksheetDataService.getStoredByKey("sysName") },
			    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
			    "IS_OBJECT_ID": params.IS_OBJECT_ID,
			    "IS_PROCESS_TYPE": params.IS_PROCESS_TYPE
			};

			Prompter.showLoading(loadingStr);
	        var promise = HttpAppService.post(worksheetHttpService.serviceDetail.url,queryParams);
	        promise.success(function(response){
	        	if(response && !response.ES_RESULT){
	        		Prompter.showLoadingAutoHidden(response, false, 2000);
	        	}
	        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG != "S"){ // 未加载到数据
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        		return;
	        	}
	        	if(!$scope.datas.serviceListDatas){
	        		$scope.datas.serviceListDatas = [];
	        	}
	        	var tempResponse = response;
	        	var kyhuMingCheng = "";
	        	var waifuRenyuan = "";

	        	if(tempResponse && tempResponse.ET_PARTNER){
	        		var items = tempResponse.ET_PARTNER.item;
		        	if(items && items.length >= 0){
		        		for(var j = 0; j < items.length; j++){
			        		if(items[j].PARTNER_FCT == "ZCUSTOME"){  //: 客户名称
			        			kyhuMingCheng = items[j].NAME1;
			        		}
			        		if(items[j].PARTNER_FCT == "ZSRVEMPL"){ //: 外服人员姓名
			        			waifuRenyuan = items[j].NAME1;
			        		}
			        	}
		        	}
	        	}

	        	if(tempResponse.ET_TEXT && tempResponse.ET_TEXT.item && tempResponse.ET_TEXT.item.length > 0){
	        		var texts = tempResponse.ET_TEXT.item;
	        		var lines = [];     var linesJieGuo = [];
	        		for(var i = 0; i < texts.length; i ++){
	        			if(texts[i].TDID == "Z001"){
	        				var tempStr = texts[i].TDLINE+"";
	        				tempStr.replace(/[\s]{10}/g, " ");
	        				tempStr.replace(/[\s]{5}/g, " ");
	        				tempStr.replace(/[\s]{2}/g, " ");
	        				tempStr.replace(/[\s]{2}/g, " ");
	        				texts[i].finalStr = tempStr;
	        				lines.push(angular.copy(texts[i]));
	        			}
	        			if(texts[i].TDID == "Z005"){
	        				var tempStr2 = texts[i].TDLINE+"";
	        				tempStr2.replace(/[\s]{10}/g, " ");
	        				tempStr2.replace(/[\s]{5}/g, " ");
	        				tempStr2.replace(/[\s]{2}/g, " ");
	        				tempStr2.replace(/[\s]{2}/g, " ");
	        				texts[i].finalStr = tempStr2;
	        				linesJieGuo.push(angular.copy(texts[i]));
	        			}
	        		}
	        	}
	        	tempResponse.XBRZHUSHIS = lines;
	        	tempResponse.XBRCHULIJIEGUOS = linesJieGuo;

	        	//计算总价：XBR_TOTALPRICE
	        	var details = [];
	        	try{
	        		details = tempResponse.ET_DETAIL.item;
	        	}catch(e){
	        		details = [];
	        	}
	        	var pridocs = [];
	        	try{
	        		pridocs = tempResponse.ET_PRIDOC.item;
	        	}catch(e){
	        		pridocs = [];
	        	}
	        	if(angular.isUndefined(details) || details== null){
        			details = [];
        		}
        		if(angular.isUndefined(pridocs) || pridocs== null){
        			pridocs = [];
        		}

	        	for(var i = 0; i < details.length; i++){
	        		details[i].XBR_TOTALPRICE = 0;
	        		for(var x = 0; x < pridocs.length; x++){
	        			if(details[i].NUMBER_INT == pridocs[x].NUMBER_INT && (pridocs[x].KSCHL=="ZPR1" || pridocs[x].KSCHL=="ZPD1" || pridocs[x].KSCHL=="ZPR2" || pridocs[x].KSCHL=="ZPD2")){
	        				//details[i].XBR_TOTALPRICE += Number(pridocs[x].KBETR);
	        				details[i].XBR_TOTALPRICE += Number(pridocs[x].KWERT);
	        			}
	        		}
	        	}
	        	
	        	tempResponse.kyhuMingCheng = kyhuMingCheng;
	        	tempResponse.waifuRenyuan = waifuRenyuan;
	        	tempResponse.ydWorksheetNum = params.IS_OBJECT_ID;
	        	tempResponse.IS_PROCESS_TYPE = params.IS_PROCESS_TYPE;
	        	tempResponse.ES_OUT_LIST.DESCRIPTION_EDIT = tempResponse.ES_OUT_LIST.DESCRIPTION;
	        	
	        	baoGongService.wsBaoDetailData = $scope.datas.detail = tempResponse;
	        	__handleFWDetail(params.IS_OBJECT_ID, params.IS_PROCESS_TYPE); //处理数据同步
	        	$scope.config.statusStr = tempResponse.ES_OUT_LIST.STATU;
	        	//worksheetDataService.wsDetailData = tempResponse;

	        	if(tempResponse.ES_OUT_LIST && tempResponse.ES_OUT_LIST.EDIT_FLAG == "X"){
	        		$scope.config.canEdit = true;
	        	}else{
	        		$scope.config.canEdit = false;
	        	}

	        	Prompter.hideLoading();
	        })
	        .error(function(errorResponse){
	        	Prompter.showLoadingAutoHidden("数据加载失败,请检查网络!", false, 2000);
	        });
		}

		function __handleFWDetail(objId, proType){
			if(!$scope.config.IS_FROM_WS_HISTORY){ return; }
			var items = worksheetDataService.wsDetailData.ET_HISTORY.item;
			for(var i = 0; i < items.length; i++){
				if(items[i].OBJECT_ID == objId && items[i].PROCESS_TYPE == proType){
					items[i].START_DATE = $scope.datas.detail.ES_OUT_LIST.START_DATE;
					items[i].START_TIME = $scope.datas.detail.ES_OUT_LIST.START_TIME;
					items[i].END_DATE = $scope.datas.detail.ES_OUT_LIST.END_DATE;
					items[i].END_TIME = $scope.datas.detail.ES_OUT_LIST.END_TIME;
					items[i].DESCRIPTION = $scope.datas.detail.ES_OUT_LIST.DESCRIPTION;
					items[i].TYPE_DESC = $scope.datas.detail.ES_OUT_LIST.TYPE_DESC;
				}
			}
		}

		// 修改工单状态
		//		eg: requestChangeStatus("E0008", "已打回", "正在打回", "打回成功", "打回失败，请检查网络");
		function requestChangeStatus(statusId, statusStr, statucChangingStr, changeOkStr, requestErrorStr){
	        var queryParams = {
			    "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
			    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
			    "IV_OBJECT_ID": $scope.config.OBJECT_ID+"",
			    "IV_PROCESS_TYPE": $scope.config.PROCESS_TYPE,
			    "IS_HEAD_DATA": {
			    	"STATUS": statusId,
			    	"DESCRIPTION": $scope.datas.detail.ES_OUT_LIST.DESCRIPTION_EDIT
			    }
			}
			Prompter.showLoading(statucChangingStr); //baoGongService.BAOWS_EDIT     worksheetHttpService.serviceDetailChange
	        var promise = HttpAppService.post(baoGongService.BAOWS_EDIT.url,queryParams);
	        promise.success(function(response){
	        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG=="S"){
	        		//requestChangeStatus("E0002", "已报工", "正在报工", "报工完成", "报工失败，请检查网络");
	        		if(statusId == "E0002"){
	        			worksheetDataService.wsEditToDetail.needReload = true;
	        		}
	        		Prompter.showLoadingAutoHidden(changeOkStr, false, 1000);
	        		__changeStatus(statusId, statusStr);
	        		//if(statusId == "E0002"){ //派工后，需要重新刷新数据
	        			// $timeout(function(){
	        			// 	__requestDetailDatas("正在刷新详情");
	        			// }, 1000);
	        		//}
	        		//刷新数据
	        		//__requestDetailDatas("刷新数据中!");
	        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG == "E" && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!=""){
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!="" ){
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        	}else if(response && response.ES_RESULT){
	        		Prompter.showLoadingAutoHidden(JSON.stringify(response), false, 2000);
	        	}else{
	        		Prompter.showLoadingAutoHidden(response, false, 2000);
	        	}
	        	if(!$scope.datas.serviceListDatas){
	        		$scope.datas.serviceListDatas = [];
	        	}
	        })
	        .error(function(errorResponse){
	        	$scope.config.loadingErrorMsg = "状态修改失败,请检查网络!";
	        	Prompter.showLoadingAutoHidden(requestErrorStr, false, 2000);
	        });
		}


        
    }]);