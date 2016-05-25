signinModule.controller('signinDetailCtrl', [
	'$scope',
	"$timeout", 
	"signinService",
	"$state",
	"HttpAppService",
	"Prompter",
	"$ionicHistory",
	"$cordovaGeolocation",
	function ($scope, $timeout, signinService, $state, HttpAppService, 
		Prompter, $ionicHistory, $cordovaGeolocation) {
	
	$scope.config = {
		isEditMode: false,
		hasEdited: false
	};
	$scope.datas = {
		detail: null
	};
	$scope.init = function(){
		$scope.datas.detail = signinService.currentSigninDetail;
		$scope.datas.detail.comment_edit = $scope.datas.detail.comment;
		$scope.datas.detail.address_edit = $scope.datas.detail.address;
		$timeout(function(){
			// 先获取元素
			var lbsGeo = document.getElementById('geo');
			//监听定位失败事件 geofail	
			lbsGeo.addEventListener("geofail",function(evt){ 
				alert("fail");
			});
			//监听定位成功事件 geosuccess
			lbsGeo.addEventListener("geosuccess",function(evt){ 
				console.log(evt.detail);
				var address = evt.detail.address;
				var coords = evt.detail.coords;
				var x = coords.lng;
				var y = coords.lat;
				alert("地址："+address);
				alert("地理坐标："+x+','+y);
			});
		}, 800);
	};
	$scope.init();

	$scope.goBack = function(){
		signinService.signinListNeedRefresh = $scope.config.hasEdited;
		$ionicHistory.goBack();
	};

	$scope.cancleEdit = function(){
		$scope.config.isEditMode = false;
	};
	$scope.enterEditMode = function(){
		$scope.config.isEditMode = true;
	};
	$scope.editConfirm = function(){
		__requestSaveSignin({
			"attendance_id": $scope.datas.detail.attendance_id,
			"comment": $scope.datas.detail.comment_edit,
			"user_code": signinService.getStoredByKey("userName")
		}, function(response){
			$scope.datas.detail.comment = $scope.datas.detail.comment_edit;
			$scope.config.isEditMode = false;
			$scope.config.hasEdited = true;
		});
	};

	function __requestSaveSignin(options, successCallback){
        var url = signinService.signin_edit.url;
        // var postDatas = signinService.signin_list.defaults;
        // angular.extend(postDatas, options);
        var promise = HttpAppService.post(url, options);
        Prompter.showLoading("正在保存");
        promise.success(function(response, status, obj, config){
        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG=="S"){
        		successCallback(response);
        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT != null){
        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT);
        	}else{
        		Prompter.showLoadingAutoHidden(JSON.stringify(response));
        	}
        	//Prompter.hideLoading();
        })
        .error(function(errorResponse){
        	Prompter.showLoadingAutoHidden("数据加载失败,请检查网络!");
        });
	}



}]);

