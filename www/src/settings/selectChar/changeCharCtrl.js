settingsModule.controller("ChangeCharCtrl", [
	'$scope',
	'$state',
	'$ionicHistory',
	'$timeout',
	'$interval',
	'$cordovaToast',
	'HttpAppService',
	'SettingsService',
	'worksheetDataService',
	'Prompter',
	'$rootScope','LoginService',
	function($scope, $state, $ionicHistory, $timeout, $interval, $cordovaToast, HttpAppService, SettingsService, worksheetDataService, Prompter, $rootScope,LoginService){
		$scope.config = {
			char : ""
		}
		$scope.charDetail = [{
			name : "服务",
			code : "APP_SERVICE"
		},
			{
				name : "销售",
				code : "APP_SALE"
			},]
		$scope.confirmChangeChar = function(){
			if($scope.config.char == ""){
				$cordovaToast.showShortBottom("请选择角色");
				return;
			}else if($scope.config.char.code == "APP_SERVICE"){
				var list =["CUSTOMER","EMPLOYEE","CAR","PRODUCT","SERVICE"];
				LoginService.setMenulist(list);
				if($rootScope.FIRST_LOGIN == "Y" || $rootScope.FIRST_LOGIN == "D"){
					$state.go('changePass');
					$rootScope.FIRST_LOGIN = response.FIRST_LOGIN;
				}else{
					$state.go('tabs', {}, {location:"replace", reload:"true"});
				}
			}else if($scope.config.char.code == "APP_SALE"){
				var list =["CUSTOMER","EMPLOYEE","OPPORT","ACTIVITY"];
				LoginService.setMenulist(list);
				if($rootScope.FIRST_LOGIN == "Y" || $rootScope.FIRST_LOGIN == "D"){
					$state.go('changePass');
				}else{
					$state.go('tabs', {}, {location:"replace", reload:"true"});
				}
			}

		}
	}]);















