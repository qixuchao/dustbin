
worksheetModule.controller("WorksheetSparepartCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','HttpAppService','worksheetDataService',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,HttpAppService,worksheetDataService){
    ionicMaterialInk.displayEffect();
        var dataCang = {
            "I_SYSTEM": { "SysName": "CATL" },
            "IS_USER": { "BNAME": "" }
        }
        //cangku
        var urlCang = ROOTCONFIG.hempConfig.basePath + 'SERVICE_ORDER_STORAGE';
        HttpAppService.post(urlCang, dataCang).success(function(response){
            $scope.wareHouse = response.ET_STORAGE.item;
            console.log(angular.toJson(response)+"仓库");
        }).error(function(err){
            console.log(angular.toJson(err));
        });

        var worksheetDetail = worksheetDataService.wsDetailData;
        console.log(angular.toJson(worksheetDetail));
        var data = {
            "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_USER": { "BNAME": "" },
            "IS_PAGE": {
                "CURRPAGE": "1",
                "ITEMS": "10"
            },
            "IS_VEHICLID": {
                "PRODUCT_ID": worksheetDetail.ES_OUT_LIST.CAR_NO,
                "PRODUCT_TEXT": ""
            }
        }
        console.log(angular.toJson(data));
        var url = ROOTCONFIG.hempConfig.basePath + 'ATTACHMENT_LIST';
        HttpAppService.post(url, data).success(function(response){
            $scope.infos = response.ET_COMM_LIST.Item;
            console.log(angular.toJson(response));
        }).error(function(err){

        });

        $scope.goLoadMore = function(){

        }
        $scope.goUpdate = function(){
            $state.go("worksheetSelect");
        }
        $scope.goMore = true;
        $scope.goNo = false;
        $scope.goLoad = false;
        $scope.shi = { "item": {
            "RECORD_ID": "AFBWgycOHtW/qxd08Vc/Ug==",
            "STORAGE": "",
            "STORAGE_DESC": "",
            "PROD": "",
            "PROD_DESC": "",
            "APPLY_NUM": "",
            "SEND_NUM": "",
            "RETURN_NUM": "",
            "OLDNUM": "",
            "PARTNER_NO": "PI_CA3_340",
            "PARTNER_NAME": "PI_CA3_340",
            "NOTE": ""
        }};
        $scope.selectWarehouse = "南京"
        $scope.selectInfos = function(){
            var str=document.getElementsByName("selectSparePart");
            chestr = new Array();
            for (var i=0;i<str.length;i++) {
                if(str[i].checked == true)
                {
                    chestr.push(JSON.parse(str[i].value));
                }
            }
            console.log(angular.toJson(chestr));
            console.log(angular.toJson($scope.selectWarehouse));
        }
        //暂存
        $scope.goDetailList = function(){
           // var str=document.getElementsByName("selectSparePart");
           // chestr = new Array();
           // for (var i=0;i<str.length;i++) {
           //     if(str[i].checked == true)
           //     {
           //         chestr.push(JSON.parse(str[i].value));
           //     }
           // }
           // console.log(angular.toJson(chestr));
           //var b = {
           //     STORAGE_DESC : "客服/售后服务仓-备件中心-南京",
           //     flag : true,scrollStyle : "",
           //     detail : chestr
           // }
           // worksheetHttpService.setSparePart(b);
            $state.go("worksheetSelect");
        }
        $scope.selectDetail = function(){
            console.log("11"+$scope.info);
        }
        //增加数量
        $scope.add = function(item){
            item.APPLY_NUM += 1;
            console.log(angular.toJson($scope.infos));
        }
        //减少数量
        $scope.reduce = function(item){
            if(item.APPLY_NUM > 0){
                item.APPLY_NUM -= 1;
            }
            console.log(angular.toJson($scope.infos));
        }
        //input
        $scope.ngBlur = function(){
            console.log(angular.toJson($scope.infos));
        }
}]);
worksheetModule.controller("WorksheetPareSelectCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','worksheetDataService',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,worksheetDataService){
        ionicMaterialInk.displayEffect();
        //工单详情
        var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
        console.log(angular.toJson(worksheetDetail));
        var map = {};
        var dest = [];
        for(var i = 0; i < worksheetDetail.length; i++){
            var ai = worksheetDetail[i];
            if(!map[ai.id]){
                dest.push({
                    STORAGE: ai.STORAGE,
                    STORAGE_DESC: ai.STORAGE_DESC,
                    flag : true,
                    scrollStyle : "",
                    detail: [ai]
                });
                map[ai.id] = ai;
            }else{
                for(var j = 0; j < dest.length; j++){
                    var dj = dest[j];
                    if(dj.id == ai.id){
                        dj.detail.push(ai);
                        break;
                    }
                }
            }
        }
        console.log(angular.toJson(dest));
        $scope.spareDetail = dest;
        //返回详情页
        $scope.goDetail = function(){
            console.log(worksheetDataService.wsDetailData.IS_PROCESS_TYPE);
            if(worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPRO" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPRV"){
                $state.go("worksheetDetail",{
                    detailType: 'siteRepair'
                });
            }else if(worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZNCO" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZNCV"){
                $state.go("worksheetDetail",{
                    detailType: 'newCar'
                });
            }else if(worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPLO " || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPLV"){
                $state.go("worksheetDetail",{
                    detailType: 'batchUpdate'
                });
            }

        }
        $scope.upDown = true;
        $scope.showDetail = function(items) {
            console.log(items);
            for(var i=0;i<$scope.spareDetail.length;i++){
                $scope.spareDetail[i].scrollStyle = "height:"+0+"px";
            }
            console.log(items.detail.length);
            var scrHe = sco - items.detail.length * 116;
            console.log("内容高度"+scrHe);
            if(scrHe < 0){
                items.scrollStyle = "height:"+sco+"px";
             }else {
                items.scrollStyle = "height:"+items.detail.length * 116+"px";
            }
            console.log(angular.toJson($scope.spareDetail));
            for(var i=0;i<$scope.spareDetail.length;i++){
                if($scope.spareDetail[i].flag === false && $scope.spareDetail[i].STORAGE_DESC !== items.STORAGE_DESC){
                    $scope.spareDetail[i].flag = true;
                    //items.scrollStyle = "height:"+0+"px";

                }
                if($scope.spareDetail[i].flag === false && $scope.spareDetail[i].STORAGE_DESC === items.STORAGE_DESC){
                    items.scrollStyle = "height:"+0+"px";
                }
            }
            var a = items.flag;
            items.flag = !a;
            console.log(angular.toJson($scope.spareDetail));
        }

        $scope.showDetailInfos = false;
        var a=document.getElementById("content").offsetHeight-44;
        console.log(a + "内容高度");//48  116
        var h = $scope.spareDetail.length;
        var sco = a - 48*h;
        console.log(sco + "剩余高度");
    }]);