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
        var isToday = function (days) {
            for (var i = 0; i < days.length; i++) {
                if (todayDate == $scope.year + '/' + $scope.month + '/' + days[i]) {
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
        //$scope.days[0].arr = [];
        //$scope.days[1].arr = [];
        //$scope.days[2].arr = [];
        $scope.days = [
            {},{},{}
        ]
        //获取最近一周的天数据,传入的day为周一的日期
        var getDays = function (year, month, day, dayss) {
            //$scope.days[0].arr = [];\
            //当月多少天
            var days = angular.copy(dayss);
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
            //$scope.isToday();
            return days;
        }
        //以当前数组的最后一日为准
        var getDays = function(month,day){
            //if(isLeapYear(year)){
            //    months[2]=29;
            //}else{
            //    months[2]=28;
            //}
            var days = [];
            //角标,从后往前
            var count = 6;
            //跨月
            if(day<7){
                for(var i=day; i>0;i--,count--){
                    days[count]=i;
                }
                month = month-1;
                if(month==0){
                    month=12;
                    //year=year-1;
                }
                for(var j=months[month];count>=0;j--,count--){
                    days[count]=j;
                }
                return days;
            }else{
                for(var i=day;count>=0;count--,i--){
                    days[count]=i;
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
        var tempDate = new Date()
        var pageDate_one = {}, pageDate_two = {}, pageDate_three = {};
        var nextDays = function (add, daysArr,nextDateObj) {
            var arr = angular.copy(daysArr);
            //console.log(daysObj)
            //var month = getTempDate(days, isNext, add);

            //var month = angular.copy($scope.month);
            //var getYearMonth = getTempDate(days, isNext, add);
            //var nowFirstDate = getYearMonth + '/' + days[0];
            //var tempYear = Number(getYearMonth.split('/')[0]);
            //var tempMonth = Number(getYearMonth.split('/')[1]);
            var nowLastDate = $scope.year+'/'+$scope.month+'/'+arr[6];

            //console.log(tempYear + '-------' + tempMonth + '-------' + arr[6])
            tempDate = addDate(nowLastDate, add);
            nextDateObj.year = tempDate.getFullYear();
            nextDateObj.month = tempDate.getMonth()+1;
            console.log(nextDateObj.year+'--------'+nextDateObj.month+'-------'+tempDate.getDate())
            //if (page == 1) {
            //    $scope.days[0].year = tempDate.getFullYear();
            //    $scope.days[0].month = tempDate.getMonth()+1;
            //} else if (page == 2) {
            //    $scope.days[1].year = tempDate.getFullYear();
            //    $scope.days[1].month =tempDate.getMonth()+1;
            //} else {
            //    $scope.days[2].year = tempDate.getFullYear();
            //    $scope.days[2].month =tempDate.getMonth()+1;
            //}
            //console.log(tempDate.getFullYear() + '-------' + (tempDate.getMonth() + 1) + '-------' + tempDate.getDate())
            return getDays(nextDateObj.month, tempDate.getDate());
        }

        var getTempDate = function (days, isNext, add) {
            //if (isNext) {
            if (add > 0) {
                //if(isContinue(days)){
                return $scope.year + '/' + $scope.month;
                //}else{
                //
                //}
                //console.log(days)
                //if (days[0] > days[6]) {
                //    console.log($scope.month)
                //    return $scope.year + '/' + ($scope.month);
                //} else {
                //    if (days[6] + 7 > months[$scope.month]) {
                //        if ($scope.month + 1 == 13) {
                //            return ($scope.year + 1) + '/' + 1;
                //        }
                //        return $scope.year + '/' + ($scope.month + 1);
                //    }
                //}
                //return $scope.year + '/' + $scope.month;
                //}
            } else {
                if (isContinue(days)) {
                    return $scope.year + '/' + $scope.month;
                } else {
                    if ($scope.month - 1 == 0) {
                        return ($scope.year - 1) + '/' + 12;
                    }
                    return $scope.year + '/' + ($scope.month - 1);
                }
                //if ((days[6] - 7 <= 0) || (days[0] - 7 <= 0)) {
                //    if ($scope.month - 1 == 0) {
                //        return ($scope.year - 1) + '/' + 12;
                //    }
                //    return $scope.year + '/' + ($scope.month - 1);
                //}
                //return $scope.year + '/' + $scope.month;
            }
        }


        //}


        var getMonth = function (days, isNext) {
            //if (!isContinue(days)) {
            if (isNext) {
                if (days[6] - 7 <= 0) {
                    $scope.month++;
                    if ($scope.month == 13) {
                        $scope.month = 1;
                        $scope.year++;
                    }
                }

            } else {
                var testMonth = $scope.month - 1;
                if (!isContinue(days)) {
                    testMonth = $scope.month - 1;
                }
                var lastDate = new Date($scope.year + '/' + testMonth + '/' + days[6]);
                var nextDate = addDate(lastDate, 7);
                if (lastDate.getDay() == 0 && nextDate.getDay() == 0 && (nextDate.getMonth() == ($scope.month - 1))) {
                    $scope.month--;
                    if ($scope.month == 0) {
                        $scope.month = 12;
                        $scope.year--;
                    }
                }

                //}
            }
            //}

        }

        var isContinue = function (arr) {
            for (var i = 1; i < arr.length; i++) {
                if (Math.abs(arr[i]) - Math.abs(arr[i - 1]) != 1) {
                    return false;
                }
            }
            return true;
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
        var page_last = 0;
//初始化数据
        console.log(today)

        var last_day = 0;
        if(today!=0){
            last_day=7-today;
        }else{
            last_day=today;
        }
        $scope.days[0].arr = getDays(addDate(todayDate, last_day).getMonth()+1, addDate(todayDate, last_day).getDate());
        isToday($scope.days[0].arr);
        $scope.days[1].arr = nextDays(7, $scope.days[0].arr,$scope.days[1]);
        $scope.days[2].arr = nextDays(-7, $scope.days[0].arr,$scope.days[2]);
//滚动日视图
        $scope.slideHasChanged = function (page_now) {
            //是否右滑动
            var isNext = true;
            if ((page_now == 1 && page_last == 0) || (page_now == 2 && page_last == 1) || (page_now == 0 && page_last == 2)) {
                console.log('右滑')
                isNext = true;
            } else {
                console.log('左滑')
                isNext = false;
            }
            page_last = page_now;
            console.log($scope.days[page_now])
            $scope.year = $scope.days[page_now].year;
            $scope.month = $scope.days[page_now].month;
            if(isLeapYear($scope.year)){
                months[2]=29;
            }else{
                months[2]=28;
            }
            switch (page_now) {
                case 0:
                    //console.log('0')
                    //console.log($scope.days[0].arr);
                    //console.log(pageDate_one)
                    //if (isNext) {
                    //    if ($scope.days[0].arr[6] - 7 <= 0) {
                    //        $scope.month = pageDate_three.month;
                    //        $scope.year = pageDate_three.year;
                    //    }
                    //} else {
                    //    if ($scope.days[0].arr[6] > $scope.days[0].arr[0]) {
                    //        $scope.month = pageDate_one.month;
                    //        $scope.year = pageDate_one.year;
                    //    }
                    //}
                    $scope.days[1].arr = nextDays(7, $scope.days[0].arr,$scope.days[1]);
                    $scope.days[2].arr = nextDays(-7, $scope.days[0].arr,$scope.days[2]);
                    isToday($scope.days[0].arr);
                    break;
                //中间的视图
                case 1:
                    //console.log('1')
                    //console.log($scope.days[1].arr);
                    //console.log(pageDate_two)
                    //if (isNext) {
                    //    if ($scope.days[1].arr[6] - 7 <= 0) {
                    //        $scope.month = pageDate_three.month;
                    //        $scope.year = pageDate_three.year;
                    //    }
                    //} else {
                    //    if ($scope.days[1].arr[6] > $scope.days[1].arr[0]) {
                    //        $scope.month = pageDate_two.month;
                    //        $scope.year = pageDate_two.year;
                    //    }
                    //}

                    $scope.days[2].arr = nextDays(7, $scope.days[1].arr,$scope.days[2]);
                    $scope.days[0].arr = nextDays(-7, $scope.days[1].arr,$scope.days[0]);
                    isToday($scope.days[1].arr);
                    break;
                case 2:
                    //console.log('2')
                    //console.log($scope.days[2].arr);
                    //console.log(pageDate_three)
                    //if (isNext) {
                    //    if ($scope.days[2].arr[6] - 7 <= 0) {
                    //        $scope.month = pageDate_three.month;
                    //        $scope.year = pageDate_three.year;
                    //    }
                    //} else {
                    //    if ($scope.days[2].arr[0] > $scope.days[2].arr[6]) {
                    //        $scope.month = pageDate_three.month;
                    //        $scope.year = pageDate_three.year;
                    //    }
                    //}

                    $scope.days[0].arr = nextDays(7, $scope.days[2].arr,$scope.days[0]);
                    $scope.days[1].arr = nextDays(-7, $scope.days[2].arr,$scope.days[1]);

                    isToday($scope.days[2].arr);
                    break;
            }
        }
    }

    ])
;
