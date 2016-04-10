/**
 * Created by gongke on 2016/4/10.
 */
ContactsRelationModule
    .controller('contactRelationshipCtrl',['$scope','$rootScope','$state','Prompter','$ionicLoading','$ionicScrollDelegate','$ionicPopup','ionicMaterialInk','contactService','$window','$ionicActionSheet',function($scope,$rootScope,$state,Prompter,$ionicLoading,$ionicScrollDelegate,$ionicPopup,ionicMaterialInk,contactService,$window,$ionicActionSheet){
        $scope.contactRelationname = contactService.get_ContactsListvalue().NAME_LAST;

        $scope.contact_relationship = contactService.get_ContactsdeaRelationval();
    }])