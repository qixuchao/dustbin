/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', ['$scope', 'ionicMaterialInk', function ($scope, ionicMaterialInk) {



        ionicMaterialInk.displayEffect();
        /*--------------------------------------------日历--------------------------------------------*/
        //判断是否是闰年,2月平年28天、闰年29天
        var isLeapYear = function(year)
        {
            return ((year%4==0&&year%100!=0)||year%400==0);
        }
        var mydate = new Date();
        //当天周几
        var today = mydate.getDay();
        //当天多少号
        var day = mydate.getDate();
        var year = mydate.getFullYear();
        var month = mydate.getMonth()+1;
        console.log(year+'----'+month+'----'+day+'----'+isLeapYear(year))

        $scope.weeks = [{value: '一', flag: false}, {value: '二', flag: false}, {value: '三', flag: false
        }, {value: '四', flag: false}, {value: '五', flag: false}, {value: '六', flag: false}, {value: '日', flag: false}];
        $scope.weeks[today-1].today = '今';
        $scope.selectDay = function (x) {
            for (var i = 0; i < $scope.weeks.length; i++) {
                $scope.weeks[i].flag = false;
            }
            x.flag = true;
        }

        /*-------------------------------------------日历 end-------------------------------------------*/
    }]);
