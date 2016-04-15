 worksheetModule.controller("dealHistoryListCtrl",[
	"$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "worksheetDataService",
    "$timeout",
    function($scope, ionicMaterialInk, ionicMaterialMotion, worksheetDataService, $timeout){
    
    $scope.config = {

    };

    $scope.enterDetail = function(item){
        /*//工单类型：   filterNewCarOnline: ZNCO 新车档案收集工单    filterLocalService:ZPRO 现场维修工单    filterBatchUpdate:ZPLO 批量改进工单
        //            filterNewCarOnlineFWS: ZNCV                filterLocalServiceFWS: ZPRV           filterBatchUpdateFWS: ZPLV
        worksheetDataService.toDetailPageTag = "history";
        worksheetDataService.worksheetHistoryList.toDetail = {
            "IS_OBJECT_ID": item.OBJECT_ID,
            "IS_PROCESS_TYPE": item.PROCESS_TYPE,
            "ydWorksheetNum": item.SOLDTO_NAME,
            'ydStatusNum': item.STAT
        };
        if(item.PROCESS_TYPE == "ZNCO" || item.PROCESS_TYPE == "ZNCV"){
            $state.go("worksheetDetail", {
                detailType: 'newCar'
            });
        }else if(item.PROCESS_TYPE == "ZPRO" || item.PROCESS_TYPE == "ZPRV"){
            $state.go("worksheetDetail",{
                detailType: 'siteRepair'
            });
        }else if(item.PROCESS_TYPE == "ZPLO" || item.PROCESS_TYPE == "ZPLV"){
            $state.go("worksheetDetail",{
                detailType: 'batchUpdate'
            });
        }*/
    };

    $scope.datas = {
        history: [],
    	testDates: [
    		{
    			category: '现场维修工单',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		},
    		{
    			category: '现场维修工单',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		},
    		{
    			category: '现场维修工单',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		},
    		{
    			category: '现场维修工单',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		},
    		{
    			category: '现场维修工单',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		},
    		{
    			category: '现场维修工单',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		},
    		{
    			category: '现场维修工单-last',
    			desc: '现场维修服务请求测试',
    			timeStart: '2016.01.01 10:00:01',
    			timeEnd: '2016.12.31 12:00:00'
    		}
    	]
    };

    $scope.init = function(){
        $timeout(function () {
            ionicMaterialInk.displayEffect();
        }, 100);
        if(worksheetDataService.wsDetailData.ET_HISTORY && worksheetDataService.wsDetailData.ET_HISTORY.item && worksheetDataService.wsDetailData.ET_HISTORY.item.length > 0){
            $scope.datas.history = worksheetDataService.wsDetailData.ET_HISTORY.item;
        }
    };
    $scope.init();

}]);