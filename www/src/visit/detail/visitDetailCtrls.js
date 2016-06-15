visitModule.controller('visitDetailCtrl', [
	'$scope','visitService','HttpAppService','Prompter','$ionicModal','$timeout','$cordovaToast','LoginService','$state',
	function ($scope,visitService,HttpAppService,Prompter,$ionicModal,$timeout,$cordovaToast,LoginService,$state) {
		$scope.datas = {
			detail: null,//详情
			name : null,//相关方名字
			ET_PARTNERS :null,//相关方
			customer :null,//客户
			summary :[],//zongjie
			comment :null,//评论
			pictures : [],//tupian
			content : '',//评论内容
			userName : '',//当前登录人姓名
			allInfo :'',
			time:"",
			noComment : "",
			edit : ""
		};
		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
			console.log(toState.name);
			if(toState.name == 'visit.detail'){
				$scope.init();
			}
		});
		$ionicModal.fromTemplateUrl('src/visit/detail/model/visitDetail_Modal.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.processModal = modal;
		});
		$scope.openModal=function(){
			$scope.processModal.show();
			angular.element('.modal-backdrop-bg').css('background-color', 'transparent');
			$timeout(function () {
				angular.element('.modal-backdrop').removeClass('active').css('height', '0');
			}, 50);
		}
		$scope.init = function(){
			__requestVisitDetail();
			__requestVisitPicture();
			__requestVisitName();
		};

		$scope.config = {
			photoModel: null,
			currentPhotoSrc: ''
		}
		$scope.destoryPhotoModel = function(){
			if($scope.config.photoModel){
				$scope.config.photoModel.hide();
				$scope.config.photoModel.remove();
				$scope.config.photoModel = null;
			}
		}

		$scope.$on("$destroy", function(){
			$scope.destoryPhotoModel();
		});

		$scope.showSinglePicture = function(item, index){
			if($scope.config.photoModel == null){
				$ionicModal.fromTemplateUrl('src/visit/photo/model.html', {
			        scope: $scope,
			        animation: 'slide-in-up',
			        focusFirstInput: true
			    }).then(function (modal) {
			        $scope.config.photoModel = modal;
			        $scope.config.currentPhotoSrc = item.LINE;
					$scope.config.photoModel.show();
		    	});
			}else{
				$scope.config.currentPhotoSrc = item.LINE;
				$scope.config.photoModel.show();
			}
		};

		//详情
		function __requestVisitDetail(){
			$scope.datas.summary=[];
			var options={
				I_OBJECT_ID : visitService.currentVisitDetail.OBJECT_ID
				//"I_OBJECT_ID": "0064000004"
			}
			//var postDatas = angular.copy(visitService.visit_detail.defaults);
			var postDatas = {
				"I_SYSNAME": { "SysName": visitService.getStoredByKey("sysName") },
				"IS_USER": { "BNAME": visitService.getStoredByKey("userName") }
			};
			angular.extend(postDatas, options);
			var promise = HttpAppService.post(visitService.visit_detail.url,postDatas);
			Prompter.showLoading("正在加载详情");
			promise.success(function(response, status, obj, config){
				if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
					if(response.ES_RESULT.ZFLAG == "S"){
						$scope.datas.allInfos = response;
						console.log($scope.datas.allInfos );
						$scope.datas.detail = response.ES_VISIT;
						if($scope.datas.detail.EDIT_FLAG=='X'){
							$scope.datas.edit=true;
						}else{
							$scope.datas.edit=false;
						}
						var date =$scope.datas.detail.CREATED_AT.toString();
						$scope.datas.time=date.substring(0,4)+"-"+date.substring(4,6)+"-"+date.substring(6,8)+" "
						+date.substring(8,10)+":"+date.substring(10,12)+":"+date.substring(12,14);
						$scope.datas.comment = response.ES_VISIT.COMMENT_LIST;
						if($scope.datas.comment.length==0){
							$scope.datas.noComment=true;
						}else{
							$scope.datas.noComment=false;
						}
						if(response.ET_TEXT != ''){
							for(var i=0;i< response.ET_TEXT.item_out.length;i++){
								if(response.ET_TEXT.item_out[i].TDID=='Z006'){
									$scope.datas.summary.push(response.ET_TEXT.item_out[i]);
								}
							}
						}
						if(response.ET_PARTNERS != ''){
							$scope.datas.ET_PARTNERS = response.ET_PARTNERS.item_out;
							for(var i=0;i< response.ET_PARTNERS.item_out.length;i++){
								if($scope.datas.ET_PARTNERS[i].PARTNER_FCT=='ZSRVEMPL'){
									$scope.datas.name=$scope.datas.ET_PARTNERS[i].NAME;
								}
								if($scope.datas.ET_PARTNERS[i].PARTNER_FCT=='ZCUSTOME'){
									$scope.datas.customer=$scope.datas.ET_PARTNERS[i].NAME;
								}
							}
						}
					}else if(response.ES_RESULT.ZFLAG == "E"){
						Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
					}else{
						Prompter.showLoadingAutoHidden(angular.toJson(response), false, 2000);
					}
				}else{
					Prompter.showLoadingAutoHidden(response, false, 2000);
				}
			})
			.error(function(errorResponse){
				Prompter.showLoadingAutoHidden("请求失败,请检查网络!", false, 2000);
			});
		}
		function __requestVisitPicture(options){
			Prompter.showLoading();
			var data ={
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
				"IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
				"IS_PAGE": {
					"CURRPAGE": "1",
					"ITEMS": "10"
				},
				"IS_URL": {
					OBJECT_ID : visitService.currentVisitDetail.OBJECT_ID,
					"PROCESS_TYPE": "ZVIS"
					//"OBJECT_ID": "5200000315",
					//"PROCESS_TYPE": "ZPRO"
				}
			}
			var url =ROOTCONFIG.hempConfig.basePath + 'downloadImageList';
			var photo = HttpAppService.post(url,data);
			photo.success(function(response, status, obj, config){
				if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
					if(response.ES_RESULT.ZFLAG == "S"){
						if( response.ET_OUT_LIST != ''){
							$scope.datas.pictures = response.ET_OUT_LIST.item;
							visitService.visitPicture=$scope.datas.pictures;
							console.log($scope.datas.pictures);
						}
					}else if(response.ES_RESULT.ZFLAG == "E"){
						visitService.visitPicture=[];
						Prompter.hideLoading();
						//Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
					}else{
						Prompter.showLoadingAutoHidden(angular.toJson(response), false, 2000);
						visitService.visitPicture=[];
					}
				}else{
					Prompter.showLoadingAutoHidden(response, false, 2000);
				}
			})
				.error(function(errorResponse){
					Prompter.showLoadingAutoHidden("请求失败,请检查网络!", false, 2000);
				});
		}
		//名称
		function __requestVisitName(options){
			Prompter.showLoading();
			var urlName = ROOTCONFIG.hempConfig.basePath + "STAFF_DETAIL"; //"http://117.28.248.23:9388/test/api/bty/login";
			var querParams = {
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
				"IS_EMPLOYEE": { "PARTNER": LoginService.getBupaTypeUser() }
			};
			HttpAppService.post(urlName,querParams).success(function(response){
				Prompter.hideLoading();
				console.log(response);
				if(response.ES_RESULT.ZFLAG == 'E') {
					$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
				} else if (response.ES_RESULT.ZFLAG == 'S') {
					if(response.ES_EMPLOYEE){
						$scope.datas.userName = response.ES_EMPLOYEE.NAME_LAST+response.ES_EMPLOYEE.NAME_FIRST;
						visitService.visitCreate = $scope.datas.userName;
					}
				}

			});
		}
		$scope.customer_detailstypes = [
			{
				typemane:'联系人',
				imgurl:'img/customer/customerlianxir@2x.png',
				url:'visit.contact'
			}];
		//联系人
		$scope.gocustomerLists = function(cusvalue){
			$scope.destoryPhotoModel();
			visitService.visitContact=($scope.datas.allInfos);
			$state.go(cusvalue.url);
		};
		//$scope.init();
		//评论提交
		$scope.submit=function(){
			var dataSubmit ={
				"sys_name": ROOTCONFIG.hempConfig.baseEnvironment ,
				"comment_person":  window.localStorage.crmUserName ,
				"visit_id":visitService.currentVisitDetail.OBJECT_ID,
				"comment_person_name":$scope.datas.userName,
				"content":$scope.datas.content,
				"DATE_FROM": $scope.datas.allInfos.ES_VISIT.DATE_FROM,
				"TIME_FROM": $scope.datas.allInfos.ES_VISIT.TIME_FROM,
				"DATE_TO": $scope.datas.allInfos.ES_VISIT.DATE_TO,
				"TIME_TO": $scope.datas.allInfos.ES_VISIT.TIME_TO,
				"DESCRIPTION": $scope.datas.allInfos.ES_VISIT.DESCRIPTION,
				"ACT_LOCATION": $scope.datas.allInfos.ES_VISIT.ACT_LOCATION,
				"ESTAT": $scope.datas.allInfos.ES_VISIT.ESTAT
			}
			console.log(dataSubmit);
			var urlSubmit =ROOTCONFIG.hempConfig.basePath + 'saveComment';
			if(dataSubmit.content==''){
				$cordovaToast.showShortBottom('请输入提交的内容');
				return;
			}
			Prompter.showLoading("正在上传");
			var submit = HttpAppService.post(urlSubmit,dataSubmit);
			submit.success(function(response, status, obj, config){
				console.log(response);
				if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
					if(response.ES_RESULT.ZFLAG == "S"){
						//$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
						$scope.datas.content='';
						__requestVisitDetail();
					}else if(response.ES_RESULT.ZFLAG == "E"){
						Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
					}else{
						Prompter.showLoadingAutoHidden(angular.toJson(response), false, 2000);
					}
				}else{
					Prompter.showLoadingAutoHidden(response, false, 2000);
				}
			}).error(function(errorResponse){
				Prompter.showLoadingAutoHidden("请求失败,请检查网络!", false, 2000);
			});
		}
		//编辑
		$scope.goEdit=function(){
			$scope.destoryPhotoModel();
			visitService.visitDetail=$scope.datas.allInfos;
			$state.go('visit.edit');
		}
}]);