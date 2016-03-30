
worksheetModule.controller("WorksheetRelatedCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
        $ionicPopover.fromTemplateUrl('../src/worksheet/relatedPart/worksheetRelate_select.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.relatedpopover = popover;
        });
        $scope.relatedPopoverShow = function($event) {
            console.log("--");
            $scope.relatedpopover.show($event);
            document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.relatedPopoverhide = function() {
            $scope.relatedpopover.hide();
            document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
        };
        $scope.related_types = ['联系人','服务商','外服'];
        $scope.relatedqueryType = function(type){
            console.log(type+"---");
            $scope.relatedPopoverhide();
        };
        $scope.infos = [{
            name : "往事",
            position : "服务代理商联系人",
            phone : "18298182058"
        },{
            name : "往事如风",
            position : "服务代理商",
            phone : "18298182053"
        },{
            name : "走走走",
            position : "负责员工",
            phone : "18298182052"
        }]
}]);