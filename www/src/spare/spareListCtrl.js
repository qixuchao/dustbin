/**
 * Created by Administrator on 2016/3/22 0022.
 */
spareModule.controller('SpareListCtrl',['HttpAppService','$http','SpareListService','$state','$scope','Prompter','$timeout',function (HttpAppService,$http,SpareListService,$state,$scope,Prompter,$timeout){

    $scope.spareList=[];

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
        $scope.spareInfo = '';
        $timeout(function () {
            document.getElementById('spareId').focus();
        }, 1)
    };
    $scope.cancelSearch=function(){
        $scope.searchFlag=false;

    };
    var page=1;
    var sparelist=function(){
        //var url="http://192.168.191.1:8080/battery/api/CRMAPP/PRODUCT_LIST";
        var url="http://117.28.248.23:9388/test/api/CRMAPP/PRODUCT_LIST";
        var data = {
            "I_SYSNAME": { "SysName": "ATL" },
            "IS_PAGE": {
                "CURRPAGE": page,
                "ITEMS": "10"
            },
            "IS_PRODMAS_INPUT": { "SHORT_TEXT": "" }
        };
        HttpAppService.post(url,data).success(function(response){
            var num=response.ET_PRODMAS_OUTPUT.item.length;
            console.log(num);
            for(var i=0;i<num;i++){
                var spare={
                    spareId:"",
                    spareName:""
                };
                spare.spareId=response.ET_PRODMAS_OUTPUT.item[i].PRODUCT_ID;
                spare.spareName=response.ET_PRODMAS_OUTPUT.item[i].SHORT_TEXT;
                $scope.spareList.push(spare);
            }
        });
    };
    sparelist();
    Prompter.showLoading('正在加载');
    $timeout(function () {
        Prompter.hideLoading();
    }, 1000);
    //下拉刷新
    $scope.doRefresh=function(){
        page+=1;
        sparelist();
        $timeout(function(){
            $scope.$broadcast('scroll.refreshComplete');
        },1000)
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
    }]);