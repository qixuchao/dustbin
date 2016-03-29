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
        //$scope.select = true;
        $scope.showTitle = false;
        $scope.titleStatus=false;
        //$scope.changeStatus = function(flag){
        //    $scope.select=flag;
        //};

        var position;
        var maxPosition;
        $scope.onScroll = function(){
            position = $ionicScrollDelegate.getScrollPosition().top;
            if(position>5){
                $scope.TitleFlag = true;
                $scope.showTitle=true;
                if(position>10){
                    $scope.titleFlag = true;
                }else{
                    $scope.titleFlag = false;
                }
                if(position>42){
                    $scope.qualityFlag = true;
                }else{
                    $scope.qualityFlag = false;
                }
                if(position>70){
                    $scope.projectFlag = true;
                }else{
                    $scope.projectFlag = false;
                }
                if(position>100){
                    if(maxPosition===null){
                        maxPosition=$ionicScrollDelegate.getScrollView().__maxScrollTop;
                    }
                    $scope.titleStatus=true;
                }else{
                    $scope.titleStatus=false;
                }
            }else{
                $scope.showTitle=false;
                $scope.TitleFlag = false;
                $scope.titleStatus=false;
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
        $scope.choice=function(num){
            $scope.selectRow=num;
        };
        $scope.List2 = [
            "灾难", "高", "中", "低", "无"
        ];
        var sortDown = function () {
            $(".sort").css("color", "rgba(12,99,238,0.78)");
            $(".sortType").css("color", "rgba(12,99,238,0.78)");
            //$(".sortType").css("color","FF8300");

        };
        var Up = function () {
            $(".sort").css("color", "");
            $(".select").css("color", "");
        };
        var sortUp = function () {
            $(".sort").css("color", "");
        };
        var selectUp = function () {
            $(".select").css("color", "");
            //$(".selectContent").addClass('animated fadeInUp');
        };

        var selectDown = function () {
            $(".select").css("color", "rgba(12,99,238,0.78)");
            $(".selectType").css("color", "rgba(12,99,238,0.78)");
        };
        //设置两个变量，通过值的变化来控制按钮的状态
        $scope.showSort = false;
        $scope.showSelect = false;
        $scope.shadowUp=function(){
                $scope.showSort = false;
                $scope.showSelect = false;
                 Up();
        };
        //实现下拉以及按钮状态的改变
        $scope.changeSort = function (){
            if($scope.showSort){
                $scope.showSort=false;
                sortUp();
                return;
            }
            $scope.showSort = true;
            $scope.showSelect = false;
            sortDown();
            selectUp();

        };
        $scope.changeSelect=function(){
            if($scope.showSelect){
                $scope.showSelect=false;
                selectUp();
                return;
            }
                $scope.showSort=false;
                $scope.showSelect=true;
                selectDown();
                sortUp();
        };
        $scope.reset=function(){
            $('.btType').removeClass('selected');
            $('.btType1').removeClass('selected');
        };
        var i=0;
        $scope.loadMore=function(){
            var carInfo1={
                listType:'现场维修工单'+i,
                maintenanceDate:'2016.01.01 10:00:01-2016.12.31 12:00:00',
                maintenanceDescribe:'车辆电池出现重大问题1'
            };
            i+=1;
            $scope.carInfo.push(carInfo1);

        };
}])

.controller('SpareCtrl',['$scope','CarService',function($scope,CarService){
        $scope.spareList=CarService.getData().spare;
        var i=0;
        $scope.loadMore=function(){
            var spareInfo1={
                spareName:'高压箱-BD3'+i,
                spareNum:'17240-0026',
                count:'7',
                qualityTime:'CATL两年质保',
                qualityDate:'2016.01.01-2018.01.01'
            };
            i+=1;
            $scope.spareList.push(spareInfo1);
        };
}])
.controller('SearchCtrl',['$scope',function(){

    }])