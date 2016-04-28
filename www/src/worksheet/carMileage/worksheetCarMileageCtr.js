
worksheetModule.controller("WorksheetCarMileageCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService","$cordovaToast",'worksheetHttpService', function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,$cordovaToast,worksheetHttpService){
        $scope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParam){
            if(fromState.name == 'worksheetCarMileageEdit' && toState.name == 'worksheetCarMileage'){
                var getconfig = worksheetHttpService.getWSCarMileage();
                init(getconfig.nowPage);
            }
        });
        ionicMaterialInk.displayEffect();
        $scope.edit = function(){
            worksheetHttpService.setWSCarMileage($scope.config);
            $state.go("worksheetCarMileageEdit");
        }
       var init = function(info){
           var worksheetDetail = worksheetDataService.wsDetailData;
           if(worksheetDataService.wsDetailData.ET_MILEAGE.item == undefined){
               //$cordovaToast.showShortBottom('暂无车辆读数信息');
               $scope.carMile = '';
               $scope.nomore = true;
           }else{
               $scope.nomore = false;
               $scope.config = {
                   num : worksheetDetail.ET_MILEAGE.item.length,//总页数
                   nowPage : info,//当前页,
               }
               $scope.carMile = worksheetDetail.ET_MILEAGE.item[info-1];
           }
           if($scope.carMile.MILEAGE_VALUE == ""){
               $scope.dateCar = ""
           }else{
               $scope.dateCar = $scope.carMile.MILEAGE_DATE;
           }
           if($scope.carMile.MILEAGE_VALUE == "" && $scope.carMile.MILEAGE_DESC == ""){
               $scope.carEdit = true;
           }else{
              $scope.carEdit = false;
           }
       }
        var no =1;
        init(no);
        //$scope.carEdit = true;
        $scope.downPage = function(){
            if($scope.config.nowPage >= $scope.config.num){
                $cordovaToast.showShortBottom("已是最后一页");
            }else{
                $scope.config.nowPage += 1;
                $scope.carMile = worksheetDataService.wsDetailData.ET_MILEAGE.item[$scope.config.nowPage-1];
                init($scope.config.nowPage);
            }
        };
        $scope.upPage = function(){
            if($scope.config.nowPage == 1){
                $cordovaToast.showShortBottom("已是第一 页");
            }else{
                $scope.config.nowPage -= 1;
                $scope.carMile = worksheetDataService.wsDetailData.ET_MILEAGE.item[$scope.config.nowPage-1];
                init($scope.config.nowPage);
            }
        };
}]);

