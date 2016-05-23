visitModule.service('visitService', [
	function () {
	//setStored
	return {
		setStored: setStored,
		getStoredByKey: getStoredByKey
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


visitModule.controller('absVisitCtrl', [
	'$scope',
	function ($scope) {
	
}]);