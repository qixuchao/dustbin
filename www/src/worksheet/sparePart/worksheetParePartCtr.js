
worksheetModule.controller("WorksheetSparepartCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','HttpAppService','worksheetDataService','$cordovaToast','$cordovaDialogs','$ionicHistory',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,HttpAppService,worksheetDataService,$cordovaToast,$cordovaDialogs,$ionicHistory){
    ionicMaterialInk.displayEffect();
        $scope.config = {
            warehouse : "",
            searchInfos : ""
        }
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetSelect' && toState.name == 'worksheetSparepart'){
                $scope.config = {
                    warehouse : "",
                    searchInfos : ""
                }
                var str=document.getElementsByName("selectSparePart");
                for (var i=0;i<str.length;i++) {
                    str[i].checked = false;
                }
                console.log(angular.toJson($scope.goSAPInfos));
                $scope.goSAPInfos = [];
                var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
                if(worksheetDetail === undefined){
                    worksheetDetail = [];
                }
                var localInfos = worksheetHttpService.getSparePart();
                if(localInfos !== undefined){
                    $scope.goSAPInfos = $scope.goSAPInfos.concat(localInfos);
                }else{
                    $scope.goSAPInfos = $scope.goSAPInfos.concat(worksheetDetail);
                }
                console.log(angular.toJson($scope.goSAPInfos));
            }});
        $scope.goMore = false;//等待更多
        $scope.goNo = false;//没有
        $scope.goLoad = true;//加载
        $scope.goLoadUp = false;
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
                $scope.infos[i].trans = true;
            }
            console.log(angular.toJson($scope.infos));
        }).error(function(err){

        });
