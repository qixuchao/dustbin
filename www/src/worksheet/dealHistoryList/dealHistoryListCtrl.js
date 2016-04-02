 worksheetModule.controller("dealHistoryListCtrl",[
	"$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    function($scope, ionicMaterialInk, ionicMaterialMotion){
    
    $scope.config = {

    };

    $scope.datas = {
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
        
    };
    $scope.init();

}]);