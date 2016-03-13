/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', ['$scope', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, ionicMaterialInk, ionicMaterialMotion) {

        //$timeout(function () {
        //    document.getElementsByClassName('animate-day').toggle('on');
        //}, 900);


        //ionicMaterialMotion.fadeSlideInRight();
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
        $scope.month = mydate.getMonth() + 1;
        var months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (isLeapYear($scope.year)) {
            months[2] = 29;
        }
        //存放页面上显示的一周日期
        $scope.weeks = [{value: '一', flag: false, class: 'edgeDay'}, {value: '二', flag: false}, {
            value: '三',
            flag: false
        }, {value: '四', flag: false},
            {value: '五', flag: false}, {value: '六', flag: false}, {value: '七', flag: false, class: 'edgeDay'}];
        var todayDate = mydate.getFullYear() + '/' + (mydate.getMonth() + 1) + '/' + mydate.getDate();
        $scope.isToday = function () {
            for (var i = 0; i < $scope.days_one.length; i++) {
                if (todayDate == $scope.year + '/' + $scope.month + '/' + $scope.days_one[i]) {
                    $scope.weeks[i].flag = true;
                } else {
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
        $scope.days_one = [];
        $scope.days_two = [];
        $scope.days_three = [];
        //获取最近一周的天数据,传入的day为周一的日期
        var getDays = function (year, month, day, dayss) {
            //$scope.days_one = [];\
            //当月多少天
            var days= angular.copy(dayss);
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
                    days[i - monthCount + monthCount - firstDay] = i;
                }
                for (var j = 1; j <= lastDay - monthCount; j++) {
                    days[7 - lastDay + monthCount + j - 1] = j;
                }

            } else {
                for (var i = firstDay; i <= lastDay; i++) {
                    days[7 - lastDay + i - 1] = i;
                }
            }
            $scope.isToday();
            return days;
        }

        var addDate = function (date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);

            var m = d.getMonth() + 1;
            return new Date(d.getFullYear() + '/' + m + '/' + d.getDate());
        }
        var tempDate = new Date()

        var nextDays = function (add, dayss) {
            var days = angular.copy(dayss);
            var month =3
            var nowFirstDate = $scope.year + '/' + (tempDate.getMonth() + 1) + '/' + days[0];
            var nowLastDate = $scope.year + '/' + month + '/' + days[6];
            tempDate = addDate(nowFirstDate, add);
            var tempMonth = addDate(nowLastDate, add).getMonth() + 1;
            if (add < 0 && tempMonth == 12 && month != tempMonth) {
                tempMonth = 0;
            }
            if (add > 0 && tempMonth == 1 && month != tempMonth) {
                tempMonth = 13;
            }
            if (tempMonth < month) {
                month--;
                if (month == 0) {
                    month = 12;
                    $scope.year--;
                }

            } else if (tempMonth >  month) {
                 month++;
                if ( month == 13) {
                     month = 1;
                    $scope.year++;
                }
            }
            return getDays(tempDate.getFullYear(), tempDate.getMonth() + 1, tempDate.getDate(), days)
        }

        var getMonth = function(month){
            var nowLastDate = $scope.year + '/' + month + '/' + days[6];
            var tempMonth = addDate(nowLastDate, add).getMonth() + 1;
            if (add < 0 && tempMonth == 12 && month != tempMonth) {
                tempMonth = 0;
            }
            if (add > 0 && tempMonth == 1 && month != tempMonth) {
                tempMonth = 13;
            }
            if (tempMonth < month) {
                month--;
                if (month == 0) {
                    month = 12;
                    $scope.year--;
                }

            } else if (tempMonth >  month) {
                month++;
                if ( month == 13) {
                    month = 1;
                    $scope.year++;
                }
            }
        }

        $scope.onMonthSwipeLeft = function () {
            //当前周一对应的日期
            //nextDays(7);
            alert('月份左滑')
        }
        $scope.onMonthSwipeRight = function () {
            //nextDays(-7);
            alert('月份右滑动')
        }
        /*-------------------------------------------日历 end-------------------------------------------*/

        //初始化数据
        $scope.days_one = getDays($scope.year, $scope.month, addDate(todayDate, 1 - today).getDate(), $scope.days_one);
        $scope.days_two = nextDays(7, $scope.days_one);
        $scope.days_three = nextDays(-7, $scope.days_one);
        //滚动日视图
        $scope.slideHasChanged = function (index) {
            switch (index) {
                case 0:
                    $scope.days_two = nextDays(7, $scope.days_one);
                    $scope.days_three = nextDays(-7, $scope.days_one);
                    break;
                //中间的视图
                case 1:
                    $scope.days_three = nextDays(7, $scope.days_two);
                    $scope.days_one = nextDays(-7, $scope.days_two);
                    break;
                case 2:
                    $scope.days_one = nextDays(7, $scope.days_three);
                    $scope.days_two = nextDays(-7, $scope.days_three);
                    break;
            }
        }
    }]);
