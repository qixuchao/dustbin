
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
        ////���ýӿ�����
        ////��ȡ�����б���
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
        //            $cordovaToast.showShortCenter('�޷�����������');
        //        } else {
        //            if (response.ES_RESULT.ZFLAG == 'S') {
        //                if(response.ET_EMPLOYEE != ''){
        //                    if (response.ET_OUT_LIST.item.length == 0) {
        //                        $scope.customercontactisshow = false;
        //                        Prompter.hideLoading();
        //                        if ($scope.customercontactPage == 1) {
        //                            $cordovaToast.showShortBottom('����Ϊ��');
        //                        } else {
        //                            $cordovaToast.showShortBottom('û�и�������');
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
        //                            //console.log("û�и���������");
        //                            $cordovaToast.showShortBottom('û�и�������');
        //                        }
        //                    } else {
        //                        $scope.customercontactisshow = true;
        //                    }
        //                    $scope.$broadcast('scroll.infiniteScrollComplete');
        //                }else{
        //                    $cordovaToast.showShortBottom('��ѯ����Ϊ��');
        //                }
        //
        //            }
        //        }
        //    }).error(function (response, status) {
        //        $cordovaToast.showShortBottom('������������豸');
        //        $scope.customercontactisshow = false;
        //    });
        //}
        //
        //$scope.customerContacts_godetails = function(x){
        //    customeService.set_customerContactsListvalue(x);
        //    $state.go('customerContactDetail');
        //};
        //
        ////������ϵ��
        //$scope.customercontact_types = [
        //    {
        //        type:"ɨ����Ƭ������ϵ��",
        //        url:""
        //    },
        //    {
        //        type:"�ֶ���������ϵ��",
        //        url:'ContactCreate'
        //    }
        //];
        //$scope.customerContactsqueryType = function(types){
        //    console.log(types)
        //    if(types.url){
        //        $state.go(types.url);
        //        //�ӿͻ���ϵ�˽��봴����ϵ�˽�������һ�����
        //        if(types.type == "�ֶ���������ϵ��"){
        //            contactService.set_ContactCreateflagfalse();
        //        }
        //    }
        //    $scope.customerContactsPopoverhide();
        //};
        ////���չ㲥����ȡ����contactService.get_ContactsListvalue()
        ////$rootScope.$on('customercontactCreatevalue', function(event, data) {
        ////    console.log(contactService.get_ContactCreatevalue())
        ////});
        //$scope.customercontactsgoDetail =function(cmvalue){
        //    contactService.set_ContactsListvalue(cmvalue);
        //    $state.go('ContactDetail')
        //}



