/**
 * Created by Administrator on 2016/3/14 0014.
 */
carModule.controller('CarCtrl',['$scope','CarService','$timeout','$state',function($scope,CarService,$timeout,$state){
    $scope.cars=CarService.all();
    var data={
        describe:'贵GU1229*15H647M-0001*',
        number:'',
        projectName:'',
        productionDate:'',
        version:''
    };
    $scope.doRefresh=function(){
        $timeout(function(){
            $scope.cars.push(data);
            $scope.$broadcast('scroll.refreshComplete');
        },1000)
    };
    $scope.goSkip=function(pageName){
        $state.go(pageName);
    }
    $scope.goDetail=function(car){
        CarService.setData(car);
        $scope.goSkip('carDetail');
    }
}
])
.controller('CarDetailCtrl',['$scope','$state','CarService','$ionicHistory','$ionicScrollDelegate','ionicMaterialInk','ionicMaterialMotion','$timeout',
        function($scope,$state,CarService,$ionicHistory,$ionicScrollDelegate,ionicMaterialInk,ionicMaterialMotion,$timeout){
        ionicMaterialInk.displayEffect();
        $scope.select = true;
        $scope.showTitle = false;
        $scope.showTitleStatus = false;
        $scope.changeStatus = function(flag){
            $scope.select=flag;
        };

        var position;
        $scope.onScroll = function(){
            position = $ionicScrollDelegate.getScrollPosition().top;
            if(position>10){
                $('#sdTitleId').removeClass('fadeOut');
                $('#sdTitleId').addClass('animated fadeIn');
                $scope.TitleFlag = true;
                $scope.showTitle=true;
                if(position>16){
                    $scope.qualityFlag = true;
                }else{
                    $scope.qualityFlag = false;
                }
                if(position>54){
                    $scope.projectFlag = true;
                }else{
                    $scope.projectFlag = false;
                }
                if(position>60){
                    $scope.showTitleStatus = true;
                }else{
                    $scope.showTitleStatus = false;
                }
            }else{
                $('#sdTitleId').removeClass('fadeIn');
                $('#sdTitleId').addClass('fadeOut');
                $scope.showTitle=false;
                $scope.TitleFlag = false;
            }
            $scope.$apply();
        };
        $scope.carInfo=CarService.getData();
        //console.log($scope.cars.describe)
        $scope.projectName="CATL项目名称:";
        $scope.goSkip=function(pageName){
            $state.go(pageName);
        }
}
])

.controller('MaintenanceCtrl',['$scope','$timeout','CarService',function($scope,$timeout,CarService) {
        $scope.carInfo = CarService.getData().maintenance;
        $scope.List = [
            "开始时间倒序", "开始时间顺序", "影响程度由高到低"
        ];
        $scope.List1 = [
            "现场维修工单", "批量改进工单", "新车上线工单"
        ];
        $scope.clicked=function(row){
            $scope.selectedRow=row;
        };
        $scope.clicked1=function(row){
            $scope.selectedRow1=row;
        };
        //$scope.color1=false;
        //$scope.color2=false;
        //$scope.color3=false;
        //$scope.clicked= function (num) {
        //    console.log(num);
        //    $scope.color1=false;
        //    $scope.color2=false;
        //    $scope.color3=false;
        //    switch (num) {
        //        case 1:
        //            $(".btType").css("background-color","yellow");
        //            break;
        //        case 2:
        //            $scope.color2=true;
        //            break;
        //        case 3:
        //            $scope.color1=true;
        //    }
        //};
        $scope.List2 = [
            "灾难", "高", "中", "低", "无"
        ];
        var sortDown = function () {
            $(".sort").css("color", "rgba(12,99,238,0.78)");
            $(".sortType").css("color", "rgba(12,99,238,0.78)");
            //$(".sortType").css("color","FF8300");

        };
        var sortUp = function () {
            $(".sort").css("color", "black");
            $(".sortType").css("color", "black");
            //$(".sortType").css("color","FF8300");
        };
        var selectUp = function () {
            $(".select").css("color", "black");
            $(".selectType").css("color", "black");
        };
        var selectDown = function () {
            $(".select").css("color", "rgba(12,99,238,0.78)");
            $(".selectType").css("color", "rgba(12,99,238,0.78)");
        };
        var count1 = 0;
        var count2 = 0;
        //设置两个变量，通过值的变化来控制按钮的状态
        $scope.showSort = false;
        $scope.showSelect = false;
        $scope.shadowUp=function(type){
            if(type==='sort'){
                count1+=1;
                $scope.showSort = false;
                $scope.showSelect = false;
            }
            count2+=1;
            $scope.showSort = false;
            $scope.showSelect = false;
        };
        //实现下拉以及按钮状态的改变
        $scope.changeSort = function (){
        if (count1 % 2 === 0) {
            if ($scope.showSort === false && $scope.showSelect === false) {
                $scope.showSort = true;
                sortDown();
            } else if ($scope.showSort === false && $scope.showSelect === true) {
                $scope.showSort = true;
                $scope.showSelect = false;
                selectUp();
            } else {
                $scope.showSort = true;
            }
        } else {
            sortUp();
            $scope.showSort = false;
        }
            count1+=1;
    };
        $scope.changeSelect=function(){
            if(count2%2===0){
                if($scope.showSort===false&&$scope.showSelect===false){
                    $scope.showSelect=true;
                    selectDown();
                }else if($scope.showSort===true&&$scope.showSelect===false){
                    $scope.showSort=false;
                    $scope.showSelect=true;
                    sortUp();
                }else{
                    $scope.showSelect=true;
                }
            }else{
                selectUp();
                $scope.showSelect=false;
            }
            count2+=1;
        };

}])

.controller('SpareCtrl',['$scope','CarService',function($scope,CarService){
     $scope.spareList=CarService.getData().spare;
}])
.controller('SearchCtrl',['$scope',function(){

    }])