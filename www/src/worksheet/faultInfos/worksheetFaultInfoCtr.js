
worksheetModule.controller("WorksheetFaultInfoCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
    ionicMaterialInk.displayEffect();
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            var worksheetDetail = worksheetDataService.wsDetailData;
            console.log(angular.toJson(worksheetDetail));
            $scope.faulInfos = worksheetDetail.ES_OUT_LIST;
            console.log(angular.toJson($scope.faulInfos));

            var arrInfos = worksheetDetail.ET_TEXT.item;
            console.log(angular.toJson(arrInfos));
            var remark = []; var result = "";
            if(arrInfos === undefined){

            }else{
                for(var i=0;i<arrInfos.length;i++){
                    if(arrInfos[i].TDID === 'Z001'){
                        remark.push({name : arrInfos[i].TDLINE});
                    }else if(arrInfos[i].TDID === 'Z005'){
                        result = result + arrInfos[i].TDLINE;
                    }
                    console.log(angular.toJson(remark+"=="+result));
                }
            }
            $scope.otherInfos = {
                remark : remark,
                result : result
            };
            console.log(angular.toJson($scope.otherInfos));

        });
        $scope.edit = function(){
            $state.go("worksheetFaultInfosEdit");
        }


}]);


worksheetModule.controller("WorksheetFaultInfoEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService","HttpAppService",'Prompter','$cordovaToast','$rootScope','$cordovaDialogs', function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,HttpAppService,Prompter,$cordovaToast,$rootScope,$cordovaDialogs){
        ionicMaterialInk.displayEffect();
        $scope.goAlert = function(){
            Prompter.ContactCreateCancelvalue();
        }
        //文本框自适应换行
        var autoTextarea = function (elem, extra, maxHeight) {
            extra = extra || 0;
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        };
        var text = document.getElementById("textarea");
        autoTextarea(text);// 调用
        var textresult = document.getElementById("textareare");
        autoTextarea(textresult);// 调用
        $scope.keep = function(){
            Prompter.showLoading("正在提交");
            if($scope.config.scenarioItem == null || $scope.config.scenarioItem ==undefined || $scope.config.scenarioItem ==''){
                $cordovaToast.showShortBottom("请选择故障发生场景");
                return;
                //var SCENARIO = '';
            }else {
                var SCENARIO= $scope.config.scenarioItem.SCENARIO
            }
            if($scope.config.responseItem == null || $scope.config.responseItem ==undefined|| $scope.config.responseItem ==""){
                $cordovaToast.showShortBottom("请选择责任方");
                return;
               //var RESPONSE = '';
            }else {
                var RESPONSE =  $scope.config.responseItem.RESPONSE
            }
            if($scope.config.defectItem == null || $scope.config.defectItem ==undefined || $scope.config.defectItem ==""){
                $cordovaToast.showShortBottom("请选择故障分类");
                return;
                //var DEFECT = '';
            }else {
                var DEFECT = $scope.config.defectItem.DEFECT
            }
            if($scope.config.currentChanPinLeiXing == null || $scope.config.currentChanPinLeiXing ==undefined  || $scope.config.currentChanPinLeiXing ==""){
                $cordovaToast.showShortBottom("请选择产品类型");
                return;
                //var KATALOGART = '';
            }else {
                var KATALOGART = $scope.config.currentChanPinLeiXing.KATALOGART
            }
            if($scope.config.currentGuZhangBuJian == null || $scope.config.currentGuZhangBuJian ==undefined || $scope.config.currentGuZhangBuJian ==""){
                $cordovaToast.showShortBottom("请选择故障部件");
                return;
                //var CODEGRUPPE = '';
            }else {
                var CODEGRUPPE = $scope.config.currentGuZhangBuJian.CODEGRUPPE
            }
            if($scope.config.currentGuZhangMingCheng == null || $scope.config.currentGuZhangMingCheng ==undefined || $scope.config.currentGuZhangMingCheng ==""){
                $cordovaToast.showShortBottom("请选择故障名称");
                return;
                //var CODE = '';
            }else {
               var CODE = $scope.config.currentGuZhangMingCheng.CODE
            }
            var updateEdit = {
                "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                "IS_OBJECT_ID": worksheetDetail.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDetail.IS_PROCESS_TYPE,
                    "IS_HEAD_DATA": {
                    "SCENARIO": SCENARIO,
                        "RESPONSE": RESPONSE,
                        "DEFECT": DEFECT,
                        "COMP_TYPE": KATALOGART,
                        "COMPONENT": CODEGRUPPE,
                        "REASON": CODE
                },
                    "IT_TEXT": {
                    "item": [
                        {
                            "TDID": "Z002",
                            "TEXT": $scope.otherInfos.remark
                        },
                        {
                            "TDID": "Z005",
                            "TEXT": $scope.otherInfos.result
                        }
                    ]
                }
            }
            console.log(angular.toJson(updateEdit));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, updateEdit).success(function(response){
                console.log(angular.toJson(response));
                console.log(angular.toJson(response));
                if (response.ES_RESULT.ZFLAG === 'S') {
                    $scope.updateInfos();
                    worksheetDataService.wsEditToDetail.needReload = true;
                    $cordovaToast.showShortBottom("故障信息维护成功");
                } else {
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }
            }).error(function(err){
                Prompter.hideLoading();
                console.log(angular.toJson(err));
            });
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        console.log(angular.toJson(worksheetDetail));
        $scope.faulInfos = worksheetDetail.ES_OUT_LIST;
        console.log(angular.toJson($scope.faulInfos));
        var arrInfos = worksheetDetail.ET_TEXT.item;
        console.log(angular.toJson(arrInfos));
        var remark = ""; var result = "";
        if(arrInfos === undefined){

        }else{
            for(var i=0;i<arrInfos.length;i++){
                if(arrInfos[i].TDID === 'Z005'){
                    result = result + arrInfos[i].TDLINE;
                }
            }
        }
        $scope.otherInfos = {
            remark : remark,
            result : result
        };
        console.log(angular.toJson($scope.otherInfos));
        var data = {
            "I_SYSTEM": { "SysName": "CATL" },
            "IS_USER": { "BNAME": "" }
        }

        $scope.config = {
            scenarioItem : "",
            responseItem : "",
            defectItem : "",
            currentChanPinLeiXing: "",  //{"KATALOGART": "F0", "COMP_TYPE": "eBus",}
            currentGuZhangBuJian: "",      //{ "CODEGRUPPE": "04", "COMPONENT": "电芯" }
            currentGuZhangMingCheng: "",   //{CODE: '', REASON: ''}
        };
        var pleaseChoose = '-- 请选择 --';
        $scope.datas = {
            detail: worksheetDataService.wsDetailData,
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
        $scope.buJianFeiLenChanged = function(){
            //console.log("guZhangFeiLenChanged");
            //console.log($scope.config.currentChanPinLeiXing.guZhangBuJianS);
            $scope.datas.guZhangBuJianS = $scope.config.currentChanPinLeiXing.guZhangBuJianS;
            $scope.datas.guZhangMingChengS = $scope.datas.guZhangBuJianS.guZhangMingChengS;
            $scope.config.currentGuZhangBuJian = $scope.datas.guZhangBuJianS[0];
            $scope.config.currentGuZhangMingCheng = $scope.config.currentGuZhangBuJian[0];
        };
        $scope.buJianChanged = function(){
            $scope.datas.guZhangMingChengS = $scope.config.currentGuZhangBuJian.guZhangMingChengS;
            $scope.config.currentGuZhangMingCheng = $scope.datas.guZhangMingChengS[0];
        };

        //场景
        var urlChang = ROOTCONFIG.hempConfig.basePath + 'LIST_SCENARIO';
        HttpAppService.post(urlChang, data).success(function(response){
            $scope.scenario = response.MT_ListScenario_Res.ET_SCENARIO.item;
            for(var i=0;i<$scope.scenario.length;i++){
                if($scope.scenario[i].SCENARIO === $scope.faulInfos.SCENARIO){
                    console.log("===");
                    $scope.config.scenarioItem = $scope.scenario[i];
                }
            }
            console.log(angular.toJson(response)+"场景");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //责任方
        var urlReaponse = ROOTCONFIG.hempConfig.basePath + 'LIST_RESPONSE';
        HttpAppService.post(urlReaponse, data).success(function(response){
            $scope.response = response.ET_RESPONSE.item;
            for(var i=0;i<$scope.response.length;i++){
                if($scope.response[i].RESPONSE === $scope.faulInfos.RESPONSE){
                    console.log("===");
                    $scope.config.responseItem = $scope.response[i];
                }
            }
            console.log(angular.toJson(response)+"zeren");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //故障分类
        var urlDefect = ROOTCONFIG.hempConfig.basePath + 'LIST_DEFECT';
        HttpAppService.post(urlDefect, data).success(function(response){
            $scope.defect = response.ET_DEFECT.item;
            for(var i=0;i<$scope.defect.length;i++){
                if($scope.defect[i].DEFECT === $scope.faulInfos.DEFECT){
                    console.log("===");
                    $scope.config.defectItem = $scope.defect[i];
                }
            }
            console.log(angular.toJson(response)+"故障");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //产品类型-故障部件-故障名称  --级联
        var urlReson = ROOTCONFIG.hempConfig.basePath + 'SERVICE_ORDER_REASON';
        HttpAppService.post(urlReson, data).success(function(response){
            var items = response.ET_REASON.item;
            for(var i = 0; i < items.length; i++){
                $scope.datas.chanPinLeiXingS.addItem(items[i]);
            }
            __initCurrentChangPinLeiXing();
        }).error(function(err){
            console.log(angular.toJson(err));
        });
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

        //数据刷新
        $scope.updateInfos = function(){
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
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
                $rootScope.goBack();
                Prompter.hideLoading();
            }).error(function(err){
                Prompter.hideLoading();
                console.log(angular.toJson(err));
            });
        }
    }]);