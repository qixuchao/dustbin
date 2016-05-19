
worksheetModule.controller("WorksheetSparepartCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','HttpAppService','worksheetDataService','$cordovaToast','$cordovaDialogs','$ionicHistory',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,HttpAppService,worksheetDataService,$cordovaToast,$cordovaDialogs,$ionicHistory){
    ionicMaterialInk.displayEffect();
        //$scope.config = {
        //    warehouse : "",
        //    searchInfos : ""
        //}
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetSelect' && toState.name == 'worksheetSparepart' && worksheetHttpService.goWhere.go == true && worksheetHttpService.goWhere.cun == false){
                worksheetHttpService.goWhere.go = false;
                 //worksheetHttpService.goWhere.back = false;
                $ionicHistory.goBack();
                worksheetHttpService.setSparePart("");
            }
            var proInfos =  worksheetHttpService.addPro.proInfos;
                $scope.config = {
                    warehouse : "",
                    searchInfos : "",
                    queryResultScrollDelegate : $ionicScrollDelegate.$getByHandle("worksheetListResult")
                }
                var str=document.getElementsByName("selectSparePart");
                for (var i=0;i<str.length;i++) {
                    str[i].checked = false;
                }

                $scope.goSAPInfos = [];
                var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
            //console.log(worksheetDetail);
                if(worksheetDataService.wsDetailData.ET_MAT_LIST == ''){
                    worksheetHttpService.goWhere.go = true;
                }
                if(worksheetDetail === undefined){
                    worksheetDetail = [];
                }
                var localInfos = worksheetHttpService.getSparePart();
            //console.log(localInfos);
                if(localInfos !== undefined && localInfos !== ''){
                    $scope.goSAPInfos = $scope.goSAPInfos.concat(localInfos);
                }else{
                    $scope.goSAPInfos = $scope.goSAPInfos.concat(worksheetDetail);
                }
            //console.log($scope.goSAPInfos);
            $scope.goMore = false;//等待更多
            $scope.goNo = false;//没有
            $scope.goLoad = true;//加载
            $scope.goLoadUp = false;
            $scope.isActive = true;
            $scope.numPage = 1;
            var dataCang = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName }
            }
            //$scope.infos;
            if(proInfos == undefined){
                $scope.infos = [];
            }else{
                $scope.config.wareHouse = worksheetHttpService.addPro.wareHouse;
                $scope.infos = proInfos;
            }
            //console.log($scope.infos);
            //$scope.goSAPInfos = new Array();
            //cangku
            var urlCang = ROOTCONFIG.hempConfig.basePath + 'SERVICE_ORDER_STORAGE';
            HttpAppService.post(urlCang, dataCang).success(function(response){
                    $scope.wareHouse = response.ET_STORAGE.item;

            }).error(function(err){
            });

            var data = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": $scope.numPage,
                    "ITEMS": "10"
                },
                "IS_VEHICLID": {
                    "PRODUCT_ID": worksheetDataService.wsDetailData.ES_OUT_LIST.CAR_NO,
                    "PRODUCT_TEXT": ""
                }
            }
            var url = ROOTCONFIG.hempConfig.basePath + 'ATTACHMENT_LIST';
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function(response){
                $scope.goLoad = false;
                $scope.goMore = true;
                var infosItem = response.ET_COMM_LIST.Item;
                if($scope.infos == []){
                    $scope.infos = infosItem;
                }else{
                    $scope.infos = $scope.infos.concat(infosItem);
                }
                for(var i=0;i<$scope.infos.length;i++){
                    $scope.infos[i].APPLY_NUM = 0;//数量
                    $scope.infos[i].ishave = true;//是否已被选择 显示
                    $scope.infos[i].checked = "NO";//是否默认
                }
                $scope.deletePro("");
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                Prompter.hideLoading();
                $ionicLoading.hide();
            });
            });

        //去除其他仓库选择的产品
        //$scope.addDel = [];
        $scope.deletePro = function(warehouse){
            for(var k=0;k<$scope.infos.length;k++){
                $scope.infos[k].ishave = true;
            }
            if(warehouse === ""){
                for(var i=0;i<$scope.infos.length;i++){
                    for(var j=0;j<$scope.goSAPInfos.length;j++){
                        if( $scope.goSAPInfos[j].PROD === $scope.infos[i].PRODUCT_ID){
                            $scope.infos[i].ishave = false;
                        }else{

                        }
                    }
                }
            }else{
                for(var i=0;i<$scope.infos.length;i++){
                    for(var j=0;j<$scope.goSAPInfos.length;j++){
                        if($scope.goSAPInfos[j].STORAGE !== warehouse.ZZSTORAGE && $scope.goSAPInfos[j].PROD === $scope.infos[i].PRODUCT_ID){
                            $scope.infos[i].ishave = false;
                        }else{

                        }
                    }
                }
            }
            var arr = $scope.infos;
            return arr;
        }
