/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', ['$scope', '$ionicSlideBoxDelegate', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, $ionicSlideBoxDelegate, $timeout, ionicMaterialInk, ionicMaterialMotion) {

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
        //默认显示周视图
        $scope.viewFlag = true;
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
        $scope.myTodayDate = todayDate;
        var isToday = function (days) {
            for (var i = 0; i < days.length; i++) {
                if (todayDate == $scope.year + '/' + $scope.month + '/' + days[i].value) {
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
        $scope.days = [
            {}, {}, {}
        ]
        //切换周视图和月视图
        $scope.changeView = function () {
            console.log('drop')
            $scope.viewFlag = !$scope.viewFlag
            if ($scope.viewFlag == false) {
                $timeout(function(){
                    monthInit($scope.year,$scope.month);
                },5)
                $ionicSlideBoxDelegate.update();
            }
        }
        //以当前数组的最后一日为准
        var getDays = function (month, day) {
            var days = [{}, {}, {}, {}, {}, {}, {}];
            //角标,从后往前
            var count = 6;
            //跨月
            if (day < 7) {
                for (var i = day; i > 0; i--, count--) {
                    days[count].value = i;
                }
                month = month - 1;
                if (month == 0) {
                    month = 12;
                }
                for (var j = months[month]; count >= 0; j--, count--) {
                    days[count].value = j;
                }
                return days;
            } else {
                for (var i = day; count >= 0; count--, i--) {
                    days[count].value = i;
                }
                return days;
            }
        }

        var addDate = function (date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            return new Date(d.getFullYear() + '/' + m + '/' + d.getDate());
        }
        var tempDate = new Date();
        var nextDays = function (add, daysArr, nextDateObj) {
            var arr = angular.copy(daysArr);
            var nowLastDate = $scope.year + '/' + $scope.month + '/' + arr[6].value;
            tempDate = addDate(nowLastDate, add);
            nextDateObj.year = tempDate.getFullYear();
            nextDateObj.month = tempDate.getMonth() + 1;
            return getDays(nextDateObj.month, tempDate.getDate());
        }
        //判断数组元素是否连续
        var isContinue = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (Math.abs(arr[i]) - Math.abs(arr[i - 1]) != 1) {
                    return false;
                }
            }
            return true;
        }
        $scope.doubleClick = function () {
            console.log('doubleClick')
        };
        $scope.returnToday = function () {
            var page_index = $ionicSlideBoxDelegate.currentIndex();
            if (page_index == 0) {
                for (var i = 0; i < 7; i++) {
                    if (($scope.year + '/' + $scope.month + '/' + $scope.days[0].arr[i].value) == todayDate) {
                        return
                    }
                }
                $ionicSlideBoxDelegate.previous(300);
                $timeout(function () {
                    $ionicSlideBoxDelegate.slide(0, 300);
                    $scope.init();
                }, 100)

            } else {
                $ionicSlideBoxDelegate.slide(0, 300);
                $scope.init();
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

        //初始化数据
        var last_day = 0;
        if (today != 0) {
            last_day = 7 - today;
        } else {
            last_day = today;
        }
        $scope.init = function () {
            console.log(todayDate)
            var addDateTemp = addDate(todayDate, last_day);
            $scope.days[0].arr = getDays(addDateTemp.getMonth() + 1, addDateTemp.getDate());
            $scope.year = addDateTemp.getFullYear();
            $scope.month = addDateTemp.getMonth() + 1;
            isToday($scope.days[0].arr);
            $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
            $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
        }
        $scope.init();
//滚动日视图
        $scope.slideHasChanged = function (page_now) {
            console.log(page_now)
            $scope.year = $scope.days[page_now].year;
            $scope.month = $scope.days[page_now].month;
            if (isLeapYear($scope.year)) {
                months[2] = 29;
            } else {
                months[2] = 28;
            }
            switch (page_now) {
                case 0:
                    isToday($scope.days[0].arr);
                    $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
                    $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
                    break;
                //中间的视图
                case 1:
                    isToday($scope.days[1].arr);
                    $scope.days[2].arr = nextDays(7, $scope.days[1].arr, $scope.days[2]);
                    $scope.days[0].arr = nextDays(-7, $scope.days[1].arr, $scope.days[0]);
                    break;
                case 2:
                    isToday($scope.days[2].arr);
                    $scope.days[0].arr = nextDays(7, $scope.days[2].arr, $scope.days[0]);
                    $scope.days[1].arr = nextDays(-7, $scope.days[2].arr, $scope.days[1]);
                    break;
            }
        }

        /*----------------------------月视图----------------------------*/
        $scope.monthView = [{}, {}, {}];
        //默认是当前年月
        var getMonthView = function (year, month) {
            var year = angular.copy(year);
            var month = angular.copy(month);
            var monthObj = {
                year: '',
                month: '',
                arr: []
            };
            if (month == 0) {
                month = 12;
                year--;
            } else if (month == 13) {
                month = 1;
                year++;
            }
            monthObj.year = year;
            monthObj.month = month;
            //获取当月1号是周几
            var month_getWeek = new Date(year + '/' + month + '/1').getDay();
            var count = 0;
            //var daysArr = [];
            for (var i = 1; i < month_getWeek; i++, count++) {
                monthObj.arr.push({value: ''});
            }
            for (var j = 1; j <= months[month]; j++, count++) {
                var temp = {
                    value: j
                }
                monthObj.arr.push(temp);
            }
            return monthObj;
        }
        var monthInit = function () {
            $scope.monthView[0] = getMonthView($scope.year, $scope.month);
            $scope.monthView[1] = getMonthView($scope.year, $scope.month + 1);
            $scope.monthView[2] = getMonthView($scope.year, $scope.month - 1);
        }
        //monthInit();
        console.log($scope.monthView)
        $scope.monthHasChanged = function (page_now) {
            $scope.year = $scope.monthView[page_now].year;
            $scope.month = $scope.monthView[page_now].month;
            if (isLeapYear($scope.year)) {
                months[2] = 29;
            } else {
                months[2] = 28;
            }
            console.log($scope.monthView)
            switch (page_now) {
                case 0:
                    $scope.monthView[1] = getMonthView($scope.year, $scope.month + 1);
                    $scope.monthView[2] = getMonthView($scope.year, $scope.month - 1);
                    break;
                case 1:
                    $scope.monthView[2] = getMonthView($scope.year, $scope.month + 1);
                    $scope.monthView[0] = getMonthView($scope.year, $scope.month - 1);
                    break;
                case 2:
                    $scope.monthView[0] = getMonthView($scope.year, $scope.month + 1);
                    $scope.monthView[1] = getMonthView($scope.year, $scope.month - 1);
                    break;
            }
        }
        /*----------------------------月视图 end----------------------------*/

        /*-------------------------------------------日历 end-------------------------------------------*/
    }
    ])
;
