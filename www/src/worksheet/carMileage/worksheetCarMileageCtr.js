
worksheetModule.controller("WorksheetCarMileageCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state){
    ionicMaterialInk.displayEffect();
    $scope.edit = function(){
        $state.go("worksheetCarMileageEdit");
    }
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