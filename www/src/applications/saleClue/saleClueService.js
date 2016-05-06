/**
 * Created by zhangren on 16/5/6.
 */
'use strict';
salesModule.factory('saleClueService', function () {
    var saleClueStatus = {
        status: [
            {
                text: '未处理',
                value: 'Z001'
            }, {
                text: '分配给BO',
                value: 'Z002'
            }, {
                text: '分配给销售',
                value: 'Z003'
            }, {
                text: '转为商机',
                value: 'Z004'
            }, {
                text: '关闭',
                value: 'Z005'
            }]
    };
    return {
        saleClueStatus
    }
});