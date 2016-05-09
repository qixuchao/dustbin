
worksheetModule.controller("customerFuZeCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetDataService','worksheetHttpService','$rootScope','HttpAppService','$ionicModal','saleActService','$cordovaToast','employeeService','$cordovaDialogs',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetDataService,worksheetHttpService,$rootScope,HttpAppService,$ionicModal,saleActService,$cordovaToast,employeeService,$cordovaDialogs){
    $ionicPopover.fromTemplateUrl('src/customer/customerFuZe/customer_selectbyD.html', {
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
        var fuze = customeService.get_customeFuZe().ET_OUT_RELATION.item;
    console.log(fuze);
        $scope.infos = [];
        if(fuze == undefined){
            $cordovaToast.showShortBottom('暂无负责人信息');
        }else{
            for(var i=0;i< fuze.length;i++){
                if(fuze[i].RELTYP == "BUR011"){
                    console.log(fuze[i]);
                    $scope.infos.push(fuze[i]);
                }
            }
            if($scope.infos.length<1){
                $cordovaToast.showShortBottom('暂无负责人信息');
            }
        }
        console.log($scope.infos);
        $scope.related_types = ['负责人'];
        $scope.relatedqueryType = function(types){
            console.log(types);
            if(types === "负责人"){
                //$state.go("worksheetRelatedPartContact");
                $scope.openSelectCon();
            }else if(types === ""){
                //$state.go("worksheetRelatedPartCust");
                $scope.openSelectCustomer();
            }

            $scope.relatedPopoverhide();
        };
        $scope.goDetail = function(i){
            console.log(i);
            employeeService.set_employeeListvalue(i);
            $state.go('userDetail');
        };

        $scope.deleteInfos = function(item){
                Prompter.showLoading("正在删除");
                var data={
                    "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                    "IS_RELATIONSHIP": {
                        "RELNR": "",
                        "RELTYP": "BUR011",
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
                        $cordovaToast.showShortBottom('客户与负责人关系已删除 ');
                        $scope.updateInfos();
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                    console.log(angular.toJson(response));
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
    $scope.phone = function(num){
        Prompter.showphone(num);
    }
    //选择客户
    var customerPage = 1;
    $scope.customerArr = [];
    $scope.customerSearch = false;
    $scope.getCustomerArr = function (search) {
        $scope.CustomerLoadMoreFlag = false;
        if (search) {
            $scope.customerSearch = false;
            customerPage = 1;
        } else {
            $scope.spinnerFlag = true;
        }
        var data = {
            "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
            "IS_PAGE": {
                "CURRPAGE": customerPage++,
                "ITEMS": "10"
            },
            "IS_SEARCH": {"SEARCH": search},
            "IT_IN_ROLE": {}
        };
        console.log(data);
        var startTime = new Date().getTime();
        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST', data)
            .success(function (response) {
                if (response.ES_RESULT.ZFLAG === 'S') {
                    if (response.ET_OUT_LIST.item.length < 10) {
                        $scope.CustomerLoadMoreFlag = false;
                    }
                    if (search) {
                        $scope.customerArr = response.ET_OUT_LIST.item;
                    } else {
                        $scope.customerArr = $scope.customerArr.concat(response.ET_OUT_LIST.item);
                    }
                    $scope.spinnerFlag = false;
                    $scope.customerSearch = true;
                    $scope.CustomerLoadMoreFlag = true;
                    $ionicScrollDelegate.resize();
                    //saleActService.customerArr = $scope.customerArr;
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
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
                Prompter.hideLoading();
                $ionicLoading.hide();
            });
    };

    //选择联系人

    var conPage = 1;
    $scope.conArr = [];
    $scope.conSearch = false;
    $scope.getConArr = function (search) {
        $scope.ConLoadMoreFlag = false;
        if (search) {
            $scope.conSearch = false;
            conPage = 1;
        } else {
            $scope.spinnerFlag = true;
        }
        var data = {
            "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
            "IS_PAGE": {
                "CURRPAGE": conPage++,
                "ITEMS": "10"
            },
            "IS_PARTNER": { "PARTNER": "" },
            "IS_SEARCH": { "SEARCH": search }
        };
        console.log(data);
        var startTime = new Date().getTime();
        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'STAFF_LIST', data)
            .success(function (response) {
                console.log(angular.toJson(response));
                if (response.ES_RESULT.ZFLAG === 'S') {
                    if (response.ET_EMPLOYEE.item.length < 10) {
                        $scope.ConLoadMoreFlag = false;
                    }
                    if (search) {
                        $scope.conArr = response.ET_EMPLOYEE.item;
                    } else {
                        $scope.conArr = $scope.conArr.concat(response.ET_EMPLOYEE.item);
                    }
                    $scope.spinnerFlag = false;
                    $scope.conSearch = true;
                    $scope.ConLoadMoreFlag = true;
                    $ionicScrollDelegate.resize();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
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
                Prompter.hideLoading();
                $ionicLoading.hide();
            });
    };

    $ionicModal.fromTemplateUrl('src/customer/customerFuZe/selectCustomer_Modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.selectContactModal = modal;
    });

    $scope.input = {
        customer : ""
    }
    $scope.selectContactText = '负责人';
    $scope.openSelectCon = function () {
        $scope.isDropShow = true;
        $scope.conSearch = true;
        $scope.selectContactModal.show();
    };
    $scope.closeSelectCon = function () {
        $scope.selectContactModal.hide();
    };
    $scope.selectPop = function (x) {
        $scope.selectContactText = x.text;
        $scope.referMoreflag = !$scope.referMoreflag;
    };
    $scope.showChancePop = function () {
        $scope.referMoreflag = true;
        $scope.isDropShow = true;
    };
    $scope.initConSearch = function () {
        $scope.input.customer = '';
        $timeout(function () {
            //document.getElementById('selectConId').focus();
        }, 1)
    };
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
        var startTime = new Date().getTime();
        //console.log(angular.toJson(url));
        HttpAppService.post(url, data).success(function(response){
            console.log(response);
            if (response.ES_RESULT.ZFLAG === 'S') {
                $scope.updateInfos();
                $cordovaToast.showShortBottom('客户与负责人的关系已添加');
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
                    $cordovaDialogs.alert('请求超时');
                }
            }else{
                $cordovaDialogs.alert('访问接口失败，请检查设备网络');
            }
            Prompter.hideLoading();
            $ionicLoading.hide();
        });
        $scope.selectContactModal.hide();
    };

    //数据刷新
    $scope.updateInfos = function(){
       var data = {
            "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_PARTNER": { "PARTNER": customeService.get_customerListvalue().PARTNER },
           "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
        }
        console.log(angular.toJson(data));
        var url = ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_DETAIL';
        var startTime = new Date().getTime();
        HttpAppService.post(url, data).success(function(response){
            //console.log(angular.toJson(response));
            if (response.ES_RESULT.ZFLAG === 'S') {
                customeService.set_customeFuZe(response);
                //console.log(angular.toJson(response));
                var fuze = response.ET_OUT_RELATION.item;
                $scope.infos = [];
                if(fuze == undefined){
                    $cordovaToast.showShortBottom('暂无负责人信息');
                }else{
                    for(var i=0;i< fuze.length;i++){
                        if(fuze[i].RELTYP == "BUR011"){
                            console.log(fuze[i]);
                            $scope.infos.push(fuze[i]);
                        }
                    }
                    if($scope.infos.length<1){
                        $cordovaToast.showShortBottom('暂无负责人信息');
                    }
                }
                Prompter.hideLoading();
            }else{
                Prompter.hideLoading();
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
            Prompter.hideLoading();
            $ionicLoading.hide();
        });
    }
}]);




