/**
 * Created by zhangren on 16/3/23.
 */
'use strict';
salesModule.factory('saleActService', function () {

    var saleListArr2 = [{
        title: '福州龙福汽车交流活动',
        customer: '龙福汽车',
        place: '福建省 福州市',
        startTime: '2016-3-9',
        de_startTime: '2016/3/9 12:00',
        de_endTime: '2016/4/2 15:03',
        type: '业务交流',
        status: '处理中',
        saleNum: '100036',
        annotation: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
        refer: '商机-郑州客车销售机会',
        progressArr: [{
            content: '与客户进行了初次交涉,效果良好',
            time: '2016-3-6  18:33'
        }],
        relations: [{
            name: '王紫薇',
            sex: '女士',
            position: 'CATL销售'

        }, {
            name: '克克',
            sex: '男士',
            position: '汉得CEO'

        }]
    }, {
        title: '郑州金龙客车(福州)客户拜访',
        customer: '金龙客车',
        place: '福建省 福州市',
        startTime: '2016-2-25',
        de_startTime: '2016/3/1 12:00',
        de_endTime: '2016/4/1 15:03',
        type: '事务性活动',
        status: '未处理',
        saleNum: '100034',
        annotation: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
        refer: '商机-郑州客车销售机会',
        progressArr: [{
            content: '与客户进行了初次交涉,效果良好',
            time: '2016-3-6  18:33'
        }, {
            content: '第二次交涉,效果一般,还需要继续跟进',
            time: '2016-3-7  17:33'
        }, {
            content: '最后谈了一次,应该可以成交,主要联系客户李经理进行跟进',
            time: '2016-3-8  12:11'
        }],
        relations: [{
            name: '王紫薇',
            sex: '女士',
            position: 'CATL销售'

        }, {
            name: '克克',
            sex: '男士',
            position: '汉得CEO'

        }]
    }, {
        title: '这个周末清明节加班',
        customer: '新能源项目组',
        place: '上海市',
        startTime: '2016-4-4',
        de_startTime: '2016/3/1 12:00',
        de_endTime: '2016/4/1 15:03',
        type: '放假性活动',
        status: '已完成',
        saleNum: '120036',
        annotation: 'In the tumultuous business of cutting-in and attending to a whale, there is much running backwards and forwards among',
        refer: '商机-郑州客车销售机会',
        progressArr: [{
            content: '加班第一天',
            time: '2016-4-2  18:33'
        }, {
            content: '放假',
            time: '2016-4-3  17:33'
        }, {
            content: '加班第二天',
            time: '2016-4-4  12:11'
        }],
        relations: [{
            name: '王紫薇',
            sex: '女士',
            position: 'CATL销售'

        }, {
            name: '克克',
            sex: '男士',
            position: '汉得CEO'

        }]
    }];
    var saleListArr2 = [];
    var createPopTypes = [{
        text: '商务洽谈',
        value: 'ZA01'
    }, {
        text: '客情交流',
        value: 'ZA02'
    }, {
        text: '项目推进',
        value: 'ZA03'
    }, {
        text: '内部事务',
        value: 'ZA04'
    }, {
        text: '来访接待',
        value: 'ZA05'
    }, {
        text: '市场营销',
        value: 'ZA06'
    }];
    var createPopTypes_ATL = [{
        text: '技术交流',
        value: 'ZA01'
    }, {
        text: '业务交流',
        value: 'ZA02'
    }, {
        text: '关系维护',
        value: 'ZA03'
    }, {
        text: '事务性活动',
        value: 'ZA04'
    }];
    var createPopOrgs = [{
        text: '公司间'
    }, {
        text: '内销'
    }, {
        text: '外销'
    }];
    var customerTypesArr = [{
        text: '正式客户',
        code: 'CRM000'
    }, {
        text: '潜在客户',
        code: 'Z00001'
    }, {
        text: '竞争对手',
        code: 'Z00002'
    }, {
        text: '注销伙伴',
        code: 'Z00003'
    }];
    var customerTypeArr_server = [{
        text: '正式客户',
        code: 'CRM000'
    }, {
        text: '终端客户',
        code: 'Z00004'
    }, {
        text: '服务商',
        code: 'BUP000'
    }];
    var customerTypeArr_ATL = [{
        text: '正式客户',
        code: 'CRM000'
    }, {
        text: '潜在客户',
        code: 'ZATL01'
    }, {
        text: '竞争对手',
        code: 'ZATL05'
    }, {
        text: '注销伙伴',
        code: 'ZATL06'
    }];
    var customer = [{
        text: '郑州金龙客车(福州)分公司'
    }, {
        text: '福州宇通客车集团'
    }, {
        text: '测试1'
    }, {
        text: '测试2'
    }];
    var contacts = [{
        text: '联系人1'
    }, {
        text: '联系人2'
    }, {
        text: '联系人3'
    }, {
        text: '联系人4'
    }, {
        text: '联系人5'
    }, {
        text: '联系人6'
    }, {
        text: '联系人7'
    }, {
        text: '联系人8'
    }];
    var actDetail;
    var relationsPopArr = [{
        text: 'CATL销售'
    }, {
        text: '联系人'
    }, {
        text: '正式客户'
    }, {
        text: '潜在客户'
    }, {
        text: '竞争对手'
    }, {
        text: '注销伙伴'
    }];
    var relationSelections = [{
        name: '马云',
        sex: '男士',
        position: '后勤部长'
    }, {
        name: '马化腾',
        sex: '男士',
        position: '保洁'
    }, {
        name: '李彦宏',
        sex: '女士',
        position: '保安'
    }];
    var urgentDegreeArr = [{
        text: '需上司支持',
        value: '01'
    }, {
        text: '重要紧急',
        value: '02'
    }, {
        text: '重要不紧急',
        value: '03'
    }, {
        text: '紧急不重要',
        value: '04'
    }, {
        text: '普通事项',
        value: '05'
    }];
    var processArr = [{
        text: '达成共识',
        code: 'IT_SA0021'
    }, {
        text: '跟进事项',
        code: 'IT_SA0022'
    }, {
        text: '政策解读',
        code: 'IT_SA0023'
    }];
    var positonArr = [{
        text: '我司',
        code: '01'
    }, {
        text: '客户',
        code: '02'
    }];
    var processTypesArr = [{
        text: '处理中',
        code: '01'
    }, {
        text: '已完成',
        code: '02'
    }, {
        text: '已取消',
        code: '03'
    }];
    var relationPositionArr = {
        CATL: [{
            text: '联系人',
            code: '00000015'
        }, {
            text: '客户',
            code: '00000009'
        }, {
            text: 'CATL销售',
            code: 'Z0000003'
        }],
        ATL: [{
            text: '联系人',
            code: '00000015'
        }, {
            text: '客户',
            code: '00000009'
        }, {
            text: 'ATL销售',
            code: 'Z0000003'
        }]
    };
    var relationPositionForAdd = [{
        text: '联系人',
        code: '00000015'
    }, {
        text: '客户',
        code: '00000009'
    }];
    var filters = {
        status: [{
            text: '未处理',
            value: 'E0001',
            flag: true
        }, {
            text: '处理中',
            value: 'E0002'
        }, {
            text: '已完成',
            value: 'E0003'
        }, {
            text: '已取消',
            value: 'E0004'
        }],
        type: [{
            text: '商务洽谈',
            value: 'ZA01'
        }, {
            text: '客情交流',
            value: 'ZA02'
        }, {
            text: '项目推进',
            value: 'ZA03'
        }, {
            text: '内部事务',
            value: 'ZA04'
        }, {
            text: '来访接待',
            value: 'ZA05'
        }, {
            text: '市场营销',
            value: 'ZA06'
        }],
        urgentDegree: [{
            text: '需上司支持',
            value: '01'
        }, {
            text: '重要紧急',
            value: '02'
        }, {
            text: '重要不紧急',
            value: '03'
        }, {
            text: '紧急不重要',
            value: '04'
        }, {
            text: '普通事项',
            value: '05'
        }]
    };
    var customerArr = [];
    var listPage = 1;
    var saleListArr = [];
    var isFromRelation = false;
    return {
        getSaleListArr: function () {
            return saleListArr2;
        },
        getCreatePopTypes: function () {
            return createPopTypes;
        },
        getCreatePopOrgs: function () {
            return createPopOrgs;
        },
        getCustomerTypes: function () {
            return customerTypesArr;
        },
        getServiceCustomer:function(){
            return customerTypeArr_server;
        },
        getCustomer: function () {
            return customer;
        },
        getContact: function () {
            return contacts;
        },
        getRelationsPopArr: function () {
            return relationsPopArr;
        },
        getRelationSelections: function () {
            return relationSelections;
        },
        customerArr,
        listPage,
        saleListArr,
        actDetail,
        createPopTypes,
        urgentDegreeArr,
        processArr,
        positonArr,
        processTypesArr,
        relationPositionArr,
        relationPositionForAdd,
        filters,
        customerTypeArr_server,
        customerTypeArr_ATL,
        isFromRelation,
        createPopTypes_ATL
    };
});