//点击加载更多
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
                            $scope.infos[i].APPLY_NUM = 0;
                            $scope.infos[i].trans = true;
                        }
                        $scope.change($scope.config.warehouse);
                        console.log(angular.toJson($scope.infos));
                    }
                }).error(function(err){

                });
            }
        }
        //搜索
        $scope.changeSearch = function(){
            var searchNum = 1;
            $scope.goLoadUp = true;
            console.log(angular.toJson($scope.config.searchInfos));
            var dataSeach = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": "" },
                "IS_PAGE": {
                    "CURRPAGE": searchNum,
                    "ITEMS": "10"
                },
                "IS_VEHICLID": {
                    "PRODUCT_ID": worksheetDataService.wsDetailData.ES_OUT_LIST.CAR_NO,
                    "PRODUCT_TEXT": $scope.config.searchInfos
                }
            }
            console.log(angular.toJson(dataSeach));
            var url = ROOTCONFIG.hempConfig.basePath + 'ATTACHMENT_LIST';
            HttpAppService.post(url, dataSeach).success(function(response){
                searchNum++;
                $scope.goLoadUp = false;
                var infosItem = response.ET_COMM_LIST.Item;
                console.log(angular.toJson(infosItem));
                if(infosItem === undefined){
                    $cordovaToast.showShortBottom('未搜索到相关备件');
                }else{
                    for(var m=0;m<infosItem.length;m++){
                        for(var k=0;k<$scope.infos.length;k++){
                            if($scope.infos[k].PRODUCT_ID === infosItem[m].PRODUCT_ID){
                                infosItem.splice(m,1);
                            }
                        }
                    }
                    console.log(angular.toJson(infosItem));
                    $scope.infos = infosItem.concat($scope.infos);
                    //$scope.infos = $scope.infos.concat(infosItem);
                    for(var i=0;i<$scope.infos.length;i++){
                        $scope.infos[i].APPLY_NUM = 0;
                        $scope.infos[i].trans = true;
                    }
                    $scope.change($scope.config.warehouse);

                }
            }).error(function(err){

            });
        }

        //默认已选中的  下拉框选择仓库
        $scope.change = function(item){
            for(var m=0;m<$scope.infos.length;m++){
                $scope.infos[m].APPLY_NUM = 0;
                item.trans = false;
            }
            console.log(angular.toJson(item));
            var str=document.getElementsByName("selectSparePart");
            if(item==="" || item === null || item === undefined){
                for (var i=0;i<str.length;i++) {
                    str[i].checked = false;
                }
            }else{
                console.log("--");
                for (var i=0;i<str.length;i++) {
                    console.log("--+");
                    for(var j=0;j<$scope.goSAPInfos.length;j++){
                        if(item.ZZSTORAGE === $scope.goSAPInfos[j].STORAGE && str[i].value === $scope.goSAPInfos[j].PROD){
                            str[i].checked = true;
                            console.log(angular.toJson(item));
                            console.log(angular.toJson(str[i].value));
                            console.log(angular.toJson($scope.goSAPInfos));
                            break;
                        }else{
                            str[i].checked = false;
                        }
                    }
                }
                for(var m=0;m<$scope.infos.length;m++){
                    for(var j=0;j<$scope.goSAPInfos.length;j++){
                        if($scope.infos[m].PRODUCT_ID === $scope.goSAPInfos[j].PROD && item.ZZSTORAGE === $scope.goSAPInfos[j].STORAGE){
                            $scope.infos[m].APPLY_NUM = $scope.goSAPInfos[j].APPLY_NUM;
                        }
                    }
                }
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
            }else if(item.trans===false){

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
                        "showPic":false,
                        "addNum" : true});
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
                            "showPic":false,
                            "addNum" : true});
                }
            }
            console.log(angular.toJson($scope.goSAPInfos));
        }
        //传输至sap
        $scope.goUpdateSAP = function(){

            Prompter.showLoading("正在传输");
            var item = new Array();
            for(var i=0;i<$scope.goSAPInfos.length;i++){
                if($scope.goSAPInfos[i].showPic === false){
                    item.push({
                        "STORAGE": $scope.goSAPInfos[i].STORAGE,
                        "PROD": $scope.goSAPInfos[i].PROD,
                        "APPLY_NUM": $scope.goSAPInfos[i].APPLY_NUM,
                        "ZMODE": "I"
                    });
                }else if($scope.goSAPInfos[i].addNum === false){
                    item.push({
                        "STORAGE": $scope.goSAPInfos[i].STORAGE,
                        "PROD": $scope.goSAPInfos[i].PROD,
                        "APPLY_NUM": $scope.goSAPInfos[i].APPLY_NUM,
                        "ZMODE": "U"
                    });
                }
            }
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.wsDetailData.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID": worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE,
                "IT_MAT_LIST": {
                    "item": item
                }};
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, data).success(function(response){
                console.log(angular.toJson(response));
                Prompter.hideLoading();
                if(response.ES_RESULT.ZFLAG === 'S'){
                    for(var i=0;i<$scope.goSAPInfos.length;i++){
                        $scope.goSAPInfos[i].showPic = true;
                        $scope.goSAPInfos[i].addNum = true;
                    }
                    worksheetHttpService.setSparePart($scope.goSAPInfos);
                    console.log(angular.toJson($scope.goSAPInfos));
                    worksheetDataService.wsDetailToList.needReload = true;
                    $cordovaToast.showShortBottom("数据已传输至SAP");
                }else{
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }
            }).error(function(err){
                console.log(angular.toJson(err));
            });
        }
        //暂存
        $scope.goDetailList = function(){
            worksheetHttpService.setSparePart($scope.goSAPInfos);
            console.log(angular.toJson($scope.goSAPInfos));
            $state.go("worksheetSelect");
        }
        //增加数量
        $scope.add = function(item){
            item.APPLY_NUM += 1;
            numChange(item);
            console.log(angular.toJson(item));
        }
        //减少数量
        $scope.reduce = function(item){
            if(item.APPLY_NUM > 0){
                    item.APPLY_NUM -= 1;
                }
            numChange(item);
            console.log(angular.toJson(item));

        }
        //input
        $scope.inputChange = function(item){
            numChange(item);
            console.log(angular.toJson(item));
        }
        var numChange = function(item){
            for(var n=0;n<$scope.goSAPInfos.length;n++){
                if(item.PRODUCT_ID === $scope.goSAPInfos[n].PROD && $scope.config.warehouse.ZZSTORAGE === $scope.goSAPInfos[n].STORAGE){
                    if($scope.goSAPInfos[n].showPic === true){
                        if(item.APPLY_NUM > $scope.goSAPInfos[n].APPLY_NUM){
                            item.trans = false;
                            $scope.goSAPInfos[n].APPLY_NUM = item.APPLY_NUM;
                            $scope.goSAPInfos[n].addNum = false;
                        }else if(item.APPLY_NUM = $scope.goSAPInfos[n].APPLY_NUM){
                            $scope.goSAPInfos[n].addNum = true;
                        }else{
                            $cordovaToast.showShortBottom("此数量不允许减少");
                            $scope.goSAPInfos[n].addNum = true;
                            item.APPLY_NUM = $scope.goSAPInfos[n].APPLY_NUM
                        }
                    }else {
                        $scope.goSAPInfos[n].APPLY_NUM = item.APPLY_NUM;
                    }
                }
            }
        }
        $scope.cancleInfos = function(){
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
}]);


