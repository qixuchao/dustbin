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
    var saleListArr = [];
    var createPopTypes = [{
        text: '业务交流'
    }, {
        text: '事务性活动'
    }, {
        text: '关系维护'
    }, {
        text: '技术交流'
    }];
    var createPopOrgs = [{
        text: '公司间'
    }, {
        text: '内销'
    }, {
        text: '外销'
    }];
    var customerTypesArr = [{
        text: '正式客户'
    }, {
        text: '潜在客户'
    }, {
        text: '竞争对手'
    }, {
        text: '合作伙伴'
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
    var actDetail = {};
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
        text: '合作伙伴'
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
    var customerArr = [];
    var listPage = 0;
    return {
        getSaleListArr: function () {
            return saleListArr2;
        },
        saleListArr,
        getCreatePopTypes: function () {
            return createPopTypes;
        },
        getCreatePopOrgs: function () {
            return createPopOrgs;
        },
        getCustomerTypes: function () {
            return customerTypesArr;
        },
        getCustomer: function () {
            return customer;
        },
        getContact: function () {
            return contacts;
        },
        actDetail,
        getRelationsPopArr: function () {
            return relationsPopArr;
        },
        getRelationSelections: function () {
            return relationSelections;
        },
        customerArr,
        listPage
    };
});