worksheetModule.controller("WorksheetCarMileageEditCtrl",["$scope",
    "ionicMaterialInk",
    "ionicMaterialMotion",
    "$ionicPopup", "$timeout","$state","worksheetDataService",'HttpAppService','Prompter','$cordovaToast','$cordovaDatePicker','worksheetHttpService', function($scope, ionicMaterialInk,ionicMaterialMotion,$ionicPopup,$timeout,$state,worksheetDataService,HttpAppService,Prompter,$cordovaToast,$cordovaDatePicker,worksheetHttpService){
        ionicMaterialInk.displayEffect();
        $scope.goAlert = function(){
            Prompter.ContactCreateCancelvalue();
        }
        $scope.numMore = function(item){
            if(item.length == 40){
                $cordovaToast.showShortBottom("您输入备注字数已达到40字");
            }
        }
        $scope.inputchange = function(item){
            if(item.length == 16){
                $cordovaToast.showShortBottom("您输入本次记录读数已达到16字");
            }
        }
        var worksheetDetail = worksheetDataService.wsDetailData;
        var config = worksheetHttpService.getWSCarMileage();
        //$scope.carMile = worksheetDetail.ET_MILEAGE && worksheetDetail.ET_MILEAGE.item && worksheetDetail.ET_MILEAGE.item.length ? worksheetDetail.ET_MILEAGE.item[config.nowPage-1] : {};
        $scope.carMile = worksheetDetail.ET_MILEAGE.item[config.nowPage-1];
        $scope.update = {
            readDate : $scope.carMile.MILEAGE_DATE,
            readValue : $scope.carMile.MILEAGE_VALUE,
            readDescription : $scope.carMile.MILEAGE_DESC
        };

        $scope.keep = function() {
            if($scope.update.readValue === ""){
                $cordovaToast.showShortBottom("请输入本次记录读数");
                return;
            }
            Prompter.showLoading("正在提交");
            var data = {
                "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                "IS_OBJECT_ID": worksheetDetail.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDetail.IS_PROCESS_TYPE,
                "IT_MILEAGE": {
                    "item": [
                        {   "GUID"  : $scope.carMile.GUID,
                            "MILEAGE_VALUE": $scope.update.readValue,
                            "MILEAGE_DATE": $scope.update.readDate,
                            "MILEAGE_DESC": $scope.update.readDescription
                        }
                    ]
                }
            };
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_CHANGE';
            HttpAppService.post(url, data).success(function (response) {
                if (response.ES_RESULT.ZFLAG === 'S') {
                    $scope.updateInfos();
                    $cordovaToast.showShortBottom("修改成功");
                } else {
                    Prompter.hideLoading();
                    $cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                }
            }).error(function (err) {
                Prompter.hideLoading();
            });
        }
        //
        ////选择时间
        //$scope.selectCreateTimecar = function (title) {
        //    var date = new Date().format('yyyy/MM/dd');
        //    alert(data);
        //    $cordovaDatePicker.show({
        //        date: date,
        //        allowOldDates: true,
        //        allowFutureDates: true,
        //        mode: 'date',
        //        titleText: title,
        //        okText: '确定',               //android
        //        cancelText: '取消',           //android
        //        doneButtonLabel: '确认',      // ios
        //        cancelButtonLabel: '取消',    //ios
        //        todayText: '今天',            //android
        //        nowText: '现在',              //android
        //        is24Hour: true,              //android
        //        androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
        //        popoverArrowDirection: 'UP',
        //        locale: 'zh_cn'
        //        //locale: 'en_us'
        //    }).then(function (returnDate) {
        //        alert(data);
        //        var time = returnDate.format("yyyyMMdd"); //__getFormatTime(returnDate);
        //        $scope.update.readDate = time;
        //        alert(time);
        //        if(!$scope.$$phrese){
        //            $scope.$apply();
        //        }
        //    });
        //};
        $scope.pickDate = function (type) {
            if (device.platform === 'android' || device.platform === 'Android') {
                $scope.androidPickDate(type);
            } else {
                $scope.iosPickDate(type);
            }
        };
        $scope.iosPickDate = function (type) {
            var dateTime = "";
            var options = {
                date: new Date(),
                mode: 'date'
            };
            datePicker.show(options, function (date) {
                dateTime = date.format('yyyyMMdd ');
                $scope.inputDatePicker(type, dateTime);
            });
        };
        $scope.androidPickDate = function (type) {
            var pickDate = "";
            var options1 = {
                date: new Date(),
                mode: 'date'
            };
            datePicker.show(options1, function (date) {
                pickDate = date.format('yyyyMMdd');
                $scope.inputDatePicker(type, pickDate);
            });
        };
        //根据INPUT里面的参数赋值
        $scope.inputDatePicker = function (type, dateTime) {

            if ("instart" === type) {
                $scope.update.readDate = dateTime;
            }
            if ("inend" === type) {
                $scope.dateEnd = dateTime;
            }

                    if(!$scope.$$phrese){
                        $scope.$apply();
                    }
        };
        //数据刷新
        $scope.updateInfos = function(){
            var data = {
                "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
                "IS_AUTHORITY": { "BNAME": window.localStorage.crmUserName },
                "IS_OBJECT_ID":worksheetDataService.wsDetailData.ydWorksheetNum,
                "IS_PROCESS_TYPE": worksheetDataService.wsDetailData.IS_PROCESS_TYPE
            }
            var url = ROOTCONFIG.hempConfig.basePath + 'SERVICE_DETAIL';
            var id = worksheetDataService.wsDetailData.ydWorksheetNum;
            var wf = worksheetDataService.wsDetailData.waifuRenyuan;
            var name = worksheetDataService.wsDetailData.IS_PROCESS_TYPE;
            HttpAppService.post(url, data).success(function(response){
                if (response.ES_RESULT.ZFLAG === 'S') {
                    worksheetDataService.wsDetailData = response;
                    worksheetDataService.wsDetailData.ydWorksheetNum = id;
                    worksheetDataService.wsDetailData.waifuRenyuan = wf;
                    worksheetDataService.wsDetailData.IS_PROCESS_TYPE = name;
                    $state.go("worksheetCarMileage");
                }else{

                }
                Prompter.hideLoading();
            }).error(function(err){
                Prompter.hideLoading();
            });
        }
    }]);