worksheetModule.controller("WorksheetPareSelectCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','worksheetDataService','$cordovaDialogs','HttpAppService','$cordovaToast','$ionicHistory',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,worksheetDataService,$cordovaDialogs,HttpAppService,$cordovaToast,$ionicHistory){
        ionicMaterialInk.displayEffect();
        //工单详情
        var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
        console.log(angular.toJson(worksheetDataService.wsDetailData));
        console.log(angular.toJson(worksheetDetail));
        if(worksheetDetail === undefined){
            worksheetDetail = [];
        }else{
            for(var k=0;k<worksheetDetail.length;k++){
                worksheetDetail[k].showPic = true;
                worksheetDetail[k].addNum = true;
            }
        }
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetSparepart' && toState.name == 'worksheetSelect'){
                //var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
                //console.log(angular.toJson(worksheetDataService.wsDetailData));
                //if(worksheetDetail === undefined){
                //    worksheetDetail = [];
                //}else{
                //    for(var k=0;k<worksheetDetail.length;k++){
                //        worksheetDetail[k].showPic = true;
                //    }
                //}
                var localInfos = worksheetHttpService.getSparePart();
                if(localInfos === '' || localInfos === undefined){

                }else{
                    //worksheetDetail = worksheetDetail.concat(localInfos);
                    worksheetDetail =  localInfos;
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
                    console.log(angular.toJson(dest)+"===");
                    $scope.spareDetail = dest;
                }
            }
        });
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
                console.log("---");
                $ionicHistory.goBack();
            }
        }
        var gobackDetail = function(){
            if(worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPRO" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPRV"){
                console.log("---=");
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
                if(worksheetDetail[i].showPic === false ){
                    item.push({
                        "STORAGE": worksheetDetail[i].STORAGE,
                        "PROD": worksheetDetail[i].PROD,
                        "APPLY_NUM": worksheetDetail[i].APPLY_NUM,
                        "ZMODE": "I"
                    });
                }else if(worksheetDetail[i].addNum === false){
                    item.push({
                        "STORAGE": worksheetDetail[i].STORAGE,
                        "PROD": worksheetDetail[i].PROD,
                        "APPLY_NUM": worksheetDetail[i].APPLY_NUM,
                        "ZMODE": "U"
                    });
                }
            }
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.wsDetailData.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID": worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE,
                "IT_MAT_LIST": {
                    "item": item
                }};
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            if(item.length<1){
                $cordovaToast.showShortBottom("暂无信息需要传输");
                Prompter.hideLoading();
            }else{
                HttpAppService.post(url, data).success(function(response){
                    Prompter.hideLoading();
                    console.log(angular.toJson(response));
                    if(response.ES_RESULT.ZFLAG === 'S'){
                        for(var i=0;i<$scope.spareDetail.length;i++){
                            $scope.spareDetail[i].detail.showPic = true;
                            $scope.spareDetail[i].detail.addNum = true;
                        }
                        for(var i=0;i<worksheetDetail.length;i++){
                            worksheetDetail[i].addNum = true;
                            worksheetDetail[i].showPic = true;
                        }
                        console.log(angular.toJson($scope.spareDetail));
                        worksheetDataService.wsDetailToList.needReload = true;
                        $cordovaToast.showShortBottom("数据已传输至SAP");
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                    console.log(angular.toJson(response));
                }).error(function(err){
                    console.log(angular.toJson(err));
                });
            }

        }
        //数据刷新
        $scope.updateInfos = function(){
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.wsDetailData.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID":worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE
            }
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL';
            var id = worksheetDataService.wsDetailData.ydWorksheetNum;
            var wf = worksheetDataService.wsDetailData.waifuRenyuan;
            var name = worksheetDataService.wsDetailData.IS_PROCESS_TYPE;
            HttpAppService.post(url, data).success(function(response){
                //console.log(angular.toJson(response));
                if (response.ES_RESULT.ZFLAG === 'S') {
                    worksheetDataService.wsDetailData = response;
                    worksheetDataService.wsDetailData.ydWorksheetNum = id;
                    worksheetDataService.wsDetailData.waifuRenyuan = wf;
                    worksheetDataService.wsDetailData.IS_PROCESS_TYPE = name;
                    console.log(angular.toJson(response));
                }else{

                }
                Prompter.hideLoading();
            }).error(function(err){
                Prompter.hideLoading();
                console.log(angular.toJson(err));
            });
        }
    }]);