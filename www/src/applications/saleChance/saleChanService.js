/**
 * Created by zhangren on 16/4/5.
 */
'use strict';
salesModule.factory('saleChanService', function () {
    var moneyTypes = [{
        value:'CNY',
        text:'中国人民币'
    },{
        value:'USD',
        text:'美国'
    },{
        value:'EUR',
        text:'欧洲(欧元)'
    },{
        value:'GBP',
        text:'英镑'
    },{
        value:'HKD',
        text:'港币'
    },{
        value:'JPY',
        text:'日元'
    }];
    var statusArr = [{
        value: '未处理',
        code: '',
        color:'#e24976'
    }, {
        value: '处理中',
        code: '',
        color:'#a0cb00'
    }, {
        value: '已完成',
        code: '',
        color:'#a0cb00'
    }, {
        value: '已取消',
        code: '',
        color:'#e24976'
    }];
    var stagesArr = [{
        value: '关系建立',
        code: ''
    }, {
        value: '方案沟通',
        code: ''
    }, {
        value: '样品合同',
        code: ''
    }, {
        value: '样品设计',
        code: ''
    }, {
        value: '样品试制',
        code: ''
    }, {
        value: '样品测试',
        code: ''
    }, {
        value: 'SOP阶段',
        code: ''
    }, {
        value: '投标报价',
        code: ''
    }, {
        value: '合同签订',
        code: ''
    }];
    return{
        getStatusArr: function () {
            return statusArr;
        },
        getStagesArr: function () {
            return stagesArr;
        },
        getMoneyTypesArr: function () {
            return moneyTypes;
        }
    };
});