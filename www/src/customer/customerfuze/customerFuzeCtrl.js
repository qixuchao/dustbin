
/**
 * Created by Administrator on 2016/4/16 0016.
 */
/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
customerContactsModule
    .controller('customerFuzeCtrl',['$scope',function($scope){

    }]);
        //['$scope','$rootScope','$state','$http','HttpAppService','$cordovaToast','$timeout','$ionicPopover','$ionicScrollDelegate','ionicMaterialInk','customeService','contactService','$ionicLoading',
        //function($scope,$rootScope,$state,$http,HttpAppService,$cordovaToast,$timeout,$ionicPopover,$ionicScrollDelegate,ionicMaterialInk,customeService,contactService,$ionicLoading)
        //$ionicPopover.fromTemplateUrl('src/customer/model/customercontact_selec.html', {
        //    scope: $scope
        //}).then(function(popover) {
        //    $scope.customerContactspopover = popover;
        //});
        //$scope.customerContactsopenpopv = function() {
        //    $scope.customerContactspopover.show();
        //};
        //$scope.customerContactsPopoverhide = function() {
        //    $scope.customerContactspopover.hide();
        //};
        ////alert(1)
        ////调用接口数据
        ////获取数据列表函数
        //$scope.customercontactisshow = true;
        //$scope.customerContacts_query_list = new Array();
        //$scope.customerContacts_query_list = [];
        //$scope.customercontactPage = 0;
        //$scope.customercontactLoadmore = function(){
        //    //$scope.customercontactisshow = true;
        //    $scope.customercontactPage = $scope.customercontactPage + 1;
        //    var url = ROOTCONFIG.hempConfig.basePath + 'CONTACT_LIST';
        //    var data = {
        //        "I_SYSNAME": { "SysName": ROOTCONFIG.hempConfig.baseEnvironment },
        //        "IS_AUTHORITY": { "BNAME": "HANDLCX02" },
        //        "IS_PAGE": {
        //            "CURRPAGE": "1",
        //            "ITEMS": "100"
        //        },
        //        "IS_PARTNER": { "PARTNER": customeService.get_customerWorkordervalue().PARTNER},
        //        "IS_SEARCH": { "SEARCH": "" }
        //    };
        //    HttpAppService.post(url, data).success(function (response) {
        //        if (response.ES_RESULT.ZFLAG == 'E') {
        //            $scope.customercontactisshow = false;
        //            $cordovaToast.showShortCenter('无符合条件数据');
        //        } else {
        //            if (response.ES_RESULT.ZFLAG == 'S') {
        //                if(response.ET_EMPLOYEE != ''){
        //                    if (response.ET_OUT_LIST.item.length == 0) {
        //                        $scope.customercontactisshow = false;
        //                        Prompter.hideLoading();
        //                        if ($scope.customercontactPage == 1) {
        //                            $cordovaToast.showShortBottom('数据为空');
        //                        } else {
        //                            $cordovaToast.showShortBottom('没有更多数据');
        //                        }
        //                        $scope.$broadcast('scroll.infiniteScrollComplete');
        //                    } else {
        //                        $.each(response.ET_OUT_LIST.item, function (n, value) {
        //                            $scope.customerContacts_query_list.push(value);
        //                        });
        //                    }
        //                    if (response.ET_OUT_LIST.item.length < 10) {
        //                        $scope.customercontactisshow = false;
        //                        if ($scope.customercontactPage > 1) {
        //                            //console.log("没有更多数据了");
        //                            $cordovaToast.showShortBottom('没有更多数据');
        //                        }
        //                    } else {
        //                        $scope.customercontactisshow = true;
        //                    }
        //                    $scope.$broadcast('scroll.infiniteScrollComplete');
        //                }else{
        //                    $cordovaToast.showShortBottom('查询数据为空');
        //                }
        //
        //            }
        //        }
        //    }).error(function (response, status) {
        //        $cordovaToast.showShortBottom('请检查你的网络设备');
        //        $scope.customercontactisshow = false;
        //    });
        //}
        //
        //$scope.customerContacts_godetails = function(x){
        //    customeService.set_customerContactsListvalue(x);
        //    $state.go('customerContactDetail');
        //};
        //
        ////创建联系人
        //$scope.customercontact_types = [
        //    {
        //        type:"扫描名片创建联系人",
        //        url:""
        //    },
        //    {
        //        type:"手动创建新联系人",
        //        url:'ContactCreate'
        //    }
        //];
        //$scope.customerContactsqueryType = function(types){
        //    console.log(types)
        //    if(types.url){
        //        $state.go(types.url);
        //        //从客户联系人进入创建联系人界面设置一个标记
        //        if(types.type == "手动创建新联系人"){
        //            contactService.set_ContactCreateflagfalse();
        //        }
        //    }
        //    $scope.customerContactsPopoverhide();
        //};
        ////接收广播创建取数据contactService.get_ContactsListvalue()
        ////$rootScope.$on('customercontactCreatevalue', function(event, data) {
        ////    console.log(contactService.get_ContactCreatevalue())
        ////});
        //$scope.customercontactsgoDetail =function(cmvalue){
        //    contactService.set_ContactsListvalue(cmvalue);
        //    $state.go('ContactDetail')
        //}



