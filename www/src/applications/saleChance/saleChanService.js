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
        code: 'E0001',
        color:'#e24976'
    }, {
        value: '处理中',
        code: 'E0002',
        color:'#a0cb00'
    }, {
        value: '已完成',
        code: 'E0003',
        color:'#a0cb00'
    }, {
        value: '已取消',
        code: 'E0004',
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
            color:'#9ec92a',
            flag:true
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
    var saleStages2 = [{
        text:'关系建立阶段',
        value:'Z01'
    },{
        text:'技术交流及式样阶段',
        value:'Z02'
    },{
        text:'方案沟通确认',
        value:'Z03'
    },{
        text:'样品合同签订',
        value:'Z04'
    },{
        text:'样品设计',
        value:'Z05'
    },{
        text:'样品试制',
        value:'Z06'
    },{
        text:'样品测试',
        value:'Z07'
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
    var saleStages = {
        CATL:{
            EBUS:[{
                text:'关系建立阶段',
                value:'Z01',
                confidence:0
            },{
                text:'方案沟通确认',
                value:'Z03',
                confidence:20
            },{
                text:'样品合同签订',
                value:'Z04',
                confidence:20
            },{
                text:'样品设计',
                value:'Z05',
                confidence:20
            },{
                text:'样品试制',
                value:'Z06',
                confidence:20
            },{
                text:'样品测试',
                value:'Z07',
                confidence:20
            },{
                text:'SOP阶段',
                value:'Z12',
                confidence:80
            },{
                text:'投标报价阶段',
                value:'Z13',
                confidence:90
            },{
                text:'合同签订',
                value:'Z14',
                confidence:90
            }],
            ECAR:[{
                text:'关系建立阶段',
                value:'Z01',
                confidence:0
            },{
                text:'方案沟通确认',
                value:'Z03',
                confidence:20
            },{
                text:'A样',
                value:'Z08',
                confidence:20
            },{
                text:'B样',
                value:'Z09',
                confidence:20
            },{
                text:'C样',
                value:'Z10',
                confidence:20
            },{
                text:'D样',
                value:'Z11',
                confidence:20
            },{
                text:'SOP阶段',
                value:'Z12',
                confidence:80
            },{
                text:'投标报价阶段',
                value:'Z13',
                confidence:80
            },{
                text:'合同签订',
                value:'Z14',
                confidence:90
            },{
                text:'EOP阶段',
                value:'Z15',
                confidence:90
            }],
            ESS:[{
                text:'关系建立阶段',
                value:'Z01',
                confidence:0
            },{
                text:'方案沟通确认',
                value:'Z03',
                confidence:20
            },{
                text:'样品合同签订',
                value:'Z04',
                confidence:20
            },{
                text:'样品设计',
                value:'Z05',
                confidence:20
            },{
                text:'样品试制',
                value:'Z06',
                confidence:20
            },{
                text:'样品测试',
                value:'Z07',
                confidence:20
            },{
                text:'SOP阶段',
                value:'Z12',
                confidence:80
            },{
                text:'投标报价阶段',
                value:'Z13',
                confidence:80
            },{
                text:'合同签订',
                value:'Z14',
                confidence:90
            }]
        },
        ATL:[{
            text:'关系建立阶段',
            value:'Z1',
            confidence:0
        },{
            text:'技术交流及式样阶段',
            value:'Z2',
            confidence:20
        },{
            text:'投标报价阶段',
            value:'Z3',
            confidence:80
        },{
            text:'合同签订',
            value:'Z4',
            confidence:90
        }]
    };
    var saleUnits = [{
        value:'AH',
        text:'安时'
    },{
        value:'KWH',
        text:'千瓦时'
    },{
        value:'PCS',
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
    var relationsTypes_ATL = [{
        text:'竞争对手',
        code:'00000023'
    },{
        text:'客户',
        code:'00000021'
    },{
        text:'联系人',
        code:'00000015'
    },{
        text:'ATL销售',
        code:'Z0000003'
    },{
        text:'ATL销售2',
        code:'Z0000004'
    }];
    var relationsTypesForAdd = [{
        text:'竞争对手',
        code:'00000023'
    },{
        text:'客户',
        code:'00000021'
    },{
        text:'联系人',
        code:'00000015'
    },{
        text:'CATL销售2',
        code:'Z0000004'
    }];
    var relationsTypesForAdd_ATL = [{
        text:'竞争对手',
        code:'00000023'
    },{
        text:'客户',
        code:'00000021'
    },{
        text:'联系人',
        code:'00000015'
    },{
        text:'ATL销售2',
        code:'Z0000004'
    }];
    var chanceTypes = [{
        text:'EBUS',
        code:'Z002'
    },{
        text:'ECAR',
        code:'Z003'
    },{
        text:'ESS',
        code:'Z004'
    }];
    var chanListArr=[],
        listPage=1,
        obj_id,
        loadMoreFlag=true;
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
        chanListArr,
        listPage,
        obj_id,
        filters,
        createPop,
        saleStages,
        saleUnits,
        listStatusArr,
        relationsTypes,
        loadMoreFlag,
        relationsTypesForAdd,
        relationsTypes_ATL,
        saleStages2,
        relationsTypesForAdd_ATL,
        chanceTypes
        }
});