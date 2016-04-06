
worksheetModule.controller("WorksheetSparepartCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state){
    ionicMaterialInk.displayEffect();
        $scope.infos = [{
          name : "400A高压熔断器",
            code : 13099,
            num  : 1,
            selectNum : 0
        },{
            name : "msd上盖",
            code : 13099,
            num  : 1,
            selectNum : 0
        },{
            name : "六角头",
            code : 13099,
            num  : 1,
            selectNum : 0
        },]
        $scope.add = function(item){
            item.selectNum += 1;
            console.log(angular.toJson($scope.infos));
        }
        $scope.reduce = function(item){
            if(item.selectNum > 0){
                item.selectNum -= 1;
            }
            console.log(angular.toJson($scope.infos));
        }
        $scope.ngBlur = function(){
            console.log(angular.toJson($scope.infos));
        }
        $scope.keep = function (){
            $state.go("worksheetSelect");
        };
}]);
worksheetModule.controller("WorksheetPareSelectCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout", function($scope, ionicMaterialInk){
        ionicMaterialInk.displayEffect();
        $scope.upDown = true;
        $scope.showDetail = function(items) {
            var a = items.flag;
            items.flag = !a;
            console.log(flag);
        }
        $scope.showDetailInfos = false;
        $scope.spareDetail = [{
            name : "客服/售后服务仓-备件中心-北京",
            flag : "true",
            detail : [{
                nameDetais : "MSD上盖（CATL）",
                code : "13132-3132",
                sqq : 30,
                yfq : 20,
                yhq : 10,
                jjq : 20,
                remark : "由于库存不足，暂时发20个"
            },
            {
                nameDetais : "MSD上盖（CATL）",
                code : "13132-3132",
                sqq : 30,
                yfq : 20,
                yhq : 10,
                jjq : 20,
                remark : "由于库存不足，暂时发20个"
            }]
        },
            {
                name : "客服/售后服务仓-备件中心-上海",
                flag : "true",
                detail : [{
                    nameDetais : "六头（CATL）",
                    code : "13132-3132",
                    sqq : 10,
                    yfq : 10,
                    yhq : 10,
                    jjq : 10,
                    remark : "由于库存不足，暂时发20个"
                },
                    {
                        nameDetais : "木箱（CATL）",
                        code : "13132-3132",
                        sqq : 30,
                        yfq : 20,
                        yhq : 10,
                        jjq : 20,
                        remark : "由于库存不足，暂时发20个"
                    }]
            },
            {
                name : "客服/售后服务仓-备件中心-上海",
                flag : "true",
                detail : [{
                    nameDetais : "六头（CATL）",
                    code : "13132-3132",
                    sqq : 10,
                    yfq : 10,
                    yhq : 10,
                    jjq : 10,
                    remark : "由于库存不足，暂时发20个"
                },
                    {
                        nameDetais : "木箱（CATL）",
                        code : "13132-3132",
                        sqq : 30,
                        yfq : 20,
                        yhq : 10,
                        jjq : 20,
                        remark : "由于库存不足，暂时发20个"
                    }]
            }];
    }]);