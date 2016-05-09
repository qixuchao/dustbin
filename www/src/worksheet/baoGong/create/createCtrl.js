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

	function __requestDetailDatas(loadStr){
    	var loadingStr = loadStr ? loadStr : "正在加载" ;
        var params = $scope.config.requestParams;
        var queryParams = {
		    "I_SYSNAME": { "SysName": worksheetDataService.getStoredByKey("sysName") },
		    "IS_AUTHORITY": { "BNAME": worksheetDataService.getStoredByKey("userName") },
		    "IS_OBJECT_ID": params.IS_OBJECT_ID,
		    "IS_PROCESS_TYPE": params.IS_PROCESS_TYPE
		}

		Prompter.showLoading(loadingStr);

        var promise = HttpAppService.post(worksheetHttpService.serviceDetail.url,queryParams);
        $scope.config.isLoading = true;
        $scope.config.loadingErrorMsg = null;
        promise.success(function(response){
        	if(response && !response.ES_RESULT){
        		Prompter.showLoadingAutoHidden(response, false, 2000);
        	}
        	if(response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG != "S"){ // 未加载到数据
        		$scope.config.hasMoreData = false;
        		Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
        		return;
        	}
        	if(!$scope.datas.serviceListDatas){
        		$scope.datas.serviceListDatas = [];
        	}
        	var kyhuMingCheng = "";
			var waifuRenyuan = ""; 
        	var tempResponse = response;
        	if(tempResponse && tempResponse.ET_PARTNER){
        		var items = tempResponse.ET_PARTNER.item;
	        	if(items && items.length >= 0){
	        		for(var j = 0; j < items.length; j++){
		        		if(items[j].PARTNER_FCT == "ZCUSTOME"){  //: 客户名称
		        			kyhuMingCheng = items[j].NAME1;
		        		}
		        		if(items[j].PARTNER_FCT == "ZSRVEMPL"){ //: 外服人员姓名
		        			waifuRenyuan = items[j].NAME1;
		        		}
		        	}
	        	}
        	}
        	if(tempResponse.ET_TEXT && tempResponse.ET_TEXT.item && tempResponse.ET_TEXT.item.length > 0){
        		var texts = tempResponse.ET_TEXT.item;
        		var lines = [];     var linesJieGuo = [];
        		for(var i = 0; i < texts.length; i ++){
        			if(texts[i].TDID == "Z001"){
        				var tempStr = texts[i].TDLINE+"";
        				tempStr.replace(/[\s]{10}/g, " ");
        				tempStr.replace(/[\s]{5}/g, " ");
        				tempStr.replace(/[\s]{2}/g, " ");
        				tempStr.replace(/[\s]{2}/g, " ");
        				texts[i].finalStr = tempStr;
        				lines.push(angular.copy(texts[i]));
        			}
        			if(texts[i].TDID == "Z005"){
        				var tempStr2 = texts[i].TDLINE+"";
        				tempStr2.replace(/[\s]{10}/g, " ");
        				tempStr2.replace(/[\s]{5}/g, " ");
        				tempStr2.replace(/[\s]{2}/g, " ");
        				tempStr2.replace(/[\s]{2}/g, " ");
        				texts[i].finalStr = tempStr2;
        				linesJieGuo.push(angular.copy(texts[i]));
        			}
        		}
        	}
        	tempResponse.XBRZHUSHIS = lines;
        	tempResponse.XBRCHULIJIEGUOS = linesJieGuo;
        	
        	tempResponse.ydWorksheetNum = params.IS_OBJECT_ID;
        	tempResponse.kyhuMingCheng = kyhuMingCheng;
        	tempResponse.waifuRenyuan = waifuRenyuan;
        	tempResponse.IS_PROCESS_TYPE = params.IS_PROCESS_TYPE;
        	$scope.datas.detail = tempResponse;
        	worksheetDataService.wsDetailData = tempResponse;

        	if(tempResponse.ES_OUT_LIST && tempResponse.ES_OUT_LIST.EDIT_FLAG == "Y"){
        		$scope.config.canEdit = true;
        	}else{
        		$scope.config.canEdit = false;
        	}

        	Prompter.hideLoading();


        	//debugger;
        	//console.log(tempResponse);
        })
        .error(function(errorResponse){
        	$scope.config.loadingErrorMsg = "数据加载失败,请检查网络!";
        	Prompter.showLoadingAutoHidden($scope.config.loadingErrorMsg, false, 2000);
        	$scope.config.isLoading = false;
        	if($scope.config.isReloading){
        		$scope.config.isReloading = false;
        		$scope.$broadcast('scroll.refreshComplete');
        		$scope.datas.serviceListDatas = [];
        		$scope.config.hasMoreData = false;
        	}		        	
        });
	}

}]);