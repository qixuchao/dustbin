customerModuleServive
    .factory('customeService', [function() {
        var customerlistdeatilvalue;
        var customerContactsvalues;
        var customerWorkordervalue;
        var customerContactvalue;
        return {
            //客户数据
            set_customerListvalue:function(cusvalue){
                customerlistdeatilvalue = cusvalue;
            },
            get_customerListvalue:function(){
                return customerlistdeatilvalue;
            },
            //客户联系人数据
            set_customerContactsListvalue:function(convalue){
                customerContactsvalues = convalue;
            },
            get_customerContactsListvalue:function(){
                return customerContactsvalues;
            },
            //从客户详情-进入子界面
            set_customerWorkordervalue:function(value){
                customerWorkordervalue = value;
            },
            get_customerWorkordervalue:function(){
                return customerWorkordervalue;
            },
        }
    }])
