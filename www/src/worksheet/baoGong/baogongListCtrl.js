worksheetModule.controller("WorksheetBaoGongListCtrl",[
	"$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "worksheetDataService",
    "Prompter",
    "baoGongService",
    "HttpAppService",
    "$timeout",
    function($scope, ionicMaterialInk, ionicMaterialMotion, worksheetDataService, Prompter, baoGongService, HttpAppService, $timeout){
    
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
        baogongDatasTemp: [],
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

    $scope.canShowEditBtns = function(){
        return true;
        if($scope.datas.baogongDatas.length > 0 && worksheetDataService.wsBaoDetailData.ES_OUT_LIST.EDIT_FLAG=="X"){
            return true;
        }
        return false;
    };
    
    $scope.init = function(){ //NUMBER_INT_XBR
        if(worksheetDataService.wsBaoDetailToFYJS){
            $scope.config.isBaoWS = true;
            worksheetDataService.wsBaoDetailToFYJS = false;
            var bao = worksheetDataService.wsBaoDetailData;
            if(!angular.isUndefined(bao) && bao!= null && bao != ""){
                $scope.datas.baogongDatasTemp = worksheetDataService.wsBaoDetailData.ET_DETAIL.item;
                if(!$scope.datas.baogongDatasTemp ||$scope.datas.baogongDatasTemp.length <=0){
                    $scope.config.currentTip = "该报工单暂无费用结算信息!";
                    $scope.config.noDatas = true;
                }
            }
        }else{
            $scope.datas.baogongDatasTemp = worksheetDataService.wsDetailData.ET_DETAIL.item;
            if(!$scope.datas.baogongDatasTemp ||$scope.datas.baogongDatasTemp.length <=0){
                $scope.config.currentTip = "该工单暂无费用结算信息!";
                $scope.config.noDatas = true;
            }
        }
        if(angular.isUndefined($scope.datas.baogongDatasTemp) || $scope.datas.baogongDatasTemp==null){
            $scope.datas.baogongDatasTemp = [];
        }
        if($scope.datas.baogongDatasTemp.length > 0){
            for(var i = 0; i < $scope.datas.baogongDatasTemp.length; i++){
                
                        $scope.datas.baogongDatasTemp[i].NUMBER_INT_XBR = window.parseInt($scope.datas.baogongDatasTemp[i].NUMBER_INT);
                        $scope.datas.baogongDatasTemp[i].QUANTITY_XBR = window.parseFloat($scope.datas.baogongDatasTemp[i].QUANTITY);
            }
            __requestConfirmFill();
        }
    };
    $scope.init();


    function __requestConfirmFill(){
        // baoGongService.BAOWS_CONFIRM_FILL.url
        var url = baoGongService.BAOWS_CONFIRM_FILL.url;
        var params = baoGongService.BAOWS_CONFIRM_FILL.defaults;
        params.IV_OBJECT_ID = worksheetDataService.wsBaoDetailData.ydWorksheetNum;
        params.IV_PROCESS_TYPE = worksheetDataService.wsBaoDetailData. IS_PROCESS_TYPE;
        Prompter.showLoading("正在加载");
        var promise = HttpAppService.post(url,params);
        promise.success(function(response){
            if(response && response.ES_RESULT && (response.ES_RESULT.ZFLAG == "S"||response.ES_RESULT.ZFLAG == "")){
                    var outs = [];
                    if(response.ET_FILL && response.ET_FILL.item_out){
                        outs = response.ET_FILL.item_out;
                    }
                    for(var i = 0; i < outs.length; i++){
                        for(var j = 0; j <$scope.datas.baogongDatasTemp.length; j++){
                            if(outs[i].PROD_ID == $scope.datas.baogongDatasTemp[j].ORDERED_PROD){
                                $scope.datas.baogongDatasTemp[j].INSTANCE_GUID = outs[i].INSTANCE_GUID;
                                continue;
                            }
                        }
                    }
                    $scope.datas.baogongDatas = angular.copy($scope.datas.baogongDatasTemp);
                    $scope.config.isEditPrice = false;
                    $scope.config.isEditDetail = false;
                    Prompter.hideLoading();
            }else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT != ""){
                Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
            }else{
                Prompter.showLoadingAutoHidden(response, false, 2000);
            }
        })
        .error(function(errorResponse){
            Prompter.showLoadingAutoHidden("查询失败,请检查网络!", false, 2000);
        });
    }

    //baoGongService.baoGongService.BAOWS_EDIT.
    function __requestSaveDetail(){
        var url = baoGongService.BAOWS_EDIT.url;
        var params = angular.copy(baoGongService.BAOWS_EDIT.defaults);
        params.IV_OBJECT_ID = worksheetDataService.wsBaoDetailData.ydWorksheetNum;
        params.IV_PROCESS_TYPE = worksheetDataService.wsBaoDetailData. IS_PROCESS_TYPE;
        var itemIns = [];
        for(var i = 0; i < $scope.datas.baogongDatas.length; i++){
            var tempItem = $scope.datas.baogongDatas[i];
            if(tempItem.QUANTITY_XBR != window.parseFloat(tempItem.QUANTITY)){
                itemIns.push({
                    NUMBER_INT: tempItem.NUMBER_INT,
                    ORDERED_PROD: tempItem.ORDERED_PROD,
                    DESCRIPTION: tempItem.DESCRIPTION,
                    ITM_TYPE: tempItem.ITM_TYPE,
                    QUANTITY: tempItem.QUANTITY_XBR,
                    PROCESS_QTY_UNIT: tempItem.PROCESS_QTY_UNIT,
                    INSTANCE_GUID: tempItem.INSTANCE_GUID,//tempItem.,
                    AC_INDICATOR: tempItem.AC_INDICATOR,  // D1/D2 免费/收费
                    ZMODE: 'U'      //  I 新建/U 更改
                });
            }
        }
        params.IT_DETAIL = {
            item_in: itemIns
        };
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