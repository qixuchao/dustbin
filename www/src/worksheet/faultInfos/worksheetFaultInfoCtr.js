
worksheetModule.controller("WorksheetFaultInfoCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
    ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            $state.go("worksheetFaultInfosEdit");
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        console.log(angular.toJson(worksheetDetail));
        $scope.faulInfos = worksheetDetail.ES_OUT_LIST;
        console.log(angular.toJson($scope.faulInfos));
        var arrInfos = worksheetDetail.ET_TEXT.item;
        console.log(angular.toJson(arrInfos));
        var remark = ""; var result = "";
        for(var i=0;i<arrInfos.length;i++){
            if(arrInfos[i].TDID === 'Z001'){
                remark = remark + arrInfos[i].TDLINE;
            }else if(arrInfos[i].TDID === 'Z005'){
                result = result + arrInfos[i].TDLINE;
            }
            console.log(angular.toJson(remark+"=="+result));
        }
        $scope.otherInfos = {
            remark : remark,
            result : result
        };
        console.log(angular.toJson($scope.otherInfos));
}]);


worksheetModule.controller("WorksheetFaultInfoEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService","HttpAppService",'Prompter', function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,HttpAppService,Prompter){
        ionicMaterialInk.displayEffect();
        $scope.keep = function(){
            Prompter.showLoading("正在提交");
            var updateEdit = {
                "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": {"BNAME": worksheetDetail.ES_OUT_LIST.CREATED_BY},
                "IS_OBJECT_ID": worksheetDetail.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDetail.IS_PROCESS_TYPE,
                    "IS_HEAD_DATA": {
                    "SCENARIO": $scope.config.scenarioItem,
                        "RESPONSE": $scope.config.responseItem,
                        "DEFECT": $scope.config.defectItem,
                        "COMP_TYPE": "F0",
                        "COMPONENT": "08",
                        "REASON": "06"
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
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, data).success(function(response){
                Prompter.hideLoading();
                $state.go("worksheetFaultInfos");
                console.log(angular.toJson(response));
            }).error(function(err){
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
        for(var i=0;i<arrInfos.length;i++){
            if(arrInfos[i].TDID === 'Z001'){
            }else if(arrInfos[i].TDID === 'Z005'){
                result = result + arrInfos[i].TDLINE;
            }
            console.log(angular.toJson(remark+"=="+result));
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
            scenarioItem : $scope.faulInfos.SCENARIO,
            responseItem : $scope.faulInfos.RESPONSE,
            defectItem : $scope.faulInfos.DEFECT,
            currentChanPinLeiXing: null,  //{"KATALOGART": "F0", "COMP_TYPE": "eBus",}
            currentGuZhangBuJian: null,      //{ "CODEGRUPPE": "04", "COMPONENT": "电芯" }
            currentGuZhangMingCheng: null,   //{CODE: '', REASON: ''}
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
            console.log(angular.toJson(response)+"场景");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //责任方
        var urlReaponse = ROOTCONFIG.hempConfig.basePath + 'LIST_RESPONSE';
        HttpAppService.post(urlReaponse, data).success(function(response){
            $scope.response = response.ET_RESPONSE.item;
            console.log(angular.toJson(response)+"zeren");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //故障分类
        var urlDefect = ROOTCONFIG.hempConfig.basePath + 'LIST_DEFECT';
        HttpAppService.post(urlDefect, data).success(function(response){
            $scope.defect = response.ET_DEFECT.item;
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
                            }
                        ]
                    });
                    return;
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

    }]);