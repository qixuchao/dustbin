visitModule.controller('visitDetailCtrl', [
	'$scope','visitService','HttpAppService','Prompter','$ionicModal',
	function ($scope,visitService,HttpAppService,Prompter,$ionicModal) {

		$scope.config = {
			pictures:[
				{
					src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
				},
				{
					src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
				},
				{
					src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
				},
				{
					src: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
				}]
		};

		$scope.datas = {
			detail: null,
			name : null,
			ET_PARTNERS :null,
			customer :null,
			summary :[],
			comment :null
		};
		$ionicModal.fromTemplateUrl('src/visit/detail/model/visitDetail_Modal.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.processModal = modal;
		});
		$scope.openModal=function(){
			$scope.processModal.show();
		}
		$scope.init = function(){
			var options={
				//I_OBJECT_ID : visitService.currentVisitDetail.OBJECT_ID
				"I_OBJECT_ID": "0064000004"
			}
			__requestVisitDetail(options);
		};
		function __requestVisitDetail(options){
			var postDatas = angular.copy(visitService.visit_detail.defaults);
			angular.extend(postDatas, options);
			console.log(JSON.stringify(postDatas));
			var promise = HttpAppService.post(visitService.visit_detail.url,postDatas);
			Prompter.showLoading("正在加载详情");
			promise.success(function(response, status, obj, config){
				if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
					if(response.ES_RESULT.ZFLAG == "S"){
						$scope.datas.detail = response.ES_VISIT;
						$scope.datas.comment = response.ES_VISIT.COMMENT_LIST;
						console.log(response.ET_TEXT.item_out);
						if(response.ET_TEXT != ''){
							console.log($scope.datas.summary);
							for(var i=0;i< response.ET_TEXT.item_out.length;i++){
								if(response.ET_TEXT.item_out[i].TDID=='Z008'){
									$scope.datas.summary.push(response.ET_TEXT.item_out[i]);
								}
							}
						}
						console.log($scope.datas.summary);
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
			//var photo = HttpAppService.post(visitService.visit_detail.url,postDatas);
			//photo.success(function(response, status, obj, config){
			//	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
			//		if(response.ES_RESULT.ZFLAG == "S"){
            //
			//		}else if(response.ES_RESULT.ZFLAG == "E"){
			//			Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
			//		}else{
			//			Prompter.showLoadingAutoHidden(angular.toJson(response), false, 2000);
			//		}
			//	}else{
			//		Prompter.showLoadingAutoHidden(response, false, 2000);
			//	}
			//})
			//.error(function(errorResponse){
			//	Prompter.showLoadingAutoHidden("请求失败,请检查网络!", false, 2000);
			//});
		}
		$scope.customer_detailstypes = [
			{
				typemane:'联系人',
				imgurl:'img/customer/customerlianxir@2x.png',
				url:'customerContactQuery'
			}];
		$scope.gocustomerLists = function(cusvalue){
			if(cusvalue.url == "customerContactQuery"){
				//customeService.set_customerEditServevalue( $scope.customerdetails);
			}
			//$state.go(cusvalue.url);
		};
		$scope.init();
}]);