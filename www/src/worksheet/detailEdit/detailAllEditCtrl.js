worksheetModule.controller('worksheetEditAllCtrl',[
        '$scope',
        '$state',
        '$ionicHistory',
        '$ionicScrollDelegate',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        '$timeout',
        '$cordovaDialogs',
        '$ionicModal',
        '$ionicPopover',
        '$cordovaToast',
        '$stateParams',
        '$ionicPosition',
        'HttpAppService',
        'worksheetHttpService',
        "worksheetDataService",
        "$cordovaDatePicker",
        "worksheetHttpService",
        "Prompter",
        function ($scope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $stateParams, $ionicPosition, HttpAppService, worksheetHttpService, worksheetDataService, $cordovaDatePicker, worksheetHttpService, Prompter) {

        //选择车辆返回的时候，获取车辆信息
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState && toState && fromState.name == 'car' && toState.name == 'worksheetEdit'){
                if(worksheetDataService.backObject != null){
                    $scope.datas.detail.ES_OUT_LIST.CAR_DESC = worksheetDataService.backObject.SHORT_TEXT;
                    $scope.datas.detail.ES_OUT_LIST.CAR_NO = worksheetDataService.backObject.ZBAR_CODE;
                    console.log($scope.datas.detail.ES_OUT_LIST);
                }     
            }
        }); 
        
        var pleaseChoose = '-- 请选择 --                                                         ';
        var pleaseChooseId = null;
        var noneValue = '空';
        var noneValueId = null;

        $scope.config = {
            typeStr: '',

            detailTypeNewCar: false,
            detailTypeSiteRepair: false,
            detailTypeBatchUpdate: false,

            currentImpact: null,        //{IMPACT_DESC: '', IMPACT: ''}
            currentGuZhangChangJing: null,  //{SCENARIO: '', SCENARIO_DESC:''}
            currentZeRenFang: null,  //{ RESPONSE_DESC: '', RESPONSE: '' }
            currentGuZhangFeiLen: null,  //{DEFECT_DESC: '', DEFECT: ''}
            currentChanPinLeiXing: null,  //{"KATALOGART": "F0", "COMP_TYPE": "eBus",}
            currentGuZhangBuJian: null,      //{ "CODEGRUPPE": "04", "COMPONENT": "电芯" }
            currentGuZhangMingCheng: null,   //{CODE: '', REASON: ''}

            isLoading_BujianReason: false,
            isLoading_response: false
        };

        $scope.goBack = function(){
            Prompter.wsConfirm("提示","放弃本次编辑?","确定", "取消");
        };

        $scope.saveEdited = function(){
            var impact = $scope.config.currentImpact.IMPACT;
            var scenario = $scope.config.currentGuZhangChangJing.SCENARIO;
            var response = $scope.config.currentZeRenFang.RESPONSE;
            var defect = $scope.config.currentGuZhangFeiLen.DEFECT;
            var katalogart = $scope.config.currentChanPinLeiXing.KATALOGART;
            var codegrupper = $scope.config.currentGuZhangBuJian.CODEGRUPPE;
            var code = $scope.config.currentGuZhangMingCheng.CODE;
        
            var startStr = $scope.datas.detail.ES_OUT_LIST.START_TIME_STR;
            var startDateStr = new Date(startStr.replace(/-/g, "/")).format('yyyy-MM-dd hh:mm:ss');
            startDate = startDateStr.split(" ")[0];
            startTime = startDateStr.split(" ")[1];

            var endStr = $scope.datas.detail.ES_OUT_LIST.END_TIME_STR;
            var endDateStr = new Date(endStr.replace(/-/g, "/")).format('yyyy-MM-dd hh:mm:ss');
            var endDate = endDateStr.split(" ")[0];
            var endTime = endDateStr.split(" ")[1];
            //console.log(startStr +"          "+endStr);
            console.log(startDate+"  "+startTime+"     "+endDate+" "+endTime);
            var header = {
                IMPACT: (!impact) ? "" : impact,
                SCENARIO: (!scenario) ? "" : scenario,
                RESPONSE: (!response) ? "" : response,
                DEFECT: (!defect) ? "" : defect,
                
                COMP_TYPE: (!katalogart) ? "" : katalogart,
                COMPONENT: (!codegrupper) ? "" : codegrupper,
                REASON: (!code) ? "" : code,

                DESCRIPTION: $scope.datas.detail.ES_OUT_LIST.DESCRIPTION,
                CAR_NO: $scope.datas.detail.ES_OUT_LIST.CAR_NO,
                START_DATE: startDate,
                START_TIME: startTime,
                END_DATE: endDate,
                END_TIME: endTime,

                ZZBXR: $scope.datas.detail.ES_OUT_LIST.ZZBXR,
                ZZBXDH: $scope.datas.detail.ES_OUT_LIST.ZZBXDH,
                ZZXYHF: $scope.datas.detail.ES_OUT_LIST.ZZXYHF
            };
            __requestUpdateWorksheet(header);
        };

        function __requestUpdateWorksheet(headerData){
            var url = worksheetHttpService.serviceDetailChange.url;
            var defaults = worksheetHttpService.serviceDetailChange.defaults;
            var postData = angular.extend(defaults, {
                IS_HEAD_DATA: headerData,
                IS_OBJECT_ID: $scope.datas.detail.ydWorksheetNum,
                IS_PROCESS_TYPE: $scope.datas.detail.IS_PROCESS_TYPE
            });
            var promise = HttpAppService.post(url,postData);
            Prompter.showLoading("正在保存修改");
            promise.success(function(response){ 
                if(response && response.ES_RESULT && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG == "S"){
                    Prompter.showLoadingAutoHidden("保存成功!", false, 1000);
                    worksheetDataService.wsEditToDetail.needReload = true;
                    $timeout(function(){                        
                        $scope.$ionicGoBack();
                    },1200);
                }else if(response && response.ES_RESULT && response.ES_RESULT.ZFLAG && response.ES_RESULT.ZFLAG == "E" && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!=""){
                    Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
                }else if(response && response.ES_RESULT && response.ES_RESULT.ZRESULT && response.ES_RESULT.ZRESULT!="" ){
                    Prompter.showLoadingAutoHidden(response.ES_RESULT.ZRESULT, false, 2000);
                }else if(response && response.ES_RESULT){
                    Prompter.showLoadingAutoHidden(JSON.stringify(response), false, 2000);
                }else{
                    Prompter.showLoadingAutoHidden(response, false, 2000);
                }
            })
            .error(function(errorResponse){
                Prompter.showLoadingAutoHidden("保存失败,请检查网络状况!", false, 2000);
            });
        }

        $scope.buJianFeiLenChanged = function(){
            //console.log("guZhangFeiLenChanged");
            //console.log($scope.config.currentChanPinLeiXing.guZhangBuJianS);
            $scope.datas.guZhangBuJianS = $scope.config.currentChanPinLeiXing.guZhangBuJianS;
            $scope.datas.guZhangMingChengS = $scope.datas.guZhangBuJianS[0].guZhangMingChengS;
            $scope.config.currentGuZhangBuJian = $scope.datas.guZhangBuJianS[0];
            $scope.config.currentGuZhangMingCheng = $scope.config.currentGuZhangBuJian.guZhangMingChengS[0];
        };
        $scope.buJianChanged = function(){
            $scope.datas.guZhangMingChengS = $scope.config.currentGuZhangBuJian.guZhangMingChengS;
            $scope.config.currentGuZhangMingCheng = $scope.datas.guZhangMingChengS[0];
        };

        $scope.datas = {
            detail: null,
            impactS: [
                {
                    IMPACT_DESC: pleaseChoose,
                    IMPACT: null
                },
                {
                    IMPACT_DESC: '灾难',
                    IMPACT: '01'
                },
                {
                    IMPACT_DESC: '高',
                    IMPACT: '25'
                },
                {
                    IMPACT_DESC: '中',
                    IMPACT: '50'
                },
                {
                    IMPACT_DESC: '低',
                    IMPACT: '75'
                },
                {
                    IMPACT_DESC: '无',
                    IMPACT: '99'
                }
            ],
            guZhangChangJingS:[
                {
                    SCENARIO_DESC: pleaseChoose,
                    SCENARIO: null
                }
            ],
            zeRengFangS:[
                {
                    RESPONSE_DESC: pleaseChoose,
                    RESPONSE: null
                }
            ],
            guZhangFeiLenS: [
                {
                    DEFECT_DESC: pleaseChoose,
                    DEFECT: null
                }
            ],

            guZhangBuJianS: null,
            guZhangMingChengS: null,
            chanPinLeiXingS: [ 
                {
                    COMP_TYPE: pleaseChoose,
                    KATALOGART: null,
                    guZhangBuJianS:[
                        {
                            COMPONENT: pleaseChoose,
                            CODEGRUPPE: null,
                            guZhangMingChengS: [ 
                                {
                                    REASON: pleaseChoose,
                                    CODE: null
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        $scope.datas.chanPinLeiXingS.addItem = function(item){
            for(var i = 0; i < this.length; i++){
                if(this[i].KATALOGART == item.KATALOGART){
                    var bujianS = this[i].guZhangBuJianS;
                    for(var j = 0; j < bujianS.length; j++){
                        if(bujianS[j].CODEGRUPPE == item.CODEGRUPPE){
                            var reasonS = this[i].guZhangBuJianS[j].guZhangMingChengS;
                            for(var x = 0; x < reasonS.length; x++){
                                if(reasonS[x].CODE == item.CODE){
                                    return;
                                }
                            }
                            this[i].guZhangBuJianS[j].guZhangMingChengS.push({
                                CODE: item.CODE,
                                REASON: item.KURZTEXT
                            });
                            return;
                        }
                    }
                    this[i].guZhangBuJianS.push({
                        CODEGRUPPE: item.CODEGRUPPE,
                        COMPONENT: item.GROUPTEXT,
                        guZhangMingChengS: [
                            {
                                REASON: pleaseChoose,
                                CODE: null
                            },
                            {
                                CODE: item.CODE,
                                REASON: item.KURZTEXT
                            }
                        ]
                    });
                    return;
                }else{

                }
            }
            this.push({
                KATALOGART: item.KATALOGART,
                COMP_TYPE: item.KATALOGTXT,
                guZhangBuJianS: [
                    {
                        COMPONENT: pleaseChoose,
                        CODEGRUPPE: null,
                        guZhangMingChengS: [
                            {
                                REASON: pleaseChoose,
                                CODE: null
                            },
                            {
                                CODE: item.CODE,
                                REASON: item.KURZTEXT
                            }
                        ]
                    },
                    {
                        CODEGRUPPE: item.CODEGRUPPE,
                        COMPONENT: item.GROUPTEXT,
                        guZhangMingChengS: [
                            {
                                REASON: pleaseChoose,
                                CODE: null
                            },
                            {
                                CODE: item.CODE,
                                REASON: item.KURZTEXT
                            }
                        ]
                    }
                ]
            });
            console.log(this);
        };
        function __initCurrentChangPinLeiXing(){
            var obj = $scope.datas.chanPinLeiXingS;
            var KATALOGART = $scope.datas.detail.ES_OUT_LIST.KATALOGART;
            var CODEGRUPPE = $scope.datas.detail.ES_OUT_LIST.CODEGRUPPE;
            for(var i = 0; i < $scope.datas.chanPinLeiXingS.length; i++){
                if($scope.datas.chanPinLeiXingS[i].KATALOGART == KATALOGART){
                    $scope.config.currentChanPinLeiXing = $scope.datas.chanPinLeiXingS[i];
                    $scope.datas.guZhangBuJianS = $scope.datas.chanPinLeiXingS[i].guZhangBuJianS;
                    for(var j = 0; j < $scope.datas.chanPinLeiXingS[i].guZhangBuJianS.length; j++){
                        if($scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j].CODEGRUPPE == CODEGRUPPE){
                            $scope.config.currentGuZhangBuJian = $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j];
                            $scope.datas.guZhangMingChengS = $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j].guZhangMingChengS;
                            for(var x = 0; x < $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j].guZhangMingChengS.length; x++){
                                if($scope.datas.detail.ES_OUT_LIST.CODE == $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j].guZhangMingChengS[x].CODE){
                                    $scope.config.currentGuZhangMingCheng = $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j].guZhangMingChengS[x];
                                    return;
                                }
                            }
                            if(!$scope.config.currentGuZhangMingCheng){
                                $scope.config.currentGuZhangMingCheng = $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[j].guZhangMingChengS[0];
                                return;
                            }                            
                        }
                    }
                    if($scope.config.currentGuZhangBuJian == null){
                        $scope.config.currentGuZhangBuJian = $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[0];
                        $scope.config.currentGuZhangMingCheng =  $scope.datas.chanPinLeiXingS[i].guZhangBuJianS[0].guZhangMingChengS[0];
                        return;
                    }
                }
            }
            if($scope.config.currentChanPinLeiXing== null){
                $scope.config.currentChanPinLeiXing = $scope.datas.chanPinLeiXingS[0];
                $scope.config.currentGuZhangBuJian = $scope.datas.chanPinLeiXingS[0].guZhangBuJianS;
                $scope.config.currentGuZhangMingCheng =  $scope.datas.chanPinLeiXingS[0].guZhangBuJianS[0].guZhangMingChengS;
                return;
            }
        };

        //选择时间
        $scope.selectCreateTime = function (type, title) { // type: start、end
            if(ionic.Platform.isAndroid()){
                __selectCreateTimeAndroid(type, title);
            }else{
                __selectCreateTimeIOS(type,title);
            }
        };
        function __selectCreateTimeIOS(type, title){
            var date;
            if(type == 'start'){
                date =  new Date($scope.datas.detail.ES_OUT_LIST.START_TIME_STR.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
            }else if(type=='end'){
                date = new Date($scope.datas.detail.ES_OUT_LIST.END_TIME_STR.replace(/-/g, "/")).format('yyyy/MM/dd hh:mm:ss');
            }
            __selectCreateTimeBasic(type, title, date);
        }
        function __selectCreateTimeAndroid(type, title){
            var date;
            if(type == 'start'){
                if(!$scope.datas.detail.ES_OUT_LIST.START_TIME_STR || $scope.datas.detail.ES_OUT_LIST.START_TIME_STR==""){
                    date = new Date().format('MM/dd/yyyy/hh/mm/ss');
                }else{
                    date = new Date($scope.datas.detail.ES_OUT_LIST.START_TIME_STR.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
                }
            }else if(type=='end'){
                if(!$scope.datas.detail.ES_OUT_LIST.END_TIME_STR || $scope.datas.detail.ES_OUT_LIST.END_TIME_STR==""){
                    date = new Date().format('MM/dd/yyyy/hh/mm/ss');
                }else{
                    date = new Date($scope.datas.detail.ES_OUT_LIST.END_TIME_STR.replace(/-/g, "/")).format('MM/dd/yyyy/hh/mm/ss');
                }
            }
            __selectCreateTimeBasic(type, title, date);
        }
        function __selectCreateTimeBasic(type, title, date){
            $cordovaDatePicker.show({
                date: date,
                allowOldDates: true,
                allowFutureDates: true,
                mode: 'datetime',
                titleText: title,
                okText: '确定',               //android
                cancelText: '取消',           //android
                doneButtonLabel: '确认',      // ios
                cancelButtonLabel: '取消',    //ios
                todayText: '今天',            //android
                nowText: '现在',              //android
                is24Hour: true,              //android
                androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
                popoverArrowDirection: 'UP',
                locale: 'zh_cn'
                //locale: 'en_us'
            }).then(function (returnDate) {
                var time = returnDate.format("yyyy-MM-dd hh:mm:ss"); //__getFormatTime(returnDate);
                switch (type) {
                    case 'start':
                        if(__startTimeIsValid(time, $scope.datas.detail.ES_OUT_LIST.END_TIME_STR)){
                            $scope.datas.detail.ES_OUT_LIST.START_TIME_STR = time;
                        }else{
                            $cordovaToast.showShortBottom("最小时间不能大于最大时间!");   
                        }
                        break;
                    case 'end':
                        if(__endTimeIsValid($scope.datas.detail.ES_OUT_LIST.START_TIME_STR, time)){
                            $scope.datas.detail.ES_OUT_LIST.END_TIME_STR = time;
                        }else{
                            $cordovaToast.showShortBottom("最大时间不能小于最小时间!");
                        }
                        //$scope.datas.detail.ES_OUT_LIST.END_TIME_STR = time;
                        break;
                }
                if(!$scope.$$phrese){
                    $scope.$apply();
                }
            });
        }



        function __startTimeIsValid(startTime, endTime){
            if(!startTime || startTime==""){
                return false;
            }
            if(!endTime || endTime==""){
                return true;
            }
            var startTime = new Date(startTime.replace("-","/").replace("-","/")).getTime();
            var endTime = new Date(endTime.replace("-","/").replace("-","/")).getTime();
            return startTime <= endTime;
        }
        function __endTimeIsValid(startTime, endTime){ 
            if(!endTime || endTime==""){
                return false;
            }
            if(!startTime || startTime==""){
                return true;
            }
            var startTime = new Date(startTime.replace("-","/").replace("-","/")).getTime();
            var endTime = new Date(endTime.replace("-","/").replace("-","/")).getTime();
            return startTime <= endTime;
        }



        function __getFormatTime(date) {
            var dateTemp, minutes, hour, time;
            dateTemp = date.format("yyyy-MM-dd");
            //分钟
            if (date.getMinutes().toString().length < 2) {
                minutes = "0" + date.getMinutes();
            } else {
                minutes = date.getMinutes();
            };
            //小时
            if (date.getHours().toString().length < 2) {
                hour = "0" + date.getHours();
                time = hour + ":" + minutes;
            } else {
                hour = date.getHours();
                time = hour + ":" + minutes;
            };
            return dateTemp + " " + time;
        };

        $scope.init = function(){
            $scope.config.typeStr = $stateParams.detailType;  // newCar  siteRepair  batchUpdate
            $scope.config.detailTypeNewCar =  $scope.config.typeStr == "newCar" ? true : false;
            $scope.config.detailTypeSiteRepair =  $scope.config.typeStr == "siteRepair" ? true : false;
            $scope.config.detailTypeBatchUpdate =  $scope.config.typeStr == "batchUpdate" ? true : false;

            $scope.datas.detail = angular.copy(worksheetDataService.wsDetailData);
            $scope.datas.detail.ES_OUT_LIST.START_TIME_STR = $scope.datas.detail.ES_OUT_LIST.START_DATE + " " + $scope.datas.detail.ES_OUT_LIST.START_TIME;
            $scope.datas.detail.ES_OUT_LIST.END_TIME_STR = $scope.datas.detail.ES_OUT_LIST.END_DATE + " " + $scope.datas.detail.ES_OUT_LIST.END_TIME;
            //console.log($scope.datas.detail.ES_OUT_LIST.START_TIME_STR);
            //console.log($scope.datas.detail.ES_OUT_LIST.END_TIME_STR);
            //__initSelectDatas();
            __initBuJianReason();
            __initScenario();
            __initResponse();
            __initGuZhangFeiLei();
            __initImpact();
        };

        function __initImpact(){
            if($scope.datas.detail.ES_OUT_LIST.IMPACT && $scope.datas.detail.ES_OUT_LIST.IMPACT!= ""){
                var impact = $scope.datas.detail.ES_OUT_LIST.IMPACT;
                for(var i = 0; i < $scope.datas.impactS.length; i++){
                    if($scope.datas.impactS[i].IMPACT == impact){
                        $scope.config.currentImpact = $scope.datas.impactS[i];
                    }
                }
            }
            if(!$scope.config.currentImpact){
                $scope.config.currentImpact = $scope.datas.impactS[0];
            }
        }
        var bujianFenLeiS = [];
        var responS = [];
        var bujianS = [];
        function __initBuJianReason(){
            var url = worksheetHttpService.xialazhi.service_order_reason.url;
            var defaults = worksheetHttpService.xialazhi.service_order_reason.defaults;
            var promise = HttpAppService.post(url, defaults);
            $scope.config.isLoading_BujianReason = true;
            promise.success(function(successRes){
                    var items = successRes.ET_REASON.item;                    
                    for(var i = 0; i < items.length; i++){
                        $scope.datas.chanPinLeiXingS.addItem(items[i]);
                    }
                    __initCurrentChangPinLeiXing();
                    $scope.config.isLoading_BujianReason = false;
                })
                .error(function(errorRes){
                    $scope.config.isLoading_BujianReason = false;
            });
        }
        function __initScenario(){
            var url = worksheetHttpService.xialazhi.list_scenario.url;
            var defaults = worksheetHttpService.xialazhi.list_scenario.defaults;
            var promise = HttpAppService.post(url, defaults);
            $scope.config.isLoading_scenario = true;
            promise.success(function(successRes){
                    var items = successRes.MT_ListScenario_Res.ET_SCENARIO.item;
                    //$scope.datas.guZhangChangJingS = $scope.datas.guZhangChangJingS.concat(items);
                    for(var j = 0; j < items.length; j++){
                        $scope.datas.guZhangChangJingS.push({
                            SCENARIO_DESC :items[j].DESCRIPTION,
                            SCENARIO: items[j].SCENARIO
                        });
                    }
                    for(var i = 0; i < $scope.datas.guZhangChangJingS.length; i++){
                        if($scope.datas.guZhangChangJingS[i].SCENARIO == $scope.datas.detail.ES_OUT_LIST.SCENARIO){
                            $scope.config.currentGuZhangChangJing = $scope.datas.guZhangChangJingS[i];
                        }
                    }
                    if($scope.config.currentGuZhangChangJing==null){
                        $scope.config.currentGuZhangChangJing = $scope.datas.guZhangChangJingS[0];
                    }
                    $scope.config.isLoading_scenario = false;
                })
                .error(function(errorRes){
                    $scope.config.isLoading_scenario = false;
            });
        }
        function __initResponse(){
            var url = worksheetHttpService.xialazhi.list_response.url;
            var defaults = worksheetHttpService.xialazhi.list_response.defaults;
            var promise = HttpAppService.post(url, defaults);
            $scope.config.isLoading_response = true;
            promise.success(function(successRes){
                    var items = successRes.ET_RESPONSE.item;
                    //$scope.datas.zeRengFangS = $scope.datas.zeRengFangS.concat(items);
                    for(var j =0; j < items.length; j++){
                        $scope.datas.zeRengFangS.push({
                            RESPONSE: items[j].RESPONSE,
                            RESPONSE_DESC: items[j].DESCRIPTION
                        });
                    }
                    for(var i = 0; i < $scope.datas.zeRengFangS.length; i++){
                        if($scope.datas.zeRengFangS[i].RESPONSE == $scope.datas.detail.ES_OUT_LIST.RESPONSE){
                            $scope.config.currentZeRenFang = $scope.datas.zeRengFangS[i];
                        }
                    }
                    if($scope.config.currentZeRenFang==null){
                        $scope.config.currentZeRenFang = $scope.datas.zeRengFangS[0];
                    }
                    $scope.config.isLoading_response = false;
                })
                .error(function(errorRes){
                    $scope.config.isLoading_response = false;
            });
        }
        function __initGuZhangFeiLei(){
            var url = worksheetHttpService.xialazhi.list_defect.url;
            var defaults = worksheetHttpService.xialazhi.list_defect.defaults;
            var promise = HttpAppService.post(url, defaults);
            $scope.config.isLoading_defect = true;
            promise.success(function(successRes){
                    var items = successRes.ET_DEFECT.item;
                    //$scope.datas.guZhangFeiLenS = $scope.datas.guZhangFeiLenS.concat(items);
                    for(var j = 0; j < items.length; j++){
                        $scope.datas.guZhangFeiLenS.push({
                            DEFECT: items[j].DEFECT,
                            DEFECT_DESC: items[j].DESCRIPTION
                        });
                    }
                    for(var i = 0; i < $scope.datas.guZhangFeiLenS.length; i++){
                        if($scope.datas.guZhangFeiLenS[i].DEFECT == $scope.datas.detail.ES_OUT_LIST.DEFECT){
                            $scope.config.currentGuZhangFeiLen = $scope.datas.guZhangFeiLenS[i];
                        }
                    }
                    if($scope.config.currentGuZhangFeiLen==null){
                        $scope.config.currentGuZhangFeiLen = $scope.datas.guZhangFeiLenS[0];
                    }
                    $scope.config.isLoading_defect = false;
                })
                .error(function(errorRes){
                    $scope.config.isLoading_defect = false;
            });
        }

        function __initSelectDatas(){
            $scope.datas.detail.ES_OUT_LIST.END_TIME_STR = $scope.datas.detail.ES_OUT_LIST.END_DATE + " "+$scope.datas.detail.ES_OUT_LIST.END_TIME;
            $scope.datas.detail.ES_OUT_LIST.START_TIME_STR = $scope.datas.detail.ES_OUT_LIST.START_DATE + " "+$scope.datas.detail.ES_OUT_LIST.START_TIME;
            //影响：
            if($scope.datas.detail.ES_OUT_LIST.IMPACT_DESC && $scope.datas.detail.ES_OUT_LIST.IMPACT_DESC!= ""){
                var impact = $scope.datas.detail.ES_OUT_LIST.IMPACT;
                for(var i = 0; i < $scope.datas.impactS.length; i++){
                    if($scope.datas.impactS[i].IMPACT == impact){
                        $scope.config.currentImpact = $scope.datas.impactS[i];
                    }
                }
            }else{
                $scope.config.currentImpact = $scope.datas.impactS[0];
            }
            //故障发生场景
            $scope.datas.guZhangChangJingS = $scope.datas.guZhangChangJingS.concat([
                {
                    "SCENARIO": "S01",
                    "SCENARIO_DESC": "未装车",
                },
                {
                    "SCENARIO": "S02",
                    "SCENARIO_DESC": "故障二",
                },
                {
                    "SCENARIO": "S03",
                    "SCENARIO_DESC": "故障三",
                },
                {
                    "SCENARIO": "S04",
                    "SCENARIO_DESC": "故障四a",
                }
            ]);
            if($scope.datas.detail.ES_OUT_LIST.SCENARIO && $scope.datas.detail.ES_OUT_LIST.SCENARIO != ""){
                var scenario = $scope.datas.detail.ES_OUT_LIST.SCENARIO;
                for(var i = 0; i < $scope.datas.guZhangChangJingS.length; i++){
                    if($scope.datas.guZhangChangJingS[i].SCENARIO = scenario){
                        $scope.config.currentGuZhangChangJing = $scope.datas.guZhangChangJingS[i];
                    }
                }
            }else{
                $scope.config.currentGuZhangChangJing = $scope.datas.guZhangChangJingS[0];
            }
            
            //责任方
            $scope.datas.zeRengFangS = $scope.datas.zeRengFangS.concat([
                {
                    RESPONSE_DESC: '责任方1',
                    RESPONSE: '1'
                },
                {
                    RESPONSE_DESC: '责任方2',
                    RESPONSE: '2'
                },
                {
                    RESPONSE_DESC: '责任方3',
                    RESPONSE: '3'
                }
            ]);
            if($scope.datas.detail.ES_OUT_LIST.RESPONSE && $scope.datas.detail.ES_OUT_LIST.RESPONSE != ""){
                var response = $scope.datas.detail.ES_OUT_LIST.RESPONSE;
                for(var i = 0; i < $scope.datas.zeRengFangS.length; i++){
                    if($scope.datas.zeRengFangS[i].RESPONSE = response){
                        $scope.config.currentZeRenFang = $scope.datas.zeRengFangS[i];
                    }
                }
            }else{
                $scope.config.currentZeRenFang = $scope.datas.zeRengFangS[0];
            }

            //故障分类
            $scope.datas.guZhangFeiLenS = $scope.datas.guZhangFeiLenS.concat([
                {
                    DEFECT_DESC: '分类1',
                    DEFECT: '1'
                },
                {
                    DEFECT_DESC: '分类2',
                    DEFECT: '2'
                },
                {
                    DEFECT_DESC: '分类3',
                    DEFECT: '3'
                },
            ]);
            if($scope.datas.detail.ES_OUT_LIST.DEFECT && $scope.datas.detail.ES_OUT_LIST.DEFECT != ""){
                var defect = $scope.datas.detail.ES_OUT_LIST.DEFECT;
                for(var i = 0; i < $scope.datas.guZhangFeiLenS.length; i++){
                    if($scope.datas.guZhangFeiLenS[i].DEFECT = defect){
                        $scope.config.currentGuZhangFeiLen = $scope.datas.guZhangFeiLenS[i];
                    }
                }
            }else{
                $scope.config.currentGuZhangFeiLen = $scope.datas.guZhangFeiLenS[0];
            }

            //产品类型
            $scope.datas.chanPinLeiXingS = $scope.datas.chanPinLeiXingS.concat([
                {
                    COMP_TYPE: 'eBus',
                    KATALOGART: 'F0'
                },
                {
                    COMP_TYPE: 'eBus1',
                    KATALOGART: 'F1'
                },
                {
                    COMP_TYPE: 'eBus2',
                    KATALOGART: 'F2'
                }
            ]);
            if($scope.datas.detail.ES_OUT_LIST.KATALOGART && $scope.datas.detail.ES_OUT_LIST.KATALOGART != ""){
                var KATALOGART = $scope.datas.detail.ES_OUT_LIST.KATALOGART;
                for(var i = 0; i < $scope.datas.chanPinLeiXingS.length; i++){
                    if($scope.datas.chanPinLeiXingS[i].KATALOGART = KATALOGART){
                        $scope.config.currentChanPinLeiXing = $scope.datas.chanPinLeiXingS[i];
                    }
                }
            }else{
                $scope.config.currentChanPinLeiXing = $scope.datas.chanPinLeiXingS[0];
            }

            //故障部件
            $scope.datas.guZhangBuJianS = $scope.datas.guZhangBuJianS.concat([
                {
                    "CODEGRUPPE": "04",
                    "COMPONENT": "电芯"
                },
                {
                    "CODEGRUPPE": "08",
                    "COMPONENT": "箱体间连接"
                },
                {
                    "CODEGRUPPE": "05",
                    "COMPONENT": "电芯05"
                }
            ]);
            if($scope.datas.detail.ES_OUT_LIST.CODEGRUPPE && $scope.datas.detail.ES_OUT_LIST.CODEGRUPPE != ""){
                var CODEGRUPPE = $scope.datas.detail.ES_OUT_LIST.CODEGRUPPE;
                for(var i = 0; i < $scope.datas.guZhangBuJianS.length; i++){
                    if($scope.datas.guZhangBuJianS[i].CODEGRUPPE = CODEGRUPPE){
                        $scope.config.currentGuZhangBuJian = $scope.datas.guZhangBuJianS[i];
                    }
                }
            }else{
                $scope.config.currentGuZhangBuJian = $scope.datas.guZhangBuJianS[0];
            }

            //故障名称
            $scope.datas.guZhangMingChengS = $scope.datas.guZhangMingChengS.concat([
                {
                    "CODE": "02",
                    "REASON": "漏液"
                },
                {
                    "CODE": "02",
                    "REASON": "漏液"
                },
                {
                    "CODE": "02",
                    "REASON": "漏液"
                },
            ]);
            if($scope.datas.detail.ES_OUT_LIST.CODE && $scope.datas.detail.ES_OUT_LIST.CODE != ""){
                var CODE = $scope.datas.detail.ES_OUT_LIST.CODE;
                for(var i = 0; i < $scope.datas.guZhangMingChengS.length; i++){
                    if($scope.datas.guZhangMingChengS[i].CODE = CODE){
                        $scope.config.currentGuZhangMingCheng = $scope.datas.guZhangMingChengS[i];
                    }
                }
            }else{
                $scope.config.currentGuZhangMingCheng = $scope.datas.guZhangMingChengS[0];
            }
        }
        
        $scope.init();

        $scope.selectCar = function(){
            //worksheetDataService.selectedCheLiang  backObject;
            worksheetDataService.selectedCheLiang = true;
            $state.go("car");
        };

        

}]);

