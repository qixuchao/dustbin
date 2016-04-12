
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
}]);


worksheetModule.controller("WorksheetFaultInfoEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
        ionicMaterialInk.displayEffect();
        $scope.keep = function(){
            $state.go("worksheetFaultInfos");
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        console.log(angular.toJson(worksheetDetail));
        $scope.faulInfos = worksheetDetail.ET_MILEAGE.item;
        console.log(angular.toJson($scope.faulInfos));
    }]);