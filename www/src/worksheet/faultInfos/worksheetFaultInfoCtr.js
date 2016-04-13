
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
    "$ionicPopup", "$timeout","$state","worksheetDataService","HttpAppService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,HttpAppService){
        ionicMaterialInk.displayEffect();
        $scope.keep = function(){
            $state.go("worksheetFaultInfos");
        }
        var data = {
            "I_SYSTEM": { "SysName": "CATL" },
            "IS_USER": { "BNAME": "" }
        }
        //场景
        var urlChang = ROOTCONFIG.hempConfig.basePath + 'LIST_SCENARIO';
        HttpAppService.post(urlChang, data).success(function(response){
            $scope.scenario = response.MT_ListScenario_Res.ET_SCENARIO.item;
            //console.log(angular.toJson(response)+"场景");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //责任方
        var urlReaponse = ROOTCONFIG.hempConfig.basePath + 'LIST_RESPONSE';
        HttpAppService.post(urlReaponse, data).success(function(response){
            $scope.response = response.ET_RESPONSE.item;
            //console.log(angular.toJson(response)+"zeren");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //故障分类
        var urlDefect = ROOTCONFIG.hempConfig.basePath + 'LIST_DEFECT';
        HttpAppService.post(urlDefect, data).success(function(response){
            $scope.defect = response.ET_DEFECT.item;
            //console.log(angular.toJson(response)+"故障");
        }).error(function(err){
            console.log(angular.toJson(err));
        });
        //产品类型-故障部件-故障名称  --级联
        var urlReson = ROOTCONFIG.hempConfig.basePath + 'SERVICE_ORDER_REASON';
        HttpAppService.post(urlReson, data).success(function(response){
            $scope.orderReson = response.ET_REASON.item;
            console.log(angular.toJson($scope.orderReson));
        }).error(function(err){
            console.log(angular.toJson(err));
        });
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
    }]);