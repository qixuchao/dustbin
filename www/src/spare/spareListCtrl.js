/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['SpareListService','$state','$scope',function(SpareListService,$state,$scope){
      $scope.spareList=SpareListService.all();
      $scope.goDetail=function(spare){
          SpareListService.set(spare);
          $state.go('spareDetail');
      }
}
])
.controller('SpareDetailCtrl',['$scope','SpareListService',function($scope,SpareListService){
        $scope.spareList=SpareListService.get();
    }])