settingsModule.controller("SettingCtrl", [
	'$scope',
	'$state',
	'$ionicHistory',
	'Prompter',
	'LoginService',
	'HttpAppService',
	function($scope, $state, $ionicHistory, Prompter, LoginService, HttpAppService){
		
		$scope.config = {
			currentVersion: "",
			currentVersionCode: "",
			
			appName: "",
			packageName: "",

			userName: "暂无",
			userCode: "" //登录名:工号

		};

		$scope.changePass = function(){
			$state.go("changePass");
		};

		$scope.logout = function(){
			
			$state.go("login");
		};

		function __requestStaffInfo(){
			Prompter.showLoading();
            var url = ROOTCONFIG.hempConfig.basePath + "STAFF_DETAIL"; //"http://117.28.248.23:9388/test/api/bty/login";
            var querParams = {
            	"I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
    			"IS_EMPLOYEE": { "PARTNER": LoginService.getBupaTypeUser() }
            };

            HttpAppService.post(url,querParams).success(function(response){
            	Prompter.hideLoading();
                if(response.ES_RESULT.ZFLAG == 'E') {
                     $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                } else if (response.ES_RESULT.ZFLAG == 'S') {
                	if(response.ES_EMPLOYEE){
                		$scope.config.userName = response.ES_EMPLOYEE.NAME_LAST+response.ES_EMPLOYEE.NAME_FIRST;
                		LoginService.setLoginerName($scope.config.userName);
                	}
                }

            });
		};
		
		$scope.init = function(){
			var userName = LoginService.getLoginerName();
			if(userName && userName!=null && userName!= "" && userName!="null"){
				$scope.config.userName = userName;
			}else{
				__requestStaffInfo();
			}
			$scope.config.userCode = window.localStorage.crmUserName;
			//$scope.config.currentVersion = "v"+ROOTCONFIG.versionName;
			if(window.cordova && window.cordova.getAppVersion){
				cordova.getAppVersion.getVersionNumber(function (version) {
				    $scope.config.currentVersion = version;
				    console.log("getVersionNumber "+version);
				});
				cordova.getAppVersion.getVersionCode(function (versionCode){
					$scope.config.currentVersionCode = versionCode;
					console.log("getVersionCode "+versionCode);
				});
				cordova.getAppVersion.getAppName(function(appName){
					$scope.config.appName = appName;
					console.log("getAppName "+appName);
				});
				cordova.getAppVersion.getPackageName(function(packageName){
					$scope.config.packageName = packageName;
					console.log("getPackageName "+packageName);
				});
			}

			//$scope.config.versionStr = "v " + $scope.config.currentVersion +"   build "+$scope.config.currentVersionCode;
		};
		$scope.init();

        //版本检查
        $scope.checkVersion = function () {
            Prompter.showLoading();
            //var url = ROOTCONFIG.hempConfig.basePath + 'version';
            var url = 'http://117.28.248.23:9388/crmuat/api/bty/version';
            var data = {
                "appname": "CRM",
                "system": ROOTCONFIG.hempConfig.baseEnvironment,
                "platform": ionic.Platform.platform()
            };
            HttpAppService.post(url, data).success(function (response) {
                Prompter.hideLoading();
                if (response.ES_RESULT.ZFLAG == 'S') {
                    LoginService.getNewVersion(response.VERSION);
                } else {
                    $cordovaToast.alert(response.ES_RESULT.ZRESULT);
                }

            });
        };
		
	}]);
