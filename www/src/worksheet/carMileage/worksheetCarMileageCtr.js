
worksheetModule.controller("WorksheetCarMileageCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state){
    ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            $state.go("worksheetCarMileageEdit");
        }
        var worksheetDetail = worksheetDataService.detailDatas;
        
}]);

worksheetModule.controller("WorksheetCarMileageEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state){
        ionicMaterialInk.displayEffect();
        $scope.keep = function(){
            $state.go("worksheetCarMileage");
        }
    }]);