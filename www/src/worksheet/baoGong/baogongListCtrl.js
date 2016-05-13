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
        $scope.config.isBaoWS = true;
        $scope.config.isEditPrice = true;
        $scope.config.isEditDetail = false;
    };

    $scope.enterDetailEditMode = function(){
        $scope.config.isBaoWS = true;
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
        if($scope.config.isEditPrice){
            //if(item.XBR_NEW > 0){
                item.XBR_NEW--;
            //}
        }else if($scope.config.isEditDetail){
            if(item.QUANTITY_XBR > 0){
                item.QUANTITY_XBR--;
            }
        }
    };

    $scope.detailAddOne = function(item){
        if($scope.config.isEditPrice){
            item.XBR_NEW++;
        }else if($scope.config.isEditDetail){
            item.QUANTITY_XBR++;
        }
    };

    $scope.canShowEditBtns = function(){
        //return true;
        if($scope.config.isBaoWS){
            if($scope.datas.baogongDatas.length > 0 && worksheetDataService.wsBaoDetailData.ES_OUT_LIST.EDIT_FLAG=="X"){
                return true;
            }
        }
        return false;
    };
    
    $scope.init = function(){ //NUMBER_INT_XBR
        if(baoGongService.detailFromWSHistory.isEmptyDetail){  //报工单新建+费用结算数据
            __requestConfirmFill(baoGongService.detailFromWSHistory.OBJECT_ID, baoGongService.detailFromWSHistory.PROCESS_TYPE);
            baoGongService.detailFromWSHistory.isEmptyDetail = false;
            return;
        }


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
        __handleBaoGongDatasTemp();
    };
    $scope.init();

    function __handleBaoGongDatasTemp(){
        for(var i = 0; i < $scope.datas.baogongDatasTemp.length; i++){
            //$scope.datas.baogongDatasTemp[i].NUMBER_INT_XBR = window.parseInt($scope.datas.baogongDatasTemp[i].NUMBER_INT);
            $scope.datas.baogongDatasTemp[i].QUANTITY_XBR = window.parseFloat($scope.datas.baogongDatasTemp[i].QUANTITY);
            $scope.datas.baogongDatasTemp[i].XBR_NEW = 0;
            $scope.datas.baogongDatasTemp[i].AC_INDICATOR_XBR = $scope.datas.baogongDatasTemp[i].AC_INDICATOR;
            var pridocs = [];
            if(worksheetDataService.wsBaoDetailData.ET_PRIDOC && worksheetDataService.wsBaoDetailData.ET_PRIDOC.item && worksheetDataService.wsBaoDetailData.ET_PRIDOC.item.length > 0){
                pridocs = worksheetDataService.wsBaoDetailData.ET_PRIDOC.item;
            }
            for(var j = 0; j < pridocs.length; j++){
                if(pridocs[j].NUMBER_INT == $scope.datas.baogongDatasTemp[i].NUMBER_INT){
                    if(pridocs[j].KSCHL == "ZPR1"){  // 标准价格是zpr1 
                        $scope.datas.baogongDatasTemp[i].XBR_ZPR1 = pridocs[j].KBETR; 
                    }
                    if(pridocs[j].KSCHL == "ZPD2"){  // 客户折扣是zpd2/1000
                        $scope.datas.baogongDatasTemp[i].XBR_ZPD2 = pridocs[j].KBETR/1000; 
                    }
                    if(pridocs[j].KSCHL == "ZPR2"){
                        $scope.datas.baogongDatasTemp[i].XBR_NEW_OLD = $scope.datas.baogongDatasTemp[i].XBR_NEW = window.parseFloat(pridocs[j].KBETR);
                    }
                }
            }
        }
        $scope.datas.baogongDatas = angular.copy($scope.datas.baogongDatasTemp);
    }


    function __requestConfirmFill(objId, proType){
        // baoGongService.BAOWS_CONFIRM_FILL.url
        var url = baoGongService.BAOWS_CONFIRM_FILL.url;
        var params = baoGongService.BAOWS_CONFIRM_FILL.defaults;
        params.IV_OBJECT_ID = objId;
        params.IV_PROCESS_TYPE = proType;
        Prompter.showLoading("正在加载");
        var promise = HttpAppService.post(url,params);
        promise.success(function(response){
            if(response && response.ES_RESULT && (response.ES_RESULT.ZFLAG == "S"||response.ES_RESULT.ZFLAG == "")){
                    var outs = [];
                    //$scope.datas.baogongDatasTemp = [];
                    if(response.ET_FILL && response.ET_FILL.item_out){
                        //$scope.datas.baogongDatasTemp = outs = response.ET_FILL.item_out;
                        outs = response.ET_FILL.item_out;
                    }
                    for(var i = 0; i < outs.length; i++){
                        $scope.datas.baogongDatas.push({
                            //NUMBER_INT: "0000000020",
                            ORDERED_PROD: outs[i].PROD_ID,
                            DESCRIPTION: outs[i].PROD_DESC,
                            // ITM_TYPE: "ZO02",
                            // ITM_TYPE_DESC: "工单服务项目",
                            QUANTITY: outs[i].APPLY_NUM || 0,
                            QUANTITY_XBR: outs[i].APPLY_NUM || 0,
                            // PROCESS_QTY_UNIT: "",
                            // AC_INDICATOR: "D1",
                            // ACIND_DESCR_20: "免费",
                            INSTANCE_GUID: outs[i].INSTANCE_GUID
                        });
                        // for(var j = 0; j <$scope.datas.baogongDatasTemp.length; j++){
                        //     if(outs[i].PROD_ID == $scope.datas.baogongDatasTemp[j].ORDERED_PROD){
                        //         $scope.datas.baogongDatasTemp[j].INSTANCE_GUID = outs[i].INSTANCE_GUID;
                        //         continue;
                        //     }
                        // }
                    }

                    //$scope.datas.baogongDatas = angular.copy($scope.datas.baogongDatasTemp);
                    $scope.config.isEditPrice = false;
                    $scope.config.isEditDetail = false;
                    Prompter.hideLoading();
                    $scope.enterDetailEditMode();
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
        var url = baoGongService.BAOWS_EDIT.url;
        var params = angular.copy(baoGongService.BAOWS_EDIT.defaults);
        params.IV_OBJECT_ID = worksheetDataService.wsBaoDetailData.ydWorksheetNum;
        params.IV_PROCESS_TYPE = worksheetDataService.wsBaoDetailData. IS_PROCESS_TYPE;
        var itemIns = [];
        var pridocIns = [];
        for(var i = 0; i < $scope.datas.baogongDatas.length; i++){
            var tempItem = $scope.datas.baogongDatas[i];


            if(tempItem.AC_INDICATOR != tempItem.AC_INDICATOR_XBR){ //收费是否改变
                var tempObj = {
                    NUMBER_INT: tempItem.NUMBER_INT,
                    ORDERED_PROD: tempItem.ORDERED_PROD,
                    DESCRIPTION: tempItem.DESCRIPTION,
                    ITM_TYPE: tempItem.ITM_TYPE,
                    QUANTITY: tempItem.QUANTITY_XBR,
                    PROCESS_QTY_UNIT: tempItem.PROCESS_QTY_UNIT,
                    INSTANCE_GUID: tempItem.INSTANCE_GUID,//tempItem.,
                    AC_INDICATOR: tempItem.AC_INDICATOR_XBR,  // D1/D2 免费/收费
                    ZMODE: 'U'      //  I 新建/U 更改
                };
                itemIns.push(tempObj);
            }
            if(window.parseFloat(tempItem.XBR_NEW) != window.parseFloat(tempItem.XBR_NEW_OLD)){ //数量是否修改(可为正负)
                var pridocItem = {
                    NUMBER_INT: tempItem.NUMBER_INT,
                    KSCHL: 'ZPR2',
                    KBETR: tempItem.XBR_NEW
                }
                pridocIns.push(pridocItem);
            }
        }
        if(itemIns.length > 0){
            params.IT_DETAIL = {
                item_in: itemIns
            };
        }
        if(pridocIns.length > 0){
            params.IT_PRIDOC = {
                item_in: pridocIns
            };
        }
        if(itemIns.length > 0 || pridocIns.length > 0){
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
        }else{
            Prompter.showLoadingAutoHidden("订单未改动!", false, 1000);
            $timeout(function(){
                $scope.config.isEditPrice = false;
                $scope.config.isEditDetail = false;
            });
        }
        
    }

    function __requestRefreshBaoDetail(loadStr){ //loadStr, params
        var loadingStr = loadStr ? loadStr : "正在刷新数据" ;
        var queryParams = {
            "I_SYSNAME": { "SysName": worksheetDataService.getStoredByKey("sysName") },
            "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
            "IS_OBJECT_ID": worksheetDataService.wsBaoDetailData.ydWorksheetNum,
            "IS_PROCESS_TYPE": worksheetDataService.wsBaoDetailData.IS_PROCESS_TYPE
        };
        Prompter.showLoading(loadingStr);
        var promise = HttpAppService.post(worksheetHttpService.serviceDetail.url,queryParams);
        promise.success(function(response){
            if(response && !response.ES_RESULT){
                Prompter.showLoadingAutoHidden(response, false, 2000);
            }
            if(response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG != "S"){ // 未加载到数据
                Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
                return;
            }

            if(response.ET_DETAIL && response.ET_DETAIL.item){
                var detailItems = response.ET_DETAIL.item;
                __updateDetailInfos(detailItems);
            }
            if(response.ET_PRIDOC && response.ET_PRIDOC.item){
                var detailItems = response.ET_PRIDOC.item;
                __updatePridocInfos(detailItems);
            }
            __updateDetailAndPridocInfos();
            Prompter.hideLoading();
        })
        .error(function(errorResponse){
            Prompter.showLoadingAutoHidden("数据加载失败,请检查网络!", false, 2000);
        });
    }

    function __updateDetailAndPridocInfos(detailItems, pridocItems){
        $scope.datas.baogongDatasTemp = worksheetDataService.wsBaoDetailData.ET_DETAIL.item = detailItems;
        $scope.datas.baogongDatasTemp = worksheetDataService.wsBaoDetailData.ET_PRIDOC.item = pridocItems;
        __handleBaoGongDatasTemp();
    }







    
}]);