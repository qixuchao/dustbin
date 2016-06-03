visitModule.service('visitService', [
	function () {
		//setStored    
		return {
			setStored: setStored,
			getStoredByKey: getStoredByKey,
			visit_create: {
				url: ROOTCONFIG.hempConfig.basePath + "VISIT_CREATE",
				defaults: {
					"I_SYSNAME": { "SysName": getStoredByKey("sysName") },
					"IS_USER": { "BNAME": getStoredByKey("userName") }
				}
			},
			visit_list: {
				url: ROOTCONFIG.hempConfig.basePath + "getVisitList",
				defaults: {
					"I_SYSTEM": { "SysName": getStoredByKey("sysName") },
					"IS_USER": { "BNAME": getStoredByKey("userName") },
				}
			},
			visit_detail: {
				url: ROOTCONFIG.hempConfig.basePath + "getVisitDetail",
				defaults: {
					"I_SYSNAME": { "SysName": getStoredByKey("sysName") },
					"IS_USER": { "BNAME": getStoredByKey("userName") },
				}
			},
			visit_edit: {
				url: ROOTCONFIG.hempConfig.basePath + "",
				defaults: {
					"I_SYSTEM": { "SysName": getStoredByKey("sysName") },
					"IS_USER": { "BNAME": getStoredByKey("userName") },
				}
			},
			visit_saveComment: {
				url: ROOTCONFIG.hempConfig.basePath + "saveComment",
				defaults: {
					// "I_SYSTEM": { "SysName": getStoredByKey("sysName") },
					// "IS_USER": { "BNAME": getStoredByKey("userName") },
				}
			},


			//页面间传递数据用
			currentVisitDetail: null,
			//详情到编辑
			visitDetail : null,
			visitContact : null,
			visitCreate : null,//创建人
			visitPicture : [],
			//为了创建联系人
			goCreateCon : "",
			goCreateConInfo : {
				id : "",
				name : ""
			}
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


signinModule.filter('visitDateFilter', function(){
  return function (str) {
      return returnStr = str.substring(0,4) + "-" + str.substring(4,6) + "-" + str.substring(6,8);
  };
});

visitModule.controller('absVisitCtrl', [
	'$scope',
	function ($scope) {
	
}]);