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
			}];
		//console.log($rootScope.FIRST_LOGIN);
		$scope.confirmChangeChar = function(){
			// $state.go('tabs', {}, {location:"replace", reload:"true"});
			if($scope.config.char == ""){
				$cordovaToast.showShortBottom("请选择角色");
				return;
			}else if($scope.config.char.code == "APP_SERVICE"){
				LoginService.setProfileType($scope.config.char.code);
				var list =["CUSTOMER","EMPLOYEE","CAR","PRODUCT","SERVICE",'SIGNIN','VISIT','SERVICEMAP'];
				LoginService.setMenulist(list); 
				if($rootScope.FIRST_LOGIN == "Y" || $rootScope.FIRST_LOGIN == "D"){
					$state.go('changePass');

					// $rootScope.FIRST_LOGIN = response.FIRST_LOGIN;

				}else{
					$state.go('tabs', {}, {location:"replace", reload:"true"});
				}
			}else if($scope.config.char.code == "APP_SALE"){
				LoginService.setProfileType($scope.config.char.code);
				var list =["CUSTOMER","EMPLOYEE","OPPORT","ACTIVITY","ACTPLAN","SALECLUE",'SALEQUOTE'];
				LoginService.setMenulist(list);
				//if($rootScope.FIRST_LOGIN == "Y" || $rootScope.FIRST_LOGIN == "D"){
				//	$state.go('changePass');
				//}else{
					$state.go('tabs', {}, {location:"replace", reload:"true"});
				}
			//}

		}
	}]);















