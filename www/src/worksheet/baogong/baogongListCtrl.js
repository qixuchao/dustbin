worksheetModule.controller("WorksheetBaoGongListCtrl",[
	"$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "worksheetDataService",
    function($scope, ionicMaterialInk, ionicMaterialMotion, worksheetDataService){
    

    $scope.config = {
        currentTip: "暂无数据",
        noDatas: false
    };
    
    $scope.datas = {
        baogongDatas: [],
    	testDates: [
    		{
    			title: '售后服务工时(通用)',
    			productNum: 'SV-AFS-00',
    			number: '3.50 KM',
                AC_INDICATOR: 'D2'
    		},
    		{
    			title: '售后服务工时(通用)',
    			productNum: 'SV-AFS-00',
    			number: '3.50 KM'
    		},
    		{
    			title: '售后服务工时(通用)',
    			productNum: 'SV-AFS-00',
    			number: '3.50 KM'
    		},
    		{
    			title: '售后服务工时(通用)',
    			productNum: 'SV-AFS-00',
    			number: '3.50 KM'
    		}
    	]
    };

    $scope.init = function(){
        $scope.datas.baogongDatas = worksheetDataService.wsDetailData.ET_DETAIL.item;
        console.log($scope.datas.baogongDatas);
        if(!$scope.datas.baogongDatas ||$scope.datas.baogongDatas.length <=0){
            $scope.config.currentTip = "该工单暂无费用结算信息!";
            $scope.config.noDatas = true;
        }
    };
    $scope.init();

}]);