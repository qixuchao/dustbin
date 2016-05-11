
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

        	$scope.$on("$stateChangeStart", function (event2, toState, toParams, fromState, fromParam){
	            if(fromState && fromState.name == 'worksheetDetail' && toState && toState.name == "worksheetEdit"){
	                /*if(window.event && window.event.type == "popstate"){
	                	if($scope.config.__popstateFlag){
		                    $scope.config.__popstateFlag = false;
		                }else{
		                    event2.preventDefault();
		                    $scope.config.__popstateFlag = true;
		                    $scope.goBack();
		                }
	                }*/
	            }
	            if(fromState && fromState.name == 'worksheetDetail' && toState && toState.name == "worksheetTakePicture"){
	                /*if(window.event && window.event.type == "popstate"){
	                	if($scope.config.__popstateFlag){
		                    $scope.config.__popstateFlag = false;
		                }else{
		                    event2.preventDefault();
		                    $scope.config.__popstateFlag = true;
		                    $scope.goBack();
		                }
	                }*/
	            }
	        });

        	$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        		//从编辑界面返回  故障详情   ( || fromState.name == 'worksheetFaultInfosEdit')
		        if(fromState && toState && (fromState.name == 'worksheetEdit' || fromState.name == 'worksheetFaultInfos') && toState.name == 'worksheetDetail'){
		            if(worksheetDataService.wsEditToDetail.needReload){
		            	worksheetDataService.wsEditToDetail.needReload = false;
		            	__requestDetailDatas();
		            }
		        }
		    });

        	$scope.$on('$destroy', function() {
				__destroyMoreModal();
			});

        	$scope.goCarDetail = function(){
        		CarService.setData({
        			ZBAR_CODE: $scope.datas.detail.ES_OUT_LIST.CAR_NO,
        			SHORT_TEXT: $scope.datas.detail.ES_OUT_LIST.CAR_DESC
        		});
        		$state.go("carDetail");
        	};

			function __destroyMoreModal(){
				if($scope.config.moreModal != null){			
					$scope.config.moreModal.remove();
					$scope.config.moreModal = null;
				}
				if($scope.selectCustomerModal != null){
					$scope.selectCustomerModal.remove();
					$scope.selectCustomerModal = null;
				}
			}

			$scope.goState = function(stateName){
				__destroyMoreModal();
				$timeout(function (){
					$state.go(stateName);
				}, 100);
			};
			$scope.dibButtonClickHandler = function(type){
				//alert(type);
				switch(type){
					case 'xiangGuanFang':
						$scope.goState('worksheetRelatedPart');
						break;
					case 'jiaoYiLiShi':
						$scope.goState('worksheetDetailHistoryList');
						break;
					case 'baoGongXinXi':
						//alert(" ~ baoGongXinXi  费用结算 ~ ");
						$scope.goState('worksheetBaoGonglist');
						//$scope.goState('worksheetDetailHistoryList');
						//alert(" ~ baoGongXinXi  费用结算 ~ 2");
						break;
				}
			};
			$scope.moreModalClickHandler = function(type){
				console.log(type);
				$scope.config.moreModal.hide();
				if(type == 'paigong'){
					//先选择处理员工
					//__selectChuLiYuanGong();
					$scope.openSelectCustomer();
					//requestChangeStatus("E0002", "已派工", "正在派工", "派工成功", "派工失败，请检查网络");
				}else if(type == 'judan'){
					requestChangeStatus("E0003", "已拒绝", "正在拒绝", "拒绝成功", "拒绝失败，请检查网络");
				}else if(type == 'jiedan'){
					requestChangeStatus("E0004", "正在处理", "正在接单", "接单成功", "接单失败，请检查网络");
				}else if(type == 'beijianshengqing'){
					if(__hasBeijianInfo()){
						$scope.goState("worksheetSelect");
					}else{
						$scope.goState("worksheetSparepart");
					}
				}else if(type == 'chelianglicheng'){
					$scope.goState("worksheetCarMileage");
				}else if(type == 'guzhangxinxi'){
					$scope.goState("worksheetFaultInfos");
				}else if(type == 'fuwupaizhao'){
					worksheetDataService.wsDetailToPaiZHao = {
						OBJECT_ID: $scope.datas.detail.ydWorksheetNum,
      					PROCESS_TYPE: $scope.datas.detail.IS_PROCESS_TYPE
					}; 
					$scope.goState("worksheetTakePicture");
				}else if(type == 'baogong'){
					//$scope.goState("worksheetbaogonglist");
					__baoGongHandler();
				}else if(type == 'wangong'){
					requestChangeStatus("E0006", "已完工", "正在完工", "完工成功", "完工失败，请检查网络");
				}else if(type == 'yiquxiao'){
					requestChangeStatus("E0009", "已取消", "正在取消", "取消成功", "取消失败，请检查网络");
				}else if(type == 'yishenhe'){  // E0007 内部已审核
					requestChangeStatus("E0010", "外服已审核", "外服审核中", "外服审核成功", "外服审核失败，请检查网络");
				}else if(type == 'yidahui'){
					requestChangeStatus("E0008", "已打回", "正在打回", "打回成功", "打回失败，请检查网络");
				}
			};

			function __baoGongHandler(){
				var history = $scope.datas.detail.ET_HISTORY;
				if(angular.isUndefined(history) || history == null || history == "" || !history.item || history.item.length ==0){
					//直接跳转到报工单创建界面
					__goBaoGongCreatePage();
				}else{
					$scope.config.baoGongActionSheet = $ionicActionSheet.show({
						buttons: [
							{text: '新建报工'},
							{text: '修改工单状态'}
						],
						//destructiveText: 'Delete',
					    titleText: '报工操作',
					    cancelText: '取消',
					    cssClass: 'image-take-actionsheet',
					    cancel: function(){
					    	//$scope.config.baoGongActionSheet();
					    },
					    buttonClicked: function(index){
					    	if(index == 0){ //新建报工
								__goBaoGongCreatePage();
					    		return true;
					    	}else if(index == 1){ //修改工单状态
					    		requestChangeStatus("E0005", "已报工", "正在报工", "报工完成", "报工失败，请检查网络");
					    		return true;
					    	}
					    	//return false;
					    }
					});
				}
			}
			function __goBaoGongCreatePage(){
				var waifuRenyuan = {};
				var ets = $scope.datas.detail.ET_PARTNER;
				if(!angular.isUndefined(ets) && ets!= null && ets!="" && !angular.isUndefined(ets.item) && !angular.isUndefined(ets.item.length)){
					for(var i = 0; i < ets.item.length; i++){
						if(ets.item[i].PARTNER_FCT == "ZSRVEMPL"){
							waifuRenyuan = angular.copy(ets.item[i]);
						}
					}
				}
				baoGongService.createFromWSDetail = {
					IS_OBJECT_ID: $scope.datas.detail.ydWorksheetNum,
					IS_PROCESS_TYPE: $scope.datas.detail.IS_PROCESS_TYPE,
					TYPE_DESC: $scope.datas.detail.ES_OUT_LIST.TYPE_DESC,
					DESCRIPTION: $scope.datas.detail.ES_OUT_LIST.DESCRIPTION,
					STATU: $scope.datas.detail.ES_OUT_LIST.STATU,
					STATU_DESC: $scope.datas.detail.ES_OUT_LIST.STATU_DESC,
					WAIFU_EMP: angular.copy(waifuRenyuan)
				};
				$state.go("baoGongCreate");
			}
			
			$scope.showRequestModel = function(){
				if($scope.cofnig.requestModal == null){
					$scope.config.requestModal = $ionicModal.fromTemplate("<div class='show-request-modal-content worksheet-detail'>"+
						+"<div ng-bind='config.requestModalStr'></div>"+
						+"</div>", {
						scope: $scope
					});
				}
			};
			$scope.canShowMoreBtn = function(){
				if($scope.config.canEdit){
					return true;
				}
				return false;
			};
			$scope.showMoreModel = function($event, sourceClassName){
			    if($scope.config.moreModal == null){
			    	$scope.config.moreModal = $ionicModal.fromTemplate("<div class='show-more-modal-content "+$scope.config.typeStr+" "+$scope.config.statusStr+"'>"+
		                "<div><div class='top-line'></div></div>"+
		                "<div class='content-lines'>"+
		                    "<div class='content-line paigong' ng-click='moreModalClickHandler(\"paigong\");'>派工</div>"+
		                    "<div class='content-line judan' ng-click='moreModalClickHandler(\"judan\");'>拒单</div>"+
		                    "<div class='content-line jiedan' ng-click='moreModalClickHandler(\"jiedan\");'>接单</div>"+
		                    "<div class='content-line beijian' ng-click='moreModalClickHandler(\"beijianshengqing\");'>备件申请</div>"+
		                    "<div class='content-line chelianglicheng' ng-click='moreModalClickHandler(\"chelianglicheng\");'>车辆读数</div>"+
		                    "<div class='content-line guzhangxinxi' ng-click='moreModalClickHandler(\"guzhangxinxi\");'>故障信息</div>"+
		                    "<div class='content-line fuwupaizhao' ng-click='moreModalClickHandler(\"fuwupaizhao\");'>服务拍照</div>"+
		                    "<div class='content-line baogong' ng-click='moreModalClickHandler(\"baogong\");'>报工</div>"+
		                    "<div class='content-line wangong' ng-click='moreModalClickHandler(\"wangong\");'>完工</div>"+
		                    "<div class='content-line yiquxiao' ng-click='moreModalClickHandler(\"yiquxiao\");'>取消</div>"+
		                    "<div class='content-line yishenhe' ng-click='moreModalClickHandler(\"yishenhe\");'>已审核</div>"+
		                    "<div class='content-line yidahui' ng-click='moreModalClickHandler(\"yidahui\");'>打回</div>"+
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

			$scope.editDetail = function(){
				//$rootScope.$viewHistory.currentView = $rootScope.$viewHistory.backView;

				var params = $scope.config.requestParams;
				if(params.IS_PROCESS_TYPE == 'ZNCO'){	//ZNCO 新车档案收集工单 
					$state.go("worksheetEdit", {
						detailType: 'newCar'
					});
				}else if(params.IS_PROCESS_TYPE == 'ZPRO'){  //ZPRO 现场维修工单 
					$state.go("worksheetEdit", {
						detailType: 'siteRepair'
					});
				}else if(params.IS_PROCESS_TYPE == 'ZPLO'){	// ZPLO 批量改进工单
					$state.go("worksheetEdit", {
						detailType: 'batchUpdate'
					});
				}
			};

			$scope.canShowEditBtn = function(){
				if(!$scope.config.canEdit){
					return false;
				}
				var type = $scope.config.typeStr;
				var status = $scope.config.statusStr;
				if(type == 'ZPRO' || type =='ZPLO' || type == 'ZNCO'){
					if(status == "E0006" || status == "E0010" || status == "E0007" || status == "E0009"){ //已完工、已回访、已审核、已取消
						return false;
					}
					return true;
				}
				return false;
			};
			
        	$scope.config = {
        		typeStr: '',
        		statusStr:'',

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
				detail: null,
				empDatas: [],
				/*
					{
						kyhuMingCheng: 客户名称
						waifuRenyuan: 外服人员姓名
						......
					}
				*/
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

			function __hasBeijianInfo(){
				//var beijian = $scope.datas.detail.ET_MAT_LIST;
				var beijian = worksheetDataService.wsDetailData.ET_MAT_LIST;
				if(beijian && beijian.item && beijian.item.length>0){
					return true;
				}
				return false;
			}
			
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

            $scope.init = function(){
            	//console.log($stateParams.detailType);
            	// newCar、siteRepair、batchUpdate
            	var type = $stateParams.detailType;
            	$scope.config.detailType = type;
            	if(type == "newCar"){
            		$scope.config.detailTypeNewCar = true;
            		$scope.datas.header = $scope.datas.headerNewCar;
            	}else if(type == "siteRepair"){
            		$scope.config.detailTypeSiteRepair = true;
            		$scope.datas.header = $scope.datas.headerSiteRepair;
            	}else if(type == "batchUpdate"){
            		$scope.config.detailTypeBatchUpdate = true;
            		$scope.datas.header = $scope.datas.headerBatchUpdate;
            	}else{
            		throw "type 不在预期范围内!";
            	}

            	$scope.config.requestParams = worksheetDataService.worksheetList.toDetail;
            	$scope.config.ydStatusNum = worksheetDataService.worksheetList.toDetail.ydStatusNum;
            	$scope.config.typeStr = worksheetDataService.worksheetList.toDetail.IS_PROCESS_TYPE;
            	$scope.config.statusStr = worksheetDataService.worksheetList.toDetail.ydStatusNum;
            	__requestDetailDatas();
            };

            $scope.init();

            function __changeStatus(newStatus, newStatusDesc){
            	worksheetDataService.wsDetailToList.needReload = true;
            	$scope.config.statusStr = $scope.config.ydStatusNum = worksheetDataService.worksheetList.toDetail.ydStatusNum = newStatus;
            	$scope.datas.detail.ES_OUT_LIST.STATU_DESC = newStatusDesc;
            	$scope.datas.detail.ES_OUT_LIST.STATU = newStatus;

            	worksheetDataService.wsDetailData.ES_OUT_LIST.STATU = $scope.datas.detail.ES_OUT_LIST.STATU;
            	worksheetDataService.wsDetailData.ES_OUT_LIST.STATU_DESC = $scope.datas.detail.ES_OUT_LIST.STATU_DESC;

            	__destroyMoreModal();            	
            	if(!$scope.$$phase){
            		$scope.$apply();
            	}
            }
            
            function __requestDetailDatas(loadStr){
            	var loadingStr = loadStr ? loadStr : "正在加载" ;
		        var params = $scope.config.requestParams;
		        var queryParams = {
				    "I_SYSNAME": { "SysName": worksheetDataService.getStoredByKey("sysName") },
				    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
				    "IS_OBJECT_ID": params.IS_OBJECT_ID,
				    "IS_PROCESS_TYPE": params.IS_PROCESS_TYPE
				}

				Prompter.showLoading(loadingStr);

		        var promise = HttpAppService.post(worksheetHttpService.serviceDetail.url,queryParams);
		        $scope.config.isLoading = true;
		        $scope.config.loadingErrorMsg = null;
		        promise.success(function(response){
		        	if(response && !response.ES_RESULT){
		        		Prompter.showLoadingAutoHidden(response, false, 2000);
		        	}
		        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG != "S"){ // 未加载到数据
		        		$scope.config.hasMoreData = false;
		        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
		        		return;
		        	}
		        	if(!$scope.datas.serviceListDatas){
		        		$scope.datas.serviceListDatas = [];
		        	}
		        	var kyhuMingCheng = "";
					var waifuRenyuan = ""; 
		        	var tempResponse = response;
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
		        	
		        	tempResponse.ydWorksheetNum = params.IS_OBJECT_ID;
		        	tempResponse.kyhuMingCheng = kyhuMingCheng;
		        	tempResponse.waifuRenyuan = waifuRenyuan;
		        	tempResponse.IS_PROCESS_TYPE = params.IS_PROCESS_TYPE;
		        	$scope.datas.detail = tempResponse;
		        	worksheetDataService.wsDetailData = tempResponse;

		        	if(tempResponse.ES_OUT_LIST && tempResponse.ES_OUT_LIST.EDIT_FLAG == "X"){
		        		$scope.config.canEdit = true;
		        	}else{
		        		$scope.config.canEdit = false;
		        	}

		        	Prompter.hideLoading();


		        	//debugger;
		        	//console.log(tempResponse);
		        })
		        .error(function(errorResponse){
		        	$scope.config.loadingErrorMsg = "数据加载失败,请检查网络!";
		        	Prompter.showLoadingAutoHidden($scope.config.loadingErrorMsg, false, 2000);
		        	$scope.config.isLoading = false;
		        	if($scope.config.isReloading){
		        		$scope.config.isReloading = false;
		        		$scope.$broadcast('scroll.refreshComplete');
		        		$scope.datas.serviceListDatas = [];
		        		$scope.config.hasMoreData = false;
		        	}		        	
		        });
			}
			// 修改工单状态
			//requestChangeStatus("E0008", "已打回", "正在打回", "打回成功", "打回失败，请检查网络");
			function requestChangeStatus(statusId, statusStr, statucChangingStr, changeOkStr, requestErrorStr){
				var params = $scope.config.requestParams;
		        var queryParams = {
				    "I_SYSTEM": { "SysName": worksheetDataService.getStoredByKey("sysName") },
				    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
				    "IS_OBJECT_ID": params.IS_OBJECT_ID+"",
				    "IS_PROCESS_TYPE": params.IS_PROCESS_TYPE,
				    "IS_HEAD_DATA": {
				    	"STATUS": statusId
				    }
				}
				if(statusId == "E0002"){ //派工
					if($scope.config.selectedEmp==null){
						return;
					}
					queryParams.IT_PARTNER = {
						item: {
							"PARTNER_FCT": "ZSRVEMPL",
        					"PARTNER_NO": $scope.config.selectedEmp.PARTNER,
        					"ZMODE": "U"
						}
					}
				}
				//console.log(queryParams);
				Prompter.showLoading(statucChangingStr);
		        var promise = HttpAppService.post(worksheetHttpService.serviceDetailChange.url,queryParams);
		        $scope.config.isLoading = true;
		        $scope.config.loadingErrorMsg = null;
		        promise.success(function(response){
		        	$scope.config.isLoading = false;
		        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG=="S"){
		        		Prompter.showLoadingAutoHidden(changeOkStr, false, 1000);
		        		__changeStatus(statusId, statusStr);
		        		if(statusId == "E0002"){ //派工后，需要重新刷新数据
		        			$timeout(function(){
		        				__requestDetailDatas("正在刷新详情");
		        			}, 1000);
		        		}
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
		        	$scope.config.isLoading = false;
		        	$scope.config.loadingErrorMsg = "状态修改失败,请检查网络!";
		        	Prompter.showLoadingAutoHidden(requestErrorStr, false, 2000);
		        });
			}

			//选择员工相关 $scope.config.selectedEmp
			function __selectChuLiYuanGong(){
				if($scope.config.selectYuanGongModal == null){
					$ionicModal.fromTemplateUrl('src/worksheet/modals/select_emp_modal_tpl.html', {
			            scope: $scope,
			            animation: 'slide-in-up',
			            focusFirstInput: true
			        }).then(function (modal) {
			            $scope.config.selectYuanGongModal = modal;
			            $scope.config.selectYuanGongModal.show();
			        });
				}else{
					$scope.config.selectYuanGongModal.show();				
				}
			}

			$scope.changeEmpSearchStr = function(){
				//$scope.config.empSearchStr = 
			};
			// selectYuanGongModal: null,  empSearchStr
			//	selectedEmp: null     empPage
			$scope.cancelSelectEmp = function(){
				if($scope.config.selectYuanGongModal != null && $scope.config.selectYuanGongModal.isShown()){
					$scope.config.selectYuanGongModal.hide();
					$scope.config.selectYuanGongModal.remove();
					$scope.config.selectYuanGongModal = null;
				}
			};

			function __requestEmpDatas(){
				//Prompter.showLoading("");
				var options = worksheetHttpService.empsList.defaults;
				options.IS_EMPLOYEE.NAME = $scope.config.empSearchStr;
				options.IS_PAGE.CURRPAGE = $scope.config.empPage;
		        var promise = HttpAppService.post(worksheetHttpService.empsList.url,options);
		        $scope.config.isLoading = true;
		        $scope.config.loadingErrorMsg = null;
		        promise.success(function(response){
		        	$scope.config.isLoading = false;
		        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG=="S"){
		        		$scope.config.loadingErrorMsg = null;
		        		$scope.datas.empDatas.concat(response.ET_EMPLOYEE.item);
		        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG == "E" && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!=""){
		        		$scope.config.loadingErrorMsg = response.ES_RESULT.ZRESULT;
		        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!="" ){
		        		$scope.config.loadingErrorMsg = response.ES_RESULT.ZRESULT;
		        	}else if(response && response.ES_RESULT){
		        		$scope.config.loadingErrorMsg = angular.toJson(response);
		        	}else{
		        		$scope.config.loadingErrorMsg  = response;
		        	}
		        })
		        .error(function(errorResponse){
		        	$scope.config.isLoading = false;
		        	$scope.config.loadingErrorMsg = "员工查询失败,请检查网络!";
		        });
			}

			//选择员工:
			var customerPage = 1;
            $scope.customerArr = [];
            $scope.customerSearch = false;
            $scope.input = {	customer: '' };
            $scope.getCustomerArr = function (search) {
                $scope.CustomerLoadMoreFlag = false;
                if (search) {
                    $scope.customerSearch = false;
                    customerPage = 1;
                } else {
                    $scope.spinnerFlag = true;
                }
                var data = {
                    "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                    "IS_PAGE": {
                        "CURRPAGE": customerPage++,
                        "ITEMS": "10"
                    },
                    "IS_EMPLOYEE": { "NAME": $scope.input.customer }
                };
                console.log(data);
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST', data)
                    .success(function (response) {
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            if (response.ET_EMPLOYEE.item.length < 10) {
                                $scope.CustomerLoadMoreFlag = false;
                            }
                            if (search) {
                                $scope.customerArr = response.ET_EMPLOYEE.item;
                            } else {
                                $scope.customerArr = $scope.customerArr.concat(response.ET_EMPLOYEE.item);
                            }
                            $scope.spinnerFlag = false;
                            $scope.customerSearch = true;
                            $scope.CustomerLoadMoreFlag = true;
                            $ionicScrollDelegate.resize();
                            //saleActService.customerArr = $scope.customerArr;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    });
            };
            // src/applications/saleActivities/modal/selectCustomer_Modal.html
            
            $scope.customerModalArr = [{text: "公司员工"}]; //saleActService.getCustomerTypes();
            $scope.selectCustomerText = '公司员工';
            $scope.openSelectCustomer = function(){
                $scope.isDropShow = true;
                $scope.customerSearch = true;
                if($scope.selectCustomerModal == null){
                	$ionicModal.fromTemplateUrl('src/worksheet/modals/select_emp_modal_tpl.html',{
		                scope: $scope,
		                animation: 'slide-in-up',
		                focusFirstInput: true
		            }).then(function (modal){
		                $scope.selectCustomerModal = modal;
		                $scope.selectCustomerModal.show();
		            });
                }else{
                	$scope.selectCustomerModal.show();
                }
                
            };
            $scope.closeSelectCustomer = function () {
                $scope.selectCustomerModal.hide();
            };
            $scope.selectPop = function (x) {
                $scope.selectCustomerText = x.text;
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.changeReferMoreflag = function () {
                $scope.referMoreflag = !$scope.referMoreflag;
            };
            $scope.showChancePop = function () {
                $scope.referMoreflag = true;
                $scope.isDropShow = true;
            };
            $scope.initCustomerSearch = function () {
                $scope.input.customer = '';
                //$scope.getCustomerArr();
                $timeout(function () {
                    document.getElementById('selectCustomerId').focus();
                }, 1)
            }; 
            $scope.create = {};
            $scope.selectCustomer = function(x){
                $scope.create.customer = x;
                $scope.create.contact = '';
                contactPage = 1;
                $scope.contacts = [];
                $scope.contactSpinnerFLag = true;
                $scope.contactsLoadMoreFlag = true;
                //$scope.getContacts();
                $scope.selectCustomerModal.hide();

                $scope.config.selectedEmp = x;
                $cordovaDialogs.confirm("确定派工给"+x.NAME_LAST+x.NAME_FIRST+"吗?", "提示", ["确定","取消"])
                	.then(function(buttonIndex){
                		var btnIndex = buttonIndex;
                		if(btnIndex == 1){
                			requestChangeStatus("E0002", "已派工", "正在派工", "派工成功", "派工失败，请检查网络");                			
                		}else{
                			$scope.cofnig.selectedEmp = null;
                		}
                	});

                //Prompter.wsConfirm("提示",isLoadingNum+'张图片正在上传,确定放弃?',"确定", "取消");

                
            };


            
        }]);