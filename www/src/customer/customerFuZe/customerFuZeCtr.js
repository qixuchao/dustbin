
worksheetModule.controller("customerFuZeCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetDataService','worksheetHttpService','$rootScope','HttpAppService','$ionicModal','saleActService','$cordovaToast',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetDataService,worksheetHttpService,$rootScope,HttpAppService,$ionicModal,saleActService,$cordovaToast){
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
        $scope.infos = customeService.get_customeFuZe().ET_OUT_RELATION.item;
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


        $scope.deleteInfos = function(item){
            if(item.PARTNER_FCT !== "ZCUSTCTT" ){
                Prompter.deleteInfosPoint(item.FCT_DESCRIPTION + "不允许删除");
            }else{
                Prompter.showLoading("正在删除");
                var data={
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_AUTHORITY": { "BNAME": worksheetDetailData.ES_OUT_LIST.CREATED_BY },
                    "IS_OBJECT_ID": worksheetDetailData.ydWorksheetNum,
                    "IS_PROCESS_TYPE": worksheetDetailData.IS_PROCESS_TYPE,
                    "IT_PARTNER": {
                        "item": [
                            {
                                "PARTNER_FCT":item.PARTNER_FCT,
                                "PARTNER_NO":item.PARTNER_NO,
                                "ZMODE" : "D"
                            }
                        ]
                    }};
                console.log(angular.toJson(data));
                var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
                HttpAppService.post(url, data).success(function(response){
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
            "IS_PAGE": {
                "CURRPAGE": customerPage++,
                "ITEMS": "10"
            },
            "IS_SEARCH": {"SEARCH": search},
            "IT_IN_ROLE": {}
        };
        console.log(data);
        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CUSTOMER_LIST', data)
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
            "IS_PAGE": {
                "CURRPAGE": conPage++,
                "ITEMS": "10"
            },
            "IS_PARTNER": { "PARTNER": "" },
            "IS_SEARCH": { "SEARCH": search }
        };
        console.log(data);
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
            });
    };

    $ionicModal.fromTemplateUrl('src/customer/customerFuZe/selectContact_Modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.selectContactModal = modal;
    });
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
        $scope.input.con = '';
        $timeout(function () {
            document.getElementById('selectConId').focus();
        }, 1)
    };
    $scope.selectCon = function (x) {
        console.log(angular.toJson(x));
        console.log(angular.toJson($scope.infos));
        Prompter.showLoading("正在添加");
        var data={
            "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_AUTHORITY": { "BNAME": worksheetDetailData.ES_OUT_LIST.CREATED_BY },
            "IS_OBJECT_ID": worksheetDetailData.ydWorksheetNum,
            "IS_PROCESS_TYPE": worksheetDetailData.IS_PROCESS_TYPE,
            "IT_PARTNER": {
                "item": [
                    {
                        "PARTNER_FCT": "ZCUSTCTT",
                        "PARTNER_NO": x.PARTNER,
                        "ZMODE" : "U"
                    }
                ]
            }};
        console.log(angular.toJson(data));
        var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
        HttpAppService.post(url, data).success(function(response){
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

    //数据刷新
    $scope.updateInfos = function(){
       var data = {
            "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_AUTHORITY": { "BNAME": worksheetDetailData.ES_OUT_LIST.CREATED_BY },
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
                //console.log(angular.toJson(response));
                $scope.infos = worksheetDataService.wsDetailData.ET_PARTNER.item;
                Prompter.hideLoading();
            }else{
                Prompter.hideLoading();
            }
        }).error(function(err){
            console.log(angular.toJson(err));
        });
    }
}]);




