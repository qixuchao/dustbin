
worksheetModule.controller("customerContactCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetDataService','worksheetHttpService','$rootScope','HttpAppService','$ionicModal','saleActService','$cordovaToast','contactService',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetDataService,worksheetHttpService,$rootScope,HttpAppService,$ionicModal,saleActService,$cordovaToast,contactService){

    $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
        if(fromState.name == 'contactsCreate' && toState.name == 'customerContactQuery'){
            var x = contactService.get_ContactsListvalue;
            $scope.selectCon(x);
        }
    });
    $scope.gomore = true;
    $scope.goload = false;
    $scope.gono = false;

    //数据刷新
    var conpageNum = 1;
    $scope.infos = [];
    $scope.updateInfos = function(){
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
        console.log(data);
        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
            .success(function (response) {
                $scope.goload = false;
                $scope.gomore = true;
                console.log(angular.toJson(response));
                if (response.ES_RESULT.ZFLAG === 'S') {
                    $scope.infos = $scope.infos.concat(response.ET_OUT_LIST.item);
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
                "PARTNER2": x.PARTNER,
                "XDFREL": "X",
                "DATE_FROM": "0001-01-01",
                "DATE_TO": "9999-12-31",
                "MODE": "A"
            }};
        console.log(angular.toJson(data));
        var url = ROOTCONFIG.hempConfig.basePath + 'STAFF_EDIT';
        console.log(angular.toJson(url));
        HttpAppService.post(url, data).success(function(response){
            console.log(response);
            if (response.ES_RESULT.ZFLAG === 'S') {
                $scope.updateInfos();
                $cordovaToast.showShortBottom('添加成功');
            }else{
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                Prompter.hideLoading();
            }
            console.log(angular.toJson(response));

        }).error(function(err){
            Prompter.hideLoading();
            console.log(angular.toJson(err));
        });
        $scope.selectContactModal.hide();
    };

    $ionicPopover.fromTemplateUrl('src/customer/customerContacts/customer_selectConbyD.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.relatedpopover = popover;
        });

        $scope.relatedPopoverShow = function() {
            $scope.relatedpopover.show();
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
                HttpAppService.post(url, data).success(function(response){
                    console.log(response);
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        $cordovaToast.showShortBottom('删除成功 ');
                        $scope.updateInfos();
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                    console.log(angular.toJson(response));
                }).error(function(err){
                    console.log(angular.toJson(err));
                });
        }
    $scope.phone = function(num){
        Prompter.showphone(num);
    }



}]);




