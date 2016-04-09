
worksheetModule.controller("WorksheetRelatedCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter){
    $ionicPopover.fromTemplateUrl('src/worksheet/relatedPart/worksheetRelate_select.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.relatedpopover = popover;
        });
        $scope.relatedPopoverShow = function() {
            console.log("--");
            $scope.relatedpopover.show();
            //document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.relatedPopoverhide = function() {
            $scope.relatedpopover.hide();
            //document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
        };
        $scope.related_types = ['联系人','服务商','外服'];
        $scope.relatedqueryType = function(type){
            $scope.relatedPopoverhide();
        };

        $scope.title = "相关方列表";
        $scope.deleteShow = true;
        $scope.showInput = true;
        $scope.delete = function(){
            $scope.checkboxDiy = "checkbox";
            $scope.showInput = false;
            $scope.title = "相关方删除";
            $scope.deleteShow = false;
            var str=document.getElementsByName("deleteBox");
            for (var i=0;i<str.length;i++) {
                str[i].checked == false;
            }
            //$state.go("worksheetRelatedPartDelete");
        }
        $scope.infos = [{
            id : 1,
            name : "往事",
            position : "服务代理商联系人",
            phone : "18298182058"
        },{
            id : 2,
            name : "往事如风",
            position : "服务代理商",
            phone : "18298182053"
        },{
            id : 3,
            name : "走走走",
            position : "负责员工",
            phone : "18298182052"
        }]

        $scope.deleteInfos = function(){
            var str=document.getElementsByName("deleteBox");
            var chestr = new Array();
            for (var i=0;i<str.length;i++) {
                if(str[i].checked == true)
                {
                    chestr.push(JSON.parse(str[i].value));
                }
            }
            console.log(angular.toJson(chestr));
            for(var j=0;j<chestr.length;j++){
                for(var k=0;k<$scope.infos.length;k++){
                    if(chestr[j].id === $scope.infos[k].id){
                        console.log(angular.toJson($scope.infos[k]));
                        $scope.infos.splice(k,1);
                    }
                }
            }
            $scope.deleteShow = true;
            $scope.checkboxDiy = "";
            $scope.showInput = true;
        }
    $scope.phone = function(num){
        Prompter.showphone(num);
    }
}]);


worksheetModule.controller("WorksheetRelatedDeleteCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading){
    $scope.infos = [{
        id : 1,
        name : "往事",
        position : "服务代理商联系人",
        phone : "18298182058"
    },{
        id : 2,
        name : "往事如风",
        position : "服务代理商",
        phone : "18298182053"
    },{
        id : 3,
        name : "走走走",
        position : "负责员工",
        phone : "18298182052"
    }]
    $scope.deleteInfos = function(){
        var str=document.getElementsByName("deleteBox");
        var chestr = new Array();
        for (i=0;i<str.length;i++) {
            if(str[i].checked == true)
            {
                chestr.push(JSON.parse(str[i].value));
            }
        }
        for(var j=0;j<chestr.length;j++){
            for(var k=0;k<$scope.infos.length;k++){
                if(chestr[j].id === $scope.infos[k].id){
                    console.log(angular.toJson($scope.infos[k]));
                    $scope.infos.splice(k,1);
                }
            }
        }
    }
}]);