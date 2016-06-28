settingsModule.controller("ChangePassCtrl", [
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
	'$rootScope',
	function($scope, $state, $ionicHistory, $timeout, $interval, $cordovaToast, HttpAppService, SettingsService, worksheetDataService, Prompter, $rootScope){

		$scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(toState.name == "changePass" || fromState.name=="changePass"){
            	__initConfig();
            }
            if(fromState && toState && fromState.name == 'login' && toState.name == 'changePass'){
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
            }
            if(toState.name == 'changePass' && fromState && (fromState.name=='login' || fromState.name == 'changeChar')){
            	if($rootScope.FIRST_LOGIN == "Y"){
            		$scope.config.moduleCode = 'RESET_PASS';
	            	$scope.config.changeBoxTitle = '请修改初始密码';
	            	$scope.config.isReset = true;
            	}else if($rootScope.FIRST_LOGIN == "D"){
            		$scope.config.moduleCode = 'CHANGE_DEVICE';
	            	$scope.config.changeBoxTitle = '设备已更换,请重置密码';
	            	$scope.config.isReset = true;
            	}
            }
            if(toState.name == 'changePass' && fromState && fromState.name=='tabs'){
            	LoginService.needTabsCache = true;
            	$scope.config.moduleCode = 'CHANGE_PASS';
            	$scope.config.changeBoxTitle = '修改密码';
            }
        });

        function __initConfig(){
        	$scope.config = {
        		moduleCode: '', //RESET_PASS 重置密码; CHANGE_PASS: 修改密码   CHANGE_DEVICE:更换设备，重置密码
				changeBoxTitle: '请修改初始密码',
				getValidBtnText: '获取验证码',
				defaultText: '已发送##',
				isReset: false,

				btnConfirmDisabled: true,
				btnGetCodeDisabled: true,
				sendValidCodeOk: false,

				oldPassWord: '',
				newPassWord: '',
				newPassWord2: '',
				cellphone: '',
				valideCode: '',
				personcode : "",
				remoteValideCode: null
        	};
        }
		
		$scope.config = {
			moduleCode: '', //RESET_PASS 重置密码; CHANGE_PASS: 修改密码   CHANGE_DEVICE:更换设备，重置密码
			changeBoxTitle: '请修改初始密码',
			getValidBtnText: '获取验证码',
			defaultText: '已发送##',
			isReset: false,

			btnConfirmDisabled: true,
			btnGetCodeDisabled: true,
			sendValidCodeOk: false,

			oldPassWord: '',
			newPassWord: '',
			newPassWord2: '',
			cellphone: '',
			valideCode: '',
			personcode : "",
			remoteValideCode: null
		};

		$scope.otherInputChangeForConfirm = function(){
			var showConfirmBtn = false;
			if($scope.config.isReset){
				showConfirmBtn = $scope.config.newPassWord!="" && $scope.config.newPassWord2!="" && $scope.config.valideCode!="";
			}else{
				showConfirmBtn = $scope.config.oldPassword!="" && $scope.config.newPassWord!="" && 
						$scope.config.newPassWord2!="";
			}
			$scope.config.btnConfirmDisabled = !showConfirmBtn;
			return showConfirmBtn;
		};
		$scope.cellPhoneChange = function(){
			if($scope.config.cellphone.length >= 11){
				$scope.config.btnGetCodeDisabled = false;
			}else{
				$scope.config.btnGetCodeDisabled = true;
			}
		};
		
		var total = 60;
		var start = 0;
		var automaticTimeout = null;
		var intervalPromise;

		function __automatic(){
			//var showSec = total - start;
			$scope.config.getValidBtnText = $scope.config.defaultText.replace("##", start+"秒");
			start++;
		}

		$scope.getValidCode = function(){
			$scope.config.getValidBtnText = "正在获取...";
			$scope.config.btnGetCodeDisabled = true;
			start = 0;
			//__requestGetCheckCode("RESET_PASS");
			__requestGetCheckCode($scope.config.moduleCode);
			//已发送成功
			/*automaticTimeout = $timeout(function(){
				intervalPromise = $interval(__automatic, 1000, total+2);
				intervalPromise.then(function(){
					$scope.config.getValidBtnText = "重新获取";
					$scope.config.btnGetCodeDisabled = false;
				}, 1000);
				$scope.config.remoteValideCode = "1234";
				$scope.config.sendValidCodeOk = true;
			}, 3000);*/
		};

		$scope.confirmChangePass = function(){
			if($scope.config.newPassWord.length < 6){
				$cordovaToast.showShortBottom("密码不能小于6位!");
				return;
			}
			if($scope.config.newPassWord2 != $scope.config.newPassWord){
				$cordovaToast.showShortBottom("两次密码不一致!");
				return;
			}
			if($scope.config.personcode == '' || $scope.config.personcode == undefined){
				$cordovaToast.showShortBottom("请输入身份证后六位!");
				return;
			}
			//调用修改密码接口
			if($scope.config.isReset){
				__requestResetPassword();
			}else{
				__requestChangePass();
			}
		};
		
		$scope.init = function(){

		};
		$scope.init();

		$scope.$on('$destroy', function() {
	      // 保证interval已经被销毁
			if (angular.isDefined(intervalPromise)) {
				$interval.cancel(intervalPromise);
				intervalPromise = undefined;
			}
	    });

	    function __requestChangePass(){
	    	var queryParams = {
			    userName: worksheetDataService.getStoredByKey("userName"),
			    oldPassword: $scope.config.oldPassWord,
			    newPassword: $scope.config.newPassWord,
			    newPassword2: $scope.config.newPassWord2,
			    moduleCode: 'CHANGE_PASS',
			    checkcode: $scope.config.valideCode,
			    system: worksheetDataService.getStoredByKey("sysName")
			};
	        //var promise = HttpAppService.post(worksheetHttpService.imageInfos.listUrl,queryParams);
	        var promise = HttpAppService.post(SettingsService.changePwd.url,queryParams);
	        
	        Prompter.showLoading("正在修改密码");

	        promise.success(function(response){
	        	//Prompter.hideLoading();
	        	//alert(response);
	        	//alert(JSON.stringfy(response));
	        	//alert(response.ES_RESULT);
	        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG == 'S'){
	        		Prompter.showLoadingAutoHidden("密码修改成功!", false, 1000);
	        		LoginService.needTabsCache = true;
	        		$timeout(function(){
	        			$state.go("tabs");
	        		}, 1000);
	        		window.localStorage.crmUserPassword = '';
	        	}else{
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 1000);
	        	}
	        })
	        .error(function(errorResponse){
	        	Prompter.showLoadingAutoHidden("修改密码失败!请检查网络", false, 1500);
	        });
	    }

	    function __requestResetPassword(){
	    	var queryParams = {
			    userName: worksheetDataService.getStoredByKey("userName"),
			    newPassword: $scope.config.newPassWord,
			    newPassword2: $scope.config.newPassWord2,
			    moduleCode: $scope.config.moduleCode, // 'RESET_PASS',
			    checkcode: $scope.config.valideCode,
			    system: worksheetDataService.getStoredByKey("sysName"),
			    platform: ionic.Platform.isWebView() ? ionic.Platform.platform() : 'browser',
                deviceId: window.localStorage.deviceId
			};
	        //var promise = HttpAppService.post(worksheetHttpService.imageInfos.listUrl,queryParams);
	        var promise = HttpAppService.post(SettingsService.resetPwd.url,queryParams);
	        
	        Prompter.showLoading("正在重置密码");

	        promise.success(function(response){
	        	//Prompter.hideLoading();
	        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG == 'S'){
	        		Prompter.showLoadingAutoHidden("密码重置成功!", false, 1500);
	        		$timeout(function(){
	        			$state.go("tabs");
	        		}, 1500);
	        		window.localStorage.crmUserPassword = '';
	        	}else{
	        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
	        	}
	        })
	        .error(function(errorResponse){
	        	Prompter.showLoadingAutoHidden("密码重置失败!请检查网络", false, 2000);
	        });
	    }

	    function __requestGetCheckCode(moduleCode){   //RESET_PASS 重置密码; CHANGE_PASS: 修改密码
	        var queryParams = {
			    userName: worksheetDataService.getStoredByKey("userName"),
			    system: worksheetDataService.getStoredByKey("sysName"),
			    phoneNo: $scope.config.cellphone,
			    moduleCode: moduleCode
			}
	        //var promise = HttpAppService.post(worksheetHttpService.imageInfos.listUrl,queryParams);
	        var promise = HttpAppService.post(SettingsService.getCheckCode.url,queryParams);
	        
	        //Prompter.showLoading("正在获取");
	        //Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);

	        promise.success(function(response){
	        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG == 'E'){//ES_RESULT.ZFLAG ZRESULT
	        		$scope.config.getValidBtnText = "重新获取";
	        		$scope.config.btnGetCodeDisabled = false;
	        		//alert(response.ES_RESULT.ZRESULT);
	        		$cordovaToast.showLongBottom(response.ES_RESULT.ZRESULT);
	        		return;
	        	}
	        	intervalPromise = $interval(__automatic, 1000, total+2);
				intervalPromise.then(function(){
					$scope.config.getValidBtnText = "重新获取";
					$scope.config.btnGetCodeDisabled = false;
				}, 1000);
				$scope.config.remoteValideCode = "1234";
				$scope.config.sendValidCodeOk = true;
				if(!$scope.$$phase){
            		$scope.$apply();
            	}
	        })
	        .error(function(errorResponse){
	        	$scope.config.getValidBtnText = "重新获取";
	        	$scope.config.btnGetCodeDisabled = false;
	        	$cordovaToast.showLongBotton("请求失败!");
	        });
		};
		
	}]);















