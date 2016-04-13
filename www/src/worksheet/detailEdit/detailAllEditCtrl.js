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
        function ($scope, $state, $ionicHistory, $ionicScrollDelegate,
                  ionicMaterialInk, ionicMaterialMotion, $timeout, $cordovaDialogs, $ionicModal, $ionicPopover,
                  $cordovaToast, $stateParams, $ionicPosition, HttpAppService, worksheetHttpService, worksheetDataService) {

        $scope.config = {
            typeStr: ''
        };

        $scope.datas = {

        };

        $scope.init = function(){
            $scope.config.typeStr = $stateParams.detailType;
        };

        $scope.init();


}]);