/*

impactS: [
    {
        IMPACT_DESC: noneValue,
        IMPACT: noneValueId
    },
    {
        IMPACT_DESC: pleaseChoose,
        IMPACT: pleaseChooseId
    },                
    {
        IMPACT_DESC: '灾难',
        IMPACT: '01'
    },
    {
        IMPACT_DESC: '高',
        IMPACT: '25'
    },
    {
        IMPACT_DESC: '中',
        IMPACT: '50'
    },
    {
        IMPACT_DESC: '低',
        IMPACT: '75'
    },
    {
        IMPACT_DESC: '无',
        IMPACT: '99'
    }
],
guZhangChangJingS:[
    {
        SCENARIO_DESC: noneValue,
        SCENARIO: noneValueId
    },
    {
        SCENARIO_DESC: pleaseChoose,
        SCENARIO: pleaseChooseId
    }
],
zeRengFangS:[
    {
        RESPONSE_DESC: noneValue,
        RESPONSE: noneValueId
    },
    {
        RESPONSE_DESC: pleaseChoose,
        RESPONSE: pleaseChooseId
    }
],
guZhangFeiLenS: [
    {
        DEFECT_DESC: noneValue,
        DEFECT: noneValueId
    },
    {
        DEFECT_DESC: pleaseChoose,
        DEFECT: pleaseChooseId
    }
],
guZhangBuJianS: null,
guZhangMingChengS: null,
chanPinLeiXingS: [
    {
        COMP_TYPE: noneValue,
        KATALOGART: noneValueId,
        guZhangBuJianS:[
            {
                COMPONENT: noneValue,
                CODEGRUPPE: noneValueId,
                guZhangMingChengS: [
                    {
                        REASON: noneValue,
                        CODE: noneValueId
                    },
                    {
                        REASON: pleaseChoose,
                        CODE: pleaseChooseId
                    }
                ]
            },
            {
                COMPONENT: pleaseChoose,
                CODEGRUPPE: pleaseChooseId,
                guZhangMingChengS: [
                    {
                        REASON: noneValue,
                        CODE: noneValueId
                    },
                    {
                        REASON: pleaseChoose,
                        CODE: pleaseChooseId
                    }
                ]
            }
        ]
    },
    {
        COMP_TYPE: pleaseChoose,
        KATALOGART: pleaseChooseId,
        guZhangBuJianS:[
            {
                COMPONENT: noneValue,
                CODEGRUPPE: noneValueId,
                guZhangMingChengS: [ 
                    {
                        REASON: noneValue,
                        CODE: noneValueId
                    },
                    {
                        REASON: pleaseChoose,
                        CODE: pleaseChooseId
                    }
                ]
            },
            {
                COMPONENT: pleaseChoose,
                CODEGRUPPE: pleaseChooseId,
                guZhangMingChengS: [ 
                    {
                        REASON: noneValue,
                        CODE: noneValueId
                    },
                    {
                        REASON: pleaseChoose,
                        CODE: pleaseChooseId
                    }
                ]
            }
        ]
    }
]

*/