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
    var filters = {
        types:[{
            text:'EBUS销售机会'
        },{
            text:'ESS销售机会'
        },{
            text:'ECAR销售机会'
        },{
            text:'销售机会'
        }],
        statusFirst:[{
            text:'赢得'
        },{
            text:'失去'
        },{
            text:'处理中'
        }],
        statusSecond:[{
            text:'被客户终止'
        },{
            text:'被我们终止'
        }]
    };
    var createPop = {
        types:[{
            text:'EBUS销售机会',
            value:'ZO02'
        },{
            text:'ECAR销售机会',
            value:'ZO03'
        },{
            text:'ESS销售机会',
            value:'ZO04'
        }],
        channels:[{
            text:'公司间',
            value:''
        },{
            text:'内销',
            value:''
        },{
            text:'外销',
            value:''
        }]
    };
    var saleStages = [{
        text:'关系建立阶段',
        value:''
    },{
        text:'方案沟通确认',
        value:''
    },{
        text:'A样',
        value:''
    },{
        text:'B样',
        value:''
    },{
        text:'C样',
        value:''
    },{
        text:'D样',
        value:''
    },{
        text:'SOP阶段',
        value:''
    },{
        text:'投标报价阶段',
        value:''
    }];
    var saleUnits = [{
        value:'AH',
        text:'安时'
    },{
        value:'KWH',
        text:'千瓦时'
    },{
        value:'PSC',
        text:'个、件'
    },{
        value:'SET',
        text:'套、台'
    }];
    var chanListArr=[],listPage=1,obj_id;
    return{
        getStatusArr: function () {
            return statusArr;
        },
        getStagesArr: function () {
            return stagesArr;
        },
        getMoneyTypesArr: function () {
            return moneyTypes;
        },
        chanListArr,listPage,obj_id,filters,createPop,saleStages,saleUnits
    };
});