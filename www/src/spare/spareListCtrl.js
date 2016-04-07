/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['SpareListService','$state','$scope','Prompter','$timeout',function(SpareListService,$state,$scope,Prompter,$timeout){
      $scope.spareList=SpareListService.all();
      $scope.goDetail=function(spare){
          SpareListService.set(spare);
          $state.go('spareDetail');
      };
    $scope.searchFlag=false;
    $scope.isSearch=false;
    $scope.spareInfo="";
    $scope.data=[
        '上盖',
        '六角头'
    ];
    $scope.changePage=function(){
        $scope.searchFlag=true;
        $timeout(function () {
            document.getElementById('spareId').focus();
        }, 1)
    };
    $scope.changeSearch=function(){
        $scope.isSearch=true;
    };
    $scope.initSearch = function () {
        $scope.carInfo = '';
        $timeout(function () {
            document.getElementById('spareId').focus();
        }, 1)
    };
    $scope.cancelSearch=function(){
        $scope.searchFlag=false;
    };
    $scope.search = function (x, e) {
        Prompter.showLoading('正在搜索');
        $timeout(function () {
            Prompter.hideLoading();
            $scope.spareInfo = x;
        }, 800);

        e.stopPropagation();
    };
}
])
.controller('SpareDetailCtrl',['$scope','SpareListService',function($scope,SpareListService){
        $scope.spareList=SpareListService.get();
    }])