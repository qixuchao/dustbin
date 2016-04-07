worksheetReportModule.controller("WorksheetReportedListCtrl",[
    "$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout",
    "$ionicPosition","$state","worksheetReportservice",
    function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition, $state,worksheetReportservice){
        $scope.listInfos = [{
            name : "售后服务工时",
            code : "SV-AFS-01",
            num : "3.00h"
        },{
            name : "售后服务里程",
            code : "SV-AFS-02",
            num : "3.21km"
        },{
            name : "高压熔断器",
            code : "SV-AFS-03",
            num : "3"
        }]
        worksheetReportservice.setReportlist($scope.listInfos);
        $scope.goMaintain = function(){
            console.log("---");
            $state.go("worksheetReportedMaintain");
        }
    }]);

worksheetReportModule.controller("WorksheetReportedCreateCtrl",[
    "$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout",
    "$ionicPosition","$state","worksheetReportservice",
    function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition, $state,worksheetReportservice){
        $scope.worksheetReport = {
            worksheetType : "现场维修工单",
            worksheetNum  : "1212",
            worksheetDes  : "建单描述",
            remark : "取消密码:在桌面打开“设置”选项。打开设置界面后,点击“位置和安全”选项 ",
            status : "未处理",
            affect : "灾难",
            person : "王微"
        };
    }]);

worksheetReportModule.controller("WorksheetReportedMaintainCtrl",[
    "$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout",
    "$ionicPosition","$state","worksheetReportservice",
    function($scope, ionicMaterialInk, ionicMaterialMotion,$ionicPopup, $timeout,$ionicPosition, $state,worksheetReportservice){
        //$scope.listInfos = worksheetReportservice.getReportlist();
        $scope.listInfos = [{
            name : "售后服务工时",
            code : "SV-AFS-01",
            num : 3
        },{
            name : "售后服务里程",
            code : "SV-AFS-02",
            num : 3
        },{
            name : "高压熔断器",
            code : "SV-AFS-03",
            num : 3
        }]
        $scope.add = function(item){
            item.num += 1;
            console.log(angular.toJson($scope.listInfos));
        }
        $scope.reduce = function(item){
            if(item.num > 0){
                item.num -= 1;
            }
            console.log(angular.toJson($scope.listInfos));
        }
        $scope.ngBlur = function(){
            console.log(angular.toJson($scope.listInfos));
        }
    }]);
