
worksheetModule.controller("WorksheetSparepartCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','HttpAppService','worksheetDataService','$cordovaToast','$cordovaDialogs','$ionicHistory',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,HttpAppService,worksheetDataService,$cordovaToast,$cordovaDialogs,$ionicHistory){
    ionicMaterialInk.displayEffect();
        $scope.config = {
            warehouse : ""
        }
        $scope.goMore = false;//等待更多
        $scope.goNo = false;//没有
        $scope.goLoad = true;//加载
        var numPage = 1;
        var dataCang = {
            "I_SYSTEM": { "SysName": "CATL" },
            "IS_USER": { "BNAME": "" }
        }
        $scope.infos;
        $scope.goSAPInfos = new Array();
        //cangku
        var urlCang = ROOTCONFIG.hempConfig.basePath + 'SERVICE_ORDER_STORAGE';
        HttpAppService.post(urlCang, dataCang).success(function(response){
            $scope.wareHouse = response.ET_STORAGE.item;
            console.log(angular.toJson(response)+"仓库");
        }).error(function(err){
            console.log(angular.toJson(err));
        });

        var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
        //$scope.goSAPInfos = worksheetDetail;
        console.log(angular.toJson(worksheetDetail));

        var data = {
            "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_USER": { "BNAME": "" },
            "IS_PAGE": {
                "CURRPAGE": numPage,
                "ITEMS": "10"
            },
            "IS_VEHICLID": {
                "PRODUCT_ID": worksheetDataService.wsDetailData.ES_OUT_LIST.CAR_NO,
                "PRODUCT_TEXT": ""
            }
        }
        console.log(angular.toJson(data));
        var url = ROOTCONFIG.hempConfig.basePath + 'ATTACHMENT_LIST';
        HttpAppService.post(url, data).success(function(response){
            $scope.goLoad = false;
            $scope.goMore = true;
            var infosItem = response.ET_COMM_LIST.Item;
            console.log(angular.toJson(infosItem));
            $scope.infos = infosItem;
            for(var i=0;i<$scope.infos.length;i++){
                $scope.infos[i].APPLY_NUM = 0;
            }
            console.log(angular.toJson($scope.infos));
        }).error(function(err){

        });

        $scope.goLoadMore = function(){
            if($scope.goNo){

            }else{
                numPage++;
                data = {
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_USER": { "BNAME": "" },
                    "IS_PAGE": {
                        "CURRPAGE": numPage,
                        "ITEMS": "10"
                    },
                    "IS_VEHICLID": {
                        "PRODUCT_ID": worksheetDataService.wsDetailData.ES_OUT_LIST.CAR_NO,
                        "PRODUCT_TEXT": ""
                    }
                }
                console.log(angular.toJson(numPage));
                console.log(angular.toJson(data));
                $scope.goLoad = true;
                $scope.goMore = false;
                HttpAppService.post(url, data).success(function(response){
                    $scope.goLoad = false;
                    $scope.goMore = true;
                    var infosItem = response.ET_COMM_LIST.Item;
                    console.log(angular.toJson(infosItem));
                    if(infosItem === undefined){
                        $scope.goMore = false;//等待更多
                        $scope.goNo = true;//没有
                        $scope.goLoad = false;//加载
                    }else{
                        $scope.infos = $scope.infos.concat(infosItem);
                        for(var i=0;i<$scope.infos.length;i++){
                            $scope.infos[i].APPLY_NUM = 1;
                        }
                        console.log(angular.toJson($scope.infos));
                    }
                }).error(function(err){

                });
            }
        }
        //搜索
        $scope.changeSearch = function(){
            console.log(angular.toJson($scope.goSAPInfos));
        }
        $scope.change = function(item){
            console.log(angular.toJson(item));
            var str=document.getElementsByName("selectSparePart");
            var chestr = new Array();
            for (var i=0;i<str.length;i++) {
                str[i].checked = false;
            }
        }
        //点击多选框的判定
        $scope.goSelectWareHouse = function(item){
            var length = $scope.goSAPInfos.length
            console.log($scope.config.warehouse);
            console.log(item);
            if($scope.config.warehouse.ZZSTORAGE === undefined ){
                var str=document.getElementsByName("selectSparePart");
                var chestr = new Array();
                for (var i=0;i<str.length;i++) {
                        str[i].checked = false;
                }
                $cordovaToast.showShortBottom('请先选择仓库');
            }else if(length === 0){
                $scope.goSAPInfos.push(
                    {"RECORD_ID":"",
                        "STORAGE":$scope.config.warehouse.ZZSTORAGE,
                        "STORAGE_DESC":$scope.config.warehouse.ZZSTORAGE_DESC,
                        "PROD": item.PRODUCT_ID,
                        "PROD_DESC":item.SHORT_TEXT,
                        "APPLY_NUM": item.APPLY_NUM,
                        "SEND_NUM":"",
                        "RETURN_NUM":"",
                        "OLDNUM":"",
                        "PARTNER_NO":"",
                        "PARTNER_NAME":"",
                        "NOTE":"",
                        "showPic":false});
            } else{
                var num = 0;
                for(var i=0;i<length;i++){
                    if($scope.config.warehouse.ZZSTORAGE === $scope.goSAPInfos[i].STORAGE && item.PRODUCT_ID === $scope.goSAPInfos[i].PROD){
                        console.log(angular.toJson(num)+"==");
                        $scope.goSAPInfos.splice(i,1);
                        num = 1;
                        return;
                    }else{
                        console.log(angular.toJson(num)+"--");
                        num = 2;
                    }
                }
                console.log(angular.toJson(num)+"--");
                if(num === 2){
                    $scope.goSAPInfos.push(
                        {"RECORD_ID":"",
                            "STORAGE":$scope.config.warehouse.ZZSTORAGE,
                            "STORAGE_DESC":$scope.config.warehouse.ZZSTORAGE_DESC,
                            "PROD": item.PRODUCT_ID,
                            "PROD_DESC":item.SHORT_TEXT,
                            "APPLY_NUM": item.APPLY_NUM,
                            "SEND_NUM":"",
                            "RETURN_NUM":"",
                            "OLDNUM":"",
                            "PARTNER_NO":"",
                            "PARTNER_NAME":"",
                            "NOTE":"",
                            "showPic":false});
                }
            }
            worksheetHttpService.setSparePart($scope.goSAPInfos);
            console.log(angular.toJson($scope.goSAPInfos));
        }
        //传输至sap
        $scope.goUpdateSAP = function(){

            Prompter.showLoading("正在传输");
            var item = new Array();
            for(var i=0;i<worksheetDetail.length;i++){
                if(worksheetDetail[i].showPic === false){
                    item.push({
                        "STORAGE": worksheetDetail[i].STORAGE,
                        "PROD": worksheetDetail[i].PROD,
                        "APPLY_NUM": worksheetDetail[i].APPLY_NUM,
                        "ZMODE": "I"
                    });
                }
            }
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.wsDetailData.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID": worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE,
                "IT_MILEAGE": {
                    "item": item
                }};
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, data).success(function(response){
                Prompter.hideLoading();
                //$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                console.log(angular.toJson(response));
            }).error(function(err){
                console.log(angular.toJson(err));
            });
        }
        //暂存
        $scope.goDetailList = function(){
            $state.go("worksheetSelect");
        }
        //增加数量
        $scope.add = function(item){
            item.APPLY_NUM += 1;
            console.log(angular.toJson(item));
        }
        //减少数量
        $scope.reduce = function(item){
            if(item.APPLY_NUM > 0){
                item.APPLY_NUM -= 1;
            }
            console.log(angular.toJson(item));
        }
        //input
        $scope.ngBlur = function(){
            console.log(angular.toJson($scope.infos));
        }
        $scope.cancleInfos = function(){
            if($scope.goSAPInfos.length>0){
                $cordovaDialogs.confirm('是否退出？', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            worksheetHttpService.setSparePart("");
                            $ionicHistory.goBack();
                        }
                    });
            }
        }
}]);


