
worksheetModule.controller("WorksheetFaultInfoCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state){
    ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            $state.go("worksheetFaultInfosEdit");
        }
}]);


worksheetModule.controller("WorksheetFaultInfoEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state){
        ionicMaterialInk.displayEffect();
        $scope.keep = function(){
            $state.go("worksheetFaultInfos");
        }
    }]);