
worksheetModule.controller("WorksheetCarMileageCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService", function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService){
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            //if(fromState.name == 'worksheetCarMileageEdit' && toState.name == 'worksheetCarMileage'){
            var worksheetDetail = worksheetDataService.wsDetailData;
            console.log(angular.toJson(worksheetDetail));
            $scope.carMile = worksheetDetail.ET_MILEAGE.item[0];
            console.log(angular.toJson($scope.carMile));
            //}
        });
        ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            $state.go("worksheetCarMileageEdit");
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        console.log(angular.toJson(worksheetDetail));
        $scope.carMile = worksheetDetail.ET_MILEAGE.item[0];
        console.log(angular.toJson($scope.carMile));
        if($scope.carMile.MILEAGE_DATE === "" && $scope.carMile.MILEAGE_VALUE === "" && $scope.carMile.MILEAGE_DESC === ""){
            $scope.carEdit = true;
        }else{
            $scope.carEdit = false;
        }
}]);

worksheetModule.controller("WorksheetCarMileageEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService",'HttpAppService','Prompter','$cordovaToast','$cordovaDatePicker', function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,HttpAppService,Prompter,$cordovaToast,$cordovaDatePicker){
        ionicMaterialInk.displayEffect();
        $scope.goAlert = function(){
            Prompter.ContactCreateCancelvalue();
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        $scope.carMile = worksheetDetail.ET_MILEAGE.item[0];
        console.log(angular.toJson($scope.carMile));
        $scope.update = {
            readDate : $scope.carMile.MILEAGE_DATE,
            readValue : $scope.carMile.MILEAGE_VALUE,
            readDescription : $scope.carMile.MILEAGE_DESC
        };

        $scope.keep = function() {
            console.log(angular.toJson($scope.update));
            if ($scope.update.readDate === "" && $scope.update.readValue === "" && $scope.update.readDescription === "") {
                $cordovaToast.showShortBottom("您没有修改任何数据");
            } else {
                Prompter.showLoading("正在提交");
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_AUTHORITY": {"BNAME": worksheetDetail.ES_OUT_LIST.CREATED_BY},
                    "IS_OBJECT_ID": worksheetDetail.ydWorksheetNum,
                    "IS_PROCESS_TYPE": worksheetDetail.IS_PROCESS_TYPE,
                    "IT_MILEAGE": {
                        "item": [
                            {
                                "MILEAGE_VALUE": $scope.update.readValue,
                                "MILEAGE_DATE": $scope.update.readDate,
                                "MILEAGE_DESC": $scope.update.readDescription
                            }
                        ]
                    }
                };
                console.log(angular.toJson(data));
                var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
                HttpAppService.post(url, data).success(function (response) {
                    console.log(angular.toJson(response));
                    if (response.ES_RESULT.ZFLAG === 'S') {
                        $scope.updateInfos();
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    } else {
                        Prompter.hideLoading();
                        $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                    }
                }).error(function (err) {
                    Prompter.hideLoading();
                    console.log(angular.toJson(err));
                });
            }
        }

        //选择时间
        $scope.selectCreateTime = function (title) {
            var date = new Date().format('yyyy/MM/dd hh:mm:ss');;
            console.log(date);
            $cordovaDatePicker.show({
                date: date,
                mode: 'datetime',
                titleText: title,
                okText: '确定',
                cancelText: '取消',
                doneButtonLabel: '确认',
                cancelButtonLabel: '取消',
                locale: 'zh_cn'
            }).then(function (returnDate) {
                var time = returnDate.format("yyyy-MM-dd hh:mm:ss"); //__getFormatTime(returnDate);
                $scope.update.readDate = time;
                if(!$scope.$$phrese){
                    $scope.$apply();
                }
            });
        };
        //数据刷新
        $scope.updateInfos = function(){
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": worksheetDataService.wsDetailData.ES_OUT_LIST.CREATED_BY },
                "IS_OBJECT_ID":worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE
            }
            console.log(angular.toJson(data));
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL';
            var id = worksheetDataService.wsDetailData.ydWorksheetNum;
            var wf = worksheetDataService.wsDetailData.waifuRenyuan;
            var name = worksheetDataService.wsDetailData.IS_PROCESS_TYPE;
            HttpAppService.post(url, data).success(function(response){
                //console.log(angular.toJson(response));
                if (response.ES_RESULT.ZFLAG === 'S') {
                    worksheetDataService.wsDetailData = response;
                    worksheetDataService.wsDetailData.ydWorksheetNum = id;
                    worksheetDataService.wsDetailData.waifuRenyuan = wf;
                    worksheetDataService.wsDetailData.IS_PROCESS_TYPE = name;
                    console.log(angular.toJson(response));
                }else{

                }
                Prompter.hideLoading();
            }).error(function(err){
                Prompter.hideLoading();
                console.log(angular.toJson(err));
            });
        }
    }]);