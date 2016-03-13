/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', ['$scope', 'ionicMaterialInk', function ($scope, ionicMaterialInk) {

        console.log('main')
        ionicMaterialInk.displayEffect();
        /*--------------------------------------------日历--------------------------------------------*/
        //判断是否是闰年,2月平年28天、闰年29天
        var isLeapYear = function (year) {
            return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
        }
        var mydate = new Date();
        //当天周几
        var today = mydate.getDay();
        //当天多少号
        var day = mydate.getDate();
        $scope.year = mydate.getFullYear();
        $scope.month = mydate.getMonth()+1;
        var months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (isLeapYear($scope.year)) {
            months[2] = 29;
        }
        //存放页面上显示的一周日期
        $scope.weeks = [{value:'一',flag:false},{value:'二',flag:false},{value:'三',flag:false},{value:'四',flag:false},
            {value:'五',flag:false},{value:'六',flag:false},{value:'七',flag:false}];
        var todayDate = mydate.getFullYear()+'/'+(mydate.getMonth()+1)+'/'+mydate.getDate();
        $scope.isToday = function(){
            for(var i=0;i<$scope.days.length;i++){
                if(todayDate == $scope.year+'/'+$scope.month+'/'+$scope.days[i]){
                    $scope.weeks[i].flag = true;
                }else{
                    $scope.weeks[i].flag = false;
                }
            }
        }
        $scope.selectDay = function (x) {
            for (var i = 0; i < $scope.weeks.length; i++) {
                $scope.weeks[i].flag = false;
            }
            x.flag = true;
        }
        $scope.days = [];
        //获取最近一周的天数据,传入的day为周一的日期
        var getDays = function (year, month, day) {
            //$scope.days = [];
            //当月多少天
            var monthCount = months[month];
            //从周一开始显示,记录当天与周一的差值
            //周一日期
            var firstDay = day;
            var lastDay = day + 6;
            //
            if (lastDay > monthCount) {
                //$scope.month++;
                //下一年
                    if (isLeapYear($scope.year)) {
                        months[2] = 29;
                    } else {
                        months[2] = 28;
                    }
                for (var i = firstDay; i <= monthCount; i++) {
                    $scope.days[i-monthCount+monthCount-firstDay] = i;
                }
                for (var j = 1; j <= lastDay - monthCount; j++) {
                    $scope.days[7 - lastDay + monthCount + j - 1] = j;
                }

            }else{
                for(var i = firstDay;i<=lastDay;i++){
                    $scope.days[7-lastDay+i-1]=i;
                }
            }
            $scope.isToday();

        }

        var addDate = function(date,days){
            var d=new Date(date);
            console.log(d)
            d.setDate(d.getDate()+days);

            var m=d.getMonth()+1;
            return new Date(d.getFullYear()+'/'+m+'/'+d.getDate());
        }
        var tempDate = new Date()

        var nextDays = function(add){
            console.log(tempDate.getMonth()+1)
            var nowFirstDate = $scope.year+'/'+(tempDate.getMonth()+1)+'/'+$scope.days[0];
            var nowLastDate = $scope.year+'/'+$scope.month+'/'+$scope.days[6];
            tempDate = addDate(nowFirstDate,add);
            var tempMonth = addDate(nowLastDate,add).getMonth()+1;
            console.log(tempMonth);
            if(add<0&&tempMonth==12&&$scope.month!=tempMonth){
                tempMonth=0;
            }
            if(add>0&&tempMonth==1&&$scope.month!=tempMonth){
                tempMonth=13;
            }
            if(tempMonth<$scope.month){
                $scope.month--;
                if($scope.month==0){
                    $scope.month=12;
                    $scope.year--;
                }

            }else if(tempMonth>$scope.month){
                $scope.month++;
                if($scope.month==13){
                    $scope.month=1;
                    $scope.year++;
                }
            }
            getDays(tempDate.getFullYear(),tempDate.getMonth()+1,tempDate.getDate())
        }

        $scope.onDaySwipeLeft = function(){
            //当前周一对应的日期
            console.log('left')
            nextDays(7);
        }
        $scope.onDaySwipeRight = function(){
           nextDays(-7);
        }
        $scope.onMonthSwipeLeft = function(){
            //当前周一对应的日期
            nextDays(7);
        }
        $scope.onMonthSwipeRight = function(){
            nextDays(-7);
        }
        /*-------------------------------------------日历 end-------------------------------------------*/

        //初始化数据
        getDays($scope.year,$scope.month,addDate(todayDate,1-today).getDate());
    }]);
