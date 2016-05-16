/**
 * Created by zhangren on 16/5/6.
 */
'use strict';
salesModule.factory('saleClueService', function () {
    var saleClueStatus = {
        status: [
            {
                text: '未处理',
                value: 'E0001'
            }, {
                text: '分配给BO',
                value: 'E0002'
            }, {
                text: '分配给销售',
                value: 'E0003'
            }, {
                text: '转为商机',
                value: 'E0004'
            }, {
                text: '关闭',
                value: 'E0005'
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
    }, {
        text: 'PHEV',
        code: 'PHEV'
    }, {
        text: '启停',
        code: '启停'
    }, {
        text: 'HEV',
        code: 'HEV'
    }, {
        text: '大型储能',
        code: '大型储能'
    }, {
        text: '家用储能',
        code: '家用储能'
    }, {
        text: 'UPS',
        code: 'UPS'
    }, {
        text: '其他',
        code: '其他'
    }];
    //产品线
    var productLine = [{
        text: 'E-BUS',
        code: 'E-BUS'
    }, {
        text: 'E-CAR',
        code: 'E-CAR'
    }, {
        text: 'OCAR',
        code: 'OCAR'
    }, {
        text: 'ESS',
        code: 'ESS'
    }];
    //产品类型
    var productType = [{
        text: 'PACK',
        code: 'PACK'
    }, {
        text: 'MODULE',
        code: 'MODULE'
    }, {
        text: 'CELL',
        code: 'CELL'
    }, {
        text: 'BMU',
        code: 'BMU'
    }, {
        text: 'BMS',
        code: 'BMS'
    }];
    //重量
    var weight = [{
        text:'吨'
    },{
        text:'千克'
    }];  
    //客户类型
    var customerType = [{
        text: 'PACK厂',
        code: '01'
    }, {
        text: '代理商',
        code: '02'
    }, {
        text: 'OEM',
        code: '03'
    }, {
        text: 'ODM',
        code: '04'
    }, {
        text: '终端客户',
        code: '05'
    }];
    //应用类别
    var applyClass = [{
        text: 'CE',
        code: '1'
    }, {
        text: 'EV',
        code: '2'
    }, {
        text: 'ESS',
        code: '3'
    }, {
        text: '供应链',
        code: '4'
    }, {
        text: '邀展',
        code: '5'
    }];
    //产品应用
    var productApply = [{
        text: 'BTH',
        code: '001'
    }, {
        text: 'DSC',
        code: '002'
    }, {
        text: 'EBK',
        code: '003'
    }, {
        text: 'GPS',
        code: '004'
    }, {
        text: 'MPH',
        code: '005'
    }, {
        text: 'MPX',
        code: '006'
    }, {
        text: 'NBP',
        code: '007'
    }, {
        text: 'OTH',
        code: '008'
    }, {
        text: 'PPK',
        code: '009'
    }, {
        text: 'PTL',
        code: '010'
    }, {
        text: 'SMC',
        code: '011'
    }, {
        text: 'TOY',
        code: '012'
    }, {
        text: 'UPS',
        code: '013'
    }, {
        text: 'TPC',
        code: '014'
    }, {
        text: 'EBI',
        code: '015'
    }, {
        text: 'WRB',
        code: '016'
    }, {
        text: 'WTH',
        code: '017'
    }, {
        text: '无人机',
        code: '018'
    }];
    //长度单位制
    var linearMeasure = [
        {
            text: '公分',
            code: 'CM'
        }, {
            text: '分米',
            code: 'DM'
        }, {
            text: '英尺',
            code: 'FT'
        }, {
            text: '英寸',
            code: 'INC'
        }, {
            text: '公里',
            code: 'KM'
        }, {
            text: '米',
            code: 'M'
        }, {
            text: '英里',
            code: 'MI'
        }, {
            text: '毫米',
            code: 'MM'
        }, {
            text: '纳米',
            code: 'NAM'
        }, {
            text: '微米',
            code: '礛'
        }, {
            text: '码',
            code: '码'
        }
    ];

    return {
        saleClueStatus,
        relationPositionArr,
        clueSource,
        applyField,
        applyType,
        productLine,
        productType,
        weight,
        customerType,
        applyClass,
        productApply,
        linearMeasure
    }
});