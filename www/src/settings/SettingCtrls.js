settingsModule.controller("SettingCtrl", [
	'$scope',
	function($scope){
		
		$scope.config = {
			currentVersion: "",
			currentVersionCode: "",
			
			appName: "",
			packageName: ""
		};
		
		$scope.init = function(){
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