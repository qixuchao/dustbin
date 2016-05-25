signinModule.service('signinService', [ 
	function () { 
	//setStored
	return { 
		setStored: setStored,
		getStoredByKey: getStoredByKey,

		signinListNeedRefresh: false,

		signin_list: {
			url: ROOTCONFIG.hempConfig.basePath + "getAttendanceList",
			defaults: {
				//"I_SYSTEM": { "SysName": getStoredByKey("sysName") },
				//"IS_USER": { "BNAME": getStoredByKey("userName") },
			}
		},
		signin_detail: {
			url: ROOTCONFIG.hempConfig.basePath + "getVisitDetail",
			defaults: {
				//"I_SYSTEM": { "SysName": getStoredByKey("sysName") },
				//"IS_USER": { "BNAME": getStoredByKey("userName") },
			}
		},
		signin_edit: {
			url: ROOTCONFIG.hempConfig.basePath + "saveAttendance",
			defaults: {
				//"I_SYSTEM": { "SysName": getStoredByKey("sysName") },
				//"IS_USER": { "BNAME": getStoredByKey("userName") },
			}
		},

		//用于页面间参数传递
		currentSigninDetail: null
	};
	function setStored(key, value){
		window.localStorage[key] = value;
	}
	function getStoredByKey(key){
        if(key == "userName"){
          return window.localStorage.crmUserName;
        }else if(key == "sysName"){
          //return "CATL";
          return ROOTCONFIG.hempConfig.baseEnvironment;
        }else{
          return window.localStorage[key];
        }
    }
}]);

 
signinModule.controller('absSigninCtrl', [
	'$scope',
	function ($scope) {
	
}]);

signinModule.filter('signDateFilter', function(){
  return function (str) {
      return returnStr = str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8);
  };
});

//09:11:11 ---> 09:11
signinModule.filter('signInTime', function(){
  return function (str) {
      return str.substring(0, 5);
  };
});










