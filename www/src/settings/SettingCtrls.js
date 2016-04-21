settingsModule.controller("SettingCtrl", [
	'$scope',
	function($scope){

		$scope.config = {
			currentVersion: ""
		};

		$scope.config.currentVersion = "v"+ROOTCONFIG.versionName;

	}]);