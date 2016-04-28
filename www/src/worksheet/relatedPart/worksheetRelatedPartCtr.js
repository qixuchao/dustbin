
worksheetModule.controller("WorksheetRelatedCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetDataService','worksheetHttpService','$rootScope','HttpAppService','$ionicModal','saleActService','$cordovaToast','employeeService','contactService',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetDataService,worksheetHttpService,$rootScope,HttpAppService,$ionicModal,saleActService,$cordovaToast,employeeService,contactService){
    $ionicPopover.fromTemplateUrl('src/worksheet/relatedPart/worksheetRelate_select.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.relatedpopover = popover;
        });
        var  worksheetDetailData = worksheetDataService.wsDetailData;
    console.log(worksheetDetailData);
        if(worksheetDataService.wsDetailData.ET_PARTNER.item == undefined){
            $scope.infos = [];
            $cordovaToast.showShortBottom('暂无相关方');
        }else{
            $scope.infos = worksheetDataService.wsDetailData.ET_PARTNER.item;
        }
    //ZPRV ZPLV  ZNCV
        if(worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPRV" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPLV" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZNCV"){
            $scope.add = false;
            $scope.deleteButton = false;

        }
    //ZPRO ZPLO ZNCO
        //filterNewCarOnline: ZNCO 新车档案收集工单    filterLocalService:ZPRO 现场维修工单    filterBatchUpdate:ZPLO 批量改进工单
        else if(worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPRO" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZPLO" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE === "ZNCO" ){
            if(worksheetDataService.wsDetailData.ES_OUT_LIST.EDIT_FLAG == "Y"){
                if(worksheetDataService.wsDetailData.ES_OUT_LIST.status == "E0006" || worksheetDataService.wsDetailData.ES_OUT_LIST.status == "E0007" || worksheetDataService.wsDetailData.ES_OUT_LIST.status == "E0010"){
                    $scope.add = false;
                    $scope.deleteButton = false;
                }else {
                    $scope.add = true;
                    $scope.deleteButton = true;
                }
            }else if(worksheetDataService.wsDetailData.ES_OUT_LIST.EDIT_FLAG == "N"){
                $scope.add = false;
                $scope.deleteButton = false;
            }
        }
        $scope.relatedPopoverShow = function() {
            $scope.relatedpopover.show();
            //document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.relatedPopoverhide = function() {
            $scope.relatedpopover.hide();
            //document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
        };
        $scope.related_types = ['联系人'];
        $scope.relatedqueryType = function(types){
            if(types === "联系人"){
                //$state.go("worksheetRelatedPartContact");
                $scope.openSelectCon();
            }else if(types === "服务商"){
                //$state.go("worksheetRelatedPartCust");
                $scope.openSelectCustomer();
            }

            $scope.relatedPopoverhide();
        };

        $scope.title = "相关方列表";
        $rootScope.$on('worksheetRelatePartItem', function(event,msg) {
            if(msg!==undefined){
                $scope.infos.push({
                    id : msg.id,
                    name : msg.NAME_LAST,
                    position : msg.position,
                    phone : msg.TEL_NUMBER
                });
            }
        });

        $scope.deleteInfos = function(item){
            if(item.PARTNER_FCT !== "ZCUSTCTT" ){
                Prompter.deleteInfosPoint(item.FCT_DESCRIPTION + "不允许删除");
            }else{
                Prompter.showLoading("正在删除");
                var data={
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
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
                var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
                HttpAppService.post(url, data).success(function(response){
                    Prompter.hideLoading();
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        $cordovaToast.showShortBottom('删除成功 ');
                        $scope.updateInfos();
                    }else{
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                }).error(function(err){
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
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
            "IS_PAGE": {
                "CURRPAGE": customerPage++,
                "ITEMS": "10"
            },
            "IS_SEARCH": {"SEARCH": search},
            "IT_IN_ROLE": {}
        };
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
    //选择客户
    $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/selectCustomer_Modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.selectCustomerModal = modal;
    });
    $scope.input = {
        customer : ""
    }
    $scope.selectCustomerText = '客户列表';
    $scope.openSelectCustomer = function () {
        $scope.isDropShow = true;
        $scope.customerSearch = true;
        $scope.selectCustomerModal.show();
    };
    $scope.closeSelectCustomer = function () {
        $scope.selectCustomerModal.hide();
    };
    $scope.selectPop = function (x) {
        $scope.selectCustomerText = x.text;
        $scope.referMoreflag = !$scope.referMoreflag;
    };

    $scope.showChancePop = function () {
        $scope.referMoreflag = true;
        $scope.isDropShow = true;
    };
    $scope.initCustomerSearch = function () {
        $scope.input.customer = '';
        //$scope.getCustomerArr();
        $timeout(function () {
            document.getElementById('selectCustomerId').focus();
        }, 1)
    };
    $scope.selectCustomer = function (x) {
        //$scope.create.customer = x;
        //$scope.create.contact = '';
        Prompter.showLoading("正在添加");
        var data={
            "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
            "IS_OBJECT_ID": worksheetDetailData.ydWorksheetNum,
            "IS_PROCESS_TYPE": worksheetDetailData.IS_PROCESS_TYPE,
            "IT_PARTNER": {
                "item": [
                    {
                        "PARTNER_FCT": "ZSRVPROV",
                        "PARTNER_NO": x.PARTNER,
                        "ZMODE" : "I"
                    }
                ]
            }};
        var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
        HttpAppService.post(url, data).success(function(response){
            if (response.ES_RESULT.ZFLAG === 'S') {
                $scope.updateInfos();
                $cordovaToast.showShortBottom('添加成功');
            }else{
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                Prompter.hideLoading();
            }
        }).error(function(err){
            Prompter.hideLoading();
        });
        $scope.contactSpinnerFLag = true;
        $scope.contactsLoadMoreFlag = true;
        //$scope.getContacts();
        $scope.selectCustomerModal.hide();
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
        HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST', data)
            .success(function (response) {
                if (response.ES_RESULT.ZFLAG === 'S') {
                    if (response.ET_OUT_LIST.item.length < 10) {
                        $scope.ConLoadMoreFlag = false;
                    }
                    if (search) {
                        $scope.conArr = response.ET_OUT_LIST.item;
                    } else {
                        $scope.conArr = $scope.conArr.concat(response.ET_OUT_LIST.item);
                    }
                    $scope.spinnerFlag = false;
                    $scope.conSearch = true;
                    $scope.ConLoadMoreFlag = true;
                    $ionicScrollDelegate.resize();
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                }
            });
    };

    $ionicModal.fromTemplateUrl('src/worksheet/relatedPart/selectContact_Modal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    }).then(function (modal) {
        $scope.selectContactModal = modal;
    });
    $scope.selectContactText = '联系人';
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
        Prompter.showLoading("正在添加");
        var data={
            "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
            "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
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
        var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
        HttpAppService.post(url, data).success(function(response){
            if (response.ES_RESULT.ZFLAG === 'S') {
                $scope.updateInfos();
                $cordovaToast.showShortBottom('添加成功');
            }else{
                $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                Prompter.hideLoading();
            }

        }).error(function(err){
            Prompter.hideLoading();
        });
        $scope.selectContactModal.hide();
    };

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
        HttpAppService.post(url, data).success(function(response){
            if (response.ES_RESULT.ZFLAG === 'S') {
                worksheetDataService.wsDetailData = response;
                worksheetDataService.wsDetailData.ydWorksheetNum = id;
                worksheetDataService.wsDetailData.waifuRenyuan = wf;
                worksheetDataService.wsDetailData.IS_PROCESS_TYPE = name;
                $scope.infos = worksheetDataService.wsDetailData.ET_PARTNER.item;
                Prompter.hideLoading();
            }else{
                Prompter.hideLoading();
            }
        }).error(function(err){
        });
    }
    $scope.goDetail = function(item){
        if(item.PARTNER_FCT == "ZCUSTCTT"){
            var x1= item.PARTNER_NO;
            contactService.set_ContactsListvalue(x1);
            $state.go("ContactDetail");//联系人详情
        }else if(item.PARTNER_FCT == "ZSRVEMPL" || item.PARTNER_FCT == "ZTERLEAD"){
            var value = {
                PARTNER : item.PARTNER_NO
            }
            employeeService.set_employeeListvalue(value);
            $state.go("userDetail");//员工详情
        }else if(item.PARTNER_FCT == "ZCREATOR" && (worksheetDataService.wsDetailData.IS_PROCESS_TYPE == "ZPRO" || worksheetDataService.wsDetailData.IS_PROCESS_TYPE == "ZPLO" ||worksheetDataService.wsDetailData.IS_PROCESS_TYPE == "ZNCO")){
            var value = {
                PARTNER : item.PARTNER_NO
            }
            employeeService.set_employeeListvalue(value);
            $state.go("userDetail");//员工详情
        } else{
            var infosCust = {
                PARTNER_ROLE : item.PARTNER_FCT,
                PARTNER : item.PARTNER_NO
            }
            customeService.set_customerListvalue(infosCust);
            $state.go("customerDetail");//客户详情
        }
    }
}]);



worksheetModule.controller("WorksheetRelatedContactCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','worksheetHttpService','$rootScope',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,worksheetHttpService,$rootScope){
    //CONTACT_LIST接口
    //{
//    "I_SYSNAME": { "SysName": "ATL" },
//    "IS_AUTHORITY": { "BNAME": "" },
//    "IS_PAGE": {
//        "CURRPAGE": "1",
//            "ITEMS": "10"
//    },
//    "IS_PARTNER": { "PARTNER": "" },
//    "IS_SEARCH": { "SEARCH": "" }
//}
    $scope.contact_query_list = [{
        id : 4,
        position : 'haohao上学',
        NAME_LAST : "asdads",
        TEL_NUMBER : "18298182051"
    },{
        id : 5,
        position : 'haohao上学',
        NAME_LAST : "asdads",
        TEL_NUMBER : "18298182052"
    }]
    $scope.gorelatePart = function(item){
        $rootScope.$broadcast("worksheetRelatePartItem", item);
        $state.go("worksheetRelatedPart");
    }
}]);


