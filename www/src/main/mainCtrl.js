/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', ['$scope', '$ionicSlideBoxDelegate','$ionicScrollDelegate', '$timeout', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, $ionicSlideBoxDelegate, $ionicScrollDelegate,$timeout, ionicMaterialInk, ionicMaterialMotion) {


        //ionicMaterialMotion.fadeSlideInRight();

        $timeout(function(){
            document.getElementById('app-funcs').classList.toggle('on');
            ionicMaterialInk.displayEffect();
        },100);

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

        $scope.days = [
            {}, {}, {}
        ]
        //切换周视图和月视图
        $scope.changeView = function () {
            $scope.viewFlag = !$scope.viewFlag;
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTop(true)
            //$timeout(function () {
                $scope.topHeight = {
                    'margin-top':document.getElementById('mainTopId').clientHeight+'px'
                }
            //},1)
            //切换至月视图
            if ($scope.viewFlag == false) {
                var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
                var page_index = dayViewHandle.currentIndex();
                var arr=$scope.days[page_index].arr;
                var select_day;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].checked==true){
                        select_day=arr[i].value;
                        break
                    }
                }
                $timeout(function(){
                    var year = angular.copy($scope.year);
                    var month = angular.copy($scope.month);
                    if(arr[0].value>arr[6].value&&select_day>=arr[0].value){

                        if(month==1){
                            month=12;
                            year--;
                        }else{
                            month--;
                        }
                        $scope.year = year;
                        $scope.month = month;
                        monthInit(year,month,select_day);
                    }else{
                        $scope.year = year;
                        $scope.month=month;
                        monthInit(year,month,select_day);
                    }
                },5)
                $ionicSlideBoxDelegate.update();
            }else{
                var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('monthView-handle');
                var page_index = dayViewHandle.currentIndex();
                var arr=$scope.monthView[page_index].arr;
                //默认为当月一号
                var select_day=1;
                for(var i=0;i<arr.length;i++){
                    if(arr[i].checked == true){
                        select_day=arr[i].value;
                        break
                    }
                }
                daysChangedInit(select_day);
            }
        }

        var daysChangedInit = function(day){
            $timeout(function () {
                $scope.topHeight = {
                    'margin-top':document.getElementById('mainTopId').clientHeight+'px'
                }
            },10)
            //当天周几
            var init_day = new Date($scope.year+'/'+$scope.month+'/'+day).getDay();
            //当天与周日差了几天
            last_day = 0;
            if (init_day != 0) {
                last_day = 7 - init_day;
            } else {
                last_day = init_day;
            }
            console.log(last_day)
            var addDateTemp = addDate($scope.year+'/'+$scope.month+'/'+day, last_day);
            $scope.days[0].arr = getDays(addDateTemp.getMonth() + 1, addDateTemp.getDate());
            //if(day!=1){
                for(var i=0;i<$scope.days[0].arr.length;i++){
                    if($scope.days[0].arr[i].value==day){
                        $scope.days[0].arr[i].checked = true;
                    }
                }
            //}
            if($scope.days[0].arr[6].value<$scope.days[0].arr[0].value&&day>$scope.days[0].arr[6].value){
                $scope.month++;
                if($scope.month==13){
                    $scope.month=1;
                    $scope.year++;
                }
            }
            isToday($scope.days[0].arr);

            $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
            $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
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
            var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
            var page_index = dayViewHandle.currentIndex();
            console.log(page_index)
            //当前在周视图
            if(page_index!=undefined){
                if (page_index == 0) {
                    for (var i = 0; i < 7; i++) {
                        if (($scope.year + '/' + $scope.month + '/' + $scope.days[0].arr[i].value) == todayDate) {
                            return
                        }
                    }
                    dayViewHandle.previous(300);
                    $timeout(function () {
                        dayViewHandle.slide(0, 300);
                        $scope.init();
                    }, 100)

                } else {
                    dayViewHandle.slide(0, 300);
                    $scope.init();
                }
            }else{
                var monthViewHanle = $ionicSlideBoxDelegate.$getByHandle('monthView-handle');
                page_index = monthViewHanle.currentIndex();
                if(page_index==0){
                    if($scope.month==(mydate.getMonth()+1)){
                        initFirstMonth(mydate.getDate());
                        return
                    }else{
                        monthViewHanle.previous(300);
                        $timeout(function () {
                            monthViewHanle.slide(0, 300);
                            $scope.year=mydate.getFullYear();
                            $scope.month=mydate.getMonth()+1;
                            monthInit(mydate.getFullYear(),mydate.getMonth()+1,mydate.getDate());
                        }, 100)
                    }
                }else{
                    monthViewHanle.slide(0, 300);
                    $scope.year=new Date().getFullYear();
                    $scope.month=new Date().getMonth()+1;
                    monthInit(mydate.getFullYear(),mydate.getMonth()+1,mydate.getDate());
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
        $scope.selectDay = function(x,y){
            for(var i=0;i< x.length;i++){
                x[i].checked = false;
                x[i].isToday = false;
            }
            if(todayDate==$scope.year+'/'+$scope.month+'/'+y.value){
                y.isToday=true;
            }
            y.checked = true;
        }
        //初始化数据
        var last_day = 0;
        if (today != 0) {
            last_day = 7 - today;
        } else {
            last_day = today;
        }
        $scope.topHeight = {
            'margin-top':'198px'
        }
        $scope.init = function () {
            var addDateTemp = addDate(todayDate, last_day);
            $scope.days[0].arr = getDays(addDateTemp.getMonth() + 1, addDateTemp.getDate());
            var todayTemp = angular.copy(today);
            if(todayTemp==0){
                todayTemp=6;
            }else{
                todayTemp=todayTemp-1;
            }
            //默认选中当天
            $scope.days[0].arr[todayTemp].checked=true;
            //模拟有代办事项
            $scope.days[0].arr[todayTemp].toDo=true;
            $scope.days[0].arr[todayTemp+1].toDo=true;

            $scope.year = addDateTemp.getFullYear();
            $scope.month = addDateTemp.getMonth() + 1;
            isToday($scope.days[0].arr);
            $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
            $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
        }
        $scope.init();
//滚动日视图
        $scope.slideHasChanged = function (page_now) {
            $timeout(function () {
                $scope.topHeight = {
                    'margin-top':document.getElementById('mainTopId').clientHeight+'px'
                }
            },10)
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
            console.log(year + '/' + month + '/1');
            console.log(month_getWeek)
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
        var initFirstMonth = function(day){
            console.log(day);
            var month_page_now = $ionicSlideBoxDelegate.$getByHandle('monthView-handle').currentIndex();
            var arr = $scope.monthView[month_page_now].arr;
            $timeout(function(){
                for(var i=0;i<arr.length;i++){
                    if(day==arr[i].value){
                        arr[i].checked = true;
                        if(day==mydate.getDate()){
                            arr[i].isToday = true;
                        }else{
                            arr[i].isToday = false;
                        }
                        continue;
                    }
                    arr[i].isToday=false;
                    arr[i].checked=false;
                }
                $scope.$apply();
            },1)
            //$timeout(function(){
            //    $scope.$apply();
            //},1)
        }

        var monthInit = function (year,month,day) {
            $timeout(function () {
                $scope.topHeight = {
                    'margin-top':document.getElementById('mainTopId').clientHeight+'px'
                }
            },10)
            var month_page_now = $ionicSlideBoxDelegate.$getByHandle('monthView-handle').currentIndex();
            var addTemp = month_page_now+1;
            var decTemp = month_page_now-1;
            if(addTemp==3){
                addTemp=0;
            }
            if(decTemp==-1){
                decTemp=2;
            }
            $scope.monthView[month_page_now] = getMonthView(year, month);
            initFirstMonth(day);
            $scope.monthView[addTemp] = getMonthView(year, month + 1);
            $scope.monthView[decTemp] = getMonthView(year, month - 1);


        }
        //仅测试用,正式使用时需注释
        //monthInit($scope.year,$scope.month,new Date().getDate());
        $scope.monthHasChanged = function (page_now) {
            $timeout(function () {
                $scope.topHeight = {
                    'margin-top':document.getElementById('mainTopId').clientHeight+'px'
                }
            },10)
            $scope.year = $scope.monthView[page_now].year;
            $scope.month = $scope.monthView[page_now].month;
            if (isLeapYear($scope.year)) {
                months[2] = 29;
            } else {
                months[2] = 28;
            }
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
        $scope.marks = ['#cf021b','#f5a623','#4a90e2','#f8e71c','#417505'];
        $scope.thingsToDo = [{
            title:'到青浦购买机械装备',
            year:2016,
            month:3,
            day:12,
            startTime:'15:00',
            endTime:'18:00',
            mark:'#417505',
            showMarks:true
        },{
            title:'浦东新区工程监督',
            year:2016,
            month:3,
            day:16,
            startTime:'15:00',
            endTime:'18:00',
            mark:'#cf021b',
            showMarks:false
        },{
            title:'LOL拿首胜',
            year:2016,
            month:3,
            day:16,
            startTime:'19:00',
            endTime:'21:00',
            mark:'#4a90e2',
            showMarks:false
        },{
            title:'LOL拿首胜',
            year:2016,
            month:3,
            day:16,
            startTime:'19:00',
            endTime:'21:00',
            mark:'#4a90e2',
            showMarks:false
        },{
            title:'LOL拿首胜',
            year:2016,
            month:3,
            day:16,
            startTime:'19:00',
            endTime:'21:00',
            mark:'#4a90e2',
            showMarks:false
        },{
            title:'LOL拿首胜',
            year:2016,
            month:3,
            day:16,
            startTime:'19:00',
            endTime:'21:00',
            mark:'#4a90e2',
            showMarks:false
        },{
            title:'LOL拿首胜',
            year:2016,
            month:3,  
            day:16,
            startTime:'19:00',
            endTime:'21:00',
            mark:'#4a90e2',
            showMarks:false
        },{
            title:'LOL拿首胜',
            year:2016,
            month:3,
            day:16,
            startTime:'19:00',
            endTime:'21:00',
            mark:'#4a90e2',
            showMarks:false
        }];

        $scope.chooseMark = function(x,color){
            x.showMarks = false;
            x.mark = color;
        }
    }
    ])
;
