/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', [ 
        '$scope',
        '$state',
        '$ionicSlideBoxDelegate',
        '$ionicScrollDelegate',
        '$timeout',
        '$ionicBackdrop',
        '$ionicPopover',
        '$cordovaDatePicker',
        '$location',
        '$cordovaToast',
        '$ionicModal',
        'ionicMaterialInk',
        'ionicMaterialMotion',
        'Prompter',
        'HttpAppService', 
        'LoginService',
        'saleActService',
        'worksheetDataService',
        'saleChanService',
        function ($scope, $state, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout,
                  $ionicBackdrop, $ionicPopover, $cordovaDatePicker, $location, $cordovaToast, $ionicModal,
                  ionicMaterialInk, ionicMaterialMotion, Prompter, HttpAppService, LoginService, saleActService,
                  worksheetDataService, saleChanService) {

            $scope.toMap = function(){
                $state.go('myMapService');
            }


            $timeout(function () {
                document.getElementById('app-funcs').classList.toggle('on');
                ionicMaterialInk.displayEffect();
            }, 100);
            //$scope.more={flag:false};
            /*--------------------------------------------日历--------------------------------------------*/
            //判断是否是闰年,2月平年28天、闰年29天
            var isLeapYear = function (year) {
                return ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0);
            };
            $scope.role = LoginService.getProfileType();
            var selectDate = new Date().format('yyyy-MM-dd');
            var mydate = new Date();
            $scope.modeFlag = true;//判断显示销售活动还是服务工单
            $scope.showPop = false;
            //当天周几
            var today = mydate.getDay();

            if ($scope.role == 'APP_SERVICE') {
                $scope.selectModeText = '服务工单';
            } else {
                $scope.selectModeText = '销售活动';
            }
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
                {value: '五', flag: false}, {value: '六', flag: false}, {value: '日', flag: false, class: 'edgeDay'}];
            var todayDate = mydate.getFullYear() + '/' + (mydate.getMonth() + 1) + '/' + mydate.getDate();
            $scope.myTodayDate = todayDate;
            var isToday = function (days) {
                var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
                var page_index = dayViewHandle.currentIndex();
                if (angular.isUndefined(page_index)) {
                    page_index = 0;
                }
                var myTempMonth = $scope.days[page_index].month;
                for (var i = 0; i < days.length; i++) {
                    if (days[6].value < 7) {
                        myTempMonth = $scope.days[page_index].month - 1;
                        if (days[i].value > 0 && days[i].value < 7) {
                            myTempMonth = $scope.days[page_index].month;
                        }
                    }
                    if (todayDate == $scope.year + '/' + myTempMonth + '/' + days[i].value) {
                        $scope.weeks[i].flag = true;
                    } else {
                        $scope.weeks[i].flag = false;
                    }
                    //判断当天选择的天
                    if (new Date(selectDate).format('yyyy/M/d') == $scope.year + '/' + $scope.month + '/' + days[i].value) {

                    }
                }
            };

            $scope.days = [
                {}, {}, {}
            ];
            //切换周视图和月视图
            $scope.changeView = function () {
                $scope.viewFlag = !$scope.viewFlag;
                $ionicScrollDelegate.resize();
                $ionicScrollDelegate.scrollTop(true)
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': document.getElementById('mainTopId').clientHeight + 'px'
                    };
                }, 10)
                //切换至月视图
                if ($scope.viewFlag == false) {
                    if (Prompter.isAndroid()) {
                        document.getElementById('monthViewId').className = 'monthView';
                    } else {
                        document.getElementById('monthViewId').className = 'monthView own-animated fadeInDown';
                    }
                    document.getElementById('dayViewId').className = 'dayView';
                    $timeout(function () {
                        document.getElementById('monthViewId').className = 'monthView';
                    }, 500);
                    var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
                    var page_index = dayViewHandle.currentIndex();
                    var arr = $scope.days[page_index].arr;
                    var select_day;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].checked == true) {
                            select_day = arr[i].value;
                            break
                        }
                    }
                    $timeout(function () {
                        var year = angular.copy($scope.year);
                        var month = angular.copy($scope.month);
                        //if (arr[0].value > arr[6].value && select_day >= arr[0].value) {
                        //    if (month == 1) {
                        //        month = 12;
                        //        year--;
                        //    }
                        //    $scope.year = year;
                        //    $scope.month = month;
                        //    monthInit(year, month, select_day);
                        //} else {
                        $scope.year = year;
                        $scope.month = month;
                        monthInit(year, month, select_day);
                        //}
                    }, 5);
                    $ionicSlideBoxDelegate.update();
                } else {
                    if (Prompter.isAndroid()) {
                        document.getElementById('dayViewId').className = 'dayView';
                    } else {
                        document.getElementById('dayViewId').className = 'dayView own-animated fadeInDown';
                    }
                    document.getElementById('monthViewId').className = 'monthView';
                    $timeout(function () {
                        document.getElementById('dayViewId').className = 'dayView';
                    }, 500);
                    var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('monthView-handle');
                    var page_index = dayViewHandle.currentIndex();
                    var arr = $scope.monthView[page_index].arr;
                    //默认为当月一号
                    var select_day = 1;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].checked == true) {
                            select_day = arr[i].value;
                            break
                        }
                    }
                    daysChangedInit(select_day);
                    getWeekMarkDays($scope.days[0]);
                }
            };

            var daysChangedInit = function (day) {
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': '198px'
                    };
                    document.getElementById('mainContentId').style.marginTop = '198px';
                    $scope.$apply();
                }, 10);
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': '198px'
                    };
                    document.getElementById('mainContentId').style.marginTop = '198px';
                    $scope.$apply();
                }, 200);
                //当天周几
                var init_day = new Date($scope.year + '/' + $scope.month + '/' + day).getDay();
                //当天与周日差了几天
                last_day = 0;
                if (init_day != 0) {
                    last_day = 7 - init_day;
                } else {
                    last_day = init_day;
                }
                var addDateTemp = addDate($scope.year + '/' + $scope.month + '/' + day, last_day);
                console.log(addDateTemp);
                $scope.days[0].arr = getDays(addDateTemp.getMonth() + 1, addDateTemp.getDate());
                $scope.days[0].month = addDateTemp.getMonth() + 1;
                $scope.days[0].year = addDateTemp.getFullYear();
                //if(day!=1){
                var countTem;
                for (var i = 0; i < $scope.days[0].arr.length; i++) {
                    if ($scope.days[0].arr[i].value == day) {
                        countTem = i;
                    }
                }
                $timeout(function () {
                    $scope.days[0].arr[countTem].checked = true;
                }, 450);
                //}
                //if ($scope.days[0].arr[6].value < $scope.days[0].arr[0].value && day > $scope.days[0].arr[6].value) {
                //    $scope.month++;
                //    if ($scope.month == 13) {
                //        $scope.month = 1;
                //        $scope.year++;
                //    }
                //}
                isToday($scope.days[0].arr);

                $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
                $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
            };
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
            };

            var addDate = function (date, days) {
                var d = new Date(date);
                d.setDate(d.getDate() + days);
                var m = d.getMonth() + 1;
                return new Date(d.getFullYear() + '/' + m + '/' + d.getDate());
            };
            var tempDate = new Date();
            var nextDays = function (add, daysArr, nextDateObj) {
                var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
                var page_index = dayViewHandle.currentIndex();
                var myTempMonth;
                if (angular.isUndefined(page_index)) {
                    myTempMonth = $scope.days[0].month;
                } else {
                    myTempMonth = $scope.days[page_index].month;
                }
                var arr = angular.copy(daysArr);
                var nowLastDate = $scope.year + '/' + myTempMonth + '/' + arr[6].value;
                tempDate = addDate(nowLastDate, add);
                //tempDate = new Date(nowLastDate);
                nextDateObj.year = tempDate.getFullYear();
                nextDateObj.month = tempDate.getMonth() + 1;
                return getDays(nextDateObj.month, tempDate.getDate());
            };
            //判断数组元素是否连续
            var isContinue = function (arr) {
                for (var i = 1; i < arr.length; i++) {
                    if (Math.abs(arr[i].value) - Math.abs(arr[i - 1].value) != 1) {
                        return false;
                    }
                }
                return true;
            };
            $scope.doubleClick = function () {
            };
            //长按修改年月
            $scope.onHold = function () {
                var options = {
                    date: new Date('2016/04'),
                    mode: 'month',
                    titleText: '请选择时间',
                    okText: '确定',
                    cancelText: '取消',
                    doneButtonLabel: '确认',
                    cancelButtonLabel: '取消',
                    locale: 'zh_cn'
                };
                document.addEventListener("deviceready", function () {
                    $cordovaDatePicker.show(options).then(function (date) {
                        alert(date);
                    });

                }, false);
            };
            $scope.returnToday = function () {
                var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
                var page_index = dayViewHandle.currentIndex();
                //当前在周视图
                if (page_index != undefined) {
                    if (page_index == 0) {
                        var temp = true, myTempMonth;
                        for (var i = 0; i < 7; i++) {
                            if ($scope.days[page_index].arr[6].value < 7) {
                                myTempMonth = $scope.days[page_index].month - 1;
                                if ($scope.days[page_index].arr[i].value > 0 && $scope.days[page_index].arr[i].value < 7) {
                                    myTempMonth = $scope.days[page_index].month;
                                }
                            }
                            if (($scope.year + '/' + myTempMonth + '/' + $scope.days[0].arr[i].value) == todayDate) {
                                temp = false;
                            }
                        }
                        if (selectDate == new Date().format('yyyy-MM-dd')) {
                            return
                        }
                        selectDate = new Date().format('yyyy-MM-dd');
                        if (temp) {
                            //dayViewHandle.previous(300);
                            //$timeout(function () {
                            dayViewHandle.slide(0, 300);
                            //}, 100)
                        }
                        $scope.init();

                    } else {
                        dayViewHandle.slide(0, 300);
                        $scope.init();
                    }
                } else {
                    var monthViewHanle = $ionicSlideBoxDelegate.$getByHandle('monthView-handle');
                    page_index = monthViewHanle.currentIndex();
                    if (page_index == 0) {
                        if (selectDate == new Date().format('yyyy-MM-dd')) {
                            return
                        }
                        if ($scope.month == (mydate.getMonth() + 1)) {
                            initFirstMonth(mydate.getDate());
                            selectDate = new Date().format('yyyy-MM-dd');
                            $scope.getList('init');
                            return
                        } else {
                            monthViewHanle.previous(300);
                            $timeout(function () {
                                monthViewHanle.slide(0, 300);
                                $scope.year = mydate.getFullYear();
                                $scope.month = mydate.getMonth() + 1;
                                monthInit(mydate.getFullYear(), mydate.getMonth() + 1, mydate.getDate());
                            }, 100)
                        }
                    } else {
                        monthViewHanle.slide(0, 300);
                        $scope.year = new Date().getFullYear();
                        $scope.month = new Date().getMonth() + 1;
                        monthInit(mydate.getFullYear(), mydate.getMonth() + 1, mydate.getDate());
                    }
                }
                $scope.getList('init');
            };
            var lastSelectedDate = angular.copy(selectDate);
            $scope.selectDay = function (x, y) {
                var dayViewHandle = $ionicSlideBoxDelegate.$getByHandle('dayView-handle');
                var page_index = dayViewHandle.currentIndex();
                //当前在周视图
                if (angular.isDefined(page_index)) {
                    if ($scope.days[page_index].arr[6].value < 7 && y.value > 7) {
                        //tempMonth--;
                        $scope.month = $scope.days[page_index].month - 1;
                    } else {
                        $scope.month = $scope.days[page_index].month;
                    }
                }
                selectDate = new Date($scope.year + '/' + $scope.month + '/' + y.value).format('yyyy-MM-dd');
                if (selectDate === lastSelectedDate) {
                    return
                }
                lastSelectedDate = angular.copy(selectDate);
                var monthHeightNow = document.getElementById('mainTopId').clientHeight;
                if (monthHeightNow > 316) {
                    $scope.monthHeight = {
                        'height': '187px'
                    };
                } else {
                    $scope.monthHeight = {
                        'height': 'auto'
                    };
                }
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': monthHeightNow + 'px'
                    }
                }, 10);
                if (y.value == '') {
                    return
                }
                for (var i = 0; i < x.length; i++) {
                    x[i].checked = false;
                    x[i].isToday = false;
                }
                if (todayDate == $scope.year + '/' + $scope.month + '/' + y.value) {
                    y.isToday = true;
                }
                y.checked = true;
                /*刷新content*/
                $scope.getList('init');
            };
            $scope.topHeight = {
                'margin-top': '198px'
            };

            var last_day;
            $scope.init = function () {
                //初始化数据
                last_day = 0;
                if (today != 0) {
                    last_day = 7 - today;
                } else {
                    last_day = today;
                }
                var addDateTemp = addDate(todayDate, last_day);
                $scope.days[0].month = addDateTemp.getMonth() + 1;
                $scope.days[0].year = addDateTemp.getFullYear();
                $scope.days[0].arr = getDays(addDateTemp.getMonth() + 1, addDateTemp.getDate());
                var todayTemp = angular.copy(today);
                if (todayTemp == 0) {
                    // xueboren change this line.
                    //todayTemp = 6;
                    todayTemp = 6;
                } else {
                    todayTemp = todayTemp - 1;
                }
                //默认选中当天
                $scope.days[0].arr[todayTemp].checked = true;
                //模拟有代办事项
                //$scope.days[0].arr[todayTemp].toDo = true;
                //$scope.days[0].arr[todayTemp + 1].toDo = true;
                $scope.year = addDateTemp.getFullYear();
                $scope.month = new Date().getMonth() + 1;
                isToday($scope.days[0].arr);
                $timeout(function () {
                    getWeekMarkDays($scope.days[0]);
                }, 10);
                $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
                $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
            };
            $scope.init();