//点击加载更多
        $scope.goLoadMore = function(){
            if($scope.goNo){

            }else{
                $scope.numPage++;
                data = {
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_USER": { "BNAME": window.localStorage.crmUserName },
                    "IS_PAGE": {
                        "CURRPAGE": $scope.numPage,
                        "ITEMS": "10"
                    },
                    "IS_VEHICLID": {
                        "PRODUCT_ID": worksheetDataService.wsDetailData.ES_OUT_LIST.CAR_NO,
                        "PRODUCT_TEXT": ""
                    }
                }
                $scope.goLoad = true;
                $scope.goMore = false;
                var uri = ROOTCONFIG.hempConfig.basePath + 'ATTACHMENT_LIST';
                var startTime = new Date().getTime();
                HttpAppService.post(uri, data).success(function(response){
                    $scope.goLoad = false;
                    $scope.goMore = true;
                    var infosItem = response.ET_COMM_LIST.Item;
                    if(infosItem === undefined){
                        $scope.goMore = false;//等待更多
                        $scope.goNo = true;//没有
                        $scope.goLoad = false;//加载
                    }else{

                        for(var k=0;k<$scope.infos.length;k++){
                            for(var m=0;m<infosItem.length;m++){
                                if($scope.infos[k].PRODUCT_ID === infosItem[m].PRODUCT_ID){
                                    infosItem.splice(m,1);
                                }
                            }
                        }
                        $scope.infos = $scope.infos.concat(infosItem);
                        for(var i=0;i<$scope.infos.length;i++){
                            $scope.infos[i].APPLY_NUM = 0;
                            $scope.infos[i].ishave = true;
                            $scope.infos[i].checked = "NO";
                        }
                        $scope.change($scope.config.warehouse);}
                    $scope.config.queryResultScrollDelegate.resize();
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        if(ionic.Platform.isWebView()){
                            $cordovaDialogs.alert('请求超时');
                        }
                    }else{
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                    Prompter.hideLoading();
                });
            }
        }
        //搜索
        $scope.changeSearch = function(){
            var searchNum = 1;
            $scope.goLoadUp = true;
            var dataSeach = {
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_USER": { "BNAME": window.localStorage.crmUserName },
                "IS_PAGE": {
                    "CURRPAGE": searchNum,
                    "ITEMS": "10"
                },
                "IS_VEHICLID": {
                    "PRODUCT_ID": worksheetDataService.wsDetailData.ES_OUT_LIST.CAR_NO,
                    "PRODUCT_TEXT": $scope.config.searchInfos
                }
            }
            var url = ROOTCONFIG.hempConfig.basePath + 'ATTACHMENT_LIST';
            var startTime = new Date().getTime();
            HttpAppService.post(url, dataSeach).success(function(response){
                searchNum++;
                $scope.goLoadUp = false;
                var infosItem = response.ET_COMM_LIST.Item;
                if(infosItem === undefined){
                    $cordovaToast.showShortBottom('未搜索到相关备件');
                }else{
                    for(var k=0;k<$scope.infos.length;k++){
                        for(var m=0;m<infosItem.length;m++){
                            if($scope.infos[k].PRODUCT_ID == infosItem[m].PRODUCT_ID){
                                infosItem.splice(m,1);
                                break;
                            }
                        }
                    }
                    $scope.infos = infosItem.concat($scope.infos);
                    //$scope.infos = $scope.infos.concat(infosItem);
                    for(var i=0;i<$scope.infos.length;i++){
                        $scope.infos[i].APPLY_NUM = 0;
                        $scope.infos[i].ishave = true;
                        $scope.infos[i].checked = "NO";
                    }
                    $scope.change($scope.config.warehouse);
                }
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                $ionicLoading.hide();
                Prompter.hideLoading();
            });
        }

        //默认已选中的  下拉框选择仓库
        $scope.change = function(item){
            $scope.infos = $scope.deletePro($scope.config.warehouse);
            for(var m=0;m<$scope.infos.length;m++){
                $scope.infos[m].APPLY_NUM = 0;
                //$scope.infos[m].ishave = true;
            }
            for(var m=0;m<$scope.infos.length;m++){
                for(var j=0;j<$scope.goSAPInfos.length;j++){
                    if($scope.infos[m].PRODUCT_ID === $scope.goSAPInfos[j].PROD && item.ZZSTORAGE === $scope.goSAPInfos[j].STORAGE){
                        $scope.infos[m].APPLY_NUM = $scope.goSAPInfos[j].APPLY_NUM;
                    }
                }
            }
            //var str=document.getElementsByName("selectSparePart");
            //console.log(str.length);
            if(item==="" || item === null || item === undefined){
                //for (var i=0;i<str.length;i++) {
                //    str[i].checked = false;
                //}
            }else{
                for (var i=0;i<$scope.infos.length;i++) {
                    for(var j=0;j<$scope.goSAPInfos.length;j++){
                        //if(item.ZZSTORAGE === $scope.goSAPInfos[j].STORAGE && str[i].value === $scope.goSAPInfos[j].PROD){
                        //    str[i].checked = true;
                        //    console.log((item));
                        //    console.log((str[i].value));
                        //    console.log(($scope.goSAPInfos));
                        //    break;
                        //}else{
                        //    str[i].checked = false;
                        //}
                        if(item.ZZSTORAGE === $scope.goSAPInfos[j].STORAGE && $scope.infos[i].PRODUCT_ID === $scope.goSAPInfos[j].PROD){
                            $scope.infos[i].checked = "YES";
                        }
                    }
                }
            }

        }
        //点击多选框的判定
        $scope.goSelectWareHouse = function(item){
            var length = $scope.goSAPInfos.length

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
                        "ALWAY_NUM" : "",
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
                        if($scope.goSAPInfos[i].showPic === true){
                            return;
                        }
                        $scope.goSAPInfos.splice(i,1);
                        num = 1;
                        return;
                    }else{
                        num = 2;
                    }
                }
                if(num === 2){
                    $scope.goSAPInfos.push(
                        {"RECORD_ID":"",
                            "STORAGE":$scope.config.warehouse.ZZSTORAGE,
                            "STORAGE_DESC":$scope.config.warehouse.ZZSTORAGE_DESC,
                            "PROD": item.PRODUCT_ID,
                            "PROD_DESC":item.SHORT_TEXT,
                            "APPLY_NUM": item.APPLY_NUM,
                            "ALWAY_NUM" : "",
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
                        "RECORD_ID" : $scope.goSAPInfos[i].RECORD_ID,
                        "ZMODE": "U"
                    });
                }
            }
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_OBJECT_ID": worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE,
                "IT_MAT_LIST": {
                    "item": item
                }};
            //console.log(data);
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function(response){
                Prompter.hideLoading();
                if(response.ES_RESULT.ZFLAG === 'S'){
                    //for(var i=0;i<$scope.goSAPInfos.length;i++){
                    //    $scope.goSAPInfos[i].showPic = true;
                    //    $scope.goSAPInfos[i].addNum = true;
                    //}
                    //worksheetHttpService.setSparePart($scope.goSAPInfos);
                    //console.log(angular.toJson($scope.goSAPInfos));
                    //worksheetDataService.wsDetailToList.needReload = true;
                    $scope.updateInfos();
                    $cordovaToast.showShortBottom("数据已传输至SAP");
                }else{
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    $state.go("worksheetSelect");
                }
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                $ionicLoading.hide();
                Prompter.hideLoading();
            });
        }
        //暂存
        $scope.goDetailList = function(){
            //console.log($scope.goSAPInfos);
            worksheetHttpService.setSparePart($scope.goSAPInfos);
            $state.go("worksheetSelect");
        }
        //增加数量
        $scope.add = function(item){
            item.APPLY_NUM += 1;
            numChange(item);
        }
        //减少数量
        $scope.reduce = function(item){
            if(item.APPLY_NUM > 0){
                item.APPLY_NUM = item.APPLY_NUM-1;
                numChange(item);
            }else{
                $cordovaToast.showShortBottom("此备件数量已为0");
            }

        }
        //input
        $scope.inputChange = function(item){
            numChange(item);
        }
        $scope.blurnum = function(item){
            numChange(item);
        }
        //$scope.focusnum = function(item){
        //    console.log((item));
        //    //numChange(item);
        //}
        var numChange = function(item){
            //console.log(item);
            //console.log($scope.goSAPInfos)
            for(var n=0;n<$scope.goSAPInfos.length;n++){
                if(item.PRODUCT_ID === $scope.goSAPInfos[n].PROD && $scope.config.warehouse.ZZSTORAGE === $scope.goSAPInfos[n].STORAGE){
                    if($scope.goSAPInfos[n].showPic == true){
                        if(item.APPLY_NUM > $scope.goSAPInfos[n].ALWAY_NUM){
                            $scope.goSAPInfos[n].APPLY_NUM = item.APPLY_NUM;
                            $scope.goSAPInfos[n].addNum = false;
                        }else if(item.APPLY_NUM == $scope.goSAPInfos[n].ALWAY_NUM){
                            $scope.goSAPInfos[n].APPLY_NUM = item.APPLY_NUM;
                            $scope.goSAPInfos[n].addNum = true;
                        }else{
                            item.APPLY_NUM = item.APPLY_NUM+1;
                            $scope.goSAPInfos[n].addNum = true;
                            $cordovaToast.showShortBottom("此数量不允许减少");
                            //item.APPLY_NUM = $scope.goSAPInfos[n].APPLY_NUM
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
                            console.log( worksheetHttpService.getSparePart());
                            worksheetHttpService.addPro.proInfos = "";
                            $ionicHistory.goBack();
                        }
                    });
        }

        //数据刷新
        $scope.updateInfos = function(){
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_OBJECT_ID":worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE
            }
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL';
            var id = worksheetDataService.wsDetailData.ydWorksheetNum;
            var wf = worksheetDataService.wsDetailData.waifuRenyuan;
            var name = worksheetDataService.wsDetailData.IS_PROCESS_TYPE;
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function(response){
                if (response.ES_RESULT.ZFLAG === 'S') {
                    worksheetDataService.wsDetailData = response;
                    worksheetDataService.wsDetailData.ydWorksheetNum = id;
                    worksheetDataService.wsDetailData.waifuRenyuan = wf;
                    worksheetDataService.wsDetailData.IS_PROCESS_TYPE = name;
                    worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
                    for(var k=0;k<worksheetDetail.length;k++){
                        worksheetDetail[k].showPic = true;
                        worksheetDetail[k].addNum = true;
                        worksheetDetail[k].ALWAY_NUM = worksheetDetail[k].APPLY_NUM;
                    }
                    $scope.goSAPInfos = worksheetDetail;
                    worksheetHttpService.setSparePart($scope.goSAPInfos);
                    $state.go("worksheetSelect");
                }else{
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }
                Prompter.hideLoading();
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                $ionicLoading.hide();
                Prompter.hideLoading();
            });
        }
        $scope.goCustomer = function(){
            //if($scope.config.warehouse.ZZSTORAGE === undefined ){
            //    var str=document.getElementsByName("selectSparePart");
            //    var chestr = new Array();
            //    for (var i=0;i<str.length;i++) {
            //        str[i].checked = false;
            //    }
            //    $cordovaToast.showShortBottom('请先选择仓库');
            //}else{
            //    worksheetHttpService.addPro.wareHouse = $scope.config.warehouse;
                worksheetHttpService.setSparePart($scope.goSAPInfos);
                $state.go("worksheetSelectPro");
            //}
        }
}]);


