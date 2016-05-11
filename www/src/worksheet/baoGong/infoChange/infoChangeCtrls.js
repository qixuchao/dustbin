worksheetModule.controller("WorksheetBaoGongListCtrl2",[
    "$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "worksheetDataService",
    function($scope, ionicMaterialInk, ionicMaterialMotion, worksheetDataService){
    
    //alert(" ---- WorksheetBaoGongListCtrl ---- ");
    
    $scope.config = {
        currentTip: "暂无数据",
        noDatas: false,

        isBaoWS: false
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
        if(worksheetDataService.wsBaoDetailToFYJS){
            $scope.config.isBaoWS = true;
            worksheetDataService.wsBaoDetailToFYJS = false;
            var bao = worksheetDataService.wsBaoDetailData;
            if(!angular.isUndefined(bao) && bao!= null && bao != ""){
                $scope.datas.baogongDatas = worksheetDataService.wsBaoDetailData.ET_DETAIL.item;
                if(!$scope.datas.baogongDatas ||$scope.datas.baogongDatas.length <=0){
                    $scope.config.currentTip = "该报工单暂无费用结算信息!";
                    $scope.config.noDatas = true;
                }
            }
        }else{
            $scope.datas.baogongDatas = worksheetDataService.wsDetailData.ET_DETAIL.item;
            if(!$scope.datas.baogongDatas ||$scope.datas.baogongDatas.length <=0){
                $scope.config.currentTip = "该工单暂无费用结算信息!";
                $scope.config.noDatas = true;
            }
        }
        
        
    };
    $scope.init();
    
}]);