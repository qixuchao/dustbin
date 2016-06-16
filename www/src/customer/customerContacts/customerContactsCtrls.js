
worksheetModule.controller("customerContactCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetDataService','worksheetHttpService','$rootScope','HttpAppService','$ionicModal','saleActService','$cordovaToast','contactService','$cordovaDialogs',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetDataService,worksheetHttpService,$rootScope,HttpAppService,$ionicModal,saleActService,$cordovaToast,contactService,$cordovaDialogs){

    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        console.log(fromState.name+toState.name);
        if(fromState.name == 'ContactCreate' && toState.name == 'customerContactQuery'){
            var x = contactService.get_ContactsListvalue();
            console.log(x);
            conpageNum = 1;
            $scope.updateInfos(x);
            if(x != undefined  && x != ""){
                $cordovaToast.showShortBottom('客户与关系人的关系已添加');
            }
        }
    });
    $scope.gomore = true;
    $scope.goload = false;
    $scope.gono = false;

    //数据刷新
    var conpageNum = 1;
    $scope.infos = [];
    $scope.updateInfos = function(item){
        $scope.goload = true;
        $scope.gomore = false;
        var data = {
            "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
            "IS_PAGE": {
                "CURRPAGE": conpageNum++,
                "ITEMS": "10"
            },
            "IS_PARTNER": { "PARTNER": customeService.get_customerListvalue().PARTNER },
            "IS_SEARCH": { "SEARCH": "" }
        };
        console.log(angular.toJson(data));
        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
            .success(function (response) {
                $scope.goload = false;
                $scope.gomore = true;
                console.log(angular.toJson(response));
                console.log(angular.toJson(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST'));
                if (response.ES_RESULT.ZFLAG === 'S') {
                    //if(item == ""){
                        $scope.infos = $scope.infos.concat(response.ET_OUT_LIST.item);
                    //}else{
                    //    $scope.infos = response.ET_OUT_LIST.item.concat($scope.infos);
                    //}
                    if (response.ET_OUT_LIST.item.length < 10) {
                        $scope.gono = true;
                        $scope.goload = false;
                        $scope.gomore = false;
                    }
                }else{
                    $scope.gono = true;
                    $scope.goload = false;
                    $scope.gomore = false;
                }
            });
    }
    $scope.updateInfos();
    $scope.selectCon = function (x) {
        console.log(angular.toJson(x));
        console.log(angular.toJson($scope.infos));
        Prompter.showLoading("正在添加");
        var data={
            "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
            "IS_RELATIONSHIP": {
                "RELNR": "",
                "RELTYP": "BUR011",
                "PARTNER1": customeService.get_customerListvalue().PARTNER,
                "PARTNER2": x,
                "XDFREL": "X",
                "DATE_FROM": "0001-01-01",
                "DATE_TO": "9999-12-31",
                "MODE": "A"
            }};
        console.log(angular.toJson(data));
        var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_EDIT';
        HttpAppService.post(url, data).success(function(response){
            console.log(response);
            if (response.ES_RESULT.ZFLAG === 'S') {
                conpageNum = 1;
                $scope.updateInfos(x);
                $cordovaToast.showShortBottom('客户和联系人关系已添加');
            }else{
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                Prompter.hideLoading();
            }
            console.log(angular.toJson(response));

        }).error(function (response, status, header, config) {
            var respTime = new Date().getTime() - startTime;
            //超时之后返回的方法
            if(respTime >= config.timeout){
                if(ionic.Platform.isWebView()){
                    //$cordovaDialogs.alert('请求超时');
                }
            }else{
                $cordovaDialogs.alert('访问接口失败，请检查设备网络');
            }
            $ionicLoading.hide();
            Prompter.hideLoading();
        });
        $scope.selectContactModal.hide();
    };

    $ionicPopover.fromTemplateUrl('src/customer/customerContacts/customer_selectConbyD.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.relatedpopover = popover;
        });

        $scope.relatedPopoverShow = function() {
            customeService.goContacts.formCusttomer = true;
            $state.go('ContactCreate');
            //$scope.relatedpopover.show();
            //document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.relatedPopoverhide = function() {
            $scope.relatedpopover.hide();
            //document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";.ET_OUT_RELATION.item
        };

        $scope.related_types = ['扫描名片创建联系人','手动创建联系人'];
        $scope.relatedqueryType = function(types){
            console.log(types);
            if(types === "手动创建联系人"){
                customeService.goContacts.formCusttomer = true;
                $state.go('ContactCreate');
            }else if(types === "扫描名片创建联系人"){
                //$state.go('ContactCreate');
            }

            $scope.relatedPopoverhide();
        };


        $scope.deleteInfos = function(item){
                Prompter.showLoading("正在删除");
                var data={
                    "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                    "IS_RELATIONSHIP": {
                        "RELNR": "",
                        "RELTYP": "BUR001",
                        "PARTNER1": customeService.get_customerListvalue().PARTNER,
                        "PARTNER2": item.PARTNER,
                        "XDFREL": "X",
                        "DATE_FROM": "0001-01-01",
                        "DATE_TO": "9999-12-31",
                        "MODE": "D"
                    }};
                console.log(angular.toJson(data));
                var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_EDIT';
                var startTime = new Date().getTime();
                HttpAppService.post(url, data).success(function(response){
                    console.log(response);
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        $cordovaToast.showShortBottom('客户与联系人关系已添加 ');
                        conpageNum = 1;
                        $scope.updateInfos("");
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                    console.log(angular.toJson(response));
                }).error(function (response, status, header, config) {
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if(respTime >= config.timeout){
                        if(ionic.Platform.isWebView()){
                            //$cordovaDialogs.alert('请求超时');
                        }
                    }else{
                        $cordovaDialogs.alert('访问接口失败，请检查设备网络');
                    }
                    $ionicLoading.hide();
                    Prompter.hideLoading();
                });
        }
    $scope.phone = function(num){
        Prompter.showphone(num);
    }


    $scope.goDetail = function(i){
        //console.log(i);
        contactService.set_ContactsListvalue(i.PARTNER);
        $state.go("ContactDetail");
    }
}]);




