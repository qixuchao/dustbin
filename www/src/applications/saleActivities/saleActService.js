/**
 * Created by zhangren on 16/3/23.
 */
'use strict';
salesModule.factory('saleActService', function () {

    var saleListArr = [{
        title:'福州龙福汽车交流活动',
        startTime:'2016-3-9',
        type:'业务交流',
        status:'处理中'
    },{
        title:'郑州金龙客车(福州)客户拜访',
        startTime:'2016-2-25',
        type:'事务性活动',
        status:'未处理'
    },{
        title:'这个周末清明节加班',
        startTime:'2016-4-4',
        type:'放假性活动',
        status:'未处理'
    }];
    var createPopTypes = [{
       text:'业务交流'
    },{
        text:'事务性活动'
    },{
        text:'关系维护'
    },{
        text:'技术交流'
    }];
    var createPopOrgs = [{
       text:'公司间'
    },{
        text:'内销'
    },{
        text:'外销'
    }];
    var customerTypesArr = [{
        text: '正式客户'
    }, {
        text: '潜在客户'
    }, {
        text: '竞争对手'
    },{
        text: '合作伙伴'
    },{
        text: '联系人'
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
       text:'联系人1'
    },{
        text:'联系人2'
    },{
        text:'联系人3'
    },{
        text:'联系人4'
    },{
        text:'联系人5'
    },{
        text:'联系人6'
    },{
        text:'联系人7'
    },{
        text:'联系人8'
    }];
    return{
        getSaleListArr: function () {
            return saleListArr;
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
        getCustomer: function () {
            return customer;
        },
        getContact: function () {
            return contacts;
        }
    };
});