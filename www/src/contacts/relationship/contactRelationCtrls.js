/**
 * Created by gongke on 2016/4/10.
 */
ContactsRelationModule
    .controller('contactRelationshipCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){

        $scope.contact_relationship = new Array();
        if(contactService.get_ContactsListvalue() != undefined){
            $scope.contactRelationname = contactService.get_ContactsListvalue().NAME_LAST;
        }
        if(contactService.get_ContactsdeaRelationval() != undefined){
            $scope.contact_relationship = contactService.get_ContactsdeaRelationval();
        }

    }])