/**
 * Created by zhangren on 16/3/7.
 */
'use strict';
mainModule
    .controller('MainCtrl', ['$scope', 'ionicMaterialInk', function ($scope, ionicMaterialInk) {
        var today = new Date().getDay();
        console.log(today)

        ionicMaterialInk.displayEffect();
        $scope.weeks = [{value: '一', flag: false}, {value: '二', flag: false}, {value: '三', flag: false
        }, {value: '四', flag: false}, {value: '五', flag: false}, {value: '六', flag: false}, {value: '日', flag: false}];
        $scope.weeks[today-1].today = '今';
        $scope.selectDay = function (x) {
            for (var i = 0; i < $scope.weeks.length; i++) {
                $scope.weeks[i].flag = false;
            }
            x.flag = true;
        }
    }]);