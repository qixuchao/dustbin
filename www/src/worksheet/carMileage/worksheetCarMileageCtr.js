
worksheetModule.controller("WorksheetCarMileageCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
    ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            $state.go("worksheetCarMileageEdit");
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        $scope.carMile = worksheetDetail.ET_MILEAGE.item;
        console.log(angular.toJson($scope.carMile.MILEAGE_COUNTER));
        
}]);

worksheetModule.controller("WorksheetCarMileageEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
        ionicMaterialInk.displayEffect();
        $scope.keep = function(){
            $state.go("worksheetCarMileage");
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        $scope.carMile = worksheetDetail.ET_MILEAGE.item;
    }]);