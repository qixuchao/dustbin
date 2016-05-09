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
    var relationPositionArr = {
        ATL: [{
            text: '竞争对手',
            code: '00000023 '
        }, {
            text: 'ATL BO',
            code: 'Z0000002'
        }, {
            text: 'ATL销售',
            code: 'Z0000003'
        }, {
            text: 'ATL销售经理',
            code: 'Z0000006 '
        }],
        CATL: [{
            text: 'CATL BO',
            code: 'Z0000002'
        }, {
            text: 'CATL销售',
            code: 'Z0000003'
        }, {
            text: '竞争对手',
            code: '00000023'
        }]
    };
    //线索来源
    var clueSource = [{
        text: '商业展览',
        code: '001'
    }, {
        text: '外部合作伙伴',
        code: '002'
    }, {
        text: '营销活动',
        code: '003'
    }, {
        text: '电话查询',
        code: '004'
    }, {
        text: 'Roadshow',
        code: '005'
    }, {
        text: '活动响应',
        code: '006'
    }, {
        text: '会议活动',
        code: 'Z01'
    }, {
        text: '展览',
        code: 'Z02'
    }, {
        text: '官网',
        code: 'Z03'
    }, {
        text: '论坛推广',
        code: 'Z04'
    }, {
        text: '媒体',
        code: 'Z05'
    }];
    //应用领域
    var applyField = [{
        text: '大巴',
        code: '大巴'
    }, {
        text: '公交',
        code: '公交'
    }, {
        text: '乘用车',
        code: '乘用车'
    }, {
        text: '物流车',
        code: '物流车'
    }, {
        text: '摆渡车',
        code: '摆渡车'
    }, {
        text: '卡车',
        code: '卡车'
    }, {
        text: '储能',
        code: '储能'
    }, {
        text: '其他',
        code: '其他'
    }];
    //应用类型
    var applyType = [{
        text: 'BEV',
        code: 'BEV'
    },{
        text: 'PHEV',
        code: 'PHEV'
    },{
        text: '启停',
        code: '启停'
    },{
        text: 'HEV',
        code: 'HEV'
    },{
        text: '大型储能',
        code: '大型储能'
    },{
        text: '家用储能',
        code: '家用储能'
    },{
        text: 'UPS',
        code: 'UPS'
    },{
        text: '其他',
        code: '其他'
    }];
    //产品线
    var productLine = [{
        text:'E-BUS',
        code:'E-BUS'
    },{
        text:'E-CAR',
        code:'E-CAR'
    },{
        text:'OCAR',
        code:'OCAR'
    },{
        text:'ESS',
        code:'ESS'
    }];
    //产品类型
    var productType = [{
        text:'PACK',
        code:'PACK'
    },{
        text:'MODULE',
        code:'MODULE'
    },{
        text:'CELL',
        code:'CELL'
    },{
        text:'BMU',
        code:'BMU'
    },{
        text:'BMS',
        code:'BMS'
    }];
    //重量
    var weight = [{
        text:'吨'
    },{
        text:'千克'
    }];

    return {
        saleClueStatus,
        relationPositionArr,
        clueSource,
        applyField,
        applyType,
        productLine,
        productType,
        weight
    }
});