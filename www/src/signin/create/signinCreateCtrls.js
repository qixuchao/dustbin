signinModule.controller('signinCreateCtrl', [
	'$scope',
	"$timeout", 
	"signinService",
	"$state",
	"BaiduMapServ",
	"$cordovaToast",
	"HttpAppService",
	"Prompter",
	"$ionicHistory",'LoginService',
	function ($scope, $timeout, signinService, $state, BaiduMapServ, 
		$cordovaToast, HttpAppService, Prompter, $ionicHistory,LoginService) {

	$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        if(fromState && toState && fromState.name == 'signin.detail' && toState.name == 'signin.create'){
            signinService.signinListNeedRefresh = true;
            var loadingTime = 800;
            Prompter.showLoadingAutoHidden("正在返回,请稍候", false, loadingTime);
            $timeout(function(){
                $ionicHistory.goBack();
            }, loadingTime);
        }
    });
	
	$scope.config = {
		address: '',
		signInDate: '',
		signInTime: '',
		comment: '',
		isLocationing: false,
		userName:'',
		userCode : ''
	};

	$scope.datas = {
	};

	$scope.init = function(){
		var nowTime = new Date();
		$scope.config.signInDate = nowTime.format("yyyyMMdd");
		$scope.config.signInTime = nowTime.format("hh:mm:ss");
		$scope.caclCurrentLocation();
	};
	

	$scope.saveNewSingin = function(){
		if($scope.config.isLocationing){
			$cordovaToast.showShortBottom("正在定位中,请稍候保存!");
			return;
		}else if(angular.isUndefined($scope.config.address) || $scope.config.address==null || $scope.config.address==""){
			$cordovaToast.showShortBottom("请先获取定位信息!");
			return;
		}
		var options = {
		    "person_code": $scope.config.userCode,
		    "person_name": $scope.config.userName,
		    "address": $scope.config.address,
		    "sign_in_date": $scope.config.signInDate,
		    "sign_in_time": $scope.config.signInTime,
		    "comment": $scope.config.comment,
		    "sys_name": signinService.getStoredByKey("sysName")
		};
		__requestSaveNewSingin(options, function(response){
			Prompter.showLoadingAutoHidden("签到创建成功!", false, 1300);
			$timeout(function(){
				signinService.currentSigninDetail = {
					"person_code": $scope.config.userCode,
				    "person_name": $scope.config.userName,
				    "address": $scope.config.address,
				    "sign_in_date": $scope.config.signInDate,
				    "sign_in_time": $scope.config.signInTime,
				    "comment": $scope.config.comment,
				    "attendance_id": response.ES_VISIT.sign_in_id
				};
				$state.go("signin.detail");
			}, 1300);
		});
	};

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
						$scope.config.userName = response.ES_EMPLOYEE.NAME_LAST+response.ES_EMPLOYEE.NAME_FIRST;
						$scope.config.userCode = response.ES_EMPLOYEE.PARTNER;
					}
				}

			});
		}
		__requestVisitName();
	function __requestSaveNewSingin(options, successCallback){
		var url = signinService.signin_signIn.url;
        // var postDatas = signinService.signin_list.defaults;
        // angular.extend(postDatas, options);
        var promise = HttpAppService.post(url, options);
        Prompter.showLoading("正在保存");
        promise.success(function(response, status, obj, config){
        	if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG=="S"){
        		if(successCallback) successCallback(response);
        		//Prompter.hideLoading();
        	}else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT != null){
        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
        	}else{
        		Prompter.showLoadingAutoHidden(JSON.stringify(response), false, 2000);
        	}
        	//Prompter.hideLoading();
        })
        .error(function(errorResponse){
        	Prompter.showLoadingAutoHidden("数据加载失败,请检查网络!", false, 2000);
        });
	}

	$scope.caclCurrentLocation = function(){
		__requestCurrentLocation();
	};

	function __requestCurrentLocation(){
		if($scope.config.isLocationing){
			return;
		}
		$scope.config.isLocationing = true;
		BaiduMapServ.getCurrentLocation().then(function (success) {
            console.log('getCurrentLocation success = ' + angular.toJson(success));
            var lat = success.lat;
            var lng = success.long;
            BaiduMapServ.locationToAddress(lat, lng).then(function(response){
            	$scope.config.isLocationing = false;
            	if(response && response.formatted_address && response.formatted_address !=""){
            		$scope.config.address = response.formatted_address;
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


	$scope.init();

}]);