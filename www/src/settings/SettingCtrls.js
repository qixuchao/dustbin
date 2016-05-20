settingsModule.controller("SettingCtrl", [
	'$scope',
	'$state',
	'$ionicHistory',
	'Prompter',
	'LoginService',
	'HttpAppService',
	'$cordovaToast',
	function($scope, $state, $ionicHistory, Prompter, LoginService, HttpAppService, $cordovaToast){
		
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

		$scope.goAbout=function(){
	      $state.go("about");
	    };

	    $scope.goAboutApp = function(){
	    	$state.go("aboutapp");
	    };
		//$scope.updateApp = function(){
		//	hotpatch.updateNewVersion("");
		//};
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
            var url = ROOTCONFIG.hempConfig.basePath+'version';
            var data = {
                "appname": "CRM",
                "system": ROOTCONFIG.hempConfig.baseEnvironment,
                "platform": ionic.Platform.platform()
            };
            HttpAppService.post(url, data).success(function (response) {
                Prompter.hideLoading();
                //alert(JSON.stringify(response));
                if (response.ES_RESULT.ZFLAG == 'S') {

                    LoginService.getNewVersion(response.VERSION);
                } else {
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }

            }).error(function(errorResponse){
            	Prompter.hideLoading();
            });
        };
		
	}]);

settingsModule.controller("AboutAppCtrl", [
	"$scope",
	"$cordovaInAppBrowser",
	"LoginService",
	"$cordovaToast",
	"$cordovaAppVersion",
	function($scope, $cordovaInAppBrowser, LoginService, $cordovaToast, $cordovaAppVersion){
		
		$scope.config = {
			appUpdateUrl: "",
			currentVersion: '',
			newVersion: ''
		};

		$scope.config.appUpdateUrl = ROOTCONFIG.hempConfig.AppUpdateUrl;

		$scope.config.newVersion = LoginService.versionInfo.newVersion;
		if (ionic.Platform.isWebView()) {
            $cordovaAppVersion.getVersionNumber().then(function (version) {
                $scope.config.currentVersion = version;
            });
        }
        

		$scope.openInBrowser = function(){
			if(LoginService.newVersionGreaterThanOld($scope.config.newVersion, $scope.config.currentVersion)){  //有最新版本
				$cordovaInAppBrowser.open($scope.config.appUpdateUrl, '_system', {location: 'yes'});
			}else{ ////已是最新版本
				$cordovaToast.showShortBottom("当前已是最新版本!");
			}
		};

		
}]);

settingsModule.controller('AboutCtrl',[
		'$scope',
		function($scope){
        $scope.aboutCont=[
		      {
		        url:'img/setting/main.jpg',
		        describe:'登录APP显示日历，可用于根据日期查询自己的销售活动和工单信息，下滑可切换到月视图进行月度的切换和日期的选择，方便快捷操作简单；'
		      },{
		        url:'img/setting/create.jpg',
		        describe:'首页包含快速创建按钮，点击可进行联系人与事项的快速创建，超级简单有木有；'
		      },{
		        url:'img/setting/list.jpg',
		        describe:'图文结合的应用九宫格排列，简单直观，进入功能后，查询单据并可对单据进行查看、编辑、创建；'
		      },{
		        url:'img/setting/resetPass.jpg',
		        describe:'进入联系人，查询系统中的联系人，并可在列表中直接拨号，系统会自动保存常用联系人在功能首页，方便快速访问；'
		      },{
		        url:'img/setting/contact.jpg',
		        describe:'首次登陆或更换登陆设备后，需要重新进行手机号码的验证，输入手机号，获取验证码进行密码重置。'
		      }
    	];
    }]);