worksheetModule.controller("WorksheetPareSelectCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','worksheetDataService','$cordovaDialogs','HttpAppService','$cordovaToast',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,worksheetDataService,$cordovaDialogs,HttpAppService,$cordovaToast){
        ionicMaterialInk.displayEffect();
        //工单详情
        var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
        console.log(angular.toJson(worksheetDataService.wsDetailData));
        for(var k=0;k<worksheetDetail.length;k++){
            worksheetDetail[k].showPic = true;
        }
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetSparepart' && toState.name == 'worksheetSelect'){
                var localInfos = worksheetHttpService.getSparePart();
                if(localInfos === ''){

                }else{
                    worksheetDetail = worksheetDetail.concat(localInfos);
                    console.log(angular.toJson(localInfos)+"=======");
                    var map = {};
                    var dest = [];
                    for(var i = 0; i < worksheetDetail.length; i++){
                        var ai = worksheetDetail[i];
                        if(!map[ai.STORAGE]){
                            dest.push({
                                STORAGE: ai.STORAGE,
                                STORAGE_DESC: ai.STORAGE_DESC,
                                flag : true,
                                scrollStyle : "",
                                detail: [ai]
                            });
                            map[ai.STORAGE] = ai;
                        }else{
                            for(var j = 0; j < dest.length; j++){
                                var dj = dest[j];
                                if(dj.STORAGE == ai.STORAGE){
                                    dj.detail.push(ai);
                                    break;
                                }
                            }
                        }
                    }
                    console.log(angular.toJson(dest+"------"));
                    $scope.spareDetail = dest;
                }
            }
        });
        console.log(angular.toJson(worksheetDetail));
        var map = {};
        var dest = [];
        for(var i = 0; i < worksheetDetail.length; i++){
            var ai = worksheetDetail[i];
            if(!map[ai.STORAGE]){
                dest.push({
                    STORAGE: ai.STORAGE,
                    STORAGE_DESC: ai.STORAGE_DESC,
                    flag : true,
                    scrollStyle : "",
                    detail: [ai]
                });
                map[ai.STORAGE] = ai;
            }else{
                for(var j = 0; j < dest.length; j++){
                    var dj = dest[j];
                    if(dj.STORAGE == ai.STORAGE){
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
            var local = 1;
            for(var i=0;i<worksheetDetail.length;i++){
                if(worksheetDetail[i].showPic === false){
                    local = 0 ;
                }
            }
            if(local === 0 ){
                $cordovaDialogs.confirm('部分数据未上传，是否退出？', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            gobackDetail();
                        }
                    });
            }else{
                gobackDetail();
            }
        }
        var gobackDetail = function(){
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
        $scope.goUpdateSAP = function(){
            console.log(angular.toJson(worksheetDetail));
            Prompter.showLoading("正在传输");
            var item = new Array();
            for(var i=0;i<worksheetDetail.length;i++){
                if(worksheetDetail[i].showPic === false){
                    item.push({
                        "STORAGE": worksheetDetail[i].STORAGE,
                        "PROD": worksheetDetail[i].PROD,
                        "APPLY_NUM": worksheetDetail[i].APPLY_NUM,
                        "ZMODE": "I"
                    });
                }
            }
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.wsDetailData.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID": worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE,
                "IT_MILEAGE": {
                    "item": item
                }};
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, data).success(function(response){
                Prompter.hideLoading();
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                console.log(angular.toJson(response));
            }).error(function(err){
                console.log(angular.toJson(err));
            });
        }
    }]);