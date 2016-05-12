worksheetModule.controller("WorksheetBaoGongListCtrl",[
	"$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "worksheetDataService",
    "Prompter",
    function($scope, ionicMaterialInk, ionicMaterialMotion, worksheetDataService, Prompter){
    
    //alert(" ---- WorksheetBaoGongListCtrl ---- ");
    
    $scope.config = {
        currentTip: "暂无数据",
        noDatas: false,

        isBaoWS: false,
        isEditPrice: false,   //报工价格维护
        isEditDetail: false  //完工详情维护
    };

    $scope.enterPriceEditMode = function(){
        $scope.config.isEditPrice = true;
        $scope.config.isEditDetail = false;
    };

    $scope.enterDetailEditMode = function(){
        $scope.config.isEditPrice = false;
        $scope.config.isEditDetail = true;
    };
    
    $scope.editCancel = function(){
        Prompter.wsConfirmFuc("提示", "确实退出编辑?", "确定", "取消", function(){
            $scope.config.isEditPrice = false;
            $scope.config.isEditDetail = false;
        }, function(){
        });
    };

    $scope.editOk = function(){
        if($scope.config.isEditDetail){
            __requestSaveDetail();
        }else if($scope.config.isEditPrice){
            __requestSavePrice();
        }
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

    $scope.detailLowerOne = function(item){
        if(item.NUMBER_INT_XBR > 0){
            item.NUMBER_INT_XBR--;
        }
    };

    $scope.detailAddOne = function(item){
        item.NUMBER_INT_XBR++;
    };
    
    $scope.init = function(){ //NUMBER_INT_XBR
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
        for(var i = 0; i < $scope.datas.baogongDatas.length; i++){
            $scope.datas.baogongDatas[i].NUMBER_INT_XBR = window.parseInt($scope.datas.baogongDatas[i].NUMBER_INT);
        }
    };
    $scope.init();


    //baoGongService.BAOWS_EDIT.
    function __requestSaveDetail(){
        var url = baoGongService.BAOWS_EDIT.url;
        var params = angular.copy(baoGongService.BAOWS_EDIT.defaults);
        params.IT_DETAIL = {
            item_in: [

            ]
        };
        var itemIns = [];
        for(var i = 0; i < $scope.datas.baogongDatas.length; i++){
            var tempItem = $scope.datas.baogongDatas[i];
            if(tempItem.NUMBER_INT_XBR != Number(tempItem.NUMBER_INT)){
                itemIns.push({

                });
            }
        }

        Prompter.showLoading("正在修改");
        var promise = HttpAppService.post(url,params);
        promise.success(function(response){
            if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG == "S"){
                Prompter.showLoadingAutoHidden("修改成功", false, 1000);
                $timeout(function(){
                    $scope.config.isEditPrice = false;
                    $scope.config.isEditDetail = false;
                }, 1000);
            }else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT != ""){
                Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
            }else{
                Prompter.showLoadingAutoHidden(response, false, 2000);
            }
        })
        .error(function(errorResponse){
            Prompter.showLoadingAutoHidden("修改失败,请检查网络!", false, 2000);
        });
    }

    function __requestSavePrice(){

    }









    
}]);