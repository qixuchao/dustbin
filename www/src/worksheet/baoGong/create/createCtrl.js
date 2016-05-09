worksheetReportModule.controller('baoGongCreateCtrl', [
	'$scope', 
	'baoGongService',
	function ($scope, baoGongService) {
	
	$scope.config = {

	};
	$scope.datas = {
		defaultDetail: {
			/*IS_OBJECT_ID: ,
			IS_PROCESS_TYPE: ,
			TYPE_DESC: ,
			DESCRIPTION: ,
			STATU: ,
			STATU_DESC: ,
			WAIFU_EMP: {
				FCT_DESCRIPTION : "外服人员",
				NAME1 : "张建廷",
				PARTNER_FCT : "ZSRVEMPL",
				PARTNER_NO : "E060000878"
			}*/
		},
	};
	
	$scope.init = function(){
		$scope.datas.defaultDetail = angular.copy(baoGongService.detailFromWSDetail);

	};
	$scope.init();

	

}]);