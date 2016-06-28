signinModule.controller('signinDetailCtrl', [
	'$scope',
	"$timeout", 
	"signinService",
	"$state",
	"HttpAppService",
	"Prompter",
	"$ionicHistory",
	"BaiduMapServ",'$cordovaDialogs','LoginService','$cordovaToast',
	function ($scope, $timeout, signinService, $state, HttpAppService, 
		Prompter, $ionicHistory, BaiduMapServ,$cordovaDialogs,LoginService,$cordovaToast) {
	
	$scope.config = {
		isEditMode: false,
		hasEdited: false,
		isLocationing: false, //正在定位
		title : "签到明细",
		userCode: '',
		show : ""
	};
	$scope.datas = {
		detail: null
	};
	$scope.init = function(){
		$scope.datas.detail = signinService.currentSigninDetail;
		console.log($scope.datas.detail);
		$scope.datas.detail.comment_edit = $scope.datas.detail.comment;
		$scope.datas.detail.address_edit = $scope.datas.detail.address;
		__requestVisitName();
		// $timeout(function(){
		// 	// 先获取元素
		// 	var lbsGeo = document.getElementById('geo');
		// 	//监听定位失败事件 geofail	
		// 	lbsGeo.addEventListener("geofail",function(evt){ 
		// 		alert("fail");
		// 	});
		// 	//监听定位成功事件 geosuccess
		// 	lbsGeo.addEventListener("geosuccess",function(evt){ 
		// 		console.log(evt.detail);
		// 		var address = evt.detail.address;
		// 		var coords = evt.detail.coords;
		// 		var x = coords.lng;
		// 		var y = coords.lat;
		// 		alert("地址："+address);
		// 		alert("地理坐标："+x+','+y);
		// 	});
		// }, 800);
	};
	$scope.init();

		//名称
		function __requestVisitName(options){
			Prompter.showLoading();
			var urlName = ROOTCONFIG.hempConfig.basePath + "STAFF_DETAIL"; //"http://117.28.248.23:9388/test/api/bty/login";
			var querParams = {
				"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
				"IS_EMPLOYEE": { "PARTNER": LoginService.getBupaTypeUser() },
				"IS_USER": { "BNAME": window.localStorage.crmUserName }
			};
			HttpAppService.post(urlName,querParams).success(function(response){
				Prompter.hideLoading();
				console.log(response);
				if(response.ES_RESULT.ZFLAG == 'E') {
					$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
				} else if (response.ES_RESULT.ZFLAG == 'S') {
					if(response.ES_EMPLOYEE){
						//$scope.config.userName = response.ES_EMPLOYEE.NAME_LAST+response.ES_EMPLOYEE.NAME_FIRST;
						$scope.config.userCode = response.ES_EMPLOYEE.PARTNER;

						console.log($scope.config.userCode);
						console.log($scope.datas.detail.person_code);
						if($scope.config.userCode != $scope.datas.detail.person_code){
							$scope.config.show = false;
						}else {
							$scope.config.show = true;
						}
					}
				}

			});
		}
	$scope.currentLocation = function(){
		if($scope.config.isLocationing){
			return;
		}
		$scope.config.isLocationing = true;
		BaiduMapServ.getCurrentLocation().then(function (success) {
            console.log('success = ' + angular.toJson(success));
            var lat = success.lat;
            var lng = success.long;
            BaiduMapServ.locationToAddress(lat, lng).then(function(response){
            	$scope.config.isLocationing = false;
            	if(response && response.formatted_address && response.formatted_address !=""){
            		$scope.datas.detail.address_edit = response.formatted_address;
            		if($scope.$phase){
            			$scope.$apply();
            		}
            	}
	        }, function(response){
	        	$scope.config.isLocationing = false;
	        	$cordovaToast.showShortBottom(angular.toJson(response));
	        });
        }, function (error) {
        	$scope.config.isLocationing = false;
        	$cordovaToast.showShortBottom(angular.toJson(error));
        });
	}

	$scope.goBack = function(){
		signinService.signinListNeedRefresh = $scope.config.hasEdited;
		$ionicHistory.goBack();
	};

	$scope.cancleEdit = function(){
		$cordovaDialogs.confirm('是否退出编辑界面', '提示', ['确定', '取消'])
			.then(function (buttonIndex) {
				// no button = 0, 'OK' = 1, 'Cancel' = 2
				var btnIndex = buttonIndex;
				if (btnIndex == 1) {
					$scope.config.isEditMode = false;
				}
			});
	};
	$scope.enterEditMode = function(){
		$scope.config.title="签到编辑";
		$scope.config.isEditMode = true;
	};
	$scope.editConfirm = function(){
		__requestSaveSignin({
			"attendance_id": $scope.datas.detail.attendance_id,
			"comment": $scope.datas.detail.comment_edit,
			"user_code": signinService.getStoredByKey("userName"),
			"sys_name": signinService.getStoredByKey("sysName")
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
			$scope.config.title="签到明细";
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

