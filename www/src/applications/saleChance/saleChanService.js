/**
 * Created by zhangren on 16/4/5.
 */
'use strict';
salesModule.factory('saleChanService', function () {
    var moneyTypes = [{
        value: 'CNY',
        text: '中国人民币'
    }, {
        value: 'USD',
        text: '美国'
    }, {
        value: 'EUR',
        text: '欧洲(欧元)'
    }, {
        value: 'GBP',
        text: '英镑'
    }, {
        value: 'HKD',
        text: '港币'
    }, {
        value: 'JPY',
        text: '日元'
    }];
    var statusArr = [{
        value: '未处理',
        code: 'E0001',
        color: '#e24976'
    }, {
        value: '处理中',
        code: 'E0002',
        color: '#a0cb00'
    }, {
        value: '已完成',
        code: 'E0003',
        color: '#a0cb00'
    }, {
        value: '已取消',
        code: 'E0004',
        color: '#e24976'
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
        text: '赢得',
        value: 'E0002',
        color: '#FF8C2D'
    }, {
        text: '失去',
        value: 'E0003',
        color: '#e24976'
    }, {
        text: '处理中',
        value: 'E0001',
        color: '#9ec92a'
    }, {
        text: '被客户终止',
        value: 'E0004',
        color: '#e24976'
    }, {
        text: '被我们终止',
        value: 'E0005',
        color: '#e24976'
    }];
    var filters = {
        types: [{
            text: 'EBUS销售机会',
            value: 'ZO02',
            sysName: 'CATL'
        }, {
            text: 'ESS销售机会',
            value: 'ZO04',
            sysName: 'CATL'
        }, {
            text: 'ECAR销售机会',
            value: 'ZO03',
            sysName: 'CATL'
        }, {
            text: '销售机会',
            value: 'ZO01',
            sysName: 'ATL'
        }],
        statusFirst: [{
            text: '赢得',
            value: 'E0002',
            color: '#FF8C2D'
        }, {
            text: '失去',
            value: 'E0003',
            color: '#e24976'
        }, {
            text: '处理中',
            value: 'E0001',
            color: '#9ec92a',
            flag: true
        }],
        statusSecond: [{
            text: '被客户终止',
            value: 'E0004',
            color: '#e24976'
        }, {
            text: '被我们终止',
            value: 'E0005',
            color: '#e24976'
        }]
    };
    var createPop = {
        types: [{
            text: 'EBUS销售机会',
            value: 'ZO02'
        }, {
            text: 'ECAR销售机会',
            value: 'ZO03'
        }, {
            text: 'ESS销售机会',
            value: 'ZO04'
        }],
        channels: [{
            text: '公司间',
            value: ''
        }, {
            text: '内销',
            value: ''
        }, {
            text: '外销',
            value: ''
        }]
    };
    var saleStages2 = [{
        text: '关系建立阶段',
        value: 'Z01'
    },
    //    {
    //    text: '技术交流及式样阶段',
    //    value: 'Z02'
    //},
        {
        text: '方案沟通确认',
        value: 'Z03'
    }, {
        text: '样品合同签订',
        value: 'Z04'
    }, {
        text: '样品设计',
        value: 'Z05'
    }, {
        text: '样品试制',
        value: 'Z06'
    }, {
        text: '样品测试',
        value: 'Z07'
    }, {
        text: 'A样',
        value: 'Z08'
    }, {
        text: 'B样',
        value: 'Z09'
    }, {
        text: 'C样',
        value: 'Z10'
    }, {
        text: 'D样',
        value: 'Z11'
    }, {
        text: 'SOP阶段',
        value: 'Z12'
    }, {
        text: '投标报价阶段',
        value: 'Z13'
    }];
    var saleStages = {
        CATL: {
            EBUS: [{
                text: '关系建立阶段',
                value: 'Z01',
                confidence: 0
            }, {
                text: '方案沟通确认',
                value: 'Z03',
                confidence: 20
            }, {
                text: '样品合同签订',
                value: 'Z04',
                confidence: 20
            }, {
                text: '样品设计',
                value: 'Z05',
                confidence: 20
            }, {
                text: '样品试制',
                value: 'Z06',
                confidence: 20
            }, {
                text: '样品测试',
                value: 'Z07',
                confidence: 20
            }, {
                text: 'SOP阶段',
                value: 'Z12',
                confidence: 80
            }, {
                text: '投标报价阶段',
                value: 'Z13',
                confidence: 90
            }, {
                text: '合同签订',
                value: 'Z14',
                confidence: 90
            }],
            ECAR: [{
                text: '关系建立阶段',
                value: 'Z01',
                confidence: 0
            }, {
                text: '方案沟通确认',
                value: 'Z03',
                confidence: 20
            }, {
                text: 'A样',
                value: 'Z08',
                confidence: 20
            }, {
                text: 'B样',
                value: 'Z09',
                confidence: 20
            }, {
                text: 'C样',
                value: 'Z10',
                confidence: 20
            }, {
                text: 'D样',
                value: 'Z11',
                confidence: 20
            }, {
                text: 'SOP阶段',
                value: 'Z12',
                confidence: 80
            }, {
                text: '投标报价阶段',
                value: 'Z13',
                confidence: 80
            }, {
                text: '合同签订',
                value: 'Z14',
                confidence: 90
            }, {
                text: 'EOP阶段',
                value: 'Z15',
                confidence: 90
            }],
            ESS: [{
                text: '关系建立阶段',
                value: 'Z01',
                confidence: 0
            }, {
                text: '方案沟通确认',
                value: 'Z03',
                confidence: 20
            }, {
                text: '样品合同签订',
                value: 'Z04',
                confidence: 20
            }, {
                text: '样品设计',
                value: 'Z05',
                confidence: 20
            }, {
                text: '样品试制',
                value: 'Z06',
                confidence: 20
            }, {
                text: '样品测试',
                value: 'Z07',
                confidence: 20
            }, {
                text: 'SOP阶段',
                value: 'Z12',
                confidence: 80
            }, {
                text: '投标报价阶段',
                value: 'Z13',
                confidence: 80
            }, {
                text: '合同签订',
                value: 'Z14',
                confidence: 90
            }]
        },
        ATL: [{
            text: '关系建立阶段',
            value: 'Z1',
            confidence: 0
        }, {
            text: '技术交流及式样阶段',
            value: 'Z2',
            confidence: 20
        }, {
            text: '投标报价阶段',
            value: 'Z3',
            confidence: 80
        }, {
            text: '合同签订',
            value: 'Z4',
            confidence: 90
        }]
    };
    var saleUnits = [{
        value: 'KWH',
        text: '千瓦时'
    }, {
        value: 'GWH',
        text: '百万千瓦时'
    }, {
        value: 'PCS',
        text: '个、件'
    }, {
        value: 'AH',
        text: '安时'
    }, {
        value: 'SET',
        text: '套、台'
    }];
    var timeDate = [{
        text: '小时',
        value: '小时'
    }, {
        text: '天',
        value: '天'
    }, {
        text: '周',
        value: '周'
    }, {
        text: '月',
        value: '月'
    }, {
        text: '年',
        value: '年'
    }];
    var saleChanceUnits_ATL = [{
        text: '安时',
        value: 'AH'
    }, {
        text: '作业单位',
        value: 'AU'
    }, {
        text: '带',
        value: 'BAG'
    }, {
        text: '批',
        value: 'BAT'
    }, {
        text: '本',
        value: 'BEN'
    }, {
        text: '瓶',
        value: 'BOT'
    }, {
        text: '罐',
        value: 'CAN'
    }, {
        text: '箱',
        value: 'CAR'
    }, {
        text: '盒',
        value: 'CAS'
    }, {
        text: '人民币',
        value: 'CNY'
    }, {
        text: '板条箱',
        value: 'CRT'
    }, {
        text: '案例',
        value: 'CV'
    }, {
        text: '度',
        value: 'DEG'
    }, {
        text: '鼓',
        value: 'DR'
    }, {
        text: '一打',
        value: 'DZ'
    }, {
        text: '个',
        value: 'EA'
    }, {
        text: '酶单位/毫升',
        value: 'EML'
    }, {
        text: '酶单位',
        value: 'EU'
    }, {
        text: '克 act.ingrd /公升',
        value: 'G\L'
    }, {
        text: '克 act. ingrd.',
        value: 'GAI'
    }, {
        text: '黄金克',
        value: 'GAU'
    }, {
        text: '总',
        value: 'GRO'
    }, {
        text: '件',
        value: 'JIA'
    }, {
        text: '千克作用 ingrd.',
        value: 'KAI'
    }, {
        text: 'kg act.ingrd. / kg',
        value: 'KIK'
    }, {
        text: '毫升 act. ingr.',
        value: 'MLI'
    }, {
        text: '对/双',
        value: 'PAA'
    }, {
        text: '包',
        value: 'PAC'
    }, {
        text: '货盘',
        value: 'PAL'
    }, {
        text: '件',
        value: 'PC'
    }, {
        text: '个',
        value: 'PCS'
    }, {
        text: '片',
        value: 'PIE'
    }, {
        text: '组比例分配',
        value: 'PRC'
    }, {
        text: '人员编号',
        value: 'PRS'
    }, {
        text: '卷',
        value: 'ROL'
    }, {
        text: '套',
        value: 'SET'
    }, {
        text: '台',
        value: 'TAI'
    }, {
        text: '条',
        value: 'TIA'
    }, {
        text: '数千',
        value: 'TS'
    }, {
        text: '仅有值的物料',
        value: 'VAL'
    }];
    var relationsTypes = [{
        text: '竞争对手',
        code: '00000023'
    }, {
        text: '客户',
        code: '00000021'
    }, {
        text: '联系人',
        code: '00000015'
    }, {
        text: 'CATL销售',
        code: 'Z0000003'
    }, {
        text: 'CATL销售2',
        code: 'Z0000004'
    }];
    var relationsTypes_ATL = [{
        text: '竞争对手',
        code: '00000023'
    }, {
        text: '客户',
        code: '00000021'
    }, {
        text: '联系人',
        code: '00000015'
    }, {
        text: 'ATL销售',
        code: 'Z0000003'
    }, {
        text: 'ATL销售2',
        code: 'Z0000004'
    }];
    var relationsTypesForAdd = [{
        text: '竞争对手',
        code: '00000023'
    }, {
        text: '客户',
        code: '00000021'
    }, {
        text: '联系人',
        code: '00000015'
    }, {
        text: 'CATL销售2',
        code: 'Z0000004'
    }];
    var relationsTypesForAdd_ATL = [{
        text: '竞争对手',
        code: '00000023'
    }, {
        text: '客户',
        code: '00000021'
    }, {
        text: '联系人',
        code: '00000015'
    }, {
        text: 'ATL销售2',
        code: 'Z0000004'
    }];
    var chanceTypes = [{
        text: '--请选择--'
    }, {
        text: 'EBUS',
        code: 'ZO02'
    }, {
        text: 'ECAR',
        code: 'ZO03'
    }, {
        text: 'ESS',
        code: 'ZO04'
    }];
    var chanListArr = [],
        listPage = 1,
        obj_id,
        loadMoreFlag = true,
        isFromClue=false;
    return {
        getStatusArr: function () {
            return statusArr;
        },
        getStagesArr: function () {
            return stagesArr;
        },
        getMoneyTypesArr: function () {
            return moneyTypes;
        },
        chanListArr:chanListArr,
        listPage:listPage,
        obj_id:obj_id,
        filters:filters,
        createPop:createPop,
        saleStages:saleStages,
        saleUnits:saleUnits,
        listStatusArr:listStatusArr,
        relationsTypes:relationsTypes,
        loadMoreFlag:loadMoreFlag,
        relationsTypesForAdd:relationsTypesForAdd,
        relationsTypes_ATL:relationsTypes_ATL,
        saleStages2:saleStages2,
        relationsTypesForAdd_ATL:relationsTypesForAdd_ATL,
        chanceTypes:chanceTypes,
        saleChanceUnits_ATL:saleChanceUnits_ATL,
        timeDate:timeDate,
        isFromClue:timeDate
    }
});