worksheetModule.controller("WorksheetPareSelectCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetHttpService','worksheetDataService','$cordovaDialogs','HttpAppService','$cordovaToast','$ionicHistory','SpareListService',
    function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetHttpService,worksheetDataService,$cordovaDialogs,HttpAppService,$cordovaToast,$ionicHistory,SpareListService){
        ionicMaterialInk.displayEffect();
        //工单详情
        var worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
        //console.log(worksheetDetail);
            if(worksheetDetail === undefined){
                worksheetDetail = [];
            }else{
                if(worksheetHttpService.goWhere.go == true ){

                }else{
                    for(var k=0;k<worksheetDetail.length;k++){
                        worksheetDetail[k].showPic = true;//是否已存在，只是加数量
                        worksheetDetail[k].addNum = true;//新加的备件
                        worksheetDetail[k].ALWAY_NUM = worksheetDetail[k].APPLY_NUM; //原始数量
                    }
                }
            }

        //console.log(worksheetDetail);
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetSparepart' && toState.name == 'worksheetSelect'){
                var localInfos = worksheetHttpService.getSparePart();
                //console.log(localInfos);
                if(localInfos == '' || localInfos == undefined){

                }else{
                    //worksheetDetail = worksheetDetail.concat(localInfos);
                    worksheetDetail =  localInfos;
                    //console.log(worksheetDetail);
                    changeArr();
                }
            }
        });
        var changeArr = function(){
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
            $scope.spareDetail = dest;
        }
        changeArr();
        //返回详情页
        $scope.goDetail = function(){
            var local = 1;
            for(var i=0;i<worksheetDetail.length;i++){
                if(worksheetDetail[i].showPic == false || worksheetDetail[i].addNum == false){
                    local = 0;
                }
            }
            if(local == 0){
                $cordovaDialogs.confirm('部分数据未上传，是否需要退出？', '提示', ['确定', '取消'])
                    .then(function (buttonIndex) {
                        // no button = 0, 'OK' = 1, 'Cancel' = 2
                        var btnIndex = buttonIndex;
                        if (btnIndex == 1) {
                            worksheetHttpService.goWhere.cun = false;
                            worksheetHttpService.setSparePart("");
                            //console.log( worksheetHttpService.getSparePart());
                            worksheetHttpService.addPro.proInfos = "";
                            $scope.updateInfos("1");
                            $ionicHistory.goBack();
                        }
                    });
            }else{
                worksheetHttpService.goWhere.cun = false;
                worksheetHttpService.setSparePart("");
                //console.log( worksheetHttpService.getSparePart());
                worksheetHttpService.addPro.proInfos = "";
                $scope.updateInfos("1");
                $ionicHistory.goBack();
            }

        }
        $scope.goUpdateSelect = function(){
            worksheetHttpService.goWhere.cun = true;
            $state.go("worksheetSparepart");
        }
        $scope.upDown = true;
        $scope.showDetail = function(items) {
            var h = $scope.spareDetail.length;
            console.log(h);
            var sco = a - 48*h;
            //console.log(items);
            for(var i=0;i<$scope.spareDetail.length;i++){
                $scope.spareDetail[i].scrollStyle = "height:"+0+"px";
            }
            var scrHe = sco - items.detail.length * 116;
            console.log(scrHe);
            if(scrHe < 0){
                items.scrollStyle = "height:"+sco+"px";
             }else {
                items.scrollStyle = "height:"+items.detail.length * 116+"px";
            }
            console.log(items.scrollStyle);
            for(var i=0;i<$scope.spareDetail.length;i++){
                if($scope.spareDetail[i].flag === false && $scope.spareDetail[i].STORAGE_DESC !== items.STORAGE_DESC){
                    $scope.spareDetail[i].flag = true;
                    //items.scrollStyle = "height:"+0+"px";

                }
                if($scope.spareDetail[i].flag === false && $scope.spareDetail[i].STORAGE_DESC === items.STORAGE_DESC){
                    items.scrollStyle = "height:"+0+"px";
                }
            }
            items.flag = !items.flag;
        }

        $scope.showDetailInfos = false;
        var a=document.getElementById("content").offsetHeight;
        console.log(a);
        var h = $scope.spareDetail.length;
        console.log(h);
        var sco = a - 48*h;
        console.log(sco);
        $scope.goUpdateSAP = function(){
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
                        "RECORD_ID" : worksheetDetail[i].RECORD_ID,
                        "ZMODE": "U"
                    });
                }
            }
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_OBJECT_ID": worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE,
                "IT_MAT_LIST": {
                    "item": item
                }};
            //console.log(data);
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            if(item.length<1){
                $cordovaToast.showShortBottom("暂无信息需要传输");
                Prompter.hideLoading();
            }else{
                var startTime = new Date().getTime();
                HttpAppService.post(url, data).success(function(response){
                    Prompter.hideLoading();
                    if(response.ES_RESULT.ZFLAG === 'S'){
                        //for(var i=0;i<$scope.spareDetail.length;i++){
                        //    $scope.spareDetail[i].detail.showPic = true;
                        //    $scope.spareDetail[i].detail.addNum = true;
                        //}
                        //for(var i=0;i<worksheetDetail.length;i++){
                        //    worksheetDetail[i].addNum = true;
                        //    worksheetDetail[i].showPic = true;
                        //}
                        $scope.updateInfos("2");
                        //worksheetDataService.wsDetailToList.needReload = true;
                        $cordovaToast.showShortBottom("数据已传输至SAP");
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        if(ionic.Platform.isWebView()){
                            $cordovaDialogs.alert('请求超时');
                        }
                    }else{
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                    Prompter.hideLoading();
                });
            }

        }
        //数据刷新
        $scope.updateInfos = function(item){
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_OBJECT_ID":worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE
            }
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL';
            var id = worksheetDataService.wsDetailData.ydWorksheetNum;
            var wf = worksheetDataService.wsDetailData.waifuRenyuan;
            var name = worksheetDataService.wsDetailData.IS_PROCESS_TYPE;
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function(response){
                if (response.ES_RESULT.ZFLAG === 'S') {
                    worksheetDataService.wsDetailData = response;
                    worksheetDataService.wsDetailData.ydWorksheetNum = id;
                    worksheetDataService.wsDetailData.waifuRenyuan = wf;
                    worksheetDataService.wsDetailData.IS_PROCESS_TYPE = name;
                    worksheetDetail = worksheetDataService.wsDetailData.ET_MAT_LIST.item;
                    for(var k=0;k<worksheetDetail.length;k++){
                        worksheetDetail[k].showPic = true;
                        worksheetDetail[k].addNum = true;
                        worksheetDetail[k].ALWAY_NUM = worksheetDetail[k].APPLY_NUM;
                    }
                    if(item == '1'){

                    }else{
                        worksheetHttpService.setSparePart(worksheetDetail);
                    }
                    changeArr();
                }else{

                }
                Prompter.hideLoading();
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                Prompter.hideLoading();
                $ionicLoading.hide();
            });
        }
        $scope.goSpare = function(item){
            console.log(item);
            var value = {
                PRODUCT_ID : item.PROD,
                SHORT_TEXT : item.PROD_DESC
            };
            SpareListService.set(value);
            $state.go('spareDetail');
        }
    }]);

