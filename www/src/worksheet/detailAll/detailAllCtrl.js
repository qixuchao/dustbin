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
        function ($scope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $stateParams, $ionicPosition, HttpAppService, worksheetHttpService, worksheetDataService) {

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
					
				}else if(type == 'yishenhe'){
					
				}
			};
			
			$scope.showMoreModel = function($event, sourceClassName){
			    if($scope.config.moreModal == null){
			    	$scope.config.moreModal = $ionicModal.fromTemplate("<div class='show-more-modal-content "+$scope.config.typeStr+"'>"+
		                "<div><div class='top-line'></div></div>"+
		                "<div class='content-lines'>"+
		                    "<div class='content-line paigong' ng-click='moreModalClickHandler(\"paigong\");'>派工</div>"+
		                    "<div class='content-line judan' ng-click='moreModalClickHandler(\"judan\");'>拒单</div>"+
		                    "<div class='content-line jiedan' ng-click='moreModalClickHandler(\"jiedan\");'>接单</div>"+
		                    "<div class='content-line beijian' ng-click='moreModalClickHandler(\"beijianshengqing\");'>备件申请</div>"+
		                    "<div class='content-line chelianglicheng' ng-click='moreModalClickHandler(\"chelianglicheng\");'>车辆里程</div>"+
		                    "<div class='content-line guzhangxinxi' ng-click='moreModalClickHandler(\"guzhangxinxi\");'>故障信息</div>"+
		                    "<div class='content-line fuwupaizhao' ng-click='moreModalClickHandler(\"fuwupaizhao\");'>服务拍照</div>"+
		                    "<div class='content-line baogong' ng-click='moreModalClickHandler(\"baogong\");'>报工</div>"+
		                    "<div class='content-line wangong' ng-click='moreModalClickHandler(\"wangong\");'>完工</div>"+
		                    "<div class='content-line yiquxiao' ng-click='moreModalClickHandler(\"yiquxiao\");'>已取消</div>"+
		                    "<div class='content-line yishenhe' ng-click='moreModalClickHandler(\"yishenhe\");'>已审核</div>"+
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
        		typeStr: '',

				scrollDelegateHandler: null,
				contentDetegateHandler: null,

				detailType: '',
				detailTypeNewCar: false,
				detailTypeSiteRepair: false,
				detailTypeBatchUpdate: false,
				detailTypeNewCarFWS: false,
				detailTypeSiteRepairFWS: false,
				detailTypeBatchUpdateFWS: false,
				
				moreModal: null
			};
			$scope.datas = {
				detail: null,
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
                console.log(position);
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
                    if (position > 80) {
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

            	$scope.config.requestParams = worksheetDataService.worksheetList.toDetail;
            	$scope.config.typeStr = worksheetDataService.worksheetList.toDetail.IS_PROCESS_TYPE;
            	__requestDetailDatas();
            };

            $scope.init(); 

            function __requestDetailDatas(){
		        var params = $scope.config.requestParams;
		        var queryParams = {
				    "I_SYSNAME": { "SysName": "CATL" },
				    "IS_AUTHORITY": { "BNAME": "" },
				    "IS_OBJECT_ID": params.IS_OBJECT_ID,
				    "IS_PROCESS_TYPE": params.IS_PROCESS_TYPE
				}

		        var promise = HttpAppService.post(worksheetHttpService.serviceDetail.url,queryParams);
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
		        		return;
		        	}
		        	if(!$scope.datas.serviceListDatas){
		        		$scope.datas.serviceListDatas = [];
		        	}
		        	$scope.datas.detail = response;
		        	worksheetDataService.wsDetailData = response;
		        	//debugger;
		        	//console.log(response);
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

            
        }]);