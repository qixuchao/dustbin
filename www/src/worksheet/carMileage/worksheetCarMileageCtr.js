
worksheetModule.controller("WorksheetCarMileageCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetCarMileageEdit' && toState.name == 'worksheetCarMileage'){
                var worksheetDetail = worksheetDataService.wsDetailData;
                console.log(angular.toJson(worksheetDetail));
            }
        });
        ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            $state.go("worksheetCarMileageEdit");
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        console.log(angular.toJson(worksheetDetail));
        $scope.carMile = worksheetDetail.ET_MILEAGE.item[0];
        console.log(angular.toJson($scope.carMile));
        if($scope.carMile.MILEAGE_DATE === "" && $scope.carMile.MILEAGE_VALUE === "" && $scope.carMile.MILEAGE_DESC === ""){
            $scope.carEdit = true;
        }else{
            $scope.carEdit = false;
        }
}]);

worksheetModule.controller("WorksheetCarMileageEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService",'HttpAppService','Prompter', function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,HttpAppService,Prompter){
        ionicMaterialInk.displayEffect();
        var worksheetDetail = worksheetDataService.wsDetailData;
        $scope.carMile = worksheetDetail.ET_MILEAGE.item[0];
        console.log(angular.toJson($scope.carMile));
        $scope.update = {
            readDate : $scope.carMile.MILEAGE_DATE,
            readValue : $scope.carMile.MILEAGE_VALUE,
            readDescription : $scope.carMile.MILEAGE_DESC
        };

        $scope.keep = function(){
            console.log(angular.toJson($scope.update));
            Prompter.showLoading("正在提交");
            var data={
                "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDetail.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID": worksheetDetail.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDetail.IS_PROCESS_TYPE,
                "IT_MILEAGE": {
                    "item": [
                        {
                            "MILEAGE_VALUE": $scope.update.readValue,
                            "MILEAGE_DATE": $scope.update.readDate,
                            "MILEAGE_DESC": $scope.update.readDescription
                        }
                    ]
                }};
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, data).success(function(response){
                worksheetDataService.wsDetailData.ET_MILEAGE.item[0].MILEAGE_VALUE = $scope.update.readValue
                worksheetDataService.wsDetailData.ET_MILEAGE.item[0].MILEAGE_DATE = $scope.update.readDate
                worksheetDataService.wsDetailData.ET_MILEAGE.item[0].MILEAGE_DESC =  $scope.update.readDescription
                Prompter.hideLoading();
                $state.go("worksheetCarMileage");
                console.log(angular.toJson(response));
            }).error(function(err){
                console.log(angular.toJson(err));
            });
        }
    }]);