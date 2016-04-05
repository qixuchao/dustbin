worksheetModule.controller("WorksheetBaoGongListCtrl",[
	"$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    function($scope, ionicMaterialInk, ionicMaterialMotion){
    

    $scope.config = {

    };

    $scope.datas = {
    	testDates: [
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
    		},
    		{
    			title: '售后服务工时(通用)',
    			productNum: 'SV-AFS-00',
    			number: '3.50 KM'
    		}
    	]
    };

    $scope.init = function(){

    };
    $scope.init();

}]);