//滚动日视图
            $scope.slideHasChanged = function (page_now) {
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': document.getElementById('mainTopId').clientHeight + 'px'
                    }
                }, 10);
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
                        getWeekMarkDays($scope.days[0])
                        $scope.days[1].arr = nextDays(7, $scope.days[0].arr, $scope.days[1]);
                        $scope.days[2].arr = nextDays(-7, $scope.days[0].arr, $scope.days[2]);
                        break;
                    //中间的视图
                    case 1:
                        isToday($scope.days[1].arr);
                        getWeekMarkDays($scope.days[1])
                        $scope.days[2].arr = nextDays(7, $scope.days[1].arr, $scope.days[2]);
                        $scope.days[0].arr = nextDays(-7, $scope.days[1].arr, $scope.days[0]);
                        break;
                    case 2:
                        isToday($scope.days[2].arr);
                        getWeekMarkDays($scope.days[2])
                        $scope.days[0].arr = nextDays(7, $scope.days[2].arr, $scope.days[0]);
                        $scope.days[1].arr = nextDays(-7, $scope.days[2].arr, $scope.days[1]);
                        break;
                }
            };

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
                if (month_getWeek == 0) {
                    month_getWeek = 7;
                }
                var count = 0;
                //var daysArr = [];
                for (var i = 1; i < month_getWeek; i++, count++) {
                    monthObj.arr.push({value: ''});
                }
                for (var j = 1; j <= months[month]; j++, count++) {
                    var temp = {
                        value: j
                    };
                    monthObj.arr.push(temp);
                }
                return monthObj;
            };
            var initFirstMonth = function (day) {
                var month_page_now = $ionicSlideBoxDelegate.$getByHandle('monthView-handle').currentIndex();
                var arr = $scope.monthView[month_page_now].arr;
                $timeout(function () {
                    for (var i = 0; i < arr.length; i++) {
                        if (day == arr[i].value) {
                            arr[i].checked = true;
                            if (day == mydate.getDate()) {
                                arr[i].isToday = true;
                            } else {
                                arr[i].isToday = false;
                            }
                            continue;
                        }
                        arr[i].isToday = false;
                        arr[i].checked = false;
                    }
                    $scope.$apply();
                }, 1);
                //$timeout(function(){
                //    $scope.$apply();
                //},1)
            };

            var monthInit = function (year, month, day) {
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': '316px'
                    };
                    document.getElementById('mainContentId').style.marginTop = '316px';
                }, 10);
                $timeout(function () {
                    $scope.topHeight = {
                        'margin-top': document.getElementById('mainTopId').clientHeight + 'px'
                    };
                    document.getElementById('mainContentId').style.marginTop = document.getElementById('mainTopId').clientHeight + 'px';
                }, 50);
                var month_page_now = $ionicSlideBoxDelegate.$getByHandle('monthView-handle').currentIndex();
                var addTemp = month_page_now + 1;
                var decTemp = month_page_now - 1;
                if (addTemp == 3) {
                    addTemp = 0;
                }
                if (decTemp == -1) {
                    decTemp = 2;
                }
                $scope.monthView[month_page_now] = getMonthView(year, month);
                getMonthMarkDays($scope.monthView[month_page_now].arr);
                initFirstMonth(day);
                $scope.monthView[addTemp] = getMonthView(year, month + 1);
                $scope.monthView[decTemp] = getMonthView(year, month - 1);


            };
            //仅测试用,正式使用时需注释
            //monthInit($scope.year,$scope.month,new Date().getDate());
            var monthHeightTemp = 316;
            $scope.monthHasChanged = function (page_now) {
                $timeout(function () {
                    var monthHeightNow = document.getElementById('mainTopId').clientHeight;
                    $scope.monthHeight = {
                        'height': 'auto'
                    };
                    $scope.topHeight = {
                        'margin-top': monthHeightNow + 'px'
                    };
                }, 10);
                $scope.year = $scope.monthView[page_now].year;
                $scope.month = $scope.monthView[page_now].month;
                if (isLeapYear($scope.year)) {
                    months[2] = 29;
                } else {
                    months[2] = 28;
                }
                getMonthMarkDays($scope.monthView[page_now].arr);
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
            };
            /*----------------------------月视图 end----------------------------*/
            /*-------------------------------------------日历 end-------------------------------------------*/

            var getWeekMarkDays = function (days) {
                if($scope.role == 'APP_SERVICE'){
                    return
                }
                Prompter.showLoading();
                var startTemp, endTemp, monthTemp, isContinueFlag = isContinue(days.arr), yearTemp = days.year;
                //判断是否连续
                if (isContinueFlag) {
                    monthTemp = days.month;
                } else {
                    if (days.month == 1) {
                        yearTemp = days.year - 1;
                    }
                    monthTemp = days.month - 1;
                    if (monthTemp == 0) {
                        monthTemp = 12;
                    }
                }
                startTemp = yearTemp + '-' + monthTemp + '-' + days.arr[0].value;
                endTemp = $scope.year + '-' + days.month + '-' + days.arr[6].value;
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_DATE": {
                        "DATE_FROM": startTemp,
                        "DATE_TO": endTemp,
                        "ESTAT": "E0001"
                    },
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_GET_CALENDAR', data)
                    .success(function (response) {
                        Prompter.hideLoading();
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            var tempArr = response.ET_CALENDAR.item_out;
                            angular.forEach(tempArr, function (x) {
                                if (isContinueFlag) {
                                    angular.forEach(days.arr, function (y) {
                                        if (x.DATE == new Date($scope.year + '/' + days.month + '/' + y.value).format('yyyy-MM-dd')) {
                                            y.toDo = true;
                                        }
                                    })
                                } else {
                                    angular.forEach(days.arr, function (y) {
                                        if (y.value < 7) {
                                            monthTemp = days.month;
                                            yearTemp = days.year;
                                        }else {
                                            if (days.month == 1) {
                                                yearTemp = days.year - 1;
                                            }
                                            monthTemp = days.month-1;
                                        }
                                        if (x.DATE == new Date(yearTemp + '/' + monthTemp + '/' + y.value).format('yyyy-MM-dd')) {
                                            y.toDo = true;
                                        }
                                    })
                                }
                            });
                        }
                    })
            };
            var getMonthMarkDays = function (monthArr) {
                if($scope.role == 'APP_SERVICE'){
                    return
                }
                Prompter.showLoading();
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_DATE": {
                        "DATE_FROM": $scope.year +'-'+ $scope.month +'-'+ '1',
                        "DATE_TO": $scope.year+'-' + $scope.month+'-' + months[$scope.month],
                        "ESTAT": "E0001"
                    },
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_GET_CALENDAR', data)
                    .success(function (response) {
                        Prompter.hideLoading();
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            var tempArr = response.ET_CALENDAR.item_out;
                            console.log(monthArr)
                            angular.forEach(tempArr, function (x) {
                                angular.forEach(monthArr, function (y) {
                                    if (y.value&&x.DATE == new Date($scope.year + '/' + $scope.month + '/' + y.value).format('yyyy-MM-dd')) {
                                        y.toDo = true;
                                    }
                                })
                            })
                        }
                    })
            };
            $scope.marks = ['#cf021b', '#f5a623', '#4a90e2', '#f8e71c', '#417505'];
            $scope.loadMoreFlag = true;
            $scope.thingsToDo = [];
            $scope.salesArr = [];
            var salePageNum = 1;
            var getSalesArr = function (type) {
                if (type == 'init') {
                    $scope.loadMoreHasData = true;
                    salePageNum = 1;
                    var arr = document.getElementsByClassName('flipInX');
                    for (var i = 0; i < arr.length; i++) {
                        angular.element(arr[i]).removeClass('animated');
                    }
                    $scope.loadMoreFlag = true;
                    $scope.contentArr = [];
                    $ionicScrollDelegate.scrollTop(true);
                }
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_ACTIVITY": {
                        "OBJECT_ID": "",
                        "DESCSEARCH": "",
                        "PROCESS_TYPE": "",
                        "ZZHDJJD": "",
                        "CUSTOMER": "",
                        "DATE_FROM": selectDate,
                        "DATE_TO": selectDate,
                        "ESTAT": "",
                        "SALESNO": "",
                        "SELF_ONLY": "X"
                    },
                    "IS_PAGE": {
                        "CURRPAGE": salePageNum++,
                        "ITEMS": "10"
                    },
                    //"IS_USER": {"BNAME": window.localStorage.crmUserName}
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                var startTime = new Date().getTime();
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ACTIVITY_LIST', data)
                    .success(function (response, status, headers, config) {
                        if (config.data.IS_ACTIVITY.DATE_FROM != selectDate ||
                            type == 'init' && $scope.contentArr.length != 0) {
                            return
                        }
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            Prompter.hideLoading();
                            $scope.contenHideFlag = false;
                            if (response.ET_LIST.item.length < 10) {
                                $scope.loadMoreFlag = false;
                            }
                            ;
                            var tempArr = response.ET_LIST.item;
                            angular.forEach(tempArr, function (x) {
                                x.title = x.DESCRIPTION;
                                x.date = new Date(x.DATE_FROM);
                                x.startTime = x.TIME_FROM.substring(0, 5);
                                x.endTime = x.TIME_TO.substring(0, 5);
                            });
                            if (type === 'init') {
                                $scope.contentArr = tempArr;
                            } else {
                                $scope.contentArr = $scope.contentArr.concat(tempArr);
                            }
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            $ionicScrollDelegate.resize();
                        } else if(response.ES_RESULT.ZFLAG === 'E'){
                            $scope.loadMoreHasData = false;
                            $scope.loadMoreFlag = false;
                            //$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                    }).error(function (response, status, header, config) {
                    $scope.loadMoreHasData = false;
                    $scope.loadMoreFlag = false;
                    var respTime = new Date().getTime() - startTime;
                    //超时之后返回的方法
                    if (respTime >= config.timeout) {
                        console.log('HTTP timeout');
                        if (ionic.Platform.isWebView()) {
                            //Prompter.alert('请求超时', '提示', '确定');
                        }
                    }
                    Prompter.hideLoading();
                });
            };
            var profile;
            var getOrdersArr = function (type) {
                    if (type == 'init') {
                        $scope.loadMoreHasData = true;
                        salePageNum = 1;
                        var arr = document.getElementsByClassName('flipInX');
                        for (var i = 0; i < arr.length; i++) {
                            angular.element(arr[i]).removeClass('animated');
                        }
                        $scope.loadMoreFlag = true;
                        $scope.contentArr = [];
                        $ionicScrollDelegate.scrollTop(true);
                    }
                    if (LoginService.getProfile() == 'ZCATL_SRVEMP') {
                        profile = {
                            "item": {
                                "PARTNER_FCT": "",
                                "PARTNER_NO": window.localStorage.crmUserName
                            }
                        };
                    } else {
                        profile = {};
                    }
                    var data = {
                        "I_SYSNAME": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                        "IS_AUTHORITY": {"BNAME": window.localStorage.crmUserName},
                        "IS_PAGE": {
                            "CURRPAGE": salePageNum++,
                            "ITEMS": "10"
                        },
                        "IS_SEARCH": {
                            "SEARCH": "",
                            "OBJECT_ID": "",
                            "DESCRIPTION": "",
                            "PARTNER": "",
                            "PRODUCT_ID": "",
                            "CAR_TEXT": "",
                            "CREATED_FROM": selectDate,
                            "CREATED_TO": selectDate
                        },
                        "IV_SORT": "0",
                        "IT_IMPACT": {},
                        "IT_PARTNER": profile,
                        "IT_PROCESS_TYPE": {},
                        "IT_STAT": {
                            "item": [{
                                "STAT": "NEW"
                            }, {
                                "STAT": "INPR"
                            }, {
                                "STAT": "DIST"
                            }, {
                                "STAT": "REJC"
                            }]
                        }
                    };
                    var startTime = new Date().getTime();
                    HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'SERVICE_LIST', data)
                        .success(function (response, status, headers, config) {
                            if (config.data.IS_SEARCH.CREATED_FROM != selectDate ||
                                type == 'init' && $scope.contentArr.length != 0) {
                                return
                            }
                            if (response.ES_RESULT.ZFLAG === 'S') {
                                Prompter.hideLoading();
                                $scope.contenHideFlag = false;
                                if (response.ET_OUT_LIST.item1.length < 10) {
                                    $scope.loadMoreFlag = false;
                                }
                                ;
                                var tempArr = response.ET_OUT_LIST.item1;
                                angular.forEach(tempArr, function (x) {
                                    x.CHANGED_AT = x.CHANGED_AT + "";
                                    x.title = x.DESCRIPTION;
                                    x.date = new Date(x.CHANGED_AT.substring(0, 4) + '/' + x.CHANGED_AT.substring(4, 6) + '/' + x.CHANGED_AT.substring(6, 8));
                                    x.startTime = x.CHANGED_AT.substring(8, 10) + ':' + x.CHANGED_AT.substring(10, 12);
                                });
                                if (type === 'init') {
                                    $scope.contentArr = tempArr;
                                } else {
                                    $scope.contentArr = $scope.contentArr.concat(tempArr);
                                }
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                                $ionicScrollDelegate.resize();
                            } else if(response.ES_RESULT.ZFLAG === 'E'){
                                $scope.loadMoreHasData = false;
                                $scope.loadMoreFlag = false;
                                //$cordovaToast.showShortBottom(response.ES_RESULT.ZRESULT);
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            }
                        }).error(function (response, status, header, config) {
                        $scope.loadMoreHasData = false;
                        $scope.loadMoreFlag = false;
                        var respTime = new Date().getTime() - startTime;
                        //超时之后返回的方法
                        if (respTime >= config.timeout) {
                            console.log('HTTP timeout');
                            if (ionic.Platform.isWebView()) {
                                //Prompter.alert('请求超时', '提示', '确定');
                            }
                        }
                        $ionicLoading.hide();
                    });
                }
                ;
            $scope.getList = function (type) {
                if ($scope.selectModeText == '销售活动') {
                    getSalesArr(type);
                } else {
                    getOrdersArr(type);
                }
            };
            $scope.goDetail = function (x) {
                if ($scope.selectModeText == '销售活动') {
                    saleActService.actDetail = {
                        OBJECT_ID: x.OBJECT_ID
                    };
                    $state.go('saleActDetail');
                } else {
                    worksheetDataService.worksheetList.toDetail = {
                        "IS_OBJECT_ID": x.OBJECT_ID,
                        "IS_PROCESS_TYPE": x.PROCESS_TYPE,
                        "ydWorksheetNum": x.SOLDTO_NAME,
                        'ydStatusNum': x.STAT
                    };
                    if (x.PROCESS_TYPE == "ZNCO" || x.PROCESS_TYPE == "ZNCV") {
                        $state.go("worksheetDetail", {
                            detailType: 'newCar'
                        });
                    } else if (x.PROCESS_TYPE == "ZPRO" || x.PROCESS_TYPE == "ZPRV") {
                        $state.go("worksheetDetail", {
                            detailType: 'siteRepair'
                        });
                    } else if (x.PROCESS_TYPE == "ZPLO" || x.PROCESS_TYPE == "ZPLV") {
                        $state.go("worksheetDetail", {
                            detailType: 'batchUpdate'
                        });
                    }
                }
            };
            //初始化
            $scope.getList('init');
            $scope.contentArr = $scope.thingsToDo;
            $scope.moreApps = function () {
                //$ionicBackdrop.retain();
            };
            $scope.chooseMark = function (x, color) {
                x.showMarks = false;
                x.mark = color;
            };
            $scope.showMarks = function (x, e) {
                x.showMarks = !x.showMarks;
                e.stopPropagation();
            };
            $scope.delete = function (x) {
                x.class = 'own-animated zoomOutRight';
                var arr = document.getElementsByClassName('obj');
                for (var i = 0; i < arr.length; i++) {
                    arr[i].style.transitionDelay = '0s';
                }
                $timeout(function () {
                    $scope.contentArr.splice($scope.contentArr.indexOf(x), 1);
                }, 10);
            };

            /*切换销售活动与代办*/
            $scope.selectArr = [{text: '销售活动', flag: false}, {text: '服务工单', flag: true}];
            $scope.changePop = function (x) {
                if ($scope.selectModeText != x.text) {
                    $scope.selectModeText = x.text;
                    $scope.getList('init');
                }
                $scope.modeFlag = x.flag;
                $('#mainSelectionsId').removeClass('own-animated');
                $scope.showPop = false;

            };
            $scope.changeShowPop = function () {
                $scope.showPop = !$scope.showPop;
                $('#mainSelectionsId').removeClass('own-animated');
            };

            /*--------------------------------------新建-------------------------------------*/
            //销售活动
            if (Prompter.isATL()) {
                $scope.createPopTypes = saleActService.createPopTypes_ATL;
            } else {
                $scope.createPopTypes = saleActService.getCreatePopTypes();
            }

            $scope.createPopOrgs = saleActService.getCreatePopOrgs();
            $scope.pop = {
                type: {}
            };
            $scope.salesGroup = [];
            $ionicPopover.fromTemplateUrl('src/applications/saleActivities/modal/createSaleAct_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.createPop = popover;
            });
            $scope.openCreatePop = function () {
                Prompter.showLoading();
                $scope.pop.type = $scope.createPopTypes[0];
                $scope.salesGroup = [];
                $scope.creaeSpinnerFlag = true;
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ORGMAN', data)
                    .success(function (response) {
                        $scope.creaeSpinnerFlag = false;
                        var tempOfficeArr = [];
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            for (var i = 0; i < response.ET_ORGMAN.item.length; i++) {
                                if (response.ET_ORGMAN.item[i].SALES_GROUP && tempOfficeArr.indexOf(response.ET_ORGMAN.item[i].SALES_OFFICE) == -1) {
                                    $scope.salesGroup.push(response.ET_ORGMAN.item[i]);
                                    tempOfficeArr.push(response.ET_ORGMAN.item[i].SALES_OFFICE);
                                }
                            }
                            $scope.pop.saleOffice = $scope.salesGroup[0];
                            Prompter.hideLoading();
                            $scope.createPop.show();
                            //}
                        } else if(response.ES_RESULT.ZFLAG === 'E'){
                            Prompter.showShortToastBotton('无法创建');
                        }
                    });
            };
            $scope.showCreateModal = function () {
                $scope.createPop.hide();
                $ionicModal.fromTemplateUrl('src/applications/saleActivities/modal/create_Modal/createSaleAct_Modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.createModal = modal;
                    modal.show();
                    var tempArr = document.getElementsByClassName('modal-wrapper');
                    for (var i = 0; i < tempArr.length; i++) {
                        tempArr[i].style.pointerEvents = 'auto';
                    }
                });
            };

            //机会
            $scope.chancePop = {
                type: {}
            };
            $scope.createChancePopData = saleChanService.createPop;
            $ionicPopover.fromTemplateUrl('src/applications/saleChance/modal/create_Pop.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.createChancePop = popover;
            });
            $scope.openCreateChancePop = function () {
                Prompter.showLoading();
                $scope.salesChanceGroup = [];
                var data = {
                    "I_SYSTEM": {"SysName": ROOTCONFIG.hempConfig.baseEnvironment},
                    "IS_USER": {"BNAME": window.localStorage.crmUserName}
                };
                HttpAppService.post(ROOTCONFIG.hempConfig.basePath + 'ORGMAN', data)
                    .success(function (response) {
                        Prompter.hideLoading();
                        var tempOfficeArr = [];
                        if (response.ES_RESULT.ZFLAG === 'S') {
                            for (var i = 0; i < response.ET_ORGMAN.item.length; i++) {
                                response.ET_ORGMAN.item[i].text = response.ET_ORGMAN.item[i].SALES_OFF_SHORT.split(' ')[1];
                                if (response.ET_ORGMAN.item[i].SALES_GROUP && tempOfficeArr.indexOf(response.ET_ORGMAN.item[i].SALES_OFFICE) == -1) {
                                    $scope.salesChanceGroup.push(response.ET_ORGMAN.item[i]);
                                    tempOfficeArr.push(response.ET_ORGMAN.item[i].SALES_OFFICE);
                                }
                            }
                            if ($scope.salesChanceGroup.length > 1) {
                                $scope.chancePop.saleOffice = $scope.salesChanceGroup[0];
                                $scope.createChancePop.show();
                            } else {
                                $scope.chancePop.saleOffice = $scope.salesChanceGroup[0];
                                $scope.showCreateChanceModal();
                            }
                        } else if(response.ES_RESULT.ZFLAG === 'E'){
                            Prompter.showShortToastBotton('无法创建');
                        }
                    });
            };
            $scope.showCreateChanceModal = function () {
                $scope.createChancePop.hide();
                $ionicModal.fromTemplateUrl('src/applications/saleChance/modal/create_Modal/create_Modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.createChanceModal = modal;
                    modal.show();
                    var tempArr = document.getElementsByClassName('modal-wrapper');
                    for (var i = 0; i < tempArr.length; i++) {
                        tempArr[i].style.pointerEvents = 'auto';
                    }
                });
            };
            //联系人
            $scope.createContact = function () { //EMPLOYEE
                if(LoginService.getAuthInfoByFunction('LINKMAN').CREATE == false){
                    Prompter.alert('您没有创建权限!');
                }else{
                    $state.go('ContactCreate');
                }
            };
            //拜访
            $scope.openCreateVisit = function () {
                Prompter.alert('该功能尚未开通,敬请期待!');
            };
            //签到
            $scope.openCreateCheck = function () {
                Prompter.alert('该功能尚未开通,敬请期待!');
            };
            /*-------------------------------新建 end-------------------------------------*/
            $scope.$on('$destroy', function () {
                $scope.createPop.remove();
                $scope.createChancePop.remove();
            });
        }
    ])
;
