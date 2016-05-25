visitModule.controller('visitDetailCtrl', [
	'$scope',
	function ($scope) {

	$scope.config = {

	};

	$scope.datas = {
		detail: null
	};

	$scope.init = function(){

	};
	
	function __requestVisitDetail(options){
		var postDatas = angular.copy(visitService.visit_detail.defaults);
		angular.extend(postDatas, options);
        //console.log(JSON.stringify(postData));
        var promise = HttpAppService.post(visitService.visit_detail.url,postDatas);
        Prompter.showLoading("正在加载详情");
        promise.success(function(response, status, obj, config){
        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG){
        		if(response.ES_RESULT.ZFLAG == "S"){
        			$scope.datas.detail = response.ES_VISIT;
        			$scope.datas.ET_PARTNERS = response.ET_PARTNERS;
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

	$scope.init();
}]);