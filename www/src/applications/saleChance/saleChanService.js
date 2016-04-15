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
        value: '关系建立阶段',
        code: ''
    }, {
        value: '方案沟通阶段',
        code: ''
    }, {
        value: '样品合同签订',
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
        value: '投标报价阶段',
        code: ''
    }, {
        value: '合同签订',
        code: ''
    }];
    var listStatusArr = [{
        text:'赢得',
        value:'E0002',
        color:'#FF8C2D'
    },{
        text:'失去',
        value:'E0003',
        color:'#e24976'
    },{
        text:'处理中',
        value:'E0001',
        color:'#9ec92a'
    },{
        text:'被客户终止',
        value:'E0004',
        color:'#e24976'
    },{
        text:'被我们终止',
        value:'E0005',
        color:'#e24976'
    }];
    var filters = {
        types:[{
            text:'EBUS销售机会',
            value:'ZO02',
            sysName:'CATL'
        },{
            text:'ESS销售机会',
            value:'ZO04',
            sysName:'CATL'
        },{
            text:'ECAR销售机会',
            value:'ZO03',
            sysName:'CATL'
        },{
            text:'销售机会',
            value:'ZO01',
            sysName:'ATL'
        }],
        statusFirst:[{
            text:'赢得',
            value:'E0002',
            color:'#FF8C2D'
        },{
            text:'失去',
            value:'E0003',
            color:'#e24976'
        },{
            text:'处理中',
            value:'E0001',
            color:'#9ec92a'
        }],
        statusSecond:[{
            text:'被客户终止',
            value:'E0004',
            color:'#e24976'
        },{
            text:'被我们终止',
            value:'E0005',
            color:'#e24976'
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
        value:'Z01'
    },{
        text:'方案沟通确认',
        value:'Z03'
    },{
        text:'A样',
        value:'Z08'
    },{
        text:'B样',
        value:'Z09'
    },{
        text:'C样',
        value:'Z10'
    },{
        text:'D样',
        value:'Z11'
    },{
        text:'SOP阶段',
        value:'Z12'
    },{
        text:'投标报价阶段',
        value:'Z13'
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
    var relationsTypes = [{
        text:'竞争对手',
        code:'00000023'
    },{
        text:'客户',
        code:'00000021'
    },{
        text:'联系人',
        code:'00000015'
    },{
        text:'CATL销售',
        code:'Z0000003'
    },{
        text:'CATL销售2',
        code:'Z0000004'
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
        }
    };
});