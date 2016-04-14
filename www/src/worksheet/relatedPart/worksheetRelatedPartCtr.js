
worksheetModule.controller("WorksheetRelatedCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','Prompter','worksheetDataService','worksheetHttpService','$rootScope','HttpAppService',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,Prompter,worksheetDataService,worksheetHttpService,$rootScope,HttpAppService){
    $ionicPopover.fromTemplateUrl('src/worksheet/relatedPart/worksheetRelate_select.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.relatedpopover = popover;
        });
        var  worksheetDetailData = worksheetDataService.wsDetailData;
        $scope.infos = worksheetDataService.wsDetailData.ET_PARTNER.item;
        console.log(angular.toJson(worksheetDataService.wsDetailData));
        $scope.relatedPopoverShow = function() {
            $scope.relatedpopover.show();
            //document.getElementsByClassName('popover-arrow')[0].addClassName ="popover-arrow";
        };
        $scope.relatedPopoverhide = function() {
            $scope.relatedpopover.hide();
            //document.getElementsByClassName('popover-arrow')[0].removeClass ="popover-arrow";
        };
        $scope.related_types = ['联系人','服务商'];
        $scope.relatedqueryType = function(types){
            console.log(types);
            if(types === "联系人"){
                $state.go("worksheetRelatedPartContact");
            }else if(types === "服务商"){
                $state.go("worksheetRelatedPartCust");
            }

            $scope.relatedPopoverhide();
        };

        $scope.title = "相关方列表";
        $rootScope.$on('worksheetRelatePartItem', function(event,msg) {
            if(msg!==undefined){
                $scope.infos.push({
                    id : msg.id,
                    name : msg.NAME_LAST,
                    position : msg.position,
                    phone : msg.TEL_NUMBER
                });
            }
            console.log('' + angular.toJson(msg));
        });

        $scope.deleteInfos = function(item){
            if(item.PARTNER_FCT !== "ZCUSTCTT" ){
                Prompter.deleteInfosPoint(item.FCT_DESCRIPTION + "不允许删除");
            }else{
                Prompter.showLoading();
                var data={
                    "I_SYSTEM": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                    "IS_AUTHORITY": { "BNAME": worksheetDetailData.ES_OUT_LIST.CREATED_BY },
                    "IS_OBJECT_ID": worksheetDetailData.ydWorksheetNum,
                    "IS_PROCESS_TYPE": worksheetDetailData.IS_PROCESS_TYPE,
                    "IT_PARTNER": {
                        "item": [
                            {
                                "PARTNER_FCT":item.PARTNER_FCT,
                                "PARTNER_NO":item.PARTNER_NO,
                                "ZMODE" : "D"
                            }
                        ]
                    }};
                console.log(angular.toJson(data));
                var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
                HttpAppService.post(url, data).success(function(response){
                    Prompter.hideLoading();
                    Prompter.deleteInfosPoint(response.ZRESULT);
                    for(var k=0;k<$scope.infos.length;k++){
                        if(item.PARTNER_NO === $scope.infos[k].PARTNER_NO){
                            console.log(angular.toJson($scope.infos[k]));
                            $scope.infos.splice(k,1);
                        }
                    }
                    console.log(angular.toJson(response));
                }).error(function(err){
                    console.log(angular.toJson(err));
                });
            }
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

worksheetModule.controller("WorksheetRelatedContactCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','worksheetHttpService','$rootScope',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,worksheetHttpService,$rootScope){
    //CONTACT_LIST接口
    //{
//    "I_SYSNAME": { "SysName": "ATL" },
//    "IS_AUTHORITY": { "BNAME": "" },
//    "IS_PAGE": {
//        "CURRPAGE": "1",
//            "ITEMS": "10"
//    },
//    "IS_PARTNER": { "PARTNER": "" },
//    "IS_SEARCH": { "SEARCH": "" }
//}
    $scope.contact_query_list = [{
        id : 4,
        position : 'haohao上学',
        NAME_LAST : "asdads",
        TEL_NUMBER : "18298182051"
    },{
        id : 5,
        position : 'haohao上学',
        NAME_LAST : "asdads",
        TEL_NUMBER : "18298182052"
    }]
    $scope.gorelatePart = function(item){
        console.log(angular.toJson(item));
        $rootScope.$broadcast("worksheetRelatePartItem", item);
        $state.go("worksheetRelatedPart");
    }
}]);



worksheetModule.controller("WorksheetRelatedCustCtrl",['$scope','$state','$http','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','$ionicLoading','worksheetHttpService','$rootScope',function($scope,$state,$http,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,$ionicLoading,worksheetHttpService,$rootScope){
    $scope.contact_query_list = [{
        id : 6,
        position : 'haohao上学',
        NAME_LAST : "asdads",
        TEL_NUMBER : "18298182051"
    },{
        id : 7,
        position : 'haohao上学',
        NAME_LAST : "asdads",
        TEL_NUMBER : "18298182052"
    }]

    $scope.gorelatePart = function(item){
        $rootScope.$broadcast("worksheetRelatePartItem", item);
        $state.go("worksheetRelatedPart");
    }
}]);