//chanpin
/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('worksheetSpareListCtrl',['$ionicScrollDelegate','$rootScope','$cordovaToast','worksheetDataService','HttpAppService','$http','SpareListService','$state','$scope','Prompter','$timeout',
    "$ionicHistory",'worksheetHttpService','$cordovaDialogs',
    function ($ionicScrollDelegate,$rootScope,$cordovaToast,worksheetDataService,HttpAppService,$http,SpareListService,$state,$scope,Prompter,$timeout, $ionicHistory,worksheetHttpService,$cordovaDialogs){
        var page=0;
        $scope.spareList=[];
        $scope.spareList1=[];
        $scope.data=[];
        $scope.spareInfo="";
        $scope.spareimisshow=false;
        $scope.searchFlag=false;
        $scope.isSearch=false;
        $scope.showFlag=worksheetDataService.selectedProduct;


        $scope.spareListHistoryval = function(){

            if(storedb('sparedb').find().arrUniq() != undefined || storedb('sparedb').find().arrUniq() != null){
                $scope.data = (storedb('sparedb').find().arrUniq());
                if ($scope.data.length > 5) {
                    $scope.data = $scope.data.slice(0, 5);
                }
            }

            if (JSON.parse(localStorage.getItem("oftenSparedb")) != null || JSON.parse(localStorage.getItem("oftenSparedb")) != undefined) {
                $scope.spareList1 = JSON.parse(localStorage.getItem("oftenSparedb"));
                if ($scope.spareList1.length > 15) {
                    $scope.spareList1 = $scope.spareList1.slice(0, 15);
                }
            } else {
                $scope.spareList1 = [];
            }
        };
        $scope.spareListHistoryval();

        //广播修改界面显示flag
        $rootScope.$on('customercontactCreatevalue', function(event, data) {
            $scope.searchFlag =data;
            $scope.spareInfo ="";
            $scope.cancelSearch();

            //$scope.spareListHistoryval();
        });
        //$rootScope.$on('sparelist', function(event, data) {
        //    console.log("接收成功1");
        //
        //    $scope.spareListHistoryval();
        //
        //});
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState && toState && fromState.name == 'worksheetEdit'){
                // worksheetDataService.selectedProduct="";
            }
        });
        $scope.changePage=function(){
            $scope.searchFlag=true;
            //$timeout(function () {z
            //    document.getElementById('spareId').focus();
            //}, 1)
        };
        $scope.changeSearch=function(){
            $scope.isSearch=true;
        };
        $scope.initSearch = function () {
            $scope.spareInfo = '';
            //$timeout(function () {
            //    document.getElementById('spareId').focus();
            //}, 1)
        };
        $scope.cancelSearch=function(){
            $scope.searchFlag=false;
            $scope.spareInfo = '';
            $scope.spareList=new Array;
            $scope.spareListHistoryval();
            page=0;
        };
        $scope.search = function (x, e) {
            Prompter.showLoading('正在搜索');
            $scope.searchFlag=true;
            $scope.spareInfo = x;
            $scope.spareLoadmoreIm();
        };
        $scope.spareLoadmoreIm = function() {
            //$scope.spareimisshow = false;
            //console.log("第1步");
            page+=1;
            var url = ROOTCONFIG.hempConfig.basePath + 'PRODUCT_LIST';
            var data = {
                "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_USER": { "BNAME":  window.localStorage.crmUserName  },
                "IS_PAGE": {
                    "CURRPAGE": page,
                    "ITEMS": "20"
                },
                "IS_PRODMAS_INPUT": {"SHORT_TEXT": $scope.spareInfo}
            };
            var startTime = new Date().getTime();
            HttpAppService.post(url, data).success(function (response) {
                if($scope.spareInfo == data.IS_PRODMAS_INPUT.SHORT_TEXT){
                    //console.log(page);
                    if (response.ES_RESULT.ZFLAG == 'E') {
                        $scope.spareimisshow = false;
                        $scope.spareList = $scope.checkedPro
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        if (response.ES_RESULT.ZFLAG == 'S') {
                            //console.log("第4步");
                            Prompter.hideLoading();
                            $scope.spareimisshow = false;
                            if (response.ET_PRODMAS_OUTPUT.item.length == 0) {
                                if (page == 1) {
                                    $cordovaToast.showShortBottom('数据为空');
                                } else {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            } else {
                                //console.log(angular.toJson((response.ET_PRODMAS_OUTPUT.item)));
                                $.each(response.ET_PRODMAS_OUTPUT.item, function (n, value) {
                                    if($scope.spareInfo===""){
                                        $scope.spareList=new Array;
                                    }else{
                                        $scope.spareList.push({
                                            APPLY_NUM : 0,
                                            PRODUCT_ID : value.PRODUCT_ID,
                                            ishave:true,
                                            checkedP:"NO",
                                            checked:"NO",
                                            SHORT_TEXT:value.SHORT_TEXT
                                        });
                                    }
                                    //console.log("第5步");
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                });
                                for(var i=0;i<$scope.spareList.length;i++){
                                    if($scope.spareList.checkedP == "YES"){
                                        $scope.spareList.splice(i,1);
                                    }
                                }
                                $scope.spareList = $scope.checkedPro.concat($scope.spareList);
                            }
                            if (response.ET_PRODMAS_OUTPUT.item.length < 20) {
                                $scope.spareimisshow = false;
                                if (page > 1) {
                                    $cordovaToast.showShortBottom('没有更多数据了');
                                }
                            } else {
                                if($scope.spareList.length===0){
                                    $scope.spareimisshow=false;
                                }else{
                                    $scope.spareimisshow = true;
                                }
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    }
                }
            }).error(function (response, status, header, config) {
                var respTime = new Date().getTime() - startTime;
                //超时之后返回的方法
                if(respTime >= config.timeout){
                    if(ionic.Platform.isWebView()){
                        $cordovaDialogs.alert('请求超时');
                    }
                }else{
                    $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                }
                //$ionicLoading.hide();
                $ionicLoading.hide();
            });
        };
        //初始化本地数据库
        if (JSON.parse(localStorage.getItem("oftenSparedb")) != null || JSON.parse(localStorage.getItem("oftenSparedb")) != undefined) {
            $scope.oftenSpareList = JSON.parse(localStorage.getItem("oftenSparedb"));
        }else{
            $scope.oftenSpareList=new Array;
        }
        //进入详细界面传递标识
        $scope.goDetail = function(value){
            //存储历史记录
            var spareIs=false;
            if($scope.spareInfo!==""){
                if(storedb('sparedb').find()!==null || storedb('sparedb').find()!==undefined){
                    var list=storedb('sparedb').find();
                    for(var i=0;i<list.length;i++){
                        if(storedb('sparedb').find($scope.spareInfo)){
                            storedb('sparedb').remove($scope.spareInfo);
                            storedb('sparedb').insert({'name':$scope.spareInfo},function(err){
                                if(!err){
                                }else {
                                    $cordovaToast.showShortBottom('历史记录保存失败');
                                }
                            });
                            spareIs=true;
                        }
                    }
                    if(spareIs===false){
                        storedb('sparedb').insert({'name':$scope.spareInfo},function(err){
                            if(!err){
                            }else {
                                $cordovaToast.showShortBottom('历史记录保存失败');
                            }
                        });
                    }
                }
            }

            //存储常用产品
            if (JSON.parse(localStorage.getItem("oftenSparedb")) != null || JSON.parse(localStorage.getItem("oftenSparedb")) != undefined) {
                //判断是否有相同的值
                for (var i = 0; i < $scope.oftenSpareList.length; i++) {
                    var spareIsIn=true;
                    if ($scope.oftenSpareList[i].PRODUCT_ID == value.PRODUCT_ID) {
                        //删除原有的，重新插入
                        $scope.oftenSpareList = JSON.parse(localStorage.getItem("oftenSparedb"));
                        $scope.oftenSpareList.splice(i, 1);
                        $scope.oftenSpareList.unshift(value);
                        localStorage['oftenSparedb'] = JSON.stringify($scope.oftenSpareList);
                        spareIsIn=false;
                    }
                }
                if(spareIsIn){
                    $scope.oftenSpareList.unshift(value);
                    localStorage['oftenSparedb'] = JSON.stringify( $scope.oftenSpareList);
                }
            }else{
                $scope.oftenSpareList.unshift(value);
                localStorage['oftenSparedb'] = JSON.stringify( $scope.oftenSpareList);
            }
            SpareListService.set(value);
            if($scope.showFlag) {
                worksheetDataService.backObjectProduct = value;
                worksheetDataService.selectedProduct = false;
                $ionicHistory.goBack();
            }else{
                $state.go('spareDetail');
            }

        };
        $scope.checkedPro = [];
        $scope.spareInfo = "";
        $scope.initLoad=function(){
            if($scope.spareInfo.length == 0){
                $scope.spareInfo = " ";
            }else{
                page=0;
                $scope.spareList = [];
                $scope.spareLoadmoreIm();
            }
        };
        $scope.selectdPro = function(item){
            //console.log(item);
            if(item.checkedP == 'YES'){
                if($scope.checkedPro.length < 1){
                    $scope.checkedPro.push(item);
                }else{
                    var numadd = 0;
                    for(var j=0;j<$scope.checkedPro.length;j++){
                        if(item.PRODUCT_ID == $scope.checkedPro[j].PRODUCT_ID){
                            numadd++ ;
                        }
                    }
                    if(numadd == 0){
                        $scope.checkedPro.push(item);
                    }
                }
            }else{
                for(var j=0;j<$scope.checkedPro.length;j++){
                    if(item.PRODUCT_ID == $scope.checkedPro[j].PRODUCT_ID){
                        $scope.checkedPro.splice(j,1);
                        return;
                    }
                }
            }
        }
        $scope.addPro = function(){
            var addProInfos = [];
            for(var i=0;i<$scope.spareList.length;i++){
                if($scope.spareList[i].checkedP == 'YES'){
                    $scope.spareList[i].checked = 'YES';
                    addProInfos.push($scope.spareList[i]);
                }
            }
            //console.log(addProInfos)
            var a = worksheetHttpService.addPro.proInfos;
            if(a!= undefined){
                addProInfos = addProInfos.concat(a);
            }
            worksheetHttpService.addPro.proInfos = addProInfos;
            $ionicHistory.goBack();
        }
    }
])