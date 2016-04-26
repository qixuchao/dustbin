settingsModule.controller("SettingCtrl", [
	'$scope',
	'$state',
	'$ionicHistory',
	function($scope, $state, $ionicHistory){
		
		$scope.config = {
			currentVersion: "",
			currentVersionCode: "",
			
			appName: "",
			packageName: "",

			userName: "暂无",
			userCode: "", //登录名:工号

		};

		$scope.logout = function(){
			
			$state.go("login");
		};
		
		$scope.init = function(){
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
		
	}]);