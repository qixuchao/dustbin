customerModuleServive
    .factory('customeService', [function() {
        var customerlistdeatilvalue;
        var customerContactsvalues;
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
